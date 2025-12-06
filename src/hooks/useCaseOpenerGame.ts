import { useMemo, useRef, useState } from "react";
import { useBalanceContext } from "../contexts/balanceContextBase";
import type { CaseItem, CaseType, Rarity } from "../types/Types";
import { caseItemsRarities } from "../constants/caseItemsRarity";

type Deps = {
  getTotalWag?: (amount: number) => Promise<void>;
  countGames?: () => Promise<void>;
};

export const useCaseOpenerGame = (
  onOpeningChange?: (opening: boolean) => void,
  deps?: Deps,
) => {
  const [currentCase, setCurrentCase] = useState<CaseType | null>(null);
  const [wonItem, setWonItem] = useState<CaseItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const { spendBalance, balance } = useBalanceContext();

  const finishingRef = useRef(false);
  const openingRef = useRef(false);
  const gameCountedRef = useRef(false);

  const closeResultModal = () => {
    setShowResult(false);
    setWonItem(null);
  };

  const rarityWeights: Record<Rarity, number> = useMemo(() => {
    const map: Partial<Record<Rarity, number>> = {};
    caseItemsRarities.forEach((r) => {
      const key = r.rarity.toLowerCase() as Rarity;
      map[key] = r.chance;
    });
    return map as Record<Rarity, number>;
  }, []);

  const rarityGradients: Record<Rarity, string> = useMemo(() => {
    const map: Partial<Record<Rarity, string>> = {};
    caseItemsRarities.forEach((r) => {
      const key = r.rarity.toLowerCase() as Rarity;
      map[key] = r.gradient;
    });
    return map as Record<Rarity, string>;
  }, []);

  const pickWonItem = (items: CaseItem[]): CaseItem => {
    const weights = items.map((it) => rarityWeights[it.rarity] ?? 1);
    const total = weights.reduce((acc, w) => acc + w, 0);
    const rnd = Math.random() * total;
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += weights[i];
      if (rnd <= sum) return items[i];
    }
    return items[items.length - 1];
  };

  const handleSelectCase = (selected: CaseType) => {
    setCurrentCase(selected);
    setIsOpening(false);
    if (onOpeningChange) onOpeningChange(false);
    setWonItem(null);
    setShowResult(false);
    finishingRef.current = false;
    openingRef.current = false;
    gameCountedRef.current = false;
  };

  const handleCloseResult = () => setShowResult(false);

  const handleRepeatBet = async (win: CaseItem) => {
    if (openingRef.current || isOpening) return;
    openingRef.current = true;
    if (!currentCase) return;
    if (balance !== null && balance < currentCase.price) return;
    const result = await spendBalance(currentCase.price);
    if (!result?.success) {
      openingRef.current = false;
      return;
    }
    if (deps?.getTotalWag) await deps.getTotalWag(currentCase.price);
    if (!gameCountedRef.current && deps?.countGames) {
      await deps.countGames();
      gameCountedRef.current = true;
    }
    setWonItem(win);
    setShowResult(false);
    setIsOpening(true);
    finishingRef.current = false;
    if (onOpeningChange) onOpeningChange(true);
  };

  const handleOpenCase = async () => {
    if (openingRef.current || isOpening) return;
    openingRef.current = true;
    if (!currentCase) return;
    if (balance !== null && balance < currentCase.price) return;
    const result = await spendBalance(currentCase.price);
    if (!result?.success) {
      openingRef.current = false;
      return;
    }
    if (deps?.getTotalWag) await deps.getTotalWag(currentCase.price);
    if (!gameCountedRef.current && deps?.countGames) {
      await deps.countGames();
      gameCountedRef.current = true;
    }
    const win = pickWonItem(currentCase.items as unknown as CaseItem[]);
    setWonItem(win);
    setIsOpening(true);
    finishingRef.current = false;
    if (onOpeningChange) onOpeningChange(true);
    setShowResult(false);
  };

  const isCaseActive = (caseItem: CaseType) => {
    return caseItem.id === currentCase?.id;
  };

  const onSelectCase = (selected: CaseType) => {
    if (isOpening) return;
    handleSelectCase(selected);
  };

  const onFinishOpening = async (
    getTotalWon: (amount: number) => Promise<void>,
    countWonGames: () => Promise<void>,
  ) => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setIsOpening(false);
    if (onOpeningChange) onOpeningChange(false);
    if (wonItem) {
      await getTotalWon(wonItem.price);
      await countWonGames();
    }
    openingRef.current = false;
    setShowResult(true);
  };

  const onFinishOpeningWithWinner = async (
    winner: CaseItem,
    getTotalWon: (amount: number) => Promise<void>,
    countWonGames: () => Promise<void>,
  ) => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setWonItem(winner);
    setIsOpening(false);
    if (onOpeningChange) onOpeningChange(false);
    await getTotalWon(winner.price);
    await countWonGames();
    openingRef.current = false;
    setShowResult(true);
  };

  return {
    currentCase,
    wonItem,
    showResult,
    isOpening,
    handleOpenCase,
    handleSelectCase,
    handleCloseResult,
    handleRepeatBet,
    isCaseActive,
    onSelectCase,
    finishingRef,
    openingRef,
    rarityGradients,
    setIsOpening,
    closeResultModal,
    pickWonItem,
    onFinishOpening,
    onFinishOpeningWithWinner,
  };
};
