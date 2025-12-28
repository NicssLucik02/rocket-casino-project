import { create } from 'zustand';
import { balanceStore } from './balanceStore';
import { caseItemsRarities } from '../constants/caseItemsRarity';
import { RarityTypes } from '../types/enums';
import type { CaseItem } from '../types/Types';
import type { CaseGameState } from '../types/storeTypes';

const rarityFromLowercase: Record<string, RarityTypes> = {
  common: RarityTypes.Common,
  uncommon: RarityTypes.Uncommon,
  rare: RarityTypes.Rare,
  epic: RarityTypes.Epic,
  legendary: RarityTypes.Legendary,
  gold: RarityTypes.Gold,
};

const normalizeRarity = (rarity: CaseItem["rarity"]): RarityTypes =>
  rarityFromLowercase[String(rarity).toLowerCase()] ?? RarityTypes.Common;

const rarityWeights = Object.fromEntries(
  caseItemsRarities.map(r => [r.rarity, r.chance])
) as Record<RarityTypes, number>;

const rarityGradients = Object.fromEntries(
  caseItemsRarities.map(r => [r.rarity, r.gradient])
) as Record<RarityTypes, string>;

export const useCaseGameStore = create<CaseGameState>((set, get) => ({
  currentCase: null,
  wonItem: null,
  isOpening: false,
  showResult: false,

  selectCase: (caseItem) => {
    if (get().isOpening) return;
    set({
      currentCase: caseItem,
      isOpening: false,
      wonItem: null,
      showResult: false,
    });
  },

  pickRandomItem: (items) => {
    const weights = items.map(i => rarityWeights[normalizeRarity(i.rarity)] ?? 1);
    const total = weights.reduce((a, b) => a + b, 0);
    let rnd = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      rnd -= weights[i];
      if (rnd <= 0) return items[i];
    }
    return items[items.length - 1];
  },

  getRarityGradient: (rarity) => rarityGradients[rarity] ?? '#fff',

  startOpening: async () => {
    const state = get();
    if (state.isOpening || !state.currentCase) return false;

    const balance = balanceStore.getState().balance;
    if (balance !== null && balance < state.currentCase.price) return false;

    const result = await balanceStore.getState().spendBalance(state.currentCase.price);
    if (!result.success) return false;

    const winner = get().pickRandomItem(state.currentCase.items as CaseItem[]);
    set({
      wonItem: winner,
      isOpening: true,
      showResult: false,
    });

    return true;
  },

  repeatOpening: async (winner) => {
    const state = get();
    if (state.isOpening || !state.currentCase) return false;

    const balance = balanceStore.getState().balance;
    if (balance !== null && balance < state.currentCase.price) return false;

    const result = await balanceStore.getState().spendBalance(state.currentCase.price);
    if (!result.success) return false;

    set({
      wonItem: winner,
      isOpening: true,
      showResult: false,
    });

    return true;
  },

  finishOpening: (winner) => {
    set({
      wonItem: winner,
      isOpening: false,
      showResult: true,
    });
  },

  closeResult: () => {
    set({ showResult: false, wonItem: null });
  },
}));
