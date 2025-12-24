import type { RarityTypes, RiskLevel } from "./enums";

export type Rarity = Lowercase<RarityTypes>;

export type FormDataType = {
  email: string;
  password: string;
  username?: string;
};

export type FormErrors = {
  email?: string;
  password?: string;
  username?: string;
  server?: string;
};

export type LeaderboardEntry = {
  id: string;
  username: string | null;
  balance: number;
  rank: number;
  games_played: number;
  total_won: number;
  total_wagered: number;
  games_won: number;
};


export type CaseItem = {
  id: number;
  icon: string;
  price: number;
  rarity: RarityTypes | Rarity;
  name?: string;
  color1?: string;
  color2?: string;
};

export type CaseType = {
  id: string;
  name: string;
  price: number;
  icon: string;
  items: CaseItem[];
};

export type ProfileRow = {
  username?: string;
  balance?: number;
  games_played?: number;
  total_won?: number;
  total_wagered?: number;
  games_won?: number;
};

export type Cell = {
  id: number;
  isRevealed: boolean;
  isMine: boolean;
  isUserRevealed: boolean;
};

export type RarityInfo = {
  rarity: RarityTypes;
  chance: number;
  gradient: string;
};

export type PlinkoHistoryItemType = {
    id: string;
    timestamp: string;
    bet: number;
    balls: number;
    risk: RiskLevel;
    lines: number;
    results: Array<{
        multiplier: number;
        payout: number;
        slotIndex: number;
    }>;
};

export type Pin = {
  key: string;
  x: number;
  y: number;
};

export type Hit = {
  id: string;
  slotIndex: number;
  multiplier: number;
  winAmount: number;
};

export type PlinkoHistoryItem = {
  id: string;
  timestamp: string;
  bet: number;
  balls: number;
  risk: RiskLevel;
  lines: number;
  results: Array<{
    multiplier: number;
    payout: number;
    slotIndex: number;
  }>;
};

export type PlinkoResult = {
  slotIndex: number;
  multiplier: number;
  payout: number;
};

export type FloatingHit = {
  id: string;
  slotIndex: number;
  multiplier: number;
  winAmount: number;
};