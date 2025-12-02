import "./caseGame.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import type { CaseItem, Rarity } from "../../../../types/Types";
import { caseItemsRarities } from "../../../../constants/caseItemsRarity";

type Props = {
  items: CaseItem[];
  wonItem: CaseItem;
  isOpen: boolean;
  onFinish: () => void;
};

export const CaseOpeningAnimation: React.FC<Props> = ({
  items,
  wonItem,
  isOpen,
  onFinish,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const finishCalledRef = useRef(false);
  const RARITY_GRADIENTS: Record<Rarity, string> = useMemo(() => {
    const map: Partial<Record<Rarity, string>> = {};
    caseItemsRarities.forEach((r) => {
      const key = r.rarity.toLowerCase() as Rarity;
      map[key] = r.gradient;
    });
    return map as Record<Rarity, string>;
  }, []);

  const tapeItems = useMemo(() => {
    const tape: CaseItem[] = [];
    for (let i = 0; i < 15; i++) {
      const idx = (i * 9973 + (wonItem.id ?? 0)) % items.length;
      tape.push(items[idx]);
    }
    tape.push(wonItem);
    for (let i = 0; i < 38; i++) {
      const idx = (i * 7919 + (wonItem.id ?? 0)) % items.length;
      tape.push(items[idx]);
    }
    return tape;
  }, [items, wonItem]);

  useEffect(() => {
    if (isOpen) {
      const start = setTimeout(() => setIsRunning(true), 0);
      finishCalledRef.current = false;
      return () => {
        clearTimeout(start);
      };
    }
  }, [isOpen]);

  const wonIndex = 15;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [targetX, setTargetX] = useState(0);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    const winnerEl = itemRefs.current[wonIndex] ?? null;
    if (container && winnerEl) {
      const cRect = container.getBoundingClientRect();
      const iRect = winnerEl.getBoundingClientRect();
      const containerCenter = cRect.left + cRect.width / 2;
      const itemCenter = iRect.left + iRect.width / 2;
      const dx = containerCenter - itemCenter;
      setTargetX(dx);
    }
  }, [isOpen, tapeItems]);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      const container = containerRef.current;
      const winnerEl = itemRefs.current[wonIndex] ?? null;
      if (container && winnerEl) {
        const cRect = container.getBoundingClientRect();
        const iRect = winnerEl.getBoundingClientRect();
        const containerCenter = cRect.left + cRect.width / 2;
        const itemCenter = iRect.left + iRect.width / 2;
        const dx = containerCenter - itemCenter;
        setTargetX(dx);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <div className="case-game__animation" ref={containerRef}>
      <motion.div
        className="case-game__tape"
        initial={{ x: 0 }}
        animate={isOpen ? { x: targetX } : { x: 0 }}
        transition={{
          duration: 7.2,
          ease: [0.1, 0.1, 0.05, 0.99],
        }}
        onAnimationComplete={() => {
          if (isOpen && !finishCalledRef.current) {
            finishCalledRef.current = true;
            setIsRunning(false);
            setTimeout(onFinish, 800);
          }
        }}
      >
        {tapeItems.map((item, idx) => {
          const isWinner = isOpen && !isRunning && idx === wonIndex;
          const gradient =
            item.color1 && item.color2
              ? `linear-gradient(to right, ${item.color1}, ${item.color2})`
              : RARITY_GRADIENTS[item.rarity as Rarity];

          return (
            <div
              key={`${item.id}-${idx}`}
              className={`case-game__tape-item ${isWinner ? "case-game__tape-item--winner" : ""}`}
              style={{ background: gradient, zIndex: isWinner ? 10 : 1 }}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
            >
              <div className="case-game__tape-item-info">
                <p className="case-game__tape-item-icon">{item.icon}</p>
                <p
                  className="case-game__tape-item-text"
                  style={{
                    background: gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {item.name}
                </p>
              </div>
              <p className="case-game__tape-item-price">${item.price}</p>

              <AnimatePresence>
                {isWinner && item.rarity === "gold" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.6, 2] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="absolute inset-0 rounded-lg"
                    style={{
                      mixBlendMode: "screen",
                      backgroundColor: "#FFD700",
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "2px",
          height: "100%",
          backgroundColor: "#FFD700",
          boxShadow: "0 0 30px #FFD700, 0 0 60px #FFD700",
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "16px solid #FFD700",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "16px solid #FFD700",
          }}
        />
      </div>
    </div>
  );
};
