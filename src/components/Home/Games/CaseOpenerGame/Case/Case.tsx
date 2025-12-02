import classNames from "classnames";
import type { CaseType } from "../../../../../types/Types";
import "./Case.scss";

type Props = {
  itemCase: CaseType;
  onSelectCase: (selected: CaseType) => void;
  currentCase: CaseType | null;
};

export const Case: React.FC<Props> = ({
  itemCase,
  onSelectCase,
  currentCase,
}) => {
  return (
    <div
      className={classNames("case", {
        "active-case": currentCase?.id === itemCase.id,
      })}
      onClick={() => onSelectCase(itemCase)}
    >
      <div className="case__container">
        <div className="case__icon">{itemCase.icon}</div>
        <p className="case__name">{itemCase.name}</p>
        <p className="case__price">${itemCase.price}</p>
      </div>
    </div>
  );
};
