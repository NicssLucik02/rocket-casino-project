import classNames from "classnames";
import { SecondaryButton } from "../../../uikit/Buttons/SecondaryButton/SecondaryButton";
import { PrimaryInput } from "../../../uikit/Inputs/Input";
import { PrimaryButton } from "../../../uikit/Buttons/PrimaryButton/PrimaryButton";
import carImg from "@assets/images/Car.png";
import { useWindowSize } from "../../../../hooks/useWindowSize";
import { formatNumber } from "../../../../utils/utils";
import stylesAnimations from "../../HomeGame/gameAnimations.module.scss";
import stylesHomeGame from "../../HomeGame/homeGame.module.scss";
import { COLORS, GAME_CONFIG } from "../../../../constants";
import { useRocketGameStore } from "../../../../stores/rocketGameStore";

export const RocketGame = () => {
  const {
    isRunning,
    crashed,
    coeff,
    crashPoint,
    betAmount,
    betError,
    setBetAmount,
    startRound,
    cashOutRound,
  } = useRocketGameStore();
  const { isMobile } = useWindowSize();
  const buttonWidth = isMobile ? "100" : "50";

  const maxDuration = 12;
  const speedMultiplier = Math.min(coeff / 1.5, 4);
  const currentDuration = maxDuration / speedMultiplier;

  const handlePrimaryButtonClick = () => {
    if (isRunning) {
      void cashOutRound();
    } else {
      void startRound();
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
            bgColor={COLORS.BACKGROUND_DARK}
            widthSize={buttonWidth}
            inputValue={betAmount}
            handler={(e) => setBetAmount(e.target.value)}
          />
          {betError && (
            <p className={stylesHomeGame["home-game__error"]}>{betError}</p>
          )}
          <PrimaryButton
            text={isRunning ? "Cashout" : "Launch Rocket"}
            widthSize={buttonWidth}
            bgColor1={
              isRunning
                ? COLORS.SUCCESS_GRADIENT.from
                : COLORS.PRIMARY_GRADIENT.from
            }
            bgColor2={
              isRunning
                ? COLORS.SUCCESS_GRADIENT.to
                : COLORS.PRIMARY_GRADIENT.to
            }
            handler={handlePrimaryButtonClick}
            disabled={!isRunning && (!!betError || !betAmount)}
          />
        </div>
        <div className={stylesHomeGame["home-game__main-controls__additional"]}>
          {GAME_CONFIG.QUICK_BET_AMOUNTS.map((num) => (
            <SecondaryButton
              key={num}
              amount={num}
              symbol="$"
              widthSize={"25"}
              handler={(_, amount) => setBetAmount(amount)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
