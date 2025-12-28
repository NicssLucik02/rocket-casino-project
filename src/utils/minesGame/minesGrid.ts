import type { Cell } from "../../types/Types";

export const createMinesGrid = (minesCount: number): Cell[] => {
  const grid = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    isRevealed: false,
    isMine: false,
    isUserRevealed: false,
  }));

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const idx = Math.floor(Math.random() * 25);
    if (!grid[idx].isMine) {
      grid[idx].isMine = true;
      minesPlaced++;
    }
  }

  return grid;
};

export const resetGrid = (): Cell[] =>
  Array.from({ length: 25 }, (_, i) => ({
    id: i,
    isRevealed: false,
    isMine: false,
    isUserRevealed: false,
  }));
