import { useCallback, useState, useEffect, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

export const useBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const channelRef = useRef<any>(null);
  const updateTimeoutRef = useRef<number | null>(null);

  const fetchBalance = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Ошибка загрузки баланса:", error);
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

    const setupRealtime = async () => {
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      if (!isMounted) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await fetchBalance();

      if (!isMounted) return;

      const channel = supabase
        .channel(`profile-${user.id}`, {
          config: {
            broadcast: { self: false },
            presence: { key: '' }
          }
        })
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            const newBalance = payload.new.balance ?? 0;
            if (updateTimeoutRef.current) {
              clearTimeout(updateTimeoutRef.current);
            }
            updateTimeoutRef.current = setTimeout(() => {
              if (isMounted) {
                setBalance((prev) => (prev !== newBalance ? newBalance : prev));
              }
            }, 50) as unknown as number;
          }
        )
        .subscribe((status) => {
          if (status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT || 
              status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
            console.warn("⚠️ Realtime соединение потеряно, переподключение...");
            setTimeout(() => {
              if (isMounted) {
                setupRealtime();
              }
            }, 2000);
          }
        });

      channelRef.current = channel;
    };

    setupRealtime();

    return () => {
      isMounted = false;
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchBalance]);

  const addToBalance = async (amount: number) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { success: false, error: "Не авторизован" };

    const { error } = await supabase.rpc('add_balance', { amount: amount });

    if (error) {
      console.error("Ошибка RPC:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const addBonus = async() => {
    const { error } = await supabase.rpc('add_balance', { amount: 10 });
    if (error) {
      console.error("Ошибка RPC:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  }

  const spendBalance = async (amount: number) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { success: false, error: "Не авторизован" };

    const { error } = await supabase.rpc('spend_balance', { amount: amount });

    if (error) {
      console.error("Ошибка RPC:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  return { balance, addToBalance, refreshBalance: fetchBalance, fetchBalance, spendBalance, addBonus };
};
