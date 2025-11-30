import React, { createContext, useContext, ReactNode } from 'react';
import { useRocketGame } from '../hooks/useRocketGame';

type RocketGameContextType = ReturnType<typeof useRocketGame>;

const RocketGameContext = createContext<RocketGameContextType | undefined>(undefined);

export const RocketGameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useRocketGame();
  
  return (
    <RocketGameContext.Provider value={gameState}>
      {children}
    </RocketGameContext.Provider>
  );
};

export const useRocketGameContext = () => {
  const context = useContext(RocketGameContext);
  if (context === undefined) {
    throw new Error('useRocketGameContext must be used within a RocketGameProvider');
  }
  return context;
};

