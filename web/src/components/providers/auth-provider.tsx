'use client';

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';
import {
  clearStoredAuth,
  getAuthServerSnapshot,
  getAuthSnapshot,
  saveAuth,
  saveStoredUser,
  subscribeToAuthStorage,
} from '@/lib/auth-storage';
import type { AuthResponse, AuthUser } from '@/types';

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  persistAuth: (auth: AuthResponse) => void;
  setSessionUser: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authSnapshot = useSyncExternalStore(
    subscribeToAuthStorage,
    getAuthSnapshot,
    getAuthServerSnapshot,
  );

  const { token, user } = authSnapshot;

  const persistAuth = useCallback((auth: AuthResponse) => {
    saveAuth(auth.token, auth.user);
  }, []);

  const setSessionUser = useCallback((nextUser: AuthUser) => {
    saveStoredUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isReady: typeof window !== 'undefined',
        isAuthenticated: Boolean(token),
        persistAuth,
        setSessionUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
