import { RealtimeChannel } from '@supabase/supabase-js';
import { useProfileStore } from '../stores/profileStore';
import { supabase } from '../utils/supabaseClient';

let channel: RealtimeChannel | null = null;

export const setupProfileSync = async (userId: string) => {
  if (channel) {
    await supabase.removeChannel(channel);
    channel = null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('username, games_played, total_won, total_wagered, games_won')
    .eq('id', userId)
    .single();

  if (!error && data) {
    useProfileStore.getState().setProfile(data);
  }
  useProfileStore.getState().setLoading(false);

  channel = supabase
    .channel(`profile-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        useProfileStore.getState().setProfile(payload.new);
      },
    )
    .subscribe();
};

export const cleanupProfileSync = async () => {
  if (channel) {
    await supabase.removeChannel(channel);
    channel = null;
  }
  useProfileStore.getState().resetProfile();
};
