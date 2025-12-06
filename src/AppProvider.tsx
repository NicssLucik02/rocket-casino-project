import { useAuth } from "./hooks/useAuth";
import { LoginModule } from "./components/LoginModule/LoginModule";
import BalanceProvider from "./contexts/BalanceContext";
import RocketGameProvider from "./contexts/RocketGameContext";
import { Loader } from "./components/uikit/Loader/Loader";

type Props = { children: React.ReactNode };

export const AppProvider: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  if (!user) {
    return <LoginModule />;
  }

  return (
    <BalanceProvider>
      <RocketGameProvider>{children}</RocketGameProvider>
    </BalanceProvider>
  );
};
