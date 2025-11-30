import { useState } from "react";
import "./homeGame.scss";
import "./gameAnimations.scss";
import { GameBar } from "../../uikit/Gamebar/GameBar";
import { PrimaryButton } from "../../uikit/Buttons/PrimaryButton";
import { SecondaryButton } from "../../uikit/Buttons/SecondaryButton";
import { PrimaryInput } from "../../uikit/Inputs/Input";
import classNames from "classnames";
import { useRocketGameContext } from "../../../contexts/RocketGameContext";
import carImg from "../../../assets/images/car.png";
import { useWindowSize } from "../../../hooks/useWindowSize";

export const HomeGame = () => {
  const { handleChangeBetAmount, startGame, currentDuration, handleCashOut, isRunning, crashed, coeff, crashPoint, betAmount, betError} = useRocketGameContext();
  const { isMobile } = useWindowSize();
  const [activeBar, setActiveBar] = useState<string>("Rocket");

  const handleChangeBar = (value: string) => setActiveBar(value);

  // Адаптивные размеры кнопок
  const buttonWidth = isMobile ? "100" : "50";

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
              src={carImg}
              alt="game"
              data-running={isRunning}
            />

            <div className="road"></div>
            <div className="stripes"></div>
          </div>

          <div className="home-game__main-controls">
            <p> Amount</p>

            <div className="home-game__main-controls__launch">
              <PrimaryInput
                placeholderValue={"0.00"}
                type={"number"}
                bgColor={"rgba(15, 23, 43, 1)"}
                widthSize={buttonWidth}
                inputValue={betAmount}
                handler={handleChangeBetAmount}
              />
              <PrimaryButton
                text={isRunning ? "Cashout" : "Launch Rocket"}
                widthSize={buttonWidth}
                bgColor1={isRunning ? "rgba(0, 153, 102, 1)" : "rgba(21, 93, 252, 1)"}
                bgColor2={isRunning ? "rgba(0, 166, 62, 1)" : "rgba(152, 16, 250, 1)"}
                handler={isRunning ? () => handleCashOut() : () => startGame()}
              />
            </div>

            {betError && (
              <p style={{color: 'red', margin: '4px 0 0 0', fontSize: '12px'}}>{betError}</p>
            )}

            <div className="home-game__main-controls__additional">
              {["10", "50", "100", "500"].map((num) => {
                return (
                  <SecondaryButton key={num} amount={num} widthSize={"25"} handler={(_, amount) => handleChangeBetAmount(amount)}/>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
