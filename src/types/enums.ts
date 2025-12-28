export enum RarityTypes {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Epic = "Epic",
  Legendary = "Legendary",
  Gold = "Gold",
}

export enum GameTypes {
  Rocket = "Rocket",
  CaseOpener = "Cases",
  Mines = "Mines",
  Plinko = "Plinko",
}

export enum GameStatus {
  Idle = "idle",
  Playing = "playing",
  Win = "win",
  Lost = "lost",
}

export enum RocketGameResult {
  Cashed = "cashed",
  Crashed = "crashed",
}

export enum MessageType {
  Success = "success",
  Error = "error",
}

export enum MinesCount {
  One = 1,
  Three = 3,
  Five = 5,
  Ten = 10,
  Fifteen = 15,
}

export enum RiskLevel {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum BallsCount {
  One = 1,
  Two = 2,
  Five = 5,
  Ten = 10,
}

export const getLinesCounts = () => [8, 9, 10, 11, 12, 13, 14, 15, 16] as const;

export type LinesCount = ReturnType<typeof getLinesCounts>[number];
