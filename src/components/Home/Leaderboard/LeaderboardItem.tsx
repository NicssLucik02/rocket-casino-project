import classNames from "classnames";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import type { LeaderboardEntry, ProfileRow } from "../../../types/Types";
import styles from "./leaderboard.module.scss";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type Props = {
  player: LeaderboardEntry;
  isCurrentUser: boolean;
};

export const LeaderboardItem: React.FC<Props> = ({ player, isCurrentUser }) => {
  const [playerState, setPlayerState] = useState<LeaderboardEntry>(player);
  const formattedStat = (value: number | undefined) =>
    value?.toFixed(2) || "0.00";

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
        (payload: RealtimePostgresChangesPayload<ProfileRow>) => {
          const p = payload.new as Partial<ProfileRow>;
          setPlayerState((prev) => ({
            ...prev,
            username: p.username ?? prev.username,
            balance: p.balance ?? prev.balance,
            games_played: p.games_played ?? prev.games_played,
            total_won: p.total_won ?? prev.total_won,
            total_wagered: p.total_wagered ?? prev.total_wagered,
            games_won: p.games_won ?? prev.games_won,
          }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [player.id]);

  const rawWinRate = playerState.games_played
    ? ((playerState.games_won ?? 0) / playerState.games_played) * 100
    : 0;
  const averageWin = Number.isFinite(rawWinRate)
    ? Math.max(0, Math.min(100, rawWinRate))
    : 0;

  return (
    <li
      className={classNames(styles["leaderboard__item"], {
        [styles["current-user"]]: isCurrentUser,
      })}
    >
      <div className={styles["leaderboard__stats"]}>
        <span className={styles["leaderboard__rank"]}>#{playerState.rank}</span>
        <p className={styles["leaderboard__mid"]}>
          <span className={styles["leaderboard__username"]}>
            {playerState.username || "Anonymous"}
          </span>
          <span className={styles["leaderboard__games"]}>
            {playerState.games_played} games
          </span>
        </p>
      </div>

      <p className={styles["leaderboard__end"]}>
        <span className={styles["leaderboard__balance"]}>
          ${formattedStat(playerState.balance)}
        </span>
        <span className={styles["leaderboard__average-win"]}>
          {formattedStat(averageWin)}% win
        </span>
      </p>
    </li>
  );
};
