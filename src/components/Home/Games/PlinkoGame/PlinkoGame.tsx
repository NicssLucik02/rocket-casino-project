import styles from "./plinko-game.module.scss";
import { useFloatingHits } from "../../../../hooks/useFloatingHits";
import { usePlinkoPlay } from "../../../../hooks/usePlinkoGamePlay";
import { usePlinkoGameStore } from "../../../../stores/plinkoGameStore";
import { calculatePlinkoMultipliers } from "../../../../utils/plinkoGame/plinkoMultiplier";
import { PlinkoBetPanel } from "./PlinkoBetPanel/PlinkoBetPanel";
import { PlinkoGameBoard } from "./PlinkoGameBoard/PlinkoGameBoard";
import { PlinkoHistory } from "./PlinkoHistory/PlinkoHistory";
import { useCallback, useMemo } from "react";

export const PlinkoGame = () => {
  const {
    currentBet,
    currentRisk,
    currentBallsCount,
    currentLinesCount,
    isPlaying,
    dropId,
    lastHit,
    registerBallFinish,
  } = usePlinkoGameStore();

  const { play, isLoading: isStarting, error } = usePlinkoPlay();

  const { floatingHits, addFloatingHit, clearAll } = useFloatingHits();

  const linesCount = Number(currentLinesCount);
  const ballsCount = Number(currentBallsCount);

  const multipliers = useMemo(
    () => calculatePlinkoMultipliers(linesCount, currentRisk),
    [linesCount, currentRisk],
  );

  const handleBallFinish = useCallback(
    (slotIndex: number) => {
      const multiplier = multipliers[slotIndex] ?? 0;
      const winAmount = currentBet * multiplier;

      registerBallFinish(slotIndex, multiplier);

      if (winAmount > 0) {
        addFloatingHit({
          slotIndex,
          multiplier,
          winAmount,
        });
      }
    },
    [multipliers, currentBet, registerBallFinish, addFloatingHit],
  );

  const handlePlay = useCallback(() => {
    clearAll();
    play();
  }, [play, clearAll]);

  const boardLastHit = lastHit
    ? {
        id: "last",
        slotIndex: lastHit.slotIndex ?? 0,
        multiplier: lastHit.multiplier,
        winAmount: lastHit.payout,
      }
    : null;

  return (
    <div className={styles.plinkoGame}>
      <div className={styles.plinkoGame__container}>
        <PlinkoGameBoard
          linesCount={linesCount}
          multipliers={multipliers}
          ballsCount={ballsCount}
          dropId={dropId}
          isPlaying={isPlaying}
          lastHit={boardLastHit}
          floatingHits={floatingHits}
          onBallFinish={handleBallFinish}
        />

        <PlinkoBetPanel
          onPlay={handlePlay}
          disabled={isPlaying || isStarting}
          error={error}
        />
      </div>

      <PlinkoHistory />
    </div>
  );
};