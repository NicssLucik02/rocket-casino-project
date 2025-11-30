import { PrimaryInput } from "../uikit/Inputs/Input";

type Props = {
  icon: string;
  label: string;
  value: string;
  error?: string;
  charLimit?: number;
  successMessage?: { type: string; text: string } | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UsernameSection: React.FC<Props> = ({
  icon,
  label,
  value,
  error,
  charLimit = 20,
  successMessage,
  onChange,
}) => (
  <div>
    <p className="settings-modal__input-text">
      <img src={icon} alt={label.toLowerCase()} />
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
      className={`settings-modal__input-ch-counter ${error ? "settings-modal__input-ch-counter--error" : ""}`}
    >
      {value.length} / {charLimit} characters
    </p>
    {error && <p className="settings-modal__input-error">{error}</p>}
    {successMessage?.type && (
      <p className="settings-modal__input-success">{successMessage.text}</p>
    )}
  </div>
);
