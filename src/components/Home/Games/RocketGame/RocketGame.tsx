import classNames from "classnames";
import { SecondaryButton } from "../../../uikit/Buttons/SecondaryButton/SecondaryButton";
import { PrimaryInput } from "../../../uikit/Inputs/Input";
import { PrimaryButton } from "../../../uikit/Buttons/PrimaryButton/PrimaryButton";
import { useRocketGameContext } from "../../../../contexts/rocketGameContextBase";
import carImg from "../../../../assets/images/car.png";
import { useWindowSize } from "../../../../hooks/useWindowSize";
import { formatNumber } from "../../../../utils/utils";
import stylesAnimations from "../../HomeGame/gameAnimations.module.scss";
import stylesHomeGame from "../../HomeGame/homeGame.module.scss";

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
    betError,
  } = useRocketGameContext();
  const { isMobile } = useWindowSize();
  const buttonWidth = isMobile ? "100" : "50";

  const handlePrimaryButtonClick = () => {
    if (isRunning) {
      handleCashOut();
    } else {
      startGame();
    }
  };

  return (
    <>
      <div
        className={stylesAnimations["home-game__main-window"]}
        style={{ "--duration": `${currentDuration}s` } as React.CSSProperties}
        data-running={isRunning}
      >
        <p
          className={classNames(
            stylesAnimations["home-game__main-window__factor"],
            { [stylesAnimations["crashed"]]: crashed },
            { [stylesAnimations["cashout"]]: !crashed && isRunning },
          )}
        >
          {crashed ? `${formatNumber(crashPoint)}x` : `${formatNumber(coeff)}x`}
        </p>
        <div className={stylesAnimations["bg-city"]} />
        <img
          className={stylesAnimations["window-icon"]}
          src={carImg}
          alt="game"
          data-running={isRunning}
        />
        <div className={stylesAnimations["road"]}></div>
        <div className={stylesAnimations["stripes"]}></div>
      </div>

      <div className={stylesHomeGame["home-game__main-controls"]}>
        <p>Amount</p>
        <div className={stylesHomeGame["home-game__main-controls__launch"]}>
          <PrimaryInput
            placeholderValue={"0.00"}
            type={"number"}
            bgColor={"rgba(15, 23, 43, 1)"}
            widthSize={buttonWidth}
            inputValue={betAmount}
            handler={handleChangeBetAmount}
          />
          {betError && (
            <p className={stylesHomeGame["home-game__error"]}>{betError}</p>
          )}
          <PrimaryButton
            text={isRunning ? "Cashout" : "Launch Rocket"}
            widthSize={buttonWidth}
            bgColor1={
              isRunning ? "rgba(0, 153, 102, 1)" : "rgba(21, 93, 252, 1)"
            }
            bgColor2={
              isRunning ? "rgba(0, 166, 62, 1)" : "rgba(152, 16, 250, 1)"
            }
            handler={handlePrimaryButtonClick}
            disabled={!isRunning && (!!betError || !betAmount)}
          />
        </div>
        <div className={stylesHomeGame["home-game__main-controls__additional"]}>
          {[10, 50, 100, 500].map((num) => (
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
