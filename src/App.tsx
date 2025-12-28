import { AppProvider } from "./AppProvider";
import { useEffect } from "react";

import { AppContent } from "./AppContent";
import { initAuth } from "./stores/authStore/initAuth";

function App() {
  useEffect(() => {
    initAuth();
  }, []);

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
