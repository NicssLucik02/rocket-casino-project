import styles from "./mineField.module.scss";
import WinIcon from "@assets/icons/diamond.svg?react";
import FailedIcon from "@assets/icons/bomb.svg?react";
import classNames from "classnames";

type Props = {
  gameResult: string;
  onClick: () => void;
};

export const MineField: React.FC<Props> = ({ gameResult, onClick }) => {
  return (
    <div
      className={classNames(
        styles["mine-field"],
        { [styles.win]: gameResult === "win" },
        { [styles.lost]: gameResult === "lost" },
      )}
      onClick={onClick}
    >
      {gameResult === "win" && (
        <WinIcon className={styles["mine-field__icon"]} />
      )}
      {gameResult === "lost" && (
        <FailedIcon className={styles["mine-field__icon"]} />
      )}
    </div>
  );
};
