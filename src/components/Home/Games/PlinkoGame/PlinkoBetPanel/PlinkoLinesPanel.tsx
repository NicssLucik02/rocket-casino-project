import { lines } from "../../../../../constants/plinko";
import { usePlinkoGameStore } from "../../../../../stores/plinkoGameStore";
import { SecondaryButton } from "../../../../uikit/Buttons/SecondaryButton/SecondaryButton";
import styles from "./plinko-bet-panel.module.scss";

type Props = {
    disabled?: boolean;
};

export const PlinkoLinesPanel: React.FC<Props> = ({ disabled }) => {
    const {currentLinesCount, handleChangeLinesCount} = usePlinkoGameStore();
    
    return (
        <div className={styles["plinko-panel__lines"]}>
            <div className={styles["plinko-panel__lines-container"]}>
            <p className={styles["plinko-panel__lines-title"]}>Lines</p>

            <div className={styles["plinko-panel__lines-actions"]}>
                {lines.map((item) => (
                    <SecondaryButton 
                      key={item} 
                      amount={item.toString()} 
                      widthSize="30" 
                      handler={() => handleChangeLinesCount(item)}
                      fontSize="16px" 
                      bgColor="rgba(29, 41, 61, 1)"
                      isActive={currentLinesCount === item}
                      disabled={disabled}
                    />
                ))}
            </div>
          </div>
        </div>
    );
}
