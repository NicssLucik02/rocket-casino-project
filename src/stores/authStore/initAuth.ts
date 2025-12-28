import { supabase } from '../../utils/supabaseClient';
import { useAuthStore } from './authStore';

let isInitialized = false;

export const initAuth = () => {
  if (isInitialized) return;
  isInitialized = true;

  supabase.auth.getSession().then(({ data }) => {
    useAuthStore.setState({
      user: data.session?.user ?? null,
      session: data.session ?? null,
      loading: false,
    });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({
      user: session?.user ?? null,
      session: session ?? null,
      loading: false,
    });
  });
};