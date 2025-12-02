import classNames from "classnames";
import { SecondaryButton } from "../../uikit/Buttons/SecondaryButton";
import { PrimaryInput } from "../../uikit/Inputs/Input";
import { PrimaryButton } from "../../uikit/Buttons/PrimaryButton";
import { useRocketGameContext } from "../../../contexts/rocketGameContextBase";
import carImg from "../../../assets/images/car.png";
import { useWindowSize } from "../../../hooks/useWindowSize";

export const RocketGame = () => {
  const {
    handleChangeBetAmount,
    startGame,
    currentDuration,
    handleCashOut,
    isRunning,
    crashed,
    coeff,
    crashPoint,
    betAmount,
  } = useRocketGameContext();
  const { isMobile } = useWindowSize();
  const buttonWidth = isMobile ? "100" : "50";

  return (
    <>
      <div
        className="home-game__main-window"
        style={{ "--duration": `${currentDuration}s` } as React.CSSProperties}
        data-running={isRunning}
      >
        <p
          className={classNames(
            "home-game__main-window__factor",
            { crashed },
            { cashout: !crashed && isRunning },
          )}
        >
          {crashed ? `${crashPoint.toFixed(2)}x` : `${coeff.toFixed(2)}x`}
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
        <p>Amount</p>
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
            bgColor1={
              isRunning ? "rgba(0, 153, 102, 1)" : "rgba(21, 93, 252, 1)"
            }
            bgColor2={
              isRunning ? "rgba(0, 166, 62, 1)" : "rgba(152, 16, 250, 1)"
            }
            handler={isRunning ? () => handleCashOut() : () => startGame()}
          />
        </div>
        <div className="home-game__main-controls__additional">
          {["10", "50", "100", "500"].map((num) => (
            <SecondaryButton
              key={num}
              amount={num}
              widthSize={"25"}
              handler={(_, amount) => handleChangeBetAmount(amount)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
