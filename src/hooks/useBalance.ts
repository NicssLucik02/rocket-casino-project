import { useCallback, useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

export const useBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const channelRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

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
      setBalance(data.balance);
    }
  }, []);

  const addToBalance = async (amount: number) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { success: false, error: "Не авторизован" };

    const { error } = await supabase.rpc('add_balance', { amount: amount });

    if (error) {
      console.error("Ошибка RPC:", error);
      return { success: false, error: error.message };
    }

    // Оптимистическое обновление
    setBalance((prev) => (prev ?? 0) + amount);
    // Синхронизация с сервером через небольшую задержку
    setTimeout(() => fetchBalance(), 500);

    return { success: true };
  };

  const spendBalance = async (amount: number) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { success: false, error: "Не авторизован" };

    const { error } = await supabase.rpc('spend_balance', { amount: amount });

    if (error) {
      console.error("Ошибка RPC:", error);
      return { success: false, error: error.message };
    }

    // Оптимистическое обновление
    setBalance((prev) => (prev ?? 0) - amount);
    // Синхронизация с сервером через небольшую задержку
    setTimeout(() => fetchBalance(), 500);

    return { success: true };
  };

  useEffect(() => {
    let isMounted = true;

    const setupRealtime = async () => {
      // Очищаем предыдущий таймаут реконнекта
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Удаляем старый канал, если он существует
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
            console.log("Realtime update!", payload.new);
            if (isMounted) {
              setBalance(payload.new.balance ?? 0);
            }
          }
        )
        .subscribe((status, err) => {
          console.log("Realtime status:", status, err);

          if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
            console.log("✅ Realtime подписка активна");
          }

          if (status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT || 
              status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
            console.warn("⚠️ Realtime соединение потеряно, переподключение...");
            
            if (reconnectTimeoutRef.current) return; // Уже в процессе реконнекта

            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMounted) {
                setupRealtime();
              }
            }, 2000);
          }
        });

      channelRef.current = channel;
    };

    setupRealtime();

    // Периодическая проверка соединения (каждые 30 секунд)
    const healthCheck = setInterval(() => {
      if (channelRef.current) {
        const channel = channelRef.current;
        // Проверяем состояние канала
        if (channel.state === 'closed' || channel.state === 'errored') {
          console.log("Health check: канал неактивен, переподключение...");
          setupRealtime();
        }
      }
    }, 30000);

    return () => {
      isMounted = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      clearInterval(healthCheck);
    };
  }, [fetchBalance]);

  return { balance, addToBalance, refreshBalance: fetchBalance, spendBalance };
};
