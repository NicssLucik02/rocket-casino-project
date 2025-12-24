import { useEffect, useState } from 'react';
import { useProfileStore } from '../stores/profileStore';
import { setupProfileSync, cleanupProfileSync } from '../services/profileSync';
import { supabase } from '../utils/supabaseClient';

let mountedCount = 0;

export const useProfile = () => {
  const [changeUserName, setChangeUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const {
    username,
    gamesPlayed,
    totalWon,
    totalWagered,
    wonGames,
    isLoading,
    setLoading,
  } = useProfileStore();

  useEffect(() => {
    mountedCount += 1;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        useProfileStore.getState().setLoading(true);
        await setupProfileSync(session.user.id);
        setChangeUserName(useProfileStore.getState().username ?? '');
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.id) {
        useProfileStore.getState().setLoading(true);
        await setupProfileSync(session.user.id);
        setChangeUserName(useProfileStore.getState().username ?? '');
      } else {
        await cleanupProfileSync();
        setChangeUserName('');
      }
    });

    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await setupProfileSync(session.user.id);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      listener.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
      mountedCount -= 1;
      if (mountedCount <= 0) {
        mountedCount = 0;
        void cleanupProfileSync();
      }
    };
  }, []);

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setChangeUserName(v);

    if (v.length > 20) setUserNameError('Username cannot exceed 20 characters');
    else if (!v.trim()) setUserNameError('Username cannot be empty');
    else setUserNameError('');
  };

  const handleClearInput = () => setChangeUserName(username ?? '');

  const saveUsername = async () => {
    if (userNameError || !changeUserName.trim()) return;

    setLoading(true);
    setSaveMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username: changeUserName.trim() })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      setSaveMessage({
        text: error.code === '23505' ? 'Это имя занято' : 'Ошибка сохранения',
        type: 'error',
      });
    } else {
      setSaveMessage({ text: 'Username saved!', type: 'success' });
      setTimeout(() => setSaveMessage(null), 2500);
    }
  };

  const resetStats = async () => {
    setLoading(true);
    setSaveMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        games_played: 0,
        total_won: 0,
        total_wagered: 0,
        games_won: 0,
      })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      setSaveMessage({ text: 'Ошибка сброса', type: 'error' });
    } else {
      setSaveMessage({ text: 'Stats reset', type: 'success' });
      setTimeout(() => setSaveMessage(null), 2500);
    }
  };

  const countGames = () => supabase.rpc('increment_games_played');
  const getTotalWon = (amount: number) => supabase.rpc('add_win', { win_amount: amount });
  const getTotalWag = (amount: number) => supabase.rpc('add_wager', { amount });
  const countWonGames = async () => {
    const { error } = await supabase.rpc('increment_wins');
    if (error) {

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            games_won: wonGames + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
    }
  };

  return {
    gamesPlayed,
    totalWon,
    totalWagered,

    changeUserName,
    userNameError,
    handleChangeUserName,
    handleClearInput,
    saveUsername,

    isLoading,
    saveMessage,

    resetStats,
    countGames,
    getTotalWon,
    getTotalWag,
    countWonGames,
  };
};
