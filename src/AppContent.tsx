import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Home } from "./components/Home/Home";
import { BetResultModal } from "./components/Home/Games/RocketGame/BetResultModal/BetResultModal";
import { SettingsModal } from "./components/SettingsModal/SettingsModal";
import { useRocketGameStore } from "./stores/rocketGameStore";
import { useSettingsModal } from "./hooks/useSettingsModal";

export function AppContent() {
  const { showBetResultModal, closeBetResultModal, crashed, betAmount, coeff } =
    useRocketGameStore();
  const { isSettingsOpen, openSettingsModal, settingsModalProps } = useSettingsModal();

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/home" replace />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/home"
        element={
          <>
            <Header onSettingsClick={openSettingsModal} />
            <Home />
            {isSettingsOpen && <SettingsModal {...settingsModalProps} />}
            {showBetResultModal && (
              <BetResultModal
                onClose={closeBetResultModal}
                crashed={crashed}
                betAmount={betAmount}
                coeff={coeff}
              />
            )}
          </>
        }
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
