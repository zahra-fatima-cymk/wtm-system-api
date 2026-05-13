"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, login as loginRequest } from '@/lib/api';
import { clearAuthSession, loadAuthSession, saveAuthSession, type AuthSession, type AuthUser } from '@/lib/auth';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const session = loadAuthSession();
    if (session) {
      setUser(session.user);
      setToken(session.token);
    }
    setReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginRequest({ email, password });
    const profile = await getProfile();
    const session: AuthSession = {
      token: data.access_token,
      expiresAt: Date.now() + 9 * 3600 * 1000,
      user: profile,
    };

    saveAuthSession(session);
    setUser(profile);
    setToken(data.access_token);
    router.push('/dashboard');
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      login,
      logout,
    }),
    [user, token, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
