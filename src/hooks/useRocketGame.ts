import { useRef, useState, useCallback } from "react";
import { useBalanceContext } from "../contexts/BalanceContext";
import { useSettings } from "./useSettings";

export const useRocketGame = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [coeff, setCoeff] = useState<number>(1.0);
  const [crashed, setCrashed] = useState<boolean>(false);
  const [crashPoint, setCrashPoint] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<string>("");
  const [betError, setBetError] = useState<string | null>(null);
  const [showBetResultModal, setShowBetResultModal] = useState<boolean>(false);

  const { addToBalance, spendBalance } = useBalanceContext();
  const { countGames, getTotalWon, getTotalWag } = useSettings();

  const coeffRef = useRef<number>(1.0);
  const hasCashedOutRef = useRef<boolean>(false);
  const crashedRef = useRef<boolean>(false);
  const finalResultRef = useRef<"cashed" | "crashed" | null>(null);
  const finalMultiplierRef = useRef<number>(0);
  const cashOutInProgressRef = useRef<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const animationIdRef = useRef<number | null>(null);
  const crashPointRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const generateCrashPoint = () => {
    const houseEdge = 0.01;
    const r = Math.random();
    const crash = 1 / (1 - r * (1 - houseEdge));
    return Math.max(1.1, Math.min(crash, 100));
  };

  const startGame = useCallback(() => {
    if (isRunningRef.current) return;

    if (betAmount === '' || betAmount.trim() === '') {
      setBetError('Enter Bet Amount');
      return;
    }

    const amount = Number(betAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setBetError('Bet amount must be greater than 0');
      return;
    }
    
    // Очищаем ошибку перед запуском игры
    setBetError(null);

    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    spendBalance(amount);
    getTotalWag(amount);

    setIsRunning(true);
    setCrashed(false);
    setCoeff(1.0);
    coeffRef.current = 1.0;
    crashedRef.current = false;
    hasCashedOutRef.current = false;
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
      const rounded = Number(raw.toFixed(2));

      coeffRef.current = rounded;
      setCoeff(rounded);

      if (raw >= crashPointRef.current) {
        const final = Number(crashPointRef.current.toFixed(2));
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
  }, [betAmount, spendBalance, getTotalWag]);

  const handleCashOut = async () => {
    if (cashOutInProgressRef.current || !isRunningRef.current || crashedRef.current || hasCashedOutRef.current) return;

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
      const reward = Number((Number(betAmount) * multiplier).toFixed(2));

      finalResultRef.current = "cashed";
      finalMultiplierRef.current = multiplier;

      if (reward > 0) {
        await getTotalWon(reward);
      }
    } finally {
      cashOutInProgressRef.current = false;
    }
  }

  const handleChangeBetAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === "string" ? e : e.target.value;
      setBetAmount(value);
      if (betError) setBetError(null);
    },
    [betError]
  );

  const maxDuration = 12;
  const speedMultiplier = Math.min(coeff / 1.5, 4);
  const currentDuration = maxDuration / speedMultiplier;

   const onClose = () => {
    setShowBetResultModal(false)
  }
  
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
