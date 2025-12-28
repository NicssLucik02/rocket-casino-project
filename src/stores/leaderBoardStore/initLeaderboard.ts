import { LEADERBOARD_CONFIG } from "../../constants";
import { useLeaderboardStore } from "./leaderboardStore";

let initialized = false;

export const initializeLeaderboard = () => {
  if (initialized) return;
  initialized = true;

  const { fetchLeaderboard } = useLeaderboardStore.getState();
  fetchLeaderboard();

  const interval = setInterval(fetchLeaderboard, LEADERBOARD_CONFIG.REFRESH_INTERVAL_MS);

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') fetchLeaderboard();
  };
  document.addEventListener('visibilitychange', handleVisibility);

  window.addEventListener('beforeunload', () => {
    if (interval) clearInterval(interval);
  });
};
