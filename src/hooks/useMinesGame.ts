import { useState, useCallback, useMemo, useRef } from "react";
import { GameStatus } from "../types/enums";
import { isValidBetAmount } from "../utils/utils";
import { useBalanceContext } from "../contexts/balanceContextBase";
import { useSettings } from "./useSettings";
import { calculateMultiplier } from "../utils/calculateMultiplier";
import { resetGrid } from "../utils/minesGrid";
import type { Cell } from "../types/Types";

export const useMinesGame = () => {
  const { spendBalance, addToBalance } = useBalanceContext();
  const { getTotalWon, getTotalWag, countGames, countWonGames } = useSettings();

  const [minesCount, setMinesCount] = useState(3);
  const [betAmount, setBetAmount] = useState("10");
  const [gameState, setGameState] = useState<GameStatus>(GameStatus.Idle);
  const hasProcessedWinRef = useRef(false);
  const startInProgressRef = useRef(false);
  const cashOutInProgressRef = useRef(false);
  const [grid, setGrid] = useState<Cell[]>(resetGrid());

  const revealedCount = useMemo(() => {
    return grid.filter((cell) => cell.isUserRevealed && !cell.isMine).length;
  }, [grid]);

  const currentMultiplier = useMemo(() => {
    return calculateMultiplier(revealedCount, minesCount);
  }, [revealedCount, minesCount]);

  const startGame = useCallback(async () => {
    if (startInProgressRef.current || gameState === GameStatus.Playing) return;
    startInProgressRef.current = true;

    const amount = Number(betAmount);
    if (isNaN(amount) || amount < 1) {
      startInProgressRef.current = false;
      return;
    }

    try {
      const result = await spendBalance(amount);
      if (!result.success) return;

      await getTotalWag(amount);
      await countGames();

      hasProcessedWinRef.current = false;

      const newGrid = resetGrid();
      let minesPlaced = 0;
      while (minesPlaced < minesCount) {
        const idx = Math.floor(Math.random() * 25);
        if (!newGrid[idx].isMine) {
          newGrid[idx].isMine = true;
          minesPlaced++;
        }
      }

      setGrid(newGrid);
      setGameState(GameStatus.Playing);
    } finally {
      startInProgressRef.current = false;
    }
  }, [betAmount, minesCount, spendBalance, getTotalWag, countGames, gameState]);

  const revealCell = useCallback(
    (id: number) => {
      if (gameState !== GameStatus.Playing) return false;
      const currentCell = grid[id];
      if (!currentCell || currentCell.isRevealed || currentCell.isUserRevealed)
        return false;
      const hitMine = currentCell.isMine;

      setGrid((prev) => {
        const newGrid = prev.map((cell) => ({ ...cell }));
        const cell = newGrid[id];

        if (cell.isRevealed || cell.isUserRevealed) return prev;

        cell.isRevealed = true;
        cell.isUserRevealed = true;

        if (cell.isMine) {
          setGameState(GameStatus.Lost);
          return newGrid.map((c) => ({
            ...c,
            isRevealed: c.isMine ? true : c.isRevealed,
          }));
        }

        return newGrid;
      });

      return hitMine;
    },
    [gameState, grid],
  );

  const cashOut = useCallback(async () => {
    if (
      cashOutInProgressRef.current ||
      gameState !== GameStatus.Playing ||
      hasProcessedWinRef.current
    )
      return;
    cashOutInProgressRef.current = true;

    hasProcessedWinRef.current = true;
    setGameState(GameStatus.Win);

    try {
      const winAmount =
        Math.round(Number(betAmount) * currentMultiplier * 100) / 100;

      if (winAmount > 0) {
        await addToBalance(winAmount);
        await getTotalWon(winAmount);
        await countWonGames();
      }

      setGrid((prev) => prev.map((c) => ({ ...c, isRevealed: true })));
    } finally {
      cashOutInProgressRef.current = false;
    }
  }, [
    gameState,
    betAmount,
    currentMultiplier,
    addToBalance,
    getTotalWon,
    countWonGames,
  ]);

  const resetIfGameOver = () => {
    if (gameState === GameStatus.Win || gameState === GameStatus.Lost) {
      setGrid(resetGrid());
      setGameState(GameStatus.Idle);
    }
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidBetAmount(value)) {
      setBetAmount(value);
      resetIfGameOver();
    }
  };

  const handleSetBetAmount = (amount: string) => {
    if (isValidBetAmount(amount)) {
      setBetAmount(amount);
      resetIfGameOver();
    }
  };

  const handleMinesCountChange = (count: number) => {
    setMinesCount(count);
    resetIfGameOver();
  };

  return {
    minesCount,
    setMinesCount: handleMinesCountChange,
    betAmount,
    handleBetAmountChange,
    handleSetBetAmount,
    gameState,
    grid,
    startGame,
    revealCell,
    cashOut,
    currentMultiplier,
    revealedCount,
  };
};
