import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export const useSettings = () => {
  const [changeUserName, setChangeUserName] = useState<string>('');
  const [userNameError, setUserNameError] = useState<string>('');
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [totalWon, setTotalWon] = useState<number>(0);
  const [totalWagered, setTotalWagered] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("username, games_played, total_won, total_wagered")
        .eq("id", user.id)
        .single();

      if (data) {
        setChangeUserName(data.username || "");
        setGamesPlayed(data.games_played || 0);
        setTotalWon(data.total_won || 0);
        setTotalWagered(data.total_wagered || 0);
      }
    };

    loadProfile();

    const channel = supabase
      .channel("profile-changes")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "profiles",
        filter: `id=eq.${(supabase.auth.getUser().then(r => r.data.user?.id))}`
      }, (payload) => {
        const p = payload.new;
        setGamesPlayed(p.games_played ?? 0);
        setTotalWon(p.total_won ?? 0);
        setTotalWagered(p.total_wagered ?? 0);
        if (p.username) setChangeUserName(p.username);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClearInput = () => {
    setChangeUserName('');
  }

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
      setSaveMessage({ text: error.code === "23505" ? "Это имя занято" : "Ошибка сохранения", type: "error" });
    } else {
      setSaveMessage({ text: "Username saved!", type: "success" });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const countGames = async () => {
    await supabase.rpc('increment_games_played');
  };

  const getTotalWon = async (amount: number) => {
    await supabase.rpc('add_win', { win_amount: amount });
  };

  const getTotalWag = async (amount: number) => {
    await supabase.rpc('add_wager', { amount });
  };

  return {
    changeUserName,
    userNameError,
    gamesPlayed,
    totalWon,
    totalWagered,
    handleChangeUserName,
    saveUsername,
    loading,
    saveMessage,
    countGames,
    getTotalWon,
    getTotalWag,
    handleClearInput,
  };
};