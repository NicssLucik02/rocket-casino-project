import { useCallback, useState } from "react";
import type { SettingsModalProps } from "../components/SettingsModal/SettingsModal";
import { useSettings } from "./useSettings";

export const useSettingsModal = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettingsModal = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettingsModal = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const {
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
  } = useSettings();

  const settingsModalProps: SettingsModalProps = {
    onClose: closeSettingsModal,
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
  };

  return {
    isSettingsOpen,
    openSettingsModal,
    closeSettingsModal,
    settingsModalProps,
  };
};
