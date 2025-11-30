import React, { createContext, useContext, ReactNode } from 'react';
import { useBalance } from '../hooks/useBalance';

type BalanceContextType = ReturnType<typeof useBalance>;

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const balanceState = useBalance();
  
  return (
    <BalanceContext.Provider value={balanceState}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalanceContext = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalanceContext must be used within a BalanceProvider');
  }
  return context;
};

