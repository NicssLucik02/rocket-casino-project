import { COLORS } from "../../../../../constants";
import { usePlinkoGameStore } from "../../../../../stores/plinkoGameStore";
import { PrimaryButton } from "../../../../uikit/Buttons/PrimaryButton/PrimaryButton";
import styles from "./plinko-bet-panel.module.scss";
import { PlinkoBallsPanel } from "./PlinkoBallsPanel";
import { PlinkoLinesPanel } from "./PlinkoLinesPanel";
import { PlinkoRiskPanel } from "./PlinkoRiskPanel";

type Props = {
  onPlay: () => void;
  disabled?: boolean;
  error?: string | null;
};

export const PlinkoBetPanel: React.FC<Props> = ({ onPlay, disabled, error }) => {
  const { currentBallsCount, currentBet } = usePlinkoGameStore();
  const buttonContent = `Drop ${currentBallsCount} ball(s) ($${currentBet} each)`;
  
  return (
    <div className={styles["plinko-panel"]}>
        <div className={styles["plinko-panel__container"]}>
            <PlinkoRiskPanel disabled={disabled} />
            <PlinkoBallsPanel disabled={disabled} />
            <PlinkoLinesPanel disabled={disabled} />
            <PrimaryButton 
              text={buttonContent} 
              widthSize="100" 
              bgColor1={COLORS.SUCCESS_GRADIENT.from} 
              bgColor2={COLORS.SUCCESS_GRADIENT.to}
              handler={onPlay}
              disabled={disabled}
            />
            {error ? (
              <p className={styles["plinko-panel__error"]}>{error}</p>
            ) : null}
        </div>
    </div>
  );
};
