import { useEffect, useState, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";

export const useSettings = () => {
  const [changeUserName, setChangeUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [totalWagered, setTotalWagered] = useState(0);
  const [wonGames, setWonGames] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username, games_played, total_won, total_wagered, games_won")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setChangeUserName(data.username ?? "");
        setGamesPlayed(data.games_played ?? 0);
        setTotalWon(data.total_won ?? 0);
        setTotalWagered(data.total_wagered ?? 0);
        setWonGames(data.games_won ?? 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setupChannel = async (userId: string) => {
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`profile-changes-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const p = payload.new;

          setGamesPlayed(p.games_played ?? 0);
          setTotalWon(p.total_won ?? 0);
          setTotalWagered(p.total_wagered ?? 0);
          setWonGames(p.games_won ?? 0);
          if (p.username !== undefined) {
            setChangeUserName(p.username);
          }
        },
      )
      .subscribe();

    channelRef.current = channel;
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) return;

      await setupChannel(user.id);
      await loadProfile();
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const userId = session?.user?.id;

        if (!userId) {
          if (channelRef.current) {
            await supabase.removeChannel(channelRef.current);
            channelRef.current = null;
          }
          return;
        }

        await setupChannel(userId);
        await loadProfile();
      },
    );

    return () => {
      listener.subscription.unsubscribe();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState !== "visible") return;
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      if (!userId) return;
      await setupChannel(userId);
      await loadProfile();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleClearInput = () => setChangeUserName("");

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setChangeUserName(v);

    if (v.length > 20) setUserNameError("Username cannot exceed 20 characters");
    else if (!v.trim()) setUserNameError("Username cannot be empty");
    else setUserNameError("");
  };

  const saveUsername = async () => {
    if (userNameError || !changeUserName.trim()) return;

    setIsLoading(true);
    setSaveMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: changeUserName.trim() })
      .eq("id", user.id);

    setIsLoading(false);

    if (error) {
      setSaveMessage({
        text: error.code === "23505" ? "Это имя занято" : "Ошибка сохранения",
        type: "error",
      });
    } else {
      setSaveMessage({ text: "Username saved!", type: "success" });
      setTimeout(() => setSaveMessage(null), 2500);
    }
  };

  const resetStats = async () => {
    setIsLoading(true);
    setSaveMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return setSaveMessage({ text: "Не авторизован", type: "error" });
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        games_played: 0,
        total_won: 0,
        total_wagered: 0,
        games_won: 0,
      })
      .eq("id", user.id);

    setIsLoading(false);

    if (error) {
      setSaveMessage({ text: "Ошибка сброса", type: "error" });
    } else {
      setSaveMessage({ text: "Stats reset", type: "success" });
      setTimeout(() => setSaveMessage(null), 2500);
    }
  };

  const countGames = async () => {
    await supabase.rpc("increment_games_played");
  };

  const getTotalWon = async (amount: number) => {
    await supabase.rpc("add_win", { win_amount: amount });
  };

  const getTotalWag = async (amount: number) => {
    await supabase.rpc("add_wager", { amount });
  };

  const countWonGames = async () => {
    const { data, error } = await supabase.rpc("increment_wins");

    if (error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { success: false };

      await supabase
        .from("profiles")
        .update({
          games_won: wonGames + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      return { success: true };
    }

    if (data === true) return { success: true };
    return { success: false, error: "RPC returned false" };
  };

  return {
    countGames,
    getTotalWon,
    getTotalWag,
    countWonGames,
    resetStats,
    saveUsername,
    changeUserName,
    userNameError,
    gamesPlayed,
    totalWon,
    totalWagered,
    wonGames,
    isLoading,
    saveMessage,
    handleClearInput,
    handleChangeUserName,
  };
};
