import styles from "./settingsModal.module.scss";
import { X } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { balanceStore } from "../../stores/balanceStore";
import { UsernameSection } from "./ModalParts/UsernameSection";
import { ModalActions } from "./ModalParts/ModalActions";

import UserIcon from "../../assets/icons/User.svg?react";

import { GAME_CONFIG, SUPABASE_CONFIG } from "../../constants";
import { AccountStats } from "./ModalParts/AccountStats";

export type SettingsModalProps = {
  onClose: () => void;
  changeUserName: string;
  userNameError: string;
  gamesPlayed: number;
  totalWon: number;
  totalWagered: number;
  handleChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveUsername: () => void;
  resetStats: () => void;
  isLoading: boolean;
  saveMessage: { type: string; text: string } | null;
  handleClearInput: () => void;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  changeUserName,
  userNameError,
  gamesPlayed,
  totalWon,
  totalWagered,
  handleChangeUserName,
  saveUsername,
  resetStats,
  isLoading,
  saveMessage,
  handleClearInput,
}) => {
  const balance = balanceStore((s) => s.balance);

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
        {isLoading ? (
          <ClipLoader
            color={SUPABASE_CONFIG.SPINNER_COLOR}
            size={SUPABASE_CONFIG.SPINNER_SIZE}
            className={styles["spin"]}
          />
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
                  charLimit={GAME_CONFIG.MAX_USERNAME_LENGTH}
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
