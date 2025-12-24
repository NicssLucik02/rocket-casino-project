import styles from "./playArea.module.scss";
import { MineField } from "../MineField/MineField";
import { formatNumber } from "../../../../../utils/utils";
import { MinesGameResult } from "../MinesGameResult/MinesGameResult";
import { GameStatus } from "../../../../../types/enums";
import { useGameSounds } from "../../../../../hooks/useGameSound";
import { useMinesGameController } from "../../../../../hooks/useMinesGameController";

export const MinesPlayArea = () => {
  const { playClick, playLose } = useGameSounds();
  const {
    gameState,
    grid,
    revealCell,
    currentMultiplier,
    revealedCount,
    currentWin,
  } = useMinesGameController();

  return (
    <div className={styles["minesGame__playArea"]}>
      <div className={styles["minesGame__top"]}>
        <p className={styles["minesGame__top-title"]}>Mines</p>
        <div className={styles["minesGame__top-info"]}>
          <p className={styles["minesGame__top-info-item"]}>
            Revealed: {revealedCount}
          </p>
          <p className={styles["minesGame__top-info-item"]}>
            Multiplier:
            <span className={styles["minesGame__top-info-item__multiplier"]}>
              {formatNumber(currentMultiplier)}x
            </span>
          </p>
        </div>
      </div>

      <div className={styles["minesGame__board"]}>
        <div className={styles["minesGame__board-container"]}>
          {grid.map((cell) => (
            <MineField
              key={cell.id}
              gameResult={cell.isRevealed ? (cell.isMine ? "lost" : "win") : ""}
              onClick={() => {
                const isGameActive = gameState === GameStatus.Playing;
                const isCellAlreadyOpen =
                  cell.isRevealed || cell.isUserRevealed;

                if (!isGameActive || isCellAlreadyOpen) return;

                playClick();
                const hitMine = revealCell(cell.id);
                if (hitMine) playLose();
              }}
            />
          ))}
        </div>
      </div>

      {(gameState === GameStatus.Win || gameState === GameStatus.Lost) && (
        <MinesGameResult currentWin={currentWin} gameResult={gameState} />
      )}
    </div>
  );
};
