import styles from "./progressBar.module.scss";

type Props = { isLoading: boolean };

export const ProgressBar: React.FC<Props> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className={styles["progress-bar"]}>
      <div
        className={`${styles["progress-bar__inner"]} ${styles["loading"]}`}
      />
    </div>
  );
};
