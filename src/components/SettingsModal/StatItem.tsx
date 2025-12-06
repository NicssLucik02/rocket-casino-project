import styles from "./settingsModal.module.scss";

type Props = {
  label: string;
  value: string | number;
};

export const StatItem: React.FC<Props> = ({ label, value }) => (
  <div className={styles["settings-modal__panel-item"]}>
    <p className={styles["settings-modal__panel-item-desc"]}>{label}</p>
    <p className={styles["settings-modal__panel-item-value"]}>{value}</p>
  </div>
);
