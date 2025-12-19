import classNames from "classnames";
import { GameStatus } from "../../../../../types/enums";
import styles from "./mines-game-result.module.scss";
import { formatNumber } from "../../../../../utils/utils";

type Props = {
  currentWin?: number;
  gameResult: GameStatus;
};

export const MinesGameResult: React.FC<Props> = ({
  currentWin,
  gameResult,
}) => {
  return (
    <div
      className={classNames(styles["game-result"], {
        [styles.win]: gameResult === GameStatus.Win,
        [styles.lose]: gameResult === GameStatus.Lost,
      })}
    >
      <p
        className={styles["game-result__text"]}
        style={{
          color:
            gameResult === GameStatus.Win
              ? "var(--safe-area-color)"
              : "var(--mine-color)",
        }}
      >
        {gameResult === GameStatus.Win
          ? `💰You win $${formatNumber(currentWin)}`
          : "💣 You hit a mine!"}
      </p>
    </div>
  );
};
