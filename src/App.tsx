import { Home } from './components/Home/Home'
import { LoginModule } from './components/LoginModule/LoginModule'
import { Header } from './components/Header/Header';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (loading) return <div>Loading...</div>;

  if (!user) return <LoginModule />;
  
  return (
    <>
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <Home />
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}

    </>
  )
}

export default App
