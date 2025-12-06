import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { LEADERBOARD_CONFIG } from "../constants/config";
import type { LeaderboardEntry } from "../types/Types";

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(
            "id, username, balance, games_played, total_won, total_wagered, games_won",
          )
          .order("balance", { ascending: false })
          .limit(LEADERBOARD_CONFIG.TOP_PLAYERS_COUNT);

        if (error) {
          return;
        }

        const leaderboardData =
          data?.map((entry, index) => ({
            ...entry,
            rank: index + 1,
          })) || [];

        setLeaderboard(leaderboardData);
      } catch {
        void 0;
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();

    const interval = setInterval(
      loadLeaderboard,
      LEADERBOARD_CONFIG.REFRESH_INTERVAL_MS,
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      const fetchData = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select(
              "id, username, balance, games_played, total_won, total_wagered, games_won",
            )
            .order("balance", { ascending: false })
            .limit(LEADERBOARD_CONFIG.TOP_PLAYERS_COUNT);
          if (!error) {
            const leaderboardData =
              data?.map((entry, index) => ({ ...entry, rank: index + 1 })) ||
              [];
            setLeaderboard(leaderboardData);
          }
        } finally {
          setLoading(false);
        }
      };
      void fetchData();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return { leaderboard, loading };
};
