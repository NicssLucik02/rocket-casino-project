import { useCallback, useRef, type ChangeEvent } from 'react';
import { balanceStore } from '../stores/balanceStore';
import { useMinesStore } from '../stores/minesGameStore';
import { GameStatus } from '../types/enums';
import { GAME_CONFIG } from '../constants';
import { useProfile } from './useProfile';

const MIN_BET_AMOUNT = GAME_CONFIG.QUICK_BET_AMOUNTS[0] ?? 1;

export const useMinesGameController = () => {
  const {
    minesCount,
    betAmount,
    gameState,
    grid,
    currentMultiplier,
    revealedCount,
    setMinesCount,
    setBetAmount,
    startGame: startGameLogic,
    revealCell,
    cashOut: cashOutLogic,
    resetGame,
  } = useMinesStore()
  const spendBalance = balanceStore((s) => s.spendBalance);
  const addToBalance = balanceStore((s) => s.addToBalance);
  const { getTotalWon, getTotalWag, countGames, countWonGames } = useProfile();

  const startInProgressRef = useRef(false);
  const cashOutInProgressRef = useRef(false);

  const startGame = useCallback(async () => {
    if (startInProgressRef.current || gameState === GameStatus.Playing) return;
    startInProgressRef.current = true;

    const amount = Number(betAmount);
    if (isNaN(amount) || amount < MIN_BET_AMOUNT || betAmount.trim() === '') {
      setBetAmount(String(MIN_BET_AMOUNT));
      startInProgressRef.current = false;
      return;
    }

    try {
      const result = await spendBalance(amount);
      if (!result.success) return;

      await Promise.all([getTotalWag(amount), countGames()]);

      startGameLogic();
    } finally {
      startInProgressRef.current = false;
    }
  }, [betAmount, gameState, spendBalance, getTotalWag, countGames, startGameLogic, setBetAmount]);

  const cashOut = useCallback(async () => {
    if (cashOutInProgressRef.current || gameState !== GameStatus.Playing) return;
    cashOutInProgressRef.current = true;

    try {
      const winAmount = cashOutLogic();
      if (winAmount > 0) {
        await addToBalance(winAmount);
        await Promise.all([getTotalWon(winAmount), countWonGames()]);
      }
    } finally {
      cashOutInProgressRef.current = false;
    }
  }, [gameState, cashOutLogic, addToBalance, getTotalWon, countWonGames]);

  const onBetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setBetAmount(value);
    }
  };

  const onSetBetAmount = (amount: string) => {
    if (/^\d*\.?\d*$/.test(amount)) {
      setBetAmount(amount);
    }
  };

  const currentWin = Number(betAmount) * currentMultiplier;

  return {
    minesCount,
    setMinesCount,
    betAmount,
    onBetChange,
    onSetBetAmount,
    gameState,
    grid,
    currentMultiplier,
    revealedCount,
    startGame,
    revealCell,
    cashOut,
    resetGame,
    currentWin,
  };
};
