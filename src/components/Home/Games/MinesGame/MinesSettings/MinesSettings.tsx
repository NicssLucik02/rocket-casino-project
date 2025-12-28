import styles from "./mines-settings.module.scss";
import { MinesSettingsInfo } from "./MinesGameInfo/MinesSettingsInfo";
import { MinesSettingsTips } from "./MinesGamesTips/MinesSettingsTips";
import { MinesSettingsPanel } from "./MinesSettingsPanel/MinesSettingsPanel";
import { useMinesGameController } from "../../../../../hooks/useMinesGameController";
import { GameStatus } from "../../../../../types/enums";

export const MinesSettings = () => {
  const {
    minesCount,
    betAmount,
    gameState,
    startGame,
    cashOut,
    currentMultiplier,
    revealedCount,
    setMinesCount,
    onBetChange,
    onSetBetAmount,
    currentWin,
  } = useMinesGameController();

  const isPlaying = gameState === GameStatus.Playing;
  const safeFields = 25 - minesCount - revealedCount;

  return (
    <div className={styles["settings"]}>
      <p className={styles["settings__title"]}>Game Settings</p>

      <MinesSettingsPanel
        betAmount={betAmount}
        onBetChange={onBetChange}
        onSetBetAmount={onSetBetAmount}
        minesCount={minesCount}
        onMinesCountChange={setMinesCount}
        startGame={startGame}
        cashOut={cashOut}
        gameState={gameState}
        currentMultiplier={currentMultiplier}
        isPlaying={isPlaying}
        currentWin={currentWin}
      />

      <MinesSettingsInfo
        betAmount={betAmount}
        safeFields={safeFields}
        currentWin={currentWin}
      />

      <MinesSettingsTips />
    </div>
  );
};
