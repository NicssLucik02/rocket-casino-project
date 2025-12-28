import { getGradient } from "../../../../../utils/UITools";
import type { CaseItem as CaseItemType } from "../../../../../types/Types";
import stylesCaseGame from "../caseGame.module.scss";

type Props = { item: CaseItemType };

export const CaseItem: React.FC<Props> = ({ item }) => {
  return (
    <div
      className={stylesCaseGame["case-game__content-item"]}
      style={{ background: getGradient(item) }}
    >
      <span className={stylesCaseGame["case-game__content-item-icon"]}>
        {item.icon}
      </span>
    </div>
  );
};
