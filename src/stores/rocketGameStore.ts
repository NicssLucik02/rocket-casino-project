import { create } from 'zustand';
import { formatNumber, isValidBetAmount } from '../utils/utils';
import type { RocketState } from '../types/storeTypes';
import { generateCrashPoint } from '../utils/rocketUtils';
import { balanceStore } from './balanceStore';
import { supabase } from '../utils/supabaseClient';
import { RocketGameResult } from '../types/enums';

export const useRocketGameStore = create<RocketState>((set, get) => {
  let startInProgress = false;
  let cashOutInProgress = false;
  let credited = false;
  let preBalance: number | null = null;
  let lastBetAmount = 0;

  const countGames = async () => {
    await supabase.rpc("increment_games_played");
  };

  const addWager = async (amount: number) => {
    await supabase.rpc("add_wager", { amount });
  };

  const addWin = async (amount: number) => {
    await supabase.rpc("add_win", { win_amount: amount });
  };

  const countWonGames = async () => {
    await supabase.rpc("increment_wins");
  };

  return {
    isRunning: false,
    coeff: 1.0,
    crashed: false,
    crashPoint: 0,
    startTime: 0,
    animationId: null,
    finalResult: null,
    finalMultiplier: 0,

    betAmount: "",
    betError: null,
    showBetResultModal: false,

    setBetAmount: (value: string) => {
      if (!isValidBetAmount(value)) return;
      set({ betAmount: value, betError: null });
    },

    startRound: async () => {
      const state = get();
      if (state.isRunning || startInProgress) return;
      startInProgress = true;
      set({ betError: null });

      const amount = Number(state.betAmount);
      if (Number.isNaN(amount) || amount <= 0 || state.betAmount.trim() === "") {
        set({ betError: "Enter valid bet amount" });
        startInProgress = false;
        return;
      }

      const balance = balanceStore.getState().balance;
      if (balance !== null && balance < amount) {
        set({ betError: "Insufficient balance" });
        startInProgress = false;
        return;
      }

      const spendResult = await balanceStore.getState().spendBalance(amount);
      if (!spendResult?.success) {
        set({ betError: "Insufficient balance" });
        startInProgress = false;
        return;
      }

      await Promise.all([addWager(amount), countGames()]);
      lastBetAmount = amount;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          const { data } = await supabase
            .from("profiles")
            .select("balance")
            .eq("id", user.id)
            .single();

          preBalance = (data as { balance?: number } | null)?.balance ?? balance;
        }
      } catch {
        preBalance = balance;
      }

      const newCrashPoint = generateCrashPoint();
      get().startGame(newCrashPoint);
      credited = false;
      startInProgress = false;
    },

    cashOutRound: async () => {
      const state = get();
      if (cashOutInProgress || !state.isRunning || state.crashed) return;
      cashOutInProgress = true;

      get().cashOut(state.coeff);
      set({ showBetResultModal: true });

      await countWonGames();

      const reward = Math.round(lastBetAmount * state.coeff * 100) / 100;
      if (reward > 0 && !credited) {
        credited = true;
        await addWin(reward);

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user?.id) {
            const { data } = await supabase
              .from("profiles")
              .select("balance")
              .eq("id", user.id)
              .single();

            const serverBalance = (data as { balance?: number } | null)?.balance ?? null;
            const expected = (preBalance ?? 0) - lastBetAmount + reward;

            if (serverBalance === null || serverBalance < expected - 0.001) {
              await balanceStore.getState().addToBalance(reward);
            }
          } else {
            await balanceStore.getState().addToBalance(reward);
          }
        } catch {
          await balanceStore.getState().addToBalance(reward);
        }
      }

      cashOutInProgress = false;
    },

    closeBetResultModal: () => {
      set({ showBetResultModal: false });
      get().resetGame();
    },

    startGame: (crashPoint: number) => {
      const { stopGame } = get();
      stopGame();

      set({
        isRunning: true,
        crashed: false,
        coeff: 1.0,
        crashPoint,
        startTime: performance.now(),
        finalResult: null,
        finalMultiplier: 0,
      });

      const tick = (now: number) => {
        if (get().updateCoeff(now)) {
          get().animationId = requestAnimationFrame(tick);
        }
      };

      const id = requestAnimationFrame(tick);
      set({ animationId: id });
    },

    updateCoeff: (now: number) => {
      const s = get();
      if (!s.isRunning) return false;

      const elapsed = (now - s.startTime) / 1000;
      const raw = Math.exp(elapsed * 0.15);
      const rounded = Number(formatNumber(raw));

      set({ coeff: rounded });

      if (raw >= s.crashPoint) {
        const final = Number(formatNumber(s.crashPoint));
        set({
          coeff: final,
          crashed: true,
          isRunning: false,
          finalResult: RocketGameResult.Crashed,
          finalMultiplier: final,
          showBetResultModal: true,
        });
        if (s.animationId) cancelAnimationFrame(s.animationId);
        set({ animationId: null });
        return false;
      }

      return true;
    },

    cashOut: (currentCoeff: number) => {
      const s = get();
      if (!s.isRunning || s.crashed) return;

      if (s.animationId) {
        cancelAnimationFrame(s.animationId);
        set({ animationId: null });
      }

      set({
        isRunning: false,
        finalResult: RocketGameResult.Cashed,
        finalMultiplier: currentCoeff,
      });
    },

    stopGame: () => {
      const { animationId } = get();
      if (animationId) {
        cancelAnimationFrame(animationId);
        set({ animationId: null });
      }
      set({ isRunning: false });
    },

    resetGame: () => {
      get().stopGame();
      set({
        coeff: 1.0,
        crashed: false,
        crashPoint: 0,
        finalResult: null,
        finalMultiplier: 0,
      });
    },
  };
});
