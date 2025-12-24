import styles from "./homeBonus.module.scss";
import { PrimaryButton } from "../../uikit/Buttons/PrimaryButton/PrimaryButton";
import { balanceStore } from "../../../stores/balanceStore";
import { useState, useEffect } from "react";
import BonusIcon from "@/assets/icons/Bonus.svg?react";
import TimeIcon from "@/assets/icons/Time.svg?react";

export const HomeBonus = () => {
  const addBonus = balanceStore((s) => s.addBonus);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedTime = localStorage.getItem("bonusCooldown");
    if (!savedTime) return 0;
    const endTime = parseInt(savedTime, 10);
    const now = Date.now();
    return Math.max(0, Math.floor((endTime - now) / 1000));
  });

  const isDisabled = timeLeft > 0;

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          localStorage.removeItem("bonusCooldown");
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleClaimBonus = async () => {
    if (isDisabled) return;

    await addBonus();

    const endTime = Date.now() + 60000;
    localStorage.setItem("bonusCooldown", endTime.toString());
    setTimeLeft(60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles["home-bonus"]}>
      <div className={styles["home-bonus__container"]}>
        <div className={styles["home-bonus__title"]}>
          <BonusIcon className={styles["home-bonus__title-icon"]} />
          <div>
            <p className={styles["home-bonus__title-text"]}>Claim Bonus</p>
            <p className={styles["home-bonus__title-text--small"]}>
              Free money every minute
            </p>
          </div>
        </div>
        <div className={styles["home-bonus__panel"]}>
          <p className={styles["home-bonus__panel-item"]}>
            <span>Next claim:</span>
            <span className={styles["home-bonus__panel-item__time"]}>
              <TimeIcon
                className={styles["home-bonus__panel-item__time-icon"]}
              />
              {timeLeft > 0 ? formatTime(timeLeft) : "1:00"}
            </span>
          </p>
          <p className={styles["home-bonus__panel-item"]}>
            <span>Amount:</span>
            <span className={styles["home-bonus__panel-item__reward"]}>
              $10
            </span>
          </p>
        </div>
        <PrimaryButton
          text={isDisabled ? `Wait ${formatTime(timeLeft)}` : "Claim Now!"}
          widthSize={"100"}
          bgColor1={
            isDisabled ? "rgba(100, 100, 100, 1)" : "rgba(0, 153, 102, 1)"
          }
          bgColor2={isDisabled ? "rgba(80, 80, 80, 1)" : "rgba(0, 166, 62, 1)"}
          handler={handleClaimBonus}
        />
      </div>
    </div>
  );
};
