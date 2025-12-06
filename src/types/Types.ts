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
  | "common" // серый
  | "uncommon" // синий
  | "rare" // фиолетовый
  | "epic" // розовый
  | "legendary" // красный
  | "gold"; // спецпредметы, Covert и т.д.

export type CaseItem = {
  id: number; // уникальный id предмета
  icon: string; // эмодзи/иконка предмета
  price: number; // цена
  rarity: Rarity; // редкость
  name?: string; // необязательное название
  color1?: string; // старт градиента
  color2?: string; // конец градиента
};

export type CaseType = {
  id: string;
  name: string; // "Danger Zone Case"
  price: number; // сколько стоит открыть
  icon: string; // картинка кейса
  items: CaseItem[]; // весь пул предметов
};

export type ProfileRow = {
  username?: string;
  balance?: number;
  games_played?: number;
  total_won?: number;
  total_wagered?: number;
  games_won?: number;
};
