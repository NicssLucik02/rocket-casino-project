import classNames from "classnames";
import styles from "./secondaryButton.module.scss";
import { useCallback } from "react";

type Props = {
  amount?: number;
  content?: string;
  widthSize: string;
  symbol?: string;
  handler: (event: React.MouseEvent<HTMLButtonElement>, amount?: number) => void;
  fontSize?: string;
  bgColor?: string;
  disabled?: boolean;
  isActive?: boolean;
};

export const SecondaryButton: React.FC<Props> = ({
  amount,
  content,
  widthSize,
  symbol,
  handler,
  fontSize,
  bgColor,
  disabled,
  isActive,
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      handler(event, amount),
    [handler, amount],
  );
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={classNames(
        styles["secondary-button"],
        { [styles["disabled"]]: disabled },
        { [styles["active"]]: isActive },
      )}
      style={{
        width: `${widthSize}%`,
        fontSize: fontSize || "16px",
        backgroundColor: bgColor,
      }}
    >
      {symbol}
      {content || amount}
    </button>
  );
};
