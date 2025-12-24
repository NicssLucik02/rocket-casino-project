import styles from "./caseGame.module.scss";
import betModalStyles from "../../Games/RocketGame/BetResultModal/bet-modal.module.scss";
import classNames from "classnames";
import { useEffect, useMemo, useCallback } from "react";
import { cases } from "../../../../constants/cases";
import { Case } from "./Case/Case";
import { PrimaryButton } from "../../../uikit/Buttons/PrimaryButton/PrimaryButton";
import type {
  CaseItem as CaseItemType,
  CaseType,
  RarityInfo,
  Rarity,
} from "../../../../types/Types";
import BoxIcon from "@/assets/icons/Box.svg?react";
import { CaseItem } from "./Case/CaseItem";
import { CaseOpeningAnimation } from "./CaseOpenerAnimation";
import { CaseBetResult } from "./CaseBetResult/CaseBetResult";
import { caseItemsRarities } from "../../../../constants/caseItemsRarity";
import { useProfile } from "../../../../hooks/useProfile";
import { COLORS } from "../../../../constants";
import { useCaseGameStore } from "../../../../stores/caseGameStore";
import { balanceStore } from "../../../../stores/balanceStore";
import { RarityTypes } from "../../../../types/enums";

type Props = { onOpeningChange?: (opening: boolean) => void };

export const CaseOpenerGame: React.FC<Props> = ({ onOpeningChange }) => {
  const { getTotalWon, getTotalWag, countWonGames, countGames } = useProfile();
  const {
    currentCase,
    isOpening,
    wonItem,
    showResult,
    selectCase,
    startOpening,
    repeatOpening,
    finishOpening,
    closeResult,
    pickRandomItem,
    getRarityGradient,
  } = useCaseGameStore();

  useEffect(() => {
    onOpeningChange?.(isOpening);
  }, [isOpening, onOpeningChange]);

  const rarityGradients = useMemo<Record<Rarity, string>>(
    () => ({
      common: getRarityGradient(RarityTypes.Common),
      uncommon: getRarityGradient(RarityTypes.Uncommon),
      rare: getRarityGradient(RarityTypes.Rare),
      epic: getRarityGradient(RarityTypes.Epic),
      legendary: getRarityGradient(RarityTypes.Legendary),
      gold: getRarityGradient(RarityTypes.Gold),
    }),
    [getRarityGradient],
  );

  const isCaseActive = useCallback(
    (caseItem: CaseType) => currentCase?.id === caseItem.id,
    [currentCase?.id],
  );

  const preparedOnFinish = useCallback(
    (winner: CaseItemType) => {
      finishOpening(winner);
      void (async () => {
        await balanceStore.getState().addToBalance(winner.price);
        await getTotalWon(winner.price);
        await countWonGames();
      })();
    },
    [finishOpening, getTotalWon, countWonGames],
  );

  const openCase = useCallback(() => {
    void (async () => {
      if (!currentCase) return;
      const success = await startOpening();
      if (!success) return;
      await getTotalWag(currentCase.price);
      await countGames();
    })();
  }, [currentCase, startOpening, getTotalWag, countGames]);

  const handleRepeatBet = useCallback(
    (win: CaseItemType) => {
      void (async () => {
        const casePrice = currentCase?.price;
        const success = await repeatOpening(win);
        if (!success || casePrice === undefined) return;
        await getTotalWag(casePrice);
        await countGames();
      })();
    },
    [currentCase?.price, repeatOpening, getTotalWag, countGames],
  );

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
              onSelectCase={selectCase}
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
          onClick={closeResult}
        >
          <CaseBetResult
            wonItem={wonItem}
            rarityGradients={rarityGradients}
            onClose={closeResult}
            currentCase={currentCase as CaseType}
            isOpening={isOpening}
            pickWonItem={pickRandomItem}
            handleRepeatBet={handleRepeatBet}
          />
        </div>
      )}
    </div>
  );
};
