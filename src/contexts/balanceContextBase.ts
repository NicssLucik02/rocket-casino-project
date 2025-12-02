import { createContext, useContext } from "react";
import { useBalance } from "../hooks/useBalance";

type BalanceContextType = ReturnType<typeof useBalance>;

export const BalanceContext = createContext<BalanceContextType | undefined>(
  undefined,
);

export const useBalanceContext = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalanceContext must be used within a BalanceProvider");
  }
  return context;
};
