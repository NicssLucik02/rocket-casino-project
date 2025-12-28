import styles from "./plinkoHistoryItem.module.scss";
import type { RiskLevel } from "../../../../../../types/enums";

type Props = {
    risk: RiskLevel;
    lines: number;
    balls: number;
    totalPayout: number;
    timeLabel: string;
}

export const PlinkoHistoryItem: React.FC<Props> = ({
    risk,
    lines,
    balls,
    totalPayout,
    timeLabel,
}) => {

    return (
        <li className={styles["plinko-history__item"]}>
            <p className={styles["plinko-history__item-amount"]}>
              +${totalPayout.toFixed(2)}
            </p>
            <p className={styles["plinko-history__item-detail"]}>
                <span className={styles["plinko-history__item-detail-desc"]}>Risk:</span>
                <span className={styles["plinko-history__item-detail-value"]}>{risk}</span>
            </p>
            <p className={styles["plinko-history__item-detail"]}>
                <span className={styles["plinko-history__item-detail-desc"]}>Lines:</span>
                <span className={styles["plinko-history__item-detail-value"]}>{lines}</span>
            </p>
            <p className={styles["plinko-history__item-detail"]}>
                <span className={styles["plinko-history__item-detail-desc"]}>Balls:</span>
                <span className={styles["plinko-history__item-detail-value"]}>{balls}</span>
            </p>

            <p className={styles["plinko-history__item-detail"]}>
                <span className={styles["plinko-history__item-detail-desc"]}>Time:</span>
                <span className={styles["plinko-history__item-detail-value"]}>{timeLabel}</span>
            </p>
        </li>
    )
}