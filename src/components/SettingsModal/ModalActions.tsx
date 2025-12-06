import { PrimaryButton } from "../uikit/Buttons/PrimaryButton/PrimaryButton";
import styles from "./settingsModal.module.scss";

type Props = {
  onSave: () => void;
  onReset?: () => void;
};

export const ModalActions: React.FC<Props> = ({ onSave, onReset }) => (
  <div className={styles["settings-modal__actions"]}>
    <PrimaryButton
      text="Save Changes"
      widthSize="50"
      bgColor1="rgba(21, 93, 252, 1)"
      bgColor2="rgba(152, 16, 250, 1)"
      handler={onSave}
    />
    <PrimaryButton
      text="Reset Account"
      widthSize="50"
      bgColor1="rgba(212, 24, 61, 1)"
      bgColor2="rgb(126, 9, 32)"
      handler={onReset}
    />
  </div>
);
