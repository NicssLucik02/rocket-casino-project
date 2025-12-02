import { useCallback, useState, useEffect, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  REALTIME_SUBSCRIBE_STATES,
  type RealtimeChannel,
} from "@supabase/supabase-js";

export const useBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchBalance = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    if (error) {
      return;
    }

    if (data?.balance !== undefined) {
      setBalance((prev) => {
        if (prev !== data.balance) {
          return data.balance;
        }
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const ensureChannelForUser = async (userId: string) => {
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      await fetchBalance();

      if (!isMounted) return;

      const channel = supabase
        .channel(`profile-${userId}`, {
          config: { broadcast: { self: false }, presence: { key: "" } },
        })
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
          (payload) => {
            const newBalance = payload.new.balance ?? 0;
            if (updateTimeoutRef.current) {
              clearTimeout(updateTimeoutRef.current);
            }
            updateTimeoutRef.current = setTimeout(() => {
              if (isMounted) {
                setBalance((prev) => (prev !== newBalance ? newBalance : prev));
              }
            }, 50);
          },
        )
        .subscribe((status) => {
          if (
            status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT ||
            status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR
          ) {
            setTimeout(async () => {
              if (!isMounted) return;
              if (channelRef.current) {
                await supabase.removeChannel(channelRef.current);
                channelRef.current = null;
              }
              await ensureChannelForUser(userId);
            }, 2000);
          }
        });

      channelRef.current = channel;
    };

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        await ensureChannelForUser(user.id);
      } else {
        setBalance(null);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user?.id;
      if (!u) {
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        setBalance(null);
        return;
      }
      await ensureChannelForUser(u);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchBalance]);

  

  const addToBalance = async (amount: number) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return { success: false, error: "Не авторизован" };

    const { error } = await supabase.rpc("add_balance", { amount: amount });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const addBonus = async () => {
    const { error } = await supabase.rpc("add_balance", { amount: 10 });
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const spendBalance = async (amount: number) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return { success: false, error: "Не авторизован" };

    const { data, error } = await supabase.rpc("spend_balance", {
      amount: amount,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data === false) {
      return { success: false, error: "Недостаточно средств" };
    }
    return { success: true };
  };

  return {
    balance,
    addToBalance,
    refreshBalance: fetchBalance,
    fetchBalance,
    spendBalance,
    addBonus,
  };
};
