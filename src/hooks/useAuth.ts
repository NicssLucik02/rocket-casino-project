import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import type { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
};
