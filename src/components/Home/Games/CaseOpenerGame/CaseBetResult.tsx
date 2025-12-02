import type { CaseItem, CaseType, Rarity } from "../../../../types/Types";
import { PrimaryButton } from "../../../uikit/Buttons/PrimaryButton";

export const CaseBetResult: React.FC<{
  wonItem: CaseItem;
  rarityGradients: Record<Rarity, string>;
  onClose: () => void;
  currentCase: CaseType;
  isOpening: boolean;
  pickWonItem: (items: CaseItem[]) => CaseItem;
  handleRepeatBet: (win: CaseItem) => void;
}> = ({
  wonItem,
  rarityGradients,
  onClose,
  currentCase,
  isOpening,
  pickWonItem,
  handleRepeatBet,
}) => {
  return (
    <div className="bet-modal" onClick={(e) => e.stopPropagation()}>
      <div className="bet-modal__container">
        <div className="bet-modal__content">
          <div
            className="bet-modal__item-card"
            style={{
              background:
                wonItem.color1 && wonItem.color2
                  ? `linear-gradient(to right, ${wonItem.color1}, ${wonItem.color2})`
                  : rarityGradients[wonItem.rarity],
            }}
          >
            {wonItem.icon}
          </div>
          <div className="bet-modal__item-meta">
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
              Price: ${wonItem.price}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "14px", fontWeight: 700 }}>
              Rarity: {wonItem.rarity}
            </p>
          </div>
        </div>
        <PrimaryButton
          text={"Close"}
          widthSize={"100"}
          bgColor1={"rgba(49, 65, 88, 1)"}
          bgColor2={"rgba(29, 41, 61, 1)"}
          handler={() => onClose()}
        />
        <PrimaryButton
          text={"Open Again"}
          widthSize={"100"}
          bgColor1={"rgba(0, 166, 62, 1)"}
          bgColor2={"rgba(0, 153, 102, 1)"}
          handler={() => {
            if (!currentCase || isOpening) return;
            const win = pickWonItem(currentCase.items as unknown as CaseItem[]);
            handleRepeatBet(win);
          }}
        />
      </div>
    </div>
  );
};
