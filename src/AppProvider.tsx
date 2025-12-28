import { LoginModule } from "./components/LoginModule/LoginModule";
import { Loader } from "./components/uikit/Loader/Loader";
import { useAuthStore } from "./stores/authStore/authStore";

type Props = { children: React.ReactNode };

export const AppProvider: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  if (!user) {
    return <LoginModule />;
  }

  return children;
};
