import { useCallback, useState, useEffect, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import { GAME_CONFIG } from "../constants";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const useBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const mountedRef = useRef(true);

  const setupRealtimeChannel = useCallback((userId: string) => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
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
          const newBalance = payload.new.balance as number;
          setBalance((prev) => (prev !== newBalance ? newBalance : prev));
        },
      )
      .subscribe();

    channelRef.current = channel;
  }, []);

  const loadBalance = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setBalance((prev) => (prev === null ? 0 : prev));
      return;
    }

    if (!data) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          balance: 0,
          username: "",
        })
        .select()
        .single();
      if (insertError) {
        setBalance((prev) => (prev === null ? 0 : prev));
        return;
      }
      setBalance(0);
    } else {
      setBalance(data.balance ?? 0);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        void event;
        const userId = session?.user?.id;

        if (!userId || !mountedRef.current) {
          setBalance(null);
          if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
            channelRef.current = null;
          }
          return;
        }

        await loadBalance(userId);
        setupRealtimeChannel(userId);
      },
    );

    supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user?.id;
      if (userId && mountedRef.current) {
        loadBalance(userId);
        setupRealtimeChannel(userId);
      }
    });

    return () => {
      mountedRef.current = false;
      authListener.subscription.unsubscribe();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [loadBalance, setupRealtimeChannel]);

  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState !== "visible") return;
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      if (userId && mountedRef.current) {
        await loadBalance(userId);
        setupRealtimeChannel(userId);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [loadBalance, setupRealtimeChannel]);

  const refreshBalance = useCallback(() => {
    supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user?.id;
      if (userId) {
        loadBalance(userId);
      }
    });
  }, [loadBalance]);

  const addToBalance = async (amount: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Не авторизован" };

    const { error } = await supabase.rpc("add_balance", {
      amount: Math.floor(Number(amount)),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    refreshBalance();
    return { success: true };
  };

  const spendBalance = async (amount: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Не авторизован" };

    const { error } = await supabase.rpc("spend_balance", { amount });
    if (error) return { success: false, error: error.message };
    refreshBalance();
    return { success: true };
  };

  const addBonus = () => addToBalance(GAME_CONFIG.BONUS_AMOUNT);

  return {
    balance,
    refreshBalance,
    addToBalance,
    spendBalance,
    addBonus,
  };
};
