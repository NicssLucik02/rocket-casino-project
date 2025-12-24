import { useMemo } from "react";
import { clamp } from "../utils/plinkoGame/plinkoUtils";

export const usePlinkoPins = (linesCount: number) => {
  const PIN_ROWS = Math.max(1, linesCount);
  const topPinsCount = 3;

  return useMemo(() => {
    const yStart = 0.03;
    const yEnd = 0.83;

    return Array.from({ length: PIN_ROWS }, (_, rowIndex) => {
      const pinsInRow = rowIndex + topPinsCount;
      const rowProgress = PIN_ROWS === 1 ? 0 : rowIndex / (PIN_ROWS - 1);
      const y = yStart + rowProgress * (yEnd - yStart);
      const widthSpread = 0.32 + rowProgress * 0.54;

      return Array.from({ length: pinsInRow }, (_, colIndex) => {
        const x =
          pinsInRow === 1
            ? 0.5
            : 0.5 + (colIndex - (pinsInRow - 1) / 2) * (widthSpread / (pinsInRow - 1));

        return {
          x: clamp(x, 0.05, 0.95),
          y,
          key: `pin-${rowIndex}-${colIndex}`,
        };
      });
    }).flat();
  }, [PIN_ROWS]);
};
