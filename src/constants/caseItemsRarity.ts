export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Gold";

export type RarityInfo = {
  rarity: Rarity;
  chance: number;
  gradient: string;
};

export const caseItemsRarities: RarityInfo[] = [
  {
    rarity: "Common",
    chance: 55.0,
    gradient: "linear-gradient(135deg, #5D718A 0%, #3F526B 100%)",
  },
  {
    rarity: "Uncommon",
    chance: 25.0,
    gradient: "linear-gradient(135deg, #00E057 0%, #00913A 100%)",
  },
  {
    rarity: "Rare",
    chance: 12.0,
    gradient: "linear-gradient(135deg, #BD66FF 0%, #8F3DBD 100%)",
  },
  {
    rarity: "Epic",
    chance: 7.0,
    gradient: "linear-gradient(135deg, #F366FF 0%, #C33FFB 100%)",
  },
  {
    rarity: "Legendary",
    chance: 0.8,
    gradient: "linear-gradient(135deg, #FF3377 0%, #DD0055 100%)",
  },
  {
    rarity: "Gold",
    chance: 0.2,
    gradient: "linear-gradient(135deg, #FFD700 0%, #F09F00 80%, #B67B03 100%)",
  },
] as const;
