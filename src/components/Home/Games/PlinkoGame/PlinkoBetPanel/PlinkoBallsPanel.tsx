import { balls } from "../../../../../constants/plinko";
import { usePlinkoGameStore } from "../../../../../stores/plinkoGameStore";
import styles from "./plinko-bet-panel.module.scss";
import { PlinkoButton } from "./PlinkoButton/PlinkoButton";

type Props = {
    disabled?: boolean;
};

export const PlinkoBallsPanel: React.FC<Props> = ({ disabled }) => {
    const { currentBallsCount, handleChangeBallsCount } = usePlinkoGameStore();
    return (
        <div className={styles["plinko-panel__balls"]}>
            <div className={styles["plinko-panel__balls-container"]}>
                <p className={styles["plinko-panel__balls-title"]}>
                    Balls
                </p>
                <div className={styles["plinko-panel__balls-actions"]}>
                    {balls.map((ball) => (
                        <PlinkoButton 
                            key={ball.count} 
                            count={ball.count} 
                            price={ball.price} 
                            isActive={currentBallsCount === ball.count}
                            handler={() => handleChangeBallsCount(ball.count)}
                            disabled={disabled}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
