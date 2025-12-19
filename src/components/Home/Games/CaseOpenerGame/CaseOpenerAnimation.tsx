import styles from "./caseGame.module.scss";
import classNames from "classnames";
import { useCaseOpener } from "../../../../hooks/useAnimationCaseOpener";
import { motion, AnimatePresence } from "framer-motion";
import type { CaseItem, Rarity } from "../../../../types/Types";
import { caseItemsRarities } from "../../../../constants/caseItemsRarity";
import { RarityTypes } from "../../../../types/enums";

type Props = {
  items: CaseItem[];
  wonItem: CaseItem;
  isOpen: boolean;
  onFinish: (winner: CaseItem) => void;
};

export const CaseOpeningAnimation: React.FC<Props> = ({
  items,
  wonItem,
  isOpen,
  onFinish,
}) => {
  const {
    isRunning,
    setIsRunning,
    finishCalledRef,
    tapeItems,
    wonIndex,
    containerRef,
    itemRefs,
    targetX,
  } = useCaseOpener(items, wonItem, isOpen);
  const rarityGradients = caseItemsRarities.reduce(
    (acc, r) => {
      acc[r.rarity.toLowerCase() as Rarity] = r.gradient;
      return acc;
    },
    {} as Record<Rarity, string>,
  );

  const onAnimationComplete = () => {
    if (isOpen && !finishCalledRef.current) {
      finishCalledRef.current = true;
      setIsRunning(false);
      const winner = tapeItems[wonIndex];
      setTimeout(() => onFinish(winner), 800);
    }
  };

  return (
    <div className={styles["case-game__animation"]} ref={containerRef}>
      <motion.div
        className={styles["case-game__tape"]}
        initial={{ x: 0 }}
        animate={{ x: isOpen ? targetX : 0 }}
        transition={{
          duration: 7.2,
          ease: [0.1, 0.1, 0.05, 0.99],
        }}
        onAnimationComplete={onAnimationComplete}
      >
        {tapeItems.map((item, idx) => {
          const isWinner = isOpen && !isRunning && idx === wonIndex;
          const gradient =
            item.color1 && item.color2
              ? `linear-gradient(to right, ${item.color1}, ${item.color2})`
              : rarityGradients[item.rarity as Rarity];

          return (
            <div
              key={`${item.id}-${idx}`}
              className={classNames(styles["case-game__tape-item"], {
                [styles["case-game__tape-item--winner"]]: isWinner,
              })}
              style={{ background: gradient, zIndex: isWinner ? 10 : 1 }}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
            >
              <div className={styles["case-game__tape-item-info"]}>
                <p className={styles["case-game__tape-item-icon"]}>
                  {item.icon}
                </p>
                <p className={styles["case-game__tape-item-text"]}>
                  {item.name}
                </p>
              </div>
              <p className={styles["case-game__tape-item-price"]}>
                ${item.price}
              </p>

              <AnimatePresence>
                {isWinner &&
                  item.rarity.toLowerCase() ===
                    RarityTypes.Gold.toLowerCase() && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.8, 1.6, 2] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className={styles["case-game__tape-item-glow"]}
                    />
                  )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      <div className={styles["case-game__tape-pointer"]}>
        <div className={styles["case-game__tape-pointer-top"]} />
        <div className={styles["case-game__tape-pointer-bottom"]} />
      </div>
    </div>
  );
};
