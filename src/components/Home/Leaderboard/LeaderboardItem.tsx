import classNames from "classnames";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import type { LeaderboardEntry } from "../../../types/Types";

type Props = {
  player: LeaderboardEntry;
  isCurrentUser: boolean;
};

export const LeaderboardItem: React.FC<Props> = ({ player, isCurrentUser }) => {
  const [playerState, setPlayerState] = useState<LeaderboardEntry>(player);

  useEffect(() => {
    setPlayerState(player);
  }, [player]);

  useEffect(() => {
    const channel = supabase
      .channel(`leaderboard-item-${player.id}`, {
        config: { broadcast: { self: false }, presence: { key: "" } },
      })
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${player.id}`,
        },
        (payload) => {
          const p: { username?: string; balance?: number; games_played?: number; total_won?: number; total_wagered?: number; games_won?: number } = payload.new as any;
          setPlayerState((prev) => ({
            ...prev,
            username: p.username ?? prev.username,
            balance: p.balance ?? prev.balance,
            games_played: p.games_played ?? prev.games_played,
            total_won: p.total_won ?? prev.total_won,
            total_wagered: p.total_wagered ?? prev.total_wagered,
            games_won: p.games_won ?? prev.games_won,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [player.id]);

  console.log(playerState.games_played);
    console.log(playerState.games_won);
  
  const rawWinRate = playerState.games_played ? ((playerState.games_won ?? 0) / playerState.games_played) * 100 : 0;
  const averageWin = Number.isFinite(rawWinRate) ? Math.max(0, Math.min(100, rawWinRate)) : 0;

  return (
    <li
      className={classNames("leaderboard__item", {
        "current-user": isCurrentUser,
      })}
    >
      <div className="leaderboard__stats">
        <span className="leaderboard__rank">#{playerState.rank}</span>
        <p className="leaderboard__mid">
          <span className="leaderboard__username">
            {playerState.username || "Anonymous"}
          </span>
          <span className="leaderboard__games">
            {playerState.games_played} games
          </span>
        </p>
      </div>

      <p className="leaderboard__end">
        <span className="leaderboard__balance">
          ${playerState.balance?.toFixed(2) || "0.00"}
        </span>
        <span className="leaderboard__average-win">
          {averageWin.toFixed(2) || "0.00"}% win
        </span>
      </p>
    </li>
  );
};
