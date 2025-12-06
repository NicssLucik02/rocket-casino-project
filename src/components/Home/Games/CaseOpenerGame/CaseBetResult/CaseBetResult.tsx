import type { CaseItem, CaseType, Rarity } from "../../../../../types/Types";
import { PrimaryButton } from "../../../../uikit/Buttons/PrimaryButton/PrimaryButton";
import styles from "./caseBetResult.module.scss";
type Props = {
  wonItem: CaseItem;
  rarityGradients: Record<Rarity, string>;
  onClose: () => void;
  currentCase: CaseType;
  isOpening: boolean;
  pickWonItem: (items: CaseItem[]) => CaseItem;
  handleRepeatBet: (win: CaseItem) => void;
};

export const CaseBetResult: React.FC<Props> = ({
  wonItem,
  rarityGradients,
  onClose,
  currentCase,
  isOpening,
  pickWonItem,
  handleRepeatBet,
}) => {
  const onOpenAgain = () => {
    if (!currentCase || isOpening) return;
    const win = pickWonItem(currentCase.items as CaseItem[]);
    handleRepeatBet(win);
  };

  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (e) =>
    e.stopPropagation();

  return (
    <div className={styles["case-bet__modal"]} onClick={stopPropagation}>
      <div className={styles["case-bet__modal-container"]}>
        <div className={styles["case-bet__modal-content"]}>
          <div
            className={styles["case-bet__modal-item-card"]}
            style={{
              background:
                wonItem.color1 && wonItem.color2
                  ? `linear-gradient(to right, ${wonItem.color1}, ${wonItem.color2})`
                  : rarityGradients[wonItem.rarity],
            }}
          >
            {wonItem.icon}
          </div>
          <div className={styles["case-bet__modal-item-meta"]}>
            <p className={styles["case-bet__modal-item-price"]}>
              Price: ${wonItem.price}
            </p>
            <p className={styles["case-bet__modal-item-rarity"]}>
              Rarity: {wonItem.rarity.toUpperCase()}
            </p>
          </div>
        </div>
        <PrimaryButton
          text={"Close"}
          widthSize={"100"}
          bgColor1={"rgba(49, 65, 88, 1)"}
          bgColor2={"rgba(29, 41, 61, 1)"}
          handler={onClose}
        />
        <PrimaryButton
          text={"Open Again"}
          widthSize={"100"}
          bgColor1={"rgba(0, 166, 62, 1)"}
          bgColor2={"rgba(0, 153, 102, 1)"}
          handler={onOpenAgain}
        />
      </div>
    </div>
  );
};
