import { getGradient } from "../../../../../utils/UITools";
import type { CaseItem as CaseItemType } from "../../../../../types/Types";

export const CaseItem = ({ item }: { item: CaseItemType }) => {
  return (
    <div className="case-game__content-item" style={{ background: getGradient(item) }}>
      <span style={{ fontSize: "20px" }}>{item.icon}</span>
    </div>
  );
};
