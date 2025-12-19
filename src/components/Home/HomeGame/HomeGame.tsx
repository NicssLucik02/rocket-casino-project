import styles from "./homeGame.module.scss";
import { GameBar } from "../../uikit/Gamebar/GameBar";
import { useState } from "react";
import { RocketGame } from "../Games/RocketGame/RocketGame";
import { useSearchParams } from "react-router-dom";
import { CaseOpenerGame } from "../Games/CaseOpenerGame/CaseOpenerGame";
import { useRocketGameContext } from "../../../contexts/rocketGameContextBase";
import { games } from "../../../constants/games";
import { GameTypes } from "../../../types/enums";
import { RocketIcon } from "lucide-react";
import { MinesGame } from "../Games/MinesGame/MinesGame";

export const HomeGame = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isRunning } = useRocketGameContext();
  const [isCaseOpening, setIsCaseOpening] = useState(false);

  const activeBar = searchParams.get("game");

  const handleChangeBar = (value: string) => {
    const lockActive = isRunning || isCaseOpening;
    if (lockActive) return;
    setSearchParams({ game: value });
  };

  return (
    <div className={styles["home-game"]}>
      <div className={styles["home-game__tabs"]}>
        {games.map((game) => {
          return (
            <GameBar
              key={game.title}
              icon={game.icon}
              title={game.title}
              handleChangeBar={handleChangeBar}
              activeBar={activeBar}
              disabled={isRunning || isCaseOpening}
            />
          );
        })}
      </div>

      <div className={styles["home-game__main"]}>
        <div className={styles["home-game__main-container"]}>
          {activeBar === null && (
            <div className={styles["home-game__main-stub"]}>
              <p className="home-game__main-stub-text">Please Select a Game</p>
              <RocketIcon className={styles["home-game__main-stub-icon"]} />
            </div>
          )}

          {activeBar === GameTypes.Rocket && <RocketGame />}
          {activeBar === GameTypes.CaseOpener && (
            <CaseOpenerGame onOpeningChange={setIsCaseOpening} />
          )}
          {activeBar === GameTypes.Mines && <MinesGame />}
        </div>
      </div>
    </div>
  );
};
