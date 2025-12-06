import styles from "./settingsModal.module.scss";
import { X } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useBalanceContext } from "../../contexts/balanceContextBase";
import { UsernameSection } from "./UsernameSection";
import UserIcon from "../../assets/icons/User.svg?react";
import { AccountStats } from "./AccountStats";
import { ModalActions } from "./ModalActions";

type Props = {
  onClose: () => void;
  changeUserName: string;
  userNameError: string;
  gamesPlayed: number;
  totalWon: number;
  totalWagered: number;
  handleChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveUsername: () => void;
  resetStats: () => void;
  loading: boolean;
  saveMessage: { type: string; text: string } | null;
  handleClearInput: () => void;
};

export const SettingsModal: React.FC<Props> = ({
  onClose,
  changeUserName,
  userNameError,
  gamesPlayed,
  totalWon,
  totalWagered,
  handleChangeUserName,
  saveUsername,
  resetStats,
  loading,
  saveMessage,
  handleClearInput,
}) => {
  const { balance } = useBalanceContext();

  const handleSave = () => {
    saveUsername();
    handleClearInput();
  };

  const handleReset = () => {
    resetStats();
  };

  return (
    <div>
      <div className={styles["settings-modal__overlay"]} onClick={onClose} />

      <div className={styles["settings-modal"]}>
        {loading ? (
          <ClipLoader color="#0013bcff" size={70} className={styles["spin"]} />
        ) : (
          <>
            <X
              onClick={onClose}
              className={styles["settings-modal__close-icon"]}
              size={20}
            />
            <div className={styles["settings-modal__container"]}>
              <div className={styles["settings-modal__top"]}>
                <p className={styles["settings-modal__top-title"]}>
                  Profile Settings
                </p>
                <p className={styles["settings-modal__top-subtitle"]}>
                  Customize your profile and manage your account
                </p>

                <UsernameSection
                  Icon={UserIcon}
                  label="Username"
                  value={changeUserName}
                  error={userNameError}
                  charLimit={20}
                  successMessage={saveMessage}
                  onChange={handleChangeUserName}
                />

                <AccountStats
                  balance={balance}
                  gamesPlayed={gamesPlayed}
                  totalWagered={totalWagered}
                  totalWon={totalWon}
                />

                <ModalActions onSave={handleSave} onReset={handleReset} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
