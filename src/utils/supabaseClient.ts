import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nldykegcluiphorglzql.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZHlrZWdjbHVpcGhvcmdsenFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODExMzYsImV4cCI6MjA3OTc1NzEzNn0.0cEHVVwoRFm5Wod-Vikals3wtC6HDrJ-_i00BhHG9LA";

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
