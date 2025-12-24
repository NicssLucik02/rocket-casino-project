import { useState, useCallback } from "react";
import type { FloatingHit } from "../types/Types";

export const useFloatingHits = () => {
  const [floatingHits, setFloatingHits] = useState<FloatingHit[]>([]);

  const addFloatingHit = useCallback((hit: Omit<FloatingHit, "id">) => {
    const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    const newHit: FloatingHit = { ...hit, id };

    setFloatingHits((prev) => [...prev, newHit]);

    setTimeout(() => {
      setFloatingHits((prev) => prev.filter((h) => h.id !== id));
    }, 1300);
  }, []);

  const clearAll = useCallback(() => {
    setFloatingHits([]);
  }, []);

  return {
    floatingHits,
    addFloatingHit,
    clearAll,
  };
};