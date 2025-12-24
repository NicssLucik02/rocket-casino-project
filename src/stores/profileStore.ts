import { create } from 'zustand';
import type { ProfileState } from '../types/storeTypes';

export const useProfileStore = create<ProfileState>((set) => ({
  username: null,
  gamesPlayed: 0,
  totalWon: 0,
  totalWagered: 0,
  wonGames: 0,
  isLoading: false,

  setProfile: (data) =>
    set((state) => ({
      ...state,
      username: data.username ?? state.username,
      gamesPlayed: data.games_played ?? state.gamesPlayed,
      totalWon: data.total_won ?? state.totalWon,
      totalWagered: data.total_wagered ?? state.totalWagered,
      wonGames: data.games_won ?? state.wonGames,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  resetProfile: () =>
    set({
      username: null,
      gamesPlayed: 0,
      totalWon: 0,
      totalWagered: 0,
      wonGames: 0,
    }),
}));