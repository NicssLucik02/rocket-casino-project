import "./leaderboard.scss";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../../hooks/useAuth";
import { LEADERBOARD_CONFIG } from "../../../constants/config";
import type { LeaderboardEntry } from "../../../types/Types";
import { LeaderboardItem } from "./LeaderboardItem";
import leaderboardIcon from "../../../assets/icons/Leaderboard.svg";

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

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

  return (
    <div className="leaderboard">
      <div className="leaderboard__container">
        <div className="leaderboard__top">
          <img src={leaderboardIcon} alt="logo-trophey" />
          <p className="leaderboard__top-title">
            <span className="leaderboard__top-title-text">Leaderboard</span>
            <span className="leaderboard__top-title-text--small">
              Top players
            </span>
          </p>
        </div>

        <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="leaderboard__list">
              {leaderboard.map((player) => (
                <LeaderboardItem
                  key={player.id}
                  player={player}
                  isCurrentUser={user?.id === player.id}
                />
              ))}
              {leaderboard.length === 0 && <li>No players yet</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
