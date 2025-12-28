import styles from "./plinko-bet-panel.module.scss";
import { SecondaryButton } from "../../../../uikit/Buttons/SecondaryButton/SecondaryButton";
import { usePlinkoGameStore } from "../../../../../stores/plinkoGameStore";

type Props = {
  disabled?: boolean;
};

export const PlinkoRiskPanel: React.FC<Props> = ({ disabled }) => {
  const { currentRisk, handlePrevRisk, handleNextRisk } = usePlinkoGameStore();

  return (
    <div className={styles["plinko-panel__risk"]}>
      <div className={styles["plinko-panel__risk-container"]}>
        <p className={styles["plinko-panel__risk-title"]}>Risk</p>
        <div className={styles["plinko-panel__risk-actions"]}>
          <SecondaryButton
            content="<"
            widthSize="25"
            handler={handlePrevRisk}
            fontSize="16px"
            bgColor="rgba(29, 41, 61, 1)"
            disabled={disabled}
          />
          <p>{currentRisk}</p>
          <SecondaryButton
            content=">"
            widthSize="25"
            handler={handleNextRisk}
            fontSize="16px"
            bgColor="rgba(29, 41, 61, 1)"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
