import styles from "./leaderboard.module.scss";
import { LeaderboardItem } from "./LeaderboardItem";
import LeaderboardIcon from "@assets/icons/Leaderboard.svg?react";
import { useAuthStore } from "../../../stores/authStore/authStore";
import { useLeaderboardStore } from "../../../stores/leaderBoardStore/leaderboardStore";
import { useEffect } from "react";

export const Leaderboard = () => {
  const leaderboard = useLeaderboardStore((s) => s.leaderboard);
  const loading = useLeaderboardStore((s) => s.loading);
  const error = useLeaderboardStore((s) => s.error);
  const fetchLeaderboard = useLeaderboardStore((s) => s.fetchLeaderboard);
  const { user } = useAuthStore();

  useEffect(() => {
    void fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className={styles["leaderboard"]}>
      <div className={styles["leaderboard__container"]}>
        <div className={styles["leaderboard__top"]}>
          <LeaderboardIcon className={styles["leaderboard__top-icon"]} />
          <p className={styles["leaderboard__top-title"]}>
            <span className={styles["leaderboard__top-title-text"]}>
              Leaderboard
            </span>
            <span className={styles["leaderboard__top-title-text--small"]}>
              Top players
            </span>
          </p>
        </div>

        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ul className={styles["leaderboard__list"]}>
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
