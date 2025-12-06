import styles from "./secondaryButton.module.scss";
import { useCallback } from "react";
type Props = {
  amount: number;
  widthSize: string;
  handler: (event: React.MouseEvent<HTMLDivElement>, amount: string) => void;
};

export const SecondaryButton: React.FC<Props> = ({
  amount,
  widthSize,
  handler,
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) =>
      handler(event, amount.toString()),
    [handler, amount],
  );
  return (
    <div
      className={styles["secondary-button"]}
      style={{ width: `${widthSize}%` }}
      onClick={handleClick}
    >
      ${amount}
    </div>
  );
};
