import styles from "./mines-game.module.scss";
import { MinesPlayArea } from "./MinesPlayArea/MinesPlayArea";
import { MinesSettings } from "./MinesSettings/MinesSettings";

export const MinesGame = () => {
  return (
    <div className={styles["minesGame"]}>
      <MinesPlayArea/>
      <MinesSettings />
    </div>
  );
};
