import { create } from 'zustand';
import { supabase } from '../../utils/supabaseClient';
import type { AuthState } from '../../types/storeTypes';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  signIn: async (options) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword(options);
    if (error) {
      set({ loading: false });
      throw error;
    }
  },

  signUp: async (options) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp(options);
    if (error) {
      set({ loading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signOut();
    if (error) {
      set({ loading: false });
      throw error;
    }
  },
}));