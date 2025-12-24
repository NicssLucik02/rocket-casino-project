import classNames from "classnames";
import styles from "./plinko-button.module.scss";
import type { BallsCount } from "../../../../../../types/enums";

export const PlinkoButton = ({
    count,
    price,
    isActive,
    handler,
    disabled,
}: {
    count: BallsCount;
    price: string;
    isActive: boolean;
    handler: () => void;
    disabled?: boolean;
}) => {
    return (
        <button
          type="button"
          disabled={disabled}
          className={classNames(styles["balls-button"], {
            [styles["active"]]: isActive,
            [styles["disabled"]]: disabled,
          })}
          onClick={handler}
        > 
            <p className={styles["balls-button__title"]}>{count}</p>
            <p className={styles["balls-button__price"]}>{price}</p>
        </button>
    );
}
