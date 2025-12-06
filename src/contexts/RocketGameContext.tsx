import type { ReactNode } from "react";
import { useRocketGame } from "../hooks/useRocketGame";
import { RocketGameContext } from "./rocketGameContextBase";

type Props = { children: ReactNode };

export const RocketGameProvider: React.FC<Props> = ({ children }) => {
  const gameState = useRocketGame();

  return (
    <RocketGameContext.Provider value={gameState}>
      {children}
    </RocketGameContext.Provider>
  );
};

export default RocketGameProvider;
