import { formatNumber } from "../../../../../../utils/utils";
import styles from "./current-game-info.module.scss";

type Props = {
  betAmount: string;
  safeFields: number;
  currentWin: number;
};

export const MinesSettingsInfo: React.FC<Props> = ({
  betAmount,
  safeFields,
  currentWin,
}) => {
  return (
    <div className={styles["mines-info"]}>
      <div className={styles["mines-info__container"]}>
        <p className={styles["mines-info__title"]}>Current Game</p>
        <div className={styles["mines-info__item"]}>
          <span className={styles["mines-info__desc"]}>Bet ammount:</span>
          <span className={styles["mines-info__amount"]}>${betAmount}</span>
        </div>
        <div className={styles["mines-info__item"]}>
          <span className={styles["mines-info__desc"]}>Current Value:</span>
          <span className={styles["mines-info__win"]}>
            ${Number(formatNumber(currentWin))}
          </span>
        </div>

        <div className={styles["divider"]} />

        <div className={styles["mines-info__item"]}>
          <span className={styles["mines-info__desc"]}>Safe Tiles Left:</span>
          <span className={styles["mines-info__safe-fields"]}>
            {safeFields}
          </span>
        </div>
      </div>
    </div>
  );
};
