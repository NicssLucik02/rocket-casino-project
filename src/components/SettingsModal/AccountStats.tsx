import { StatItem } from "./StatItem";
import styles from "./settingsModal.module.scss";
type Props = {
  balance: number | null;
  gamesPlayed: number;
  totalWagered: number;
  totalWon: number;
};

export const AccountStats: React.FC<Props> = ({
  balance,
  gamesPlayed,
  totalWagered,
  totalWon,
}) => (
  <div className={styles["settings-modal__panel"]}>
    <p className={styles["settings-modal__panel-title"]}>Account Stats</p>
    <div className={styles["settings-modal__panel-info"]}>
      <StatItem label="Balance" value={`$${balance || 0}`} />
      <StatItem label="Games Played" value={gamesPlayed} />
      <StatItem label="Total wagered" value={`$${totalWagered}`} />
      <StatItem label="Total won" value={`$${totalWon}`} />
    </div>
  </div>
);
