import { useEffect, useRef, useState } from "react";
import "./homeGame.scss";
import "./gameAnimations.scss";
import { GameBar } from "../../uikit/Gamebar/GameBar";
import { PrimaryButton } from "../../uikit/Buttons/PrimaryButton";
import { SecondaryButton } from "../../uikit/Buttons/SecondaryButton";
import { PrimaryInput } from "../../uikit/Inputs/Input";
import classNames from "classnames";

export const HomeGame = () => {
  const [activeBar, setActiveBar] = useState<string>("Rocket");
  const [isRunning, setIsRunning] = useState(false);
  const [coeff, setCoeff] = useState<number>(1.0);
  const [crashed, setCrashed] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  const [betAmount, setBetAmount] = useState<string>();

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

  // Генерируем случайный краш от 1.10 до 20.00 (как в реальных играх)
  const generateCrashPoint = () => {
    const houseEdge = 0.01;
    const r = Math.random();
    const crash = 1 / (1 - r * (1 - houseEdge));
    return Math.max(1.1, Math.min(crash, 20.0));
  };

  const startGame = () => {
    if (isRunning) return;

    setIsRunning(true);
    setCrashed(false);
    setCoeff(1.0);
    hasCashedOut.current = false;
    isRunningRef.current = true;
    startTimeRef.current = Date.now();

    const newCrashPoint = generateCrashPoint();
    crashPointRef.current = newCrashPoint;
    setCrashPoint(newCrashPoint);

    console.log(`Game started with crash point: ${newCrashPoint.toFixed(2)}`);

    // Запускаем рост коэффициента
    const tick = () => {
      // Проверяем через ref, чтобы получить актуальное значение
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

  // Кнопка Cash Out
  const handleCashOut = () => {
    if (!isRunning || crashed || hasCashedOut.current) return;
    hasCashedOut.current = true;
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const maxDuration = 12;
  const speedMultiplier = Math.min(coeff / 1.5, 4);
  const currentDuration = maxDuration / speedMultiplier;

  useEffect(() => {
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  const handleChangeBar = (value: string) => setActiveBar(value);

  const games = [
    { icon: "🚀", title: "Rocket" },
    { icon: "🎰", title: "Roulette" },
  ];

  return (
    <div className="home-game">
      <div className="home-game__tabs">
        {games.map((game) => {
          return (
            <GameBar
              key={game.title}
              icon={game.icon}
              title={game.title}
              handleChangeBar={handleChangeBar}
              activeBar={activeBar}
            />
          );
        })}
      </div>

      <div className="home-game__main">
        <div className="home-game__main-container">
          <div
            className="home-game__main-window"
            style={
              {
                "--duration": `${currentDuration}s`,
              } as React.CSSProperties
            }
            data-running={isRunning}
          >
            <p 
            className={classNames(
              "home-game__main-window__factor", 
              {"crashed": crashed }, 
              {"cashout": !crashed && isRunning 
            })}>
              {crashed
                ? `${crashPoint.toFixed(2)}x`
                : `${coeff.toFixed(2)}x`}
            </p>
            <div className="bg-city" />
            <img
              className="window-icon"
              src="/rocket-casino-project/src/assets/images/car.png"
              alt="game"
              data-running={isRunning}
            />

            <div className="road"></div>
            <div className="stripes"></div>
          </div>

          <div className="home-game__main-controls">
            <p>Bet Amount</p>

            <div className="home-game__main-controls__launch">
              <PrimaryInput
                placeholderValue={"0.00"}
                type={"number"}
                bgColor={"rgba(15, 23, 43, 1)"}
                widthSize={"50"}
                inputValue={betAmount}
                handler={handleChangeBetAmount}
              />

              <PrimaryButton
                text={isRunning ? "Cashout" : "Launch Rocket"}
                widthSize={"50"}
                bgColor1={isRunning ? "rgba(0, 153, 102, 1)" : "rgba(21, 93, 252, 1)"}
                bgColor2={isRunning ? "rgba(0, 166, 62, 1)" : "rgba(152, 16, 250, 1)"}
                handler={isRunning ? () => handleCashOut() : () => startGame()}
              />
            </div>

            <div className="home-game__main-controls__additional">
              {["10", "50", "100", "500"].map((num) => {
                return (
                  <SecondaryButton key={num} amount={num} widthSize={"25"} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
