import { useEffect, useRef, useState, useCallback } from "react";
import type { FloatingHit } from "../types/Types";

export const useFloatingHits = () => {
  const [floatingHits, setFloatingHits] = useState<FloatingHit[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addFloatingHit = useCallback((hit: Omit<FloatingHit, "id">) => {
    const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    const newHit: FloatingHit = { ...hit, id };

    setFloatingHits((prev) => [...prev, newHit]);

    const timeoutId = setTimeout(() => {
      timeoutsRef.current.delete(id);
      setFloatingHits((prev) => prev.filter((h) => h.id !== id));
    }, 1300);

    timeoutsRef.current.set(id, timeoutId);
  }, []);

  const clearAll = () => {
    for (const timeoutId of timeoutsRef.current.values()) {
      clearTimeout(timeoutId);
    }
    timeoutsRef.current.clear();
    setFloatingHits([]);
  };

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      for (const timeoutId of timeouts.values()) {
        clearTimeout(timeoutId);
      }
      timeouts.clear();
    };
  }, []);

  return {
    floatingHits,
    addFloatingHit,
    clearAll,
  };
};
