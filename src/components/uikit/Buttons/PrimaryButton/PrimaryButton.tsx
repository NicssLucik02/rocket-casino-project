import styles from "./primaryButton.module.scss";

type Props = {
  text: string;
  widthSize: string;
  bgColor1: string;
  bgColor2: string;
  icon?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  handler?: () => void;
  disabled?: boolean;
};

export const PrimaryButton: React.FC<Props> = ({
  text,
  widthSize,
  bgColor1,
  bgColor2,
  icon,
  Icon,
  handler,
  disabled,
}) => {
  return (
    <button
      onClick={handler}
      disabled={disabled}
      className={styles["primary-button"]}
      style={{
        background: `linear-gradient(to right, ${bgColor1}, ${bgColor2})`,
        width: `${widthSize}%`,
      }}
    >
      {Icon ? (
        <Icon className={styles.icon} />
      ) : icon ? (
        <img src={icon} className={styles.icon} alt="icon" />
      ) : null}
      {text}
    </button>
  );
};
