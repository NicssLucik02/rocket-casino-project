import { Home } from "./components/Home/Home";
import { Header } from "./components/Header/Header";
import { SettingsModal } from "./components/SettingsModal/SettingsModal";
import { useState } from "react";
import { useRocketGameContext } from "./contexts/rocketGameContextBase";
import { BetResultModal } from "./components/Home/Games/RocketGame/BetResultModal/BetResultModal";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./AppProvider";
import { useSettings } from "./hooks/useSettings";

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { showBetResultModal, onClose, crashed, betAmount, coeff } =
    useRocketGameContext();
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

  const handleOpenSettingsModal = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsOpen(false);
  };
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/home" replace />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/home"
        element={
          <>
            <Header onSettingsClick={handleOpenSettingsModal} />
            <Home />
            {isSettingsOpen && (
              <SettingsModal
                onClose={handleCloseSettingsModal}
                changeUserName={changeUserName}
                userNameError={userNameError}
                gamesPlayed={gamesPlayed}
                totalWon={totalWon}
                totalWagered={totalWagered}
                handleChangeUserName={handleChangeUserName}
                saveUsername={saveUsername}
                resetStats={resetStats}
                loading={loading}
                saveMessage={saveMessage}
                handleClearInput={handleClearInput}
              />
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
