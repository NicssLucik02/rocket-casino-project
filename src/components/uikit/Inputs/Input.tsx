import styles from "./input.module.scss";
import classNames from "classnames";
import { COLORS } from "../../../constants";

type Props = {
  placeholderValue: string;
  type: string;
  bgColor?: string;
  widthSize: string;
  inputValue?: string | number;
  name?: string;
  handler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
};

export const PrimaryInput: React.FC<Props> = ({
  placeholderValue,
  type,
  bgColor = COLORS.BACKGROUND_CARD,
  widthSize,
  inputValue,
  handler,
  name,
  isDisabled,
}) => {
  return (
    <input
      type={type}
      name={name}
      className={classNames(styles["primary-input"], {
        [styles["disabled"]]: isDisabled,
      })}
      placeholder={placeholderValue}
      value={inputValue}
      onChange={handler}
      disabled={isDisabled}
      style={{
        width: `${widthSize}%`,
        backgroundColor: `${bgColor}`,
      }}
    />
  );
};
