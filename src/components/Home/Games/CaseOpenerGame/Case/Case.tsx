import classNames from "classnames";
import type { CaseType } from "../../../../../types/Types";
import styles from "./Case.module.scss";

type Props = {
  itemCase: CaseType;
  onSelectCase: (selected: CaseType) => void;
  isActive: boolean;
};

export const Case: React.FC<Props> = ({ itemCase, onSelectCase, isActive }) => {
  const handleClick = () => onSelectCase(itemCase);
  return (
    <div
      className={classNames(styles["case"], {
        [styles["active-case"]]: isActive,
      })}
      onClick={handleClick}
    >
      <div className={styles["case__container"]}>
        <div className={styles["case__icon"]}>{itemCase.icon}</div>
        <p className={styles["case__name"]}>{itemCase.name}</p>
        <p className={styles["case__price"]}>${itemCase.price}</p>
      </div>
    </div>
  );
};
