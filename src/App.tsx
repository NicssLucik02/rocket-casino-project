import { Home } from './components/Home/Home'
import { LoginModule } from './components/LoginModule/LoginModule'
import { Header } from './components/Header/Header';
import { useAuth } from './assets/hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <LoginModule />;
  
  return (
    <>
      <Header />
      <Home />
    </>
  )
}

export default App
