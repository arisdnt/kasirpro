/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { getSupabaseClient } from "@/lib/supabase-client";
import type { AuthState } from "./types";
import { loadUserProfile, subscribeUserProfile } from "./profile-service";

const AuthContext = createContext<{
  client: ReturnType<typeof getSupabaseClient>;
  state: AuthState;
  signInWithPassword: (params: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
} | null>(null);

const initialState: AuthState = {
  isLoading: true,
  user: null,
  session: null,
};

export function SupabaseAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const client = getSupabaseClient();
  const [state, setState] = useState<AuthState>(initialState);

  const syncSession = useCallback(
    async (nextSession: Session | null, showError = true) => {
      if (!nextSession) {
        setState({ isLoading: false, user: null, session: null });
        return;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, session: nextSession }));
        const profile = await loadUserProfile(nextSession);
        setState({ isLoading: false, user: profile, session: nextSession });
      } catch (error) {
        console.error(error);
        if (showError) {
          toast.error("Gagal memuat profil pengguna");
        }
        setState({ isLoading: false, user: null, session: nextSession });
      }
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    client.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        void syncSession(data.session ?? null, false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Tidak dapat memuat sesi autentikasi");
        setState(initialState);
      });

    const { data: subscription } = client.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        void syncSession(session ?? null);
      },
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [client, syncSession]);

  useEffect(() => {
    if (!state.user || !state.session) {
      return;
    }

    const unsubscribe = subscribeUserProfile(state.user.id, () => {
      void syncSession(state.session!, false);
    });

    return unsubscribe;
  }, [state.user, state.session, syncSession]);

  const signInWithPassword = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const { error, data } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        throw error;
      }
      await syncSession(data.session ?? null);
    },
    [client, syncSession],
  );

  const signOut = useCallback(async () => {
    const { error } = await client.auth.signOut();
    if (error) {
      toast.error(error.message);
      throw error;
    }
    setState({ ...initialState, isLoading: false });
  }, [client]);

  const refreshProfile = useCallback(async () => {
    if (state.session) {
      await syncSession(state.session, false);
    }
  }, [state.session, syncSession]);

  const value = useMemo(
    () => ({ client, state, signInWithPassword, signOut, refreshProfile }),
    [client, refreshProfile, signInWithPassword, signOut, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  }
  return context;
}
