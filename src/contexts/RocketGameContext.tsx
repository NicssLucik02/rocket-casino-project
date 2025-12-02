import type { ReactNode } from "react";
import { useRocketGame } from "../hooks/useRocketGame";
import { RocketGameContext } from "./rocketGameContextBase";

export const RocketGameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useRocketGame();

  return (
    <RocketGameContext.Provider value={gameState}>
      {children}
    </RocketGameContext.Provider>
  );
};

export default RocketGameProvider;
