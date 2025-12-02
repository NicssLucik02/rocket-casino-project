import type { CaseItem } from "../types/Types";

export const getGradient = (item: CaseItem) => {
  if (item.color1 && item.color2) {
    return `linear-gradient(to right, ${item.color1}, ${item.color2})`;
  }
  switch (item.rarity) {
    case "common":
      return "linear-gradient(to right, rgba(69, 85, 108, 1), rgba(49, 65, 88, 1))";
    case "uncommon":
      return "linear-gradient(to right, rgba(0, 166, 62, 1), rgba(0, 130, 54, 1))";
    case "rare":
      return "linear-gradient(to right, rgba(21, 93, 252, 1), rgba(20, 71, 230, 1))";
    case "epic":
      return "linear-gradient(to right, rgba(152, 16, 250, 1), rgba(130, 0, 219, 1))";
    case "legendary":
      return "linear-gradient(to right, rgba(230, 0, 118, 1), rgba(231, 0, 11, 1))";
    case "gold":
      return "linear-gradient(to right, rgba(240, 177, 0, 1), rgba(225, 113, 0, 1))";
    default:
      return "linear-gradient(to right, rgba(69, 85, 108, 1), rgba(49, 65, 88, 1))";
  }
};
