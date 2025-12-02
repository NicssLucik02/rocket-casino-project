import type { ReactNode } from "react";
import { useBalance } from "../hooks/useBalance";
import { BalanceContext } from "./balanceContextBase";

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const balanceState = useBalance();

  return (
    <BalanceContext.Provider value={balanceState}>
      {children}
    </BalanceContext.Provider>
  );
};

export default BalanceProvider;
