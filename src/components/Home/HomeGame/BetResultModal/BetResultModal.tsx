import { PrimaryButton } from "../../../uikit/Buttons/PrimaryButton";
import "./bet-modal.scss";
import emptyCarImg from "../../../../assets/images/EmptyCar.png";
import cashoutImg from "../../../../assets/images/cashout.png";
import classNames from "classnames";

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
  const reward = (Number(betAmount) * coeff).toFixed(2);
  return (
    <div className="bet-modal__overlay">
      <div className="bet-modal">
        <div className="bet-modal__container">
          <img src={crashed ? emptyCarImg : cashoutImg} alt="car" />
          <p
            className={classNames(
              "bet-modal__result",
              { fail: crashed },
              { win: !crashed },
            )}
          >
            ${crashed ? betAmount : reward}
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
