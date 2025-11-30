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