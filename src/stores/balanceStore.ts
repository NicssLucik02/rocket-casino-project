import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";
import { GAME_CONFIG } from "../constants";
import { supabase } from "../utils/supabaseClient";
import type { BalanceState } from "../types/storeTypes";

export const balanceStore = create<BalanceState>((set, get) => {
  let channel: RealtimeChannel | null = null;

  const setupRealtime = async (userId: string) => {
    if (channel) {
      await supabase.removeChannel(channel);
    }

    channel = supabase
      .channel(`profile-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const rawBalance = (payload.new as { balance?: unknown }).balance;
          const nextBalance =
            typeof rawBalance === "number" ? rawBalance : Number(rawBalance);
          if (!Number.isNaN(nextBalance)) {
            set({ balance: nextBalance });
          }
        },
      )
      .subscribe();
  };

  const loadBalance = async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        set({ balance: 0, loading: false });
        return;
      }

      if (!data) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            username: "",
            balance: 0,
            games_played: 0,
            total_won: 0,
            total_wagered: 0,
            games_won: 0,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError && insertError.code !== "23505") {
          set({ balance: 0, loading: false });
          return;
        }

        set({ balance: 0, loading: false });
        return;
      }

      set({ balance: data.balance ?? 0, loading: false });
    } catch {
      set({ balance: 0, loading: false });
    }
  };

  const handleSignedOut = async () => {
    try {
      if (channel) await supabase.removeChannel(channel);
    } finally {
      channel = null;
      set({ balance: null, loading: false });
    }
  };

  const handleSession = async (session: { user?: { id?: string } } | null) => {
    const userId = session?.user?.id;
    if (!userId) {
      await handleSignedOut();
      return;
    }

    await loadBalance(userId);
    await setupRealtime(userId);
  };

  supabase.auth.onAuthStateChange((_event, session) => {
    void handleSession(session);
  });

  supabase.auth
    .getSession()
    .then(({ data }) => handleSession(data.session))
    .catch(() => {
      set({ loading: false });
    });

  return {
    balance: null,
    loading: true,

    refresh: async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      if (userId) await loadBalance(userId);
    },

    addToBalance: async (amount: number) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { success: false, error: "Not authorized" };

      const { error } = await supabase.rpc("add_balance", {
        amount: Math.floor(amount),
      });

      if (error) return { success: false, error: error.message };

      await get().refresh();
      return { success: true };
    },

    spendBalance: async (amount: number) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { success: false, error: "Not authorized" };

      const { error } = await supabase.rpc("spend_balance", { amount });
      if (error) return { success: false, error: error.message };

      await get().refresh();
      return { success: true };
    },

    addBonus: () => get().addToBalance(GAME_CONFIG.BONUS_AMOUNT),
  };
});
