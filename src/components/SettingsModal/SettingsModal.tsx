import "./settingsModal.scss";
import { X } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useBalanceContext } from "../../contexts/BalanceContext";
import { useSettings } from "../../hooks/useSettings";
import { UsernameSection } from "./UsernameSection";
import userIcon from "../../assets/icons/User.svg";
import { AccountStats } from "./AccountStats";
import { ModalActions } from "./ModalActions";

type Props = {
  onClose: () => void;
};

export const SettingsModal: React.FC<Props> = ({ onClose }) => {
  const { balance } = useBalanceContext();
  const {
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
  } = useSettings();

  const handleSave = () => {
    saveUsername();
    handleClearInput();
  };

  const handleReset = () => {
    resetStats();
  };

  return (
    <div className="settings-modal__wrapper">
      <div className="settings-modal__overlay" onClick={onClose} />

      <div className="settings-modal">
        {loading ? (
          <ClipLoader color="#0013bcff" size={70} className="spin" />
        ) : (
          <>
            <X
              onClick={onClose}
              className="settings-modal__close-icon"
              size={20}
            />
            <div className="settings-modal__container">
              <div className="settings-modal__top">
                <p className="settings-modal__top-title">Profile Settings</p>
                <p className="settings-modal__top-subtitle">
                  Customize your profile and manage your account
                </p>

                <UsernameSection
                  icon={userIcon}
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

                <ModalActions
                  onSave={handleSave}
                  onReset={handleReset}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
