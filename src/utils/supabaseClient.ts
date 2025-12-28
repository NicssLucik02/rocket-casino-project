import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nldykegcluiphorglzql.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is required");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
});

declare global {
  interface Window {
    __supabase_initialized?: boolean;
  }
}

if (typeof window !== "undefined" && !window.__supabase_initialized) {
  window.__supabase_initialized = true;

  supabase.auth.onAuthStateChange(() => {});

  const recoverSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      void 0;
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") recoverSession();
  });
  window.addEventListener("focus", recoverSession);
  window.addEventListener("pageshow", (e: PageTransitionEvent) => {
    if (e.persisted) recoverSession();
  });

  recoverSession();
}
