import styles from "./loader.module.scss";
import { ProgressBar } from "./ProgressBar/ProgressBar";

type Props = {
  isLoading: boolean;
};

export const Loader: React.FC<Props> = ({ isLoading }) => {
  return (
    <div className={styles["loader"]}>
      <ProgressBar isLoading={isLoading} />
    </div>
  );
};
