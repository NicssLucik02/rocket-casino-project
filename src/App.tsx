import { Home } from "./components/Home/Home";
import { Header } from "./components/Header/Header";
import { SettingsModal } from "./components/SettingsModal/SettingsModal";
import { useRocketGameContext } from "./contexts/rocketGameContextBase";
import { BetResultModal } from "./components/Home/Games/RocketGame/BetResultModal/BetResultModal";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./AppProvider";
import { useSettingsModal } from "./hooks/useSettingsModal";

function AppContent() {
  const { showBetResultModal, onClose, crashed, betAmount, coeff } =
    useRocketGameContext();
  const { isSettingsOpen, openSettingsModal, settingsModalProps } =
    useSettingsModal();

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
            {isSettingsOpen && (
              <SettingsModal {...settingsModalProps} />
            )}
            {showBetResultModal && (
              <BetResultModal
                onClose={onClose}
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

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
