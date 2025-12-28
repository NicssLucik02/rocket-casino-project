import { RarityTypes } from "../types/enums";
import type { RarityInfo } from "../types/Types";

export const caseItemsRarities: RarityInfo[] = [
  {
    rarity: RarityTypes.Common,
    chance: 55.0,
    gradient: "linear-gradient(135deg, #5D718A 0%, #3F526B 100%)",
  },
  {
    rarity: RarityTypes.Uncommon,
    chance: 25.0,
    gradient: "linear-gradient(135deg, #00E057 0%, #00913A 100%)",
  },
  {
    rarity: RarityTypes.Rare,
    chance: 12.0,
    gradient: "linear-gradient(135deg, #BD66FF 0%, #8F3DBD 100%)",
  },
  {
    rarity: RarityTypes.Epic,
    chance: 7.0,
    gradient: "linear-gradient(135deg, #F366FF 0%, #C33FFB 100%)",
  },
  {
    rarity: RarityTypes.Legendary,
    chance: 0.8,
    gradient: "linear-gradient(135deg, #FF3377 0%, #DD0055 100%)",
  },
  {
    rarity: RarityTypes.Gold,
    chance: 0.2,
    gradient: "linear-gradient(135deg, #FFD700 0%, #F09F00 80%, #B67B03 100%)",
  },
] as const;
