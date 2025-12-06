import { useRef, useState, useCallback } from "react";
import { useBalanceContext } from "../contexts/balanceContextBase";
import { useSettings } from "./useSettings";
import { formatNumber } from "../utils/utils";
import { supabase } from "../utils/supabaseClient";

export const useRocketGame = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [coeff, setCoeff] = useState<number>(1.0);
  const [crashed, setCrashed] = useState<boolean>(false);
  const [crashPoint, setCrashPoint] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<string>("");
  const [betError, setBetError] = useState<string | null>(null);
  const [showBetResultModal, setShowBetResultModal] = useState<boolean>(false);

  const { spendBalance, addToBalance, balance } = useBalanceContext();
  const { getTotalWon, getTotalWag, countWonGames, countGames } = useSettings();

  const coeffRef = useRef<number>(1.0);
  const hasCashedOutRef = useRef<boolean>(false);
  const creditedRef = useRef<boolean>(false);
  const crashedRef = useRef<boolean>(false);
  const finalResultRef = useRef<"cashed" | "crashed" | null>(null);
  const finalMultiplierRef = useRef<number>(0);
  const cashOutInProgressRef = useRef<boolean>(false);
  const preBalanceRef = useRef<number | null>(null);
  const lastBetAmountRef = useRef<number>(0);

  const startTimeRef = useRef<number>(0);
  const animationIdRef = useRef<number | null>(null);
  const crashPointRef = useRef<number>(0);
  const isRunningRef = useRef(false);
  const startInProgressRef = useRef<boolean>(false);

  const generateCrashPoint = () => {
    const houseEdge = 0.01;
    const r = Math.random();
    const crash = 1 / (1 - r * (1 - houseEdge));
    return Math.max(1.1, Math.min(crash, 100));
  };

  const startGame = useCallback(async () => {
    if (isRunningRef.current || startInProgressRef.current) return;
    startInProgressRef.current = true;

    if (betAmount === "" || betAmount.trim() === "") {
      setBetError("Enter Bet Amount");
      startInProgressRef.current = false;
      return;
    }

    if (balance !== null && balance < Number(betAmount)) {
      setBetError("Insufficient balance");
      startInProgressRef.current = false;
      return;
    }

    const amount = Number(betAmount);

    if (isNaN(amount) || amount <= 0) {
      setBetError("Bet amount must be greater than 0");
      startInProgressRef.current = false;
      return;
    }

    setBetError(null);

    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    const result = await spendBalance(amount);

    if (!result?.success) {
      setBetError("Insufficient balance");
      startInProgressRef.current = false;
      return;
    }
    getTotalWag(amount);
    await countGames();
    lastBetAmountRef.current = amount;

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
        preBalanceRef.current = data?.balance ?? null;
      }
    } catch {
      preBalanceRef.current = balance;
    }

    setIsRunning(true);
    setCrashed(false);
    setCoeff(1.0);
    coeffRef.current = 1.0;
    crashedRef.current = false;
    hasCashedOutRef.current = false;
    creditedRef.current = false;
    cashOutInProgressRef.current = false;
    finalResultRef.current = null;
    isRunningRef.current = true;
    startTimeRef.current = performance.now();

    const newCrashPoint = generateCrashPoint();
    crashPointRef.current = newCrashPoint;
    setCrashPoint(newCrashPoint);

    const tick = (now: number) => {
      if (!isRunningRef.current) return;

      const elapsed = (now - startTimeRef.current) / 1000;
      const raw = Math.exp(elapsed * 0.15);
      const rounded = Number(formatNumber(raw));

      coeffRef.current = rounded;
      setCoeff(rounded);

      if (raw >= crashPointRef.current) {
        const final = Number(formatNumber(crashPointRef.current));
        coeffRef.current = final;
        setCoeff(final);
        setCrashed(true);
        crashedRef.current = true;
        setIsRunning(false);
        isRunningRef.current = false;

        finalResultRef.current = "crashed";
        finalMultiplierRef.current = final;
        setShowBetResultModal(true);

        return;
      }

      animationIdRef.current = requestAnimationFrame(tick);
    };

    animationIdRef.current = requestAnimationFrame(tick);
    startInProgressRef.current = false;
  }, [betAmount, spendBalance, getTotalWag, countGames, balance]);

  const handleCashOut = async () => {
    if (
      cashOutInProgressRef.current ||
      !isRunningRef.current ||
      crashedRef.current ||
      hasCashedOutRef.current
    )
      return;
    cashOutInProgressRef.current = true;
    hasCashedOutRef.current = true;
    isRunningRef.current = false;
    setIsRunning(false);
    setShowBetResultModal(true);

    try {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      const multiplier = coeffRef.current;
      const rewardCents = Math.round(Number(betAmount) * multiplier * 100);
      const reward = rewardCents / 100;
      await countWonGames();

      finalResultRef.current = "cashed";
      finalMultiplierRef.current = multiplier;

      if (reward > 0 && !creditedRef.current) {
        creditedRef.current = true;
        await getTotalWon(reward);

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
            const serverBalance = data?.balance ?? null;
            const expected =
              (preBalanceRef.current ?? 0) - lastBetAmountRef.current + reward;
            const epsilon = 0.001;
            if (serverBalance === null || serverBalance < expected - epsilon) {
              await addToBalance(reward);
            }
          } else {
            await addToBalance(reward);
          }
        } catch {
          await addToBalance(reward);
        }
      }
    } finally {
      cashOutInProgressRef.current = false;
    }
  };

  const handleChangeBetAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === "string" ? e : e.target.value;
      setBetAmount(value);
      if (betError) setBetError(null);
    },
    [betError],
  );

  const maxDuration = 12;
  const speedMultiplier = Math.min(coeff / 1.5, 4);
  const currentDuration = maxDuration / speedMultiplier;

  const onClose = () => {
    setShowBetResultModal(false);
  };

  return {
    isRunning,
    crashed,
    coeff,
    crashPoint,
    betAmount,
    betError,
    currentDuration,
    showBetResultModal,
    handleChangeBetAmount,
    startGame,
    handleCashOut,
    onClose,
  };
};
