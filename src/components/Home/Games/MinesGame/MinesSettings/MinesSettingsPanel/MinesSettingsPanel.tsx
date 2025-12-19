import { COLORS, GAME_CONFIG } from "../../../../../../constants";
import { formatNumber } from "../../../../../../utils/utils";
import { PrimaryButton } from "../../../../../uikit/Buttons/PrimaryButton/PrimaryButton";
import { SecondaryButton } from "../../../../../uikit/Buttons/SecondaryButton/SecondaryButton";
import { PrimaryInput } from "../../../../../uikit/Inputs/Input";
import styles from "./mines-settings-panel.module.scss";
import CurrencyIcon from "../../../../../../assets/icons/Currency.svg?react";

type Props = {
  betAmount: string;
  onBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetBetAmount: (amount: string) => void;
  minesCount: number;
  onMinesCountChange: (count: number) => void;
  startGame: () => void;
  cashOut: () => void;
  gameState: string;
  currentMultiplier: number;
  isPlaying: boolean;
  currentWin: number;
};

export const MinesSettingsPanel: React.FC<Props> = ({
  betAmount,
  onBetChange,
  onSetBetAmount,
  minesCount,
  onMinesCountChange,
  startGame,
  cashOut,
  isPlaying,
  currentWin,
}) => {
  const handleChangeMines = (item: number) =>
    !isPlaying && onMinesCountChange(item);

  return (
    <div className={styles["settings-panel"]}>
      <div className={styles["settings-panel__container"]}>
        <div>
          <p className={styles["settings-panel__desc"]}>Bet Amount</p>
          <PrimaryInput
            placeholderValue="0.00"
            type="number"
            widthSize="100"
            inputValue={betAmount}
            handler={onBetChange}
            isDisabled={isPlaying}
          />
        </div>

        <div className={styles["settings-panel__buttons"]}>
          {GAME_CONFIG.QUICK_BET_AMOUNTS.map((item) => {
            return (
              <SecondaryButton
                key={item}
                amount={item}
                symbol="$"
                widthSize="25"
                fontSize="14px"
                bgColor={COLORS.BACKGROUND_CARD}
                handler={() => onSetBetAmount(item.toString())}
                disabled={isPlaying}
              />
            );
          })}
        </div>

        <div>
          <p className={styles["settings-panel__desc"]}>Mines: {minesCount}</p>

          <div className={styles["settings-panel__buttons"]}>
            {[1, 3, 5, 10, 15].map((item) => {
              return (
                <SecondaryButton
                  key={item}
                  amount={item}
                  widthSize="20"
                  fontSize="14px"
                  bgColor={COLORS.BACKGROUND_CARD}
                  isActive={minesCount === item}
                  handler={() => handleChangeMines(item)}
                  disabled={isPlaying}
                />
              );
            })}
          </div>
        </div>

        <PrimaryButton
          text={
            isPlaying ? `Cash out $${formatNumber(currentWin)}` : "Start Game"
          }
          widthSize="100"
          bgColor1={
            isPlaying
              ? COLORS.ORANGE_GRADIENT.from
              : COLORS.SUCCESS_GRADIENT.from
          }
          bgColor2={
            isPlaying ? COLORS.ORANGE_GRADIENT.to : COLORS.SUCCESS_GRADIENT.to
          }
          Icon={CurrencyIcon}
          handler={isPlaying ? cashOut : startGame}
        />
      </div>
    </div>
  );
};
