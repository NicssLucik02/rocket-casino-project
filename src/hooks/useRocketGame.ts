import { useEffect, useRef, useState } from "react";
import { useBalance } from "./useBalance";

export const useRocketGame = () => {
      const [isRunning, setIsRunning] = useState(false);
      const [coeff, setCoeff] = useState<number>(1.0);
      const [crashed, setCrashed] = useState(false);
      const [crashPoint, setCrashPoint] = useState<number>(0);
      const [betAmount, setBetAmount] = useState<string>('');
      const [showConfetti, setShowConfetti] = useState<boolean>(false);
      const [betError, setBetError] = useState<string | null>(null);
      const { addToBalance, spendBalance } = useBalance();
      
    const handleChangeBetAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBetAmount(event.target.value);
  };
  
  const startTimeRef = useRef<number>(0);
  const animationIdRef = useRef<number>(0);
  const hasCashedOut = useRef(false);
  const crashPointRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const generateCrashPoint = () => {
    const houseEdge = 0.01;
    const r = Math.random();
    const crash = 1 / (1 - r * (1 - houseEdge));
    return Math.max(1.1, Math.min(crash, 20.0));
  };

  const startGame = () => {
    if (isRunning) return;
    if (betAmount === ''){
      setBetError('Enter Bet Ammount');
      return
    }

    spendBalance(Number(betAmount));

    setIsRunning(true);
    setCrashed(false);
    setCoeff(1.0);
    hasCashedOut.current = false;
    isRunningRef.current = true;
    startTimeRef.current = Date.now();

    const newCrashPoint = generateCrashPoint();
    crashPointRef.current = newCrashPoint;
    setCrashPoint(newCrashPoint);

    

    const tick = () => {
      if (!isRunningRef.current) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const currentCoeff = Math.exp(elapsed * 0.15);

      setCoeff(Number(currentCoeff.toFixed(2)));

      if (currentCoeff >= crashPointRef.current) {
        console.log(
          `Crash! Reached ${currentCoeff.toFixed(
            2
          )} >= ${crashPointRef.current.toFixed(2)}`
        );
        setCoeff(crashPointRef.current);
        setCrashed(true);
        setIsRunning(false);
        isRunningRef.current = false;
        return;
      }

      animationIdRef.current = requestAnimationFrame(tick);
    };

    animationIdRef.current = requestAnimationFrame(tick);
  };

  const reward = Number((Number(betAmount) * coeff).toFixed(2));

  console.log(reward)

  const handleCashOut = async () => {
    if (!isRunning || crashed || hasCashedOut.current) return;
    hasCashedOut.current = true;
    setIsRunning(false);
    isRunningRef.current = false;

    if (reward <= 0) return;

    await addToBalance(reward);
    // if (!result.success) {
    //   setBetError(result.error ?? "Не удалось обновить баланс");
    //   return;
    // }

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 8000);
  };

  const maxDuration = 12;
  const speedMultiplier = Math.min(coeff / 1.5, 4);
  const currentDuration = maxDuration / speedMultiplier;

  
  return {
    handleChangeBetAmount,
    startGame,
    animationIdRef,
    showConfetti,
    currentDuration,
    handleCashOut,
    isRunning,
    crashed,
    coeff,
    crashPoint,
    betAmount,
    betError,
  }
}