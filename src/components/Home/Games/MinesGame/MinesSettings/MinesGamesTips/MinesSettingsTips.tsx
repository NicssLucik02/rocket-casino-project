import styles from "./mines-tips.module.scss";

export const MinesSettingsTips: React.FC = () => {
  return (
    <div className={styles["mines-tips"]}>
      <div className={styles["mines-tips__container"]}>
        <p className={styles["mines-tips__title"]}>💡 Tips</p>
        <ul className={styles["mines-tips__list"]}>
          <li className={styles["mines-tips__item"]}>
            More mines = higher multiplier
          </li>
          <li className={styles["mines-tips__item"]}>
            Cash out anytime to secure wins
          </li>
          <li className={styles["mines-tips__item"]}>
            Each safe tile increases payout
          </li>
          <li className={styles["mines-tips__item"]}>One mine ends the game</li>
        </ul>
      </div>
    </div>
  );
};
