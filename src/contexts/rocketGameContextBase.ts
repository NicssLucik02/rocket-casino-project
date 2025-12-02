import { createContext, useContext } from "react";
import { useRocketGame } from "../hooks/useRocketGame";

type RocketGameContextType = ReturnType<typeof useRocketGame>;

export const RocketGameContext = createContext<
  RocketGameContextType | undefined
>(undefined);

export const useRocketGameContext = () => {
  const context = useContext(RocketGameContext);
  if (context === undefined) {
    throw new Error(
      "useRocketGameContext must be used within a RocketGameProvider",
    );
  }
  return context;
};
