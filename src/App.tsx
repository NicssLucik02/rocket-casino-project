import { Home } from "./components/Home/Home";
import { LoginModule } from "./components/LoginModule/LoginModule";
import { Header } from "./components/Header/Header";
import { SettingsModal } from "./components/SettingsModal/SettingsModal";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { RocketGameProvider } from "./contexts/RocketGameContext";
import { useRocketGameContext } from "./contexts/rocketGameContextBase";
import { BalanceProvider } from "./contexts/BalanceContext";
import { BetResultModal } from "./components/Home/HomeGame/BetResultModal/BetResultModal";
import { ClipLoader } from "react-spinners";

function AppContent() {
  const { user, loading } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { showBetResultModal, onClose, crashed, betAmount, coeff } = useRocketGameContext();

  if (loading) return <ClipLoader color="#00bc6eff" size={20} className='spin__header'/>;
  if (!user) return <LoginModule />;

  return (
    <>
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      <Home />
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}

      {showBetResultModal && (
        <BetResultModal onClose={onClose} crashed={crashed} betAmount={betAmount} coeff={coeff}/>
      )}
    </>
  );
}

function App() {
  return (
    <BalanceProvider>
      <RocketGameProvider>
        <AppContent />
      </RocketGameProvider>
    </BalanceProvider>
  );
}

export default App;
