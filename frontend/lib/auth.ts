export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  type: 'user' | 'driver' | 'admin';
  status?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  profile_image?: string;
};

export type AuthSession = {
  token: string;
  expiresAt: number;
  user: AuthUser;
};

const STORAGE_KEY = 'wtm_auth_session';

export function saveAuthSession(session: AuthSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session?.token || !session?.expiresAt || session.expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getAuthToken() {
  const session = loadAuthSession();
  return session?.token ?? null;
}

export function getAuthUser() {
  const session = loadAuthSession();
  return session?.user ?? null;
}
