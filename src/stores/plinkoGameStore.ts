import { create } from "zustand";
import type { PlinkoState } from "../types/storeTypes";
import { MAX_HISTORY_ITEMS, PLINKO_HISTORY_STORAGE_KEY } from "../constants";
import { BallsCount, LinesCount, RiskLevel } from "../types/enums";

export const riskOrder = [RiskLevel.Low, RiskLevel.Medium, RiskLevel.High] as const;

export const usePlinkoGameStore = create<PlinkoState>((set, get) => ({
  currentBet: 2,
  currentRisk: RiskLevel.Medium,
  currentBallsCount: BallsCount.One,
  currentLinesCount: LinesCount.L8,

  setBet: (bet) => set({ currentBet: bet }),

  handleChangeRisk: (risk) => set({ currentRisk: risk }),

  handlePrevRisk: () => {
    const current = get().currentRisk;
    const idx = riskOrder.indexOf(current);
    const nextIdx = idx <= 0 ? riskOrder.length - 1 : idx - 1;
    set({ currentRisk: riskOrder[nextIdx] });
  },

  handleNextRisk: () => {
    const current = get().currentRisk;
    const idx = riskOrder.indexOf(current);
    const nextIdx = (idx + 1) % riskOrder.length;
    set({ currentRisk: riskOrder[nextIdx] });
  },

  handleChangeBallsCount: (ballsCount) => set({ currentBallsCount: ballsCount }),

  handleChangeLinesCount: (linesCount) => set({ currentLinesCount: linesCount }),

  isPlaying: false,
  dropId: 0,
  finishedBalls: 0,
  totalWon: 0,
  results: [],
  lastHit: null as { slotIndex: number; multiplier: number; payout: number } | null,

  startRound: () =>
    set({
      isPlaying: true,
      dropId: Date.now(),
      finishedBalls: 0,
      totalWon: 0,
      results: [],
      lastHit: null,
    }),

  registerBallFinish: (slotIndex, multiplier) => {
    const { currentBet, currentBallsCount, finishedBalls, totalWon, results } = get();
    const payout = currentBet * multiplier;

    const newResults = [...results, { slotIndex, multiplier, payout }];
    const newTotalWon = totalWon + payout;

    set({
      finishedBalls: finishedBalls + 1,
      totalWon: newTotalWon,
      results: newResults,
      lastHit: { slotIndex, multiplier, payout },
    });

    if (finishedBalls + 1 === currentBallsCount) {
      get().completeRound(newTotalWon);
    }
  },

  completeRound: (finalWin: number) => {
    const { currentBet, currentBallsCount, currentRisk, currentLinesCount, results } = get();

    const historyItem = {
      id: `drop_${Date.now()}`,
      timestamp: new Date().toISOString(),
      bet: currentBet,
      balls: currentBallsCount,
      risk: currentRisk,
      lines: currentLinesCount,
      totalWin: finalWin,
      results: results.map((r) => ({
        slotIndex: r.slotIndex,
        multiplier: r.multiplier,
        payout: r.payout,
      })),
    };

    try {
      const raw = localStorage.getItem(PLINKO_HISTORY_STORAGE_KEY);
      const prev = raw ? JSON.parse(raw) : [];
      const history = Array.isArray(prev) ? prev : [];
      const updated = [historyItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(PLINKO_HISTORY_STORAGE_KEY, JSON.stringify(updated));

      window.dispatchEvent(new Event("plinko_history_updated"));
    } catch (e) {
      console.warn("Failed to save Plinko history", e);
    }

    set({ isPlaying: false });
  },

  resetRound: () =>
    set({
      isPlaying: false,
      finishedBalls: 0,
      totalWon: 0,
      results: [],
      lastHit: null,
    }),
}));