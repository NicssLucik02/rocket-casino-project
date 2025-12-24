import { useMemo, useRef } from "react";
import styles from "./game-board.module.scss";
import type { Hit } from "../../../../../types/Types";
import { PlinkoBall } from "./PlinkoBall/PlinkoBall";
import { PlinkoSlots } from "./PlinkoSlots/PlinkoSlots";
import { clamp, createBallIds } from "../../../../../utils/plinkoGame/plinkoUtils";
import { PlinkoPins } from "./Pins/PlinkoPins";
import { usePlinkoPins } from "../../../../../hooks/usePlinkoPins";

type Props = {
  linesCount: number;
  multipliers: number[];
  ballsCount: number;
  dropId: number;
  isPlaying: boolean;
  lastHit: Hit | null;
  floatingHits: Hit[];
  onBallFinish: (slotIndex: number) => void;
};

export const PlinkoGameBoard: React.FC<Props> = ({
  linesCount,
  multipliers,
  ballsCount,
  dropId,
  isPlaying,
  lastHit,
  floatingHits,
  onBallFinish,
}) => {
const boardInnerRef = useRef<HTMLDivElement>(null);
  const pins = usePlinkoPins(9);

  const pinSize = clamp(16 - linesCount * 0.4, 10, 14);
  const pinOpacity = clamp(1.1 - linesCount * 0.025, 0.65, 1);

  const ballIds = useMemo(
    () => createBallIds(ballsCount, dropId),
    [ballsCount, dropId]
  );

  const floatingHitsBySlot = useMemo(() => {
    const grouped: Record<number, Hit[]> = {};
    for (const hit of floatingHits) {
      (grouped[hit.slotIndex] ??= []).push(hit);
    }
    return grouped;
  }, [floatingHits]);

  return (
    <div className={styles.board}>
      <div className={styles.boardClip}>
        <div ref={boardInnerRef} className={styles.boardInner}>
          <div className={styles.backgroundGlow} />

          <PlinkoPins
            pins={pins}
            pinSize={pinSize}
            pinOpacity={pinOpacity}
          />

          {isPlaying
            ? ballIds.map((ballId, index) => (
                <PlinkoBall
                  key={ballId}
                  index={index}
                  dropId={dropId}
                  isPlaying={isPlaying}
                  slotsCount={multipliers.length}
                  pins={pins}
                  pinSize={pinSize}
                  boardRef={boardInnerRef}
                  onFinish={onBallFinish}
                />
              ))
            : null}

            <PlinkoSlots
              lastHit={lastHit}
              multipliers={multipliers}
              floatingHitsBySlot={floatingHitsBySlot}
            />
        </div>
      </div>
    </div>
  );
};
