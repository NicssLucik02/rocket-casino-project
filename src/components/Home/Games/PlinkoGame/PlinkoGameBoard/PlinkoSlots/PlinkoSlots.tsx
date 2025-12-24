import { AnimatePresence } from "framer-motion";
import styles from "./plinko-slots.module.scss";
import classNames from "classnames";
import { formatMultiplier, getSlotGradient } from "../../../../../../utils/plinkoGame/plinkoUtils";
import { FloatingWin } from "../FloatingWin/FloatingWin";
import type { Hit } from "../../../../../../types/Types";

type Props = {
  multipliers: number[];
  lastHit: Hit | null;
  floatingHitsBySlot: Record<number, Hit[]>;
};

export const PlinkoSlots: React.FC<Props> = ({
  multipliers,
  lastHit,
  floatingHitsBySlot,
}) => (
  <div className={styles.slotsContainer}>
    <div className={styles.slots}>
      {multipliers.map((multiplier, index) => {
        const isWin = lastHit?.slotIndex === index;
        const hits = floatingHitsBySlot[index] ?? [];

        return (
          <div
            key={index}
            className={classNames(styles.slot, { [styles.slotWin]: isWin })}
            style={{ background: getSlotGradient(multiplier) }}
          >
            <div className={styles.slotInner}>
              <span className={styles.multiplier}>
                {formatMultiplier(multiplier)}
              </span>

              <AnimatePresence initial={false}>
                {hits.map((hit) => (
                  <FloatingWin key={hit.id} winAmount={hit.winAmount} />
                ))}
              </AnimatePresence>
            </div>
            {isWin && <div className={styles.slotPulse} />}
          </div>
        );
      })}
    </div>
  </div>
);