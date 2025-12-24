import { create } from 'zustand';
import { GameStatus, MinesCount } from '../types/enums';
import { GAME_CONFIG } from '../constants';

import { calculateMultiplier } from '../utils/minesGame/mineMultiplier';
import type { MinesStore } from '../types/storeTypes';
import { resetGrid } from '../utils/minesGame/minesGrid';

const minBetAmount = GAME_CONFIG.QUICK_BET_AMOUNTS[0] ?? 1;

export const useMinesStore = create<MinesStore>((set, get) => ({
  minesCount: MinesCount.Three,
  betAmount: String(minBetAmount),
  gameState: GameStatus.Idle,
  grid: resetGrid(),
  revealedCount: 0,
  currentMultiplier: 1,

  setMinesCount: (count) => {
    set({ minesCount: count });
    get().resetGame();
  },

  setBetAmount: (amount) => {
    if (/^\d*\.?\d*$/.test(amount)) {
      set({ betAmount: amount });
      get().resetGame();
    }
  },

  startGame: () => {
    const { minesCount } = get();

    const newGrid = resetGrid();
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
      const idx = Math.floor(Math.random() * 25);
      if (!newGrid[idx].isMine) {
        newGrid[idx].isMine = true;
        minesPlaced++;
      }
    }

    set({
      grid: newGrid,
      gameState: GameStatus.Playing,
      revealedCount: 0,
      currentMultiplier: calculateMultiplier(0, minesCount),
    });
  },

  revealCell: (id: number): boolean => {
    const state = get();
    if (state.gameState !== GameStatus.Playing) return false;

    const cell = state.grid[id];
    if (!cell || cell.isRevealed || cell.isUserRevealed) return false;

    const hitMine = cell.isMine;

    if (hitMine) {
      set({
        gameState: GameStatus.Lost,
        grid: state.grid.map((c) => ({
          ...c,
          isRevealed: c.isMine ? true : c.isRevealed,
          isUserRevealed: c.isUserRevealed,
        })),
      });
    } else {
      const newRevealedCount = state.revealedCount + 1;
      set({
        grid: state.grid.map((c, i) =>
          i === id
            ? { ...c, isRevealed: true, isUserRevealed: true }
            : c
        ),
        revealedCount: newRevealedCount,
        currentMultiplier: calculateMultiplier(newRevealedCount, state.minesCount),
      });
    }

    return hitMine;
  },

  cashOut: (): number => {
    const state = get();
    if (state.gameState !== GameStatus.Playing) return 0;

    const winAmount = Math.round(Number(state.betAmount) * state.currentMultiplier * 100) / 100;

    set({
      gameState: GameStatus.Win,
      grid: state.grid.map((c) => ({ ...c, isRevealed: true })),
    });

    return winAmount;
  },

  resetGame: () => {
    const { minesCount } = get();
    set({
      grid: resetGrid(),
      gameState: GameStatus.Idle,
      revealedCount: 0,
      currentMultiplier: calculateMultiplier(0, minesCount),
    });
  },
}));