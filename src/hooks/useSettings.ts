import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export const useSettings = () => {
  const [changeUserName, setChangeUserName] = useState<string>("");
  const [userNameError, setUserNameError] = useState<string>("");
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [totalWon, setTotalWon] = useState<number>(0);
  const [totalWagered, setTotalWagered] = useState<number>(0);
  const [wonGames, setWonGames] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("username, games_played, total_won, total_wagered, games_won")
        .eq("id", user.id)
        .single();

      if (data) {
        setChangeUserName(data.username || "");
        setGamesPlayed(data.games_played || 0);
        setTotalWon(data.total_won || 0);
        setTotalWagered(data.total_wagered || 0);
        setWonGames(data.games_won || 0);
      }
    };

    loadProfile();

    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${supabase.auth.getUser().then((r) => r.data.user?.id)}`,
        },
        (payload) => {
          const p = payload.new;
          setGamesPlayed(p.games_played ?? 0);
          setTotalWon(p.total_won ?? 0);
          setTotalWagered(p.total_wagered ?? 0);
          setWonGames(p.games_won ?? 0);
          if (p.username) setChangeUserName(p.username);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClearInput = () => {
    setChangeUserName("");
  };

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChangeUserName(value);

    if (value.length > 20) {
      setUserNameError("Username cannot exceed 20 characters");
    } else if (value.trim() === "") {
      setUserNameError("Username cannot be empty");
    } else {
      setUserNameError("");
    }
  };

  const saveUsername = async () => {
    if (userNameError || !changeUserName.trim()) return;

    setLoading(true);
    setSaveMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({ username: changeUserName.trim() })
      .eq("id", (await supabase.auth.getUser()).data.user?.id);

    setLoading(false);

    if (error) {
      setSaveMessage({
        text: error.code === "23505" ? "Это имя занято" : "Ошибка сохранения",
        type: "error",
      });
    } else {
      setSaveMessage({ text: "Username saved!", type: "success" });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const resetStats = async () => {
    setLoading(true);
    setSaveMessage(null);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      setLoading(false);
      setSaveMessage({ text: "Не авторизован", type: "error" });
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ games_played: 0, total_won: 0, total_wagered: 0, games_won: 0 })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      setSaveMessage({ text: "Ошибка сброса", type: "error" });
    } else {
      setSaveMessage({ text: "Stats reset", type: "success" });
      setGamesPlayed(0);
      setTotalWon(0);
      setTotalWagered(0);
      setWonGames(0);
      setTimeout(() => setSaveMessage(null), 3000);
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

  const countWonGames = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "Не авторизован" };
    }

    const { data, error } = await supabase.rpc("increment_wins");
    if (error) {
      const { error: updError } = await supabase
        .from("profiles")
        .update({
          games_won: (wonGames ?? 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (updError) {
        return { success: false, error: updError.message };
      }
      setWonGames((prev) => (prev ?? 0) + 1);
      return { success: true };
    }
    if (data === true) {
      setWonGames((prev) => (prev ?? 0) + 1);
      return { success: true };
    }
    return { success: false, error: "RPC returned false" };
  };

  return {
    changeUserName,
    userNameError,
    gamesPlayed,
    totalWon,
    totalWagered,
    handleChangeUserName,
    saveUsername,
    resetStats,
    loading,
    saveMessage,
    countGames,
    getTotalWon,
    getTotalWag,
    countWonGames,
    handleClearInput,
    wonGames,
  };
};
