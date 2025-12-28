import { create } from 'zustand';
import { supabase } from '../../utils/supabaseClient';
import { LEADERBOARD_CONFIG } from '../../constants/config';
import type { LeaderboardState } from '../../types/storeTypes';

export const useLeaderboardStore = create<LeaderboardState>((set) => {
  const fetchLeaderboard = async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, balance, games_played, total_won, total_wagered, games_won')
        .order('balance', { ascending: false })
        .limit(LEADERBOARD_CONFIG.TOP_PLAYERS_COUNT);

      if (error) throw error;

      const leaderboardData = (data ?? []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

      set({ leaderboard: leaderboardData, error: null });
    } catch (err) {
      set({ error: (err as Error).message || 'Failed to load leaderboard' });
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    leaderboard: [],
    isLoading: false,
    error: null,
    fetchLeaderboard,
  };
});
