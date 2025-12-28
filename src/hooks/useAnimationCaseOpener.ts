import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CaseItem } from "../types/Types";
import { handleResize } from "../utils/UITools";

export const useCaseOpener = (
  items: CaseItem[],
  wonItem: CaseItem,
  isOpen: boolean,
) => {
  const [isRunning, setIsRunning] = useState(false);
  const finishCalledRef = useRef(false);

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
  const preparedHandleResize = () =>
    handleResize(containerRef, itemRefs, wonIndex, setTargetX);
  useLayoutEffect(() => {
    if (!isOpen) return;
    preparedHandleResize();
  }, [isOpen, tapeItems]);

  useEffect(() => {
    if (!isOpen) return;
    preparedHandleResize();
    window.addEventListener("resize", preparedHandleResize);
    return () => window.removeEventListener("resize", preparedHandleResize);
  }, [isOpen]);

  return {
    isRunning,
    setIsRunning,
    finishCalledRef,
    tapeItems,
    wonIndex,
    containerRef,
    itemRefs,
    targetX,
  };
};
