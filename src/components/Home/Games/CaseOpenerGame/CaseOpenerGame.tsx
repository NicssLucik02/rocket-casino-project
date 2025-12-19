import styles from "./caseGame.module.scss";
import betModalStyles from "../../Games/RocketGame/BetResultModal/bet-modal.module.scss";
import classNames from "classnames";
import { cases } from "../../../../constants/cases";
import { Case } from "./Case/Case";
import { PrimaryButton } from "../../../uikit/Buttons/PrimaryButton/PrimaryButton";
import type {
  CaseItem as CaseItemType,
  CaseType,
  RarityInfo,
} from "../../../../types/Types";
import BoxIcon from "../../../../assets/icons/Box.svg?react";
import { CaseItem } from "./Case/CaseItem";
import { CaseOpeningAnimation } from "./CaseOpenerAnimation";
import { CaseBetResult } from "./CaseBetResult/CaseBetResult";
import { caseItemsRarities } from "../../../../constants/caseItemsRarity";
import { useCaseOpenerGame } from "../../../../hooks/useCaseOpenerGame";
import { useSettings } from "../../../../hooks/useSettings";
import { COLORS } from "../../../../constants";

type Props = { onOpeningChange?: (opening: boolean) => void };

export const CaseOpenerGame: React.FC<Props> = ({ onOpeningChange }) => {
  const { getTotalWon, getTotalWag, countWonGames, countGames } = useSettings();
  const {
    currentCase,
    wonItem,
    showResult,
    isOpening,
    handleOpenCase,
    handleCloseResult,
    handleRepeatBet,
    isCaseActive,
    onSelectCase,
    rarityGradients,
    closeResultModal,
    pickWonItem,
    onFinishOpeningWithWinner,
  } = useCaseOpenerGame(onOpeningChange, { getTotalWag, countGames });

  const prepairedCountGames = async () => {
    await countWonGames();
  };

  const preparedOnFinish = (winner: CaseItemType) => {
    onFinishOpeningWithWinner(winner, getTotalWon, prepairedCountGames);
  };

  const openCase = () => {
    void handleOpenCase();
  };

  return (
    <div className={styles["case-game"]}>
      <div className={styles["case-game__container"]}>
        <p className={styles["case-game__title"]}>Select a Case</p>
        <div
          className={classNames(styles["case-game__cases"], {
            [styles["case-game__cases--disabled"]]: isOpening,
          })}
        >
          {cases.map((caseItem) => (
            <Case
              key={caseItem.id}
              itemCase={caseItem}
              onSelectCase={onSelectCase}
              isActive={isCaseActive(caseItem)}
            />
          ))}
        </div>
        <div className={styles["case-game__window"]}>
          {currentCase && (
            <CaseOpeningAnimation
              items={currentCase.items as unknown as CaseItemType[]}
              wonItem={
                wonItem ?? (currentCase.items[0] as unknown as CaseItemType)
              }
              isOpen={isOpening}
              onFinish={preparedOnFinish}
            />
          )}
        </div>

        <PrimaryButton
          text={
            currentCase
              ? `Open ${currentCase.name} - $${currentCase.price}`
              : "Select a Case"
          }
          widthSize={"100"}
          bgColor1={COLORS.SUCCESS_GRADIENT.to}
          bgColor2={COLORS.SUCCESS_GRADIENT.from}
          Icon={BoxIcon}
          disabled={!currentCase || isOpening}
          handler={openCase}
        />

        <div>
          <p>Case Contents</p>
          <div className={styles["case-game__items"]}>
            {currentCase?.items.map((item) => (
              <CaseItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className={styles["case-game__rarities"]}>
          <div className={styles["case-game__rarities-container"]}>
            <p className={styles["case-game__rarities-title"]}>Rarity Guide</p>

            <div className={styles["case-game__rarities-list"]}>
              {caseItemsRarities?.map((item: RarityInfo) => {
                return (
                  <div
                    className={styles["case-game__rarities-item"]}
                    key={item.rarity}
                  >
                    <div
                      className={styles["case-game__rarities-color"]}
                      style={{ background: `${item.gradient}` }}
                    />
                    <p className={styles["case-game__rarities-text"]}>
                      {item.rarity}
                    </p>
                    <p className={styles["case-game__rarities-chance"]}>
                      ({item.chance}%)
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {showResult && wonItem && (
        <div
          className={betModalStyles["bet-modal__overlay"]}
          onClick={closeResultModal}
        >
          <CaseBetResult
            wonItem={wonItem}
            rarityGradients={rarityGradients}
            onClose={handleCloseResult}
            currentCase={currentCase as CaseType}
            isOpening={isOpening}
            pickWonItem={pickWonItem}
            handleRepeatBet={handleRepeatBet}
          />
        </div>
      )}
    </div>
  );
};
