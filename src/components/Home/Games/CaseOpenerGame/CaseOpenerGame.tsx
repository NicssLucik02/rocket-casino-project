import "./caseGame.scss";
import { cases } from "../../../../constants/cases";
import { Case } from "./Case/Case";
import { PrimaryButton } from "../../../uikit/Buttons/PrimaryButton";
import type {
  CaseItem as CaseItemType,
  CaseType,
  Rarity,
} from "../../../../types/Types";
import { useMemo, useState, useRef } from "react";
import BoxIcon from "../../../../assets/icons/Box.svg";
import { CaseItem } from "./Case/CaseItem";
import { caseItemsRarities } from "../../../../constants/caseItemsRarity";
import { CaseOpeningAnimation } from "./CaseOpenerAnimation";
import { CaseBetResult } from "./CaseBetResult";
import { useBalanceContext } from "../../../../contexts/balanceContextBase";
import { useSettings } from "../../../../hooks/useSettings";

export const CaseOpenerGame = ({
  onOpeningChange,
}: {
  onOpeningChange?: (opening: boolean) => void;
}) => {
  const [currentCase, setCurrentCase] = useState<CaseType | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<CaseItemType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { spendBalance, balance } = useBalanceContext();
  const { getTotalWon, getTotalWag, countWonGames, countGames } = useSettings();
  const finishingRef = useRef(false);
  const openingRef = useRef(false);
  const gameCountedRef = useRef(false);

  const rarityWeights: Record<Rarity, number> = useMemo(() => {
    const map: Partial<Record<Rarity, number>> = {};
    caseItemsRarities.forEach((r) => {
      const key = r.rarity.toLowerCase() as Rarity;
      map[key] = r.chance;
    });
    return map as Record<Rarity, number>;
  }, []);

  const rarityGradients: Record<Rarity, string> = useMemo(() => {
    const map: Partial<Record<Rarity, string>> = {};
    caseItemsRarities.forEach((r) => {
      const key = r.rarity.toLowerCase() as Rarity;
      map[key] = r.gradient;
    });
    return map as Record<Rarity, string>;
  }, []);

  const pickWonItem = (items: CaseItemType[]): CaseItemType => {
    const weights = items.map((it) => rarityWeights[it.rarity] ?? 1);
    const total = weights.reduce((acc, w) => acc + w, 0);
    const rnd = Math.random() * total;
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += weights[i];
      if (rnd <= sum) return items[i];
    }
    return items[items.length - 1];
  };

  const handleSelectCase = (selected: CaseType) => {
    setCurrentCase(selected);
    setIsOpening(false);
    if (onOpeningChange) onOpeningChange(false);
    setWonItem(null);
    setShowResult(false);
    finishingRef.current = false;
    openingRef.current = false;
    gameCountedRef.current = false;
  };

  const handleCloseResult = () => setShowResult(false);

  const handleRepeatBet = (win: CaseItemType) => {
    (async () => {
      if (openingRef.current || isOpening) return;
      openingRef.current = true;
      if (!currentCase) return;
      if (balance !== null && balance < currentCase.price) return;
      const result = await spendBalance(currentCase.price);
      if (!result?.success) {
        openingRef.current = false;
        return;
      }
      await getTotalWag(currentCase.price);
      if (!gameCountedRef.current) {
        await countGames();
        gameCountedRef.current = true;
      }
      setWonItem(win);
      setShowResult(false);
      setIsOpening(true);
      finishingRef.current = false;
      if (onOpeningChange) onOpeningChange(true);
    })();
  };

  return (
    <div className="case-game">
      <div className="case-game__container">
        <p className="case-game__title  ">Select a Case</p>
        <div
          className={`case-game__cases ${isOpening ? "case-game__cases--disabled" : ""}`}
        >
          {cases.map((caseItem) => (
            <Case
              key={caseItem.id}
              itemCase={caseItem}
              onSelectCase={(selected) => {
                if (isOpening) return;
                handleSelectCase(selected);
              }}
              currentCase={currentCase}
            />
          ))}
        </div>
        <div className="case-game__window">
          {currentCase && (
            <CaseOpeningAnimation
              items={currentCase.items as unknown as CaseItemType[]}
              wonItem={
                wonItem ?? (currentCase.items[0] as unknown as CaseItemType)
              }
              isOpen={isOpening}
              onFinish={async () => {
                if (finishingRef.current) return;
                finishingRef.current = true;
                setIsOpening(false);
                if (onOpeningChange) onOpeningChange(false);
                if (wonItem) {
                  await getTotalWon(wonItem.price);
                  await countWonGames();
                }
                openingRef.current = false;
                setShowResult(true);
              }}
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
          bgColor1={"rgba(0, 166, 62, 1)"}
          bgColor2={"rgba(0, 153, 102, 1)"}
          icon={BoxIcon}
          disabled={!currentCase || isOpening}
          handler={
            currentCase
              ? () => {
                  (async () => {
                    if (openingRef.current || isOpening) return;
                    openingRef.current = true;
                    if (!currentCase) return;
                    if (balance !== null && balance < currentCase.price) return;
                    const result = await spendBalance(currentCase.price);
                    if (!result?.success) {
                      openingRef.current = false;
                      return;
                    }
                    await getTotalWag(currentCase.price);
                    if (!gameCountedRef.current) {
                      await countGames();
                      gameCountedRef.current = true;
                    }
                    const win = pickWonItem(
                      currentCase.items as unknown as CaseItemType[],
                    );
                    setWonItem(win);
                    setIsOpening(true);
                    finishingRef.current = false;
                    if (onOpeningChange) onOpeningChange(true);
                    setShowResult(false);
                  })();
                }
              : undefined
          }
        />

        <div>
          <p>Case Contents</p>
          <div className="case-game__items">
            {currentCase?.items.map((item) => (
              <CaseItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="case-game__rarities">
          <div className="case-game__rarities-container">
            <p className="case-game__rarities-title">Rarity Guide</p>

            <div className="case-game__rarities-list">
              {caseItemsRarities?.map((item) => {
                return (
                  <div className="case-game__rarities-item" key={item.rarity}>
                    <div
                      className="case-game__rarities-color"
                      style={{ background: `${item.gradient}` }}
                    />
                    <p className="case-game__rarities-text">{item.rarity}</p>
                    <p className="case-game__rarities-chance">
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
          className="bet-modal__overlay"
          onClick={() => setShowResult(false)}
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
