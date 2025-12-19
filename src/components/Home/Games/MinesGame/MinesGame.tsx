import styles from "./mines-game.module.scss";
import { useMinesGame } from "../../../../hooks/useMinesGame";
import { MinesPlayArea } from "./MinesPlayArea/MinesPlayArea";
import { MinesSettings } from "./MinesSettings/MinesSettings";

export const MinesGame = () => {
  const {
    minesCount,
    setMinesCount,
    betAmount,
    handleBetAmountChange,
    handleSetBetAmount,
    gameState,
    grid,
    startGame,
    revealCell,
    cashOut,
    currentMultiplier,
    revealedCount,
  } = useMinesGame();

  const currentWin = Number(betAmount) * currentMultiplier;

  return (
    <div className={styles["minesGame"]}>
      <MinesPlayArea
        revealedCount={revealedCount}
        currentMultiplier={currentMultiplier}
        grid={grid}
        revealCell={revealCell}
        currentWin={currentWin}
        gameState={gameState}
      />

      <MinesSettings
        betAmount={betAmount}
        onBetChange={handleBetAmountChange}
        onSetBetAmount={handleSetBetAmount}
        minesCount={minesCount}
        onMinesCountChange={setMinesCount}
        startGame={startGame}
        cashOut={cashOut}
        gameState={gameState}
        currentMultiplier={currentMultiplier}
        currentWin={currentWin}
        revealedCount={revealedCount}
      />
    </div>
  );
};
