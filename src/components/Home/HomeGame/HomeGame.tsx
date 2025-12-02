import "./homeGame.scss";
import "./gameAnimations.scss";
import { GameBar } from "../../uikit/Gamebar/GameBar";
import { useState } from "react";
import { RocketGame } from "../Games/RocketGame";
import { useSearchParams } from "react-router-dom";
import { CaseOpenerGame } from "../Games/CaseOpenerGame/CaseOpenerGame";
import { useRocketGameContext } from "../../../contexts/rocketGameContextBase";

export const HomeGame = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isRunning } = useRocketGameContext();
  const [isCaseOpening, setIsCaseOpening] = useState(false);

  const activeBar = searchParams.get("game");
      console.log(activeBar);
  const getActiveBar = () => {
    return activeBar === "Rocket" || activeBar === "Cases"
      ? activeBar
      : "Rocket";
  };
  const handleChangeBar = (value: string) => {
    const lockActive = isRunning || isCaseOpening;
    if (lockActive) return;
    setSearchParams({ game: value });
  };

  const games = [
    { icon: "🚀", title: "Rocket" },
    { icon: "📦", title: "Cases" },
  ];

  return (
    <div className="home-game">
      <div className="home-game__tabs">
        {games.map((game) => {
          return (
            <GameBar
              key={game.title}
              icon={game.icon}
              title={game.title}
              handleChangeBar={handleChangeBar}
              activeBar={getActiveBar()}
              disabled={isRunning || isCaseOpening}
            />
          );
        })}
      </div>

      
      <div className="home-game__main">
        <div className="home-game__main-container">
          {activeBar === null && (
            <div className="home-game__main-stub">
              <p className="home-game__main-stub-text">Please Select a Game</p>
            </div>
          )}
          
          {activeBar === "Rocket" && <RocketGame />}
          {activeBar === "Cases" && (
            <CaseOpenerGame onOpeningChange={setIsCaseOpening} />
          )}
        </div>
      </div>
    </div>
  );
};
