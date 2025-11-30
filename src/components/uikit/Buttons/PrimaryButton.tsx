type Props = {
  text: string;
  widthSize: string;
  bgColor1: string;
  bgColor2: string;
  icon?: string;
  handler?: () => void;
  disabled?: boolean;
};

export const PrimaryButton: React.FC<Props> = ({
  text,
  widthSize,
  bgColor1,
  bgColor2,
  icon,
  handler,
  disabled,
}) => {
  return (
    <button
      onClick={handler}
      disabled={disabled}
      style={{
        height: "36px",
        width: `${widthSize}%`,
        background: `linear-gradient(to right, ${bgColor1}, ${bgColor2})`,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {icon && <img src={icon} style={{ marginRight: "4px" }} alt="icon" />}
      {text}
    </button>
  );
};
