import styles from "./home.module.scss";
import { HomeBonus } from "./HomeBonus/HomeBonus";
import { HomeGame } from "./HomeGame/HomeGame";
import { Leaderboard } from "./Leaderboard/Leaderboard";

export const Home = () => {
  return (
    <section className={styles.home}>
      <div className={styles["home__container"]}>
        <HomeGame />
        <div className={styles["home__container-add"]}>
          <HomeBonus />
          <Leaderboard />
        </div>
      </div>
    </section>
  );
};
