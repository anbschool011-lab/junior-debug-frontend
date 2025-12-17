import { useEffect, useState, useCallback } from "react";
import supabase from "@/lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
    }
    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Keep local session/user state in sync
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // If the user signed out, navigate to home to clear any protected UI
        if (event === "SIGNED_OUT") {
          try {
            // Use replace to avoid keeping previous (protected) pages in history
            window.location.replace("/");
          } catch (_) {
            // fallback
            window.location.href = "/";
          }
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const getAccessToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // Ensure the client navigates to the home page after sign-out.
    // The auth listener above will also handle this, but performing the
    // redirect here ensures immediate navigation for callers.
    try {
      window.location.replace("/");
    } catch (_) {
      window.location.href = "/";
    }
  }, []);

  return {
    session,
    user,
    getAccessToken,
    signOut,
    authLoading,
    setAuthLoading,
  };
}
