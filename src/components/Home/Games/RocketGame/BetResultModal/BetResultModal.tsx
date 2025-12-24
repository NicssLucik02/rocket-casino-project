import { PrimaryButton } from "../../../../uikit/Buttons/PrimaryButton/PrimaryButton";
import styles from "./bet-modal.module.scss";
import emptyCarImg from "@/assets/images/EmptyCar.png";
import Cashout from "@/assets/images/Cashout.png";
import classNames from "classnames";
import { formatNumber } from "../../../../../utils/utils";

type Props = {
  onClose: () => void;
  crashed: boolean;
  betAmount: string;
  coeff: number;
};

export const BetResultModal: React.FC<Props> = ({
  onClose,
  crashed,
  betAmount,
  coeff,
}) => {
  const formattedBetAmount = formatNumber(Number(betAmount));
  const reward = formatNumber(Number(betAmount) * coeff);
  return (
    <div className={styles["bet-modal__overlay"]}>
      <div className={styles["bet-modal"]}>
        <div className={styles["bet-modal__container"]}>
          <img src={crashed ? emptyCarImg : Cashout} alt="car" />
          <p
            className={classNames(
              styles["bet-modal__result"],
              { [styles["fail"]]: crashed },
              { [styles["win"]]: !crashed },
            )}
          >
            ${crashed ? formattedBetAmount : reward}
          </p>

          <PrimaryButton
            text={crashed ? "Try again" : "Checkout"}
            widthSize="100"
            bgColor1={crashed ? "rgba(212, 24, 61, 1)" : "rgba(0, 153, 102, 1)"}
            bgColor2={crashed ? "rgb(126, 9, 32)" : "rgba(0, 166, 62, 1)"}
            handler={onClose}
          />
        </div>
      </div>
    </div>
  );
};
