import styles from "./mines-settings.module.scss";
import { MinesSettingsInfo } from "./MinesGameInfo/MinesSettingsInfo";
import { MinesSettingsTips } from "./MinesGamesTips/MinesSettingsTips";
import { MinesSettingsPanel } from "./MinesSettingsPanel/MinesSettingsPanel";
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
  currentWin: number;
  revealedCount: number;
};

export const MinesSettings: React.FC<Props> = ({
  betAmount,
  onBetChange,
  onSetBetAmount,
  minesCount,
  onMinesCountChange,
  startGame,
  cashOut,
  gameState,
  currentMultiplier,
  currentWin,
  revealedCount,
}) => {
  const isPlaying = gameState === "playing";

  const safeFields = 25 - minesCount - revealedCount;

  return (
    <div className={styles["settings"]}>
      <p className={styles["settings__title"]}>Game Settings</p>

      <MinesSettingsPanel
        betAmount={betAmount}
        onBetChange={onBetChange}
        onSetBetAmount={onSetBetAmount}
        minesCount={minesCount}
        onMinesCountChange={onMinesCountChange}
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
