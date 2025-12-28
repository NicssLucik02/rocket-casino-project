import { PrimaryInput } from "../../uikit/Inputs/Input";
import styles from "../settingsModal.module.scss";

type Props = {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  error?: string;
  charLimit?: number;
  successMessage?: { type: string; text: string } | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UsernameSection: React.FC<Props> = ({
  Icon,
  label,
  value,
  error,
  charLimit = 20,
  successMessage,
  onChange,
}) => (
  <div>
    <p className={styles["settings-modal__input-text"]}>
      <Icon width={16} height={16} />
      {label}
    </p>
    <PrimaryInput
      placeholderValue="John Doe"
      type="text"
      widthSize="100"
      inputValue={value}
      handler={onChange}
    />
    <p
      className={`${styles["settings-modal__input-ch-counter"]} ${error ? styles["settings-modal__input-ch-counter--error"] : ""}`}
    >
      {value.length} / {charLimit} characters
    </p>
    {error && <p className={styles["settings-modal__input-error"]}>{error}</p>}
    {successMessage?.type && (
      <p className={styles["settings-modal__input-success"]}>
        {successMessage.text}
      </p>
    )}
  </div>
);
