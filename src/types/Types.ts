import type { RarityTypes } from "./enums";

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

export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "gold";

export type CaseItem = {
  id: number;
  icon: string;
  price: number;
  rarity: Rarity;
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
