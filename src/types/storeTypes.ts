import type { Session, User } from "@supabase/supabase-js";
import type { BallsCount, GameStatus, LinesCount, MinesCount, RarityTypes, RiskLevel, RocketGameResult } from "./enums";
import type { CaseItem, CaseType, Cell, LeaderboardEntry, PlinkoResult } from "./Types";

export type CaseGameState = {
  currentCase: CaseType | null;
  wonItem: CaseItem | null;
  isOpening: boolean;
  showResult: boolean;

  selectCase: (caseItem: CaseType) => void;
  startOpening: () => Promise<boolean>;
  repeatOpening: (winner: CaseItem) => Promise<boolean>;
  finishOpening: (winner: CaseItem) => void;
  closeResult: () => void;

  pickRandomItem: (items: CaseItem[]) => CaseItem;
  getRarityGradient: (rarity: RarityTypes) => string;
}

export type BalanceState = {
  balance: number | null;
  loading: boolean;
  refresh: () => Promise<void>;
  addToBalance: (
    amount: number,
  ) => Promise<{ success: boolean; error?: string }>;
  spendBalance: (
    amount: number,
  ) => Promise<{ success: boolean; error?: string }>;
  addBonus: () => Promise<{ success: boolean; error?: string }>;
}

export type LeaderboardState = {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
}

export type MinesStore = {
  minesCount: MinesCount;
  betAmount: string;
  gameState: GameStatus;
  grid: Cell[];
  revealedCount: number;
  currentMultiplier: number;

  setMinesCount: (count: MinesCount) => void;
  setBetAmount: (amount: string) => void;
  startGame: () => void;
  revealCell: (id: number) => boolean;
  cashOut: () => number;
  resetGame: () => void;
};

export type RocketState = {
  isRunning: boolean;
  coeff: number;
  crashed: boolean;
  crashPoint: number;

  startTime: number;
  animationId: number | null;

  finalResult: RocketGameResult | null;
  finalMultiplier: number;

  betAmount: string;
  betError: string | null;
  showBetResultModal: boolean;

  setBetAmount: (value: string) => void;
  startRound: () => Promise<void>;
  cashOutRound: () => Promise<void>;
  closeBetResultModal: () => void;
  startGame: (crashPoint: number) => void;
  cashOut: (currentCoeff: number) => void;
  stopGame: () => void;
  resetGame: () => void;
  updateCoeff: (now: number) => boolean;
};

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (options: { email: string; password: string }) => Promise<void>;
  signUp: (options: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

export type ProfileState = {
  username: string | null;
  gamesPlayed: number;
  totalWon: number;
  totalWagered: number;
  wonGames: number;
  isLoading: boolean;

  setProfile: (data: {
    username?: string;
    games_played?: number;
    total_won?: number;
    total_wagered?: number;
    games_won?: number;
  }) => void;
  setLoading: (loading: boolean) => void;
  resetProfile: () => void;
};

export type PlinkoState = {
  currentBet: number;
  currentRisk: RiskLevel;
  currentBallsCount: BallsCount;
  currentLinesCount: LinesCount;

  handleChangeRisk: (risk: RiskLevel) => void;
  handlePrevRisk: () => void;
  handleNextRisk: () => void;
  handleChangeBallsCount: (ballsCount: BallsCount) => void;
  handleChangeLinesCount: (linesCount: LinesCount) => void;
  setBet: (bet: number) => void;

  isPlaying: boolean;
  dropId: number;
  finishedBalls: number;
  totalWon: number;
  results: PlinkoResult[];
  lastHit: { slotIndex: number; multiplier: number; payout: number } | null;

  startRound: () => void;
  registerBallFinish: (slotIndex: number, multiplier: number) => void;
  resetRound: () => void;
  completeRound: (finalWin: number) => void;
};