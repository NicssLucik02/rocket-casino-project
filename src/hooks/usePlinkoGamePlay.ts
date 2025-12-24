import { useCallback, useState } from 'react';
import { usePlinkoGameStore } from '../stores/plinkoGameStore';
import { balanceStore } from '../stores/balanceStore';
import { useProfile } from './useProfile';

export const usePlinkoPlay = () => {
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const {
    currentBet,
    currentBallsCount,
    isPlaying,
    startRound,
  } = usePlinkoGameStore();

  const spendBalance = balanceStore((s) => s.spendBalance);
  const { getTotalWag, countGames } = useProfile();

  const play = useCallback(async () => {
    if (isPlaying || isStarting) return;

    setError(null);
    setIsStarting(true);

    const totalBet = currentBet * Number(currentBallsCount);

    const result = await spendBalance(totalBet);
    if (!result.success) {
      setError(result.error ?? "Insufficient balance");
      setIsStarting(false);
      return;
    }

    await Promise.all([getTotalWag(totalBet), countGames()]);
    startRound();
    setIsStarting(false);
  }, [currentBet, currentBallsCount, isPlaying, isStarting, spendBalance, getTotalWag, countGames, startRound]);

  return {
    play,
    isLoading: isStarting,
    error,
  };
};
