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
const COOKIE_NAME = 'wtm_auth_token';
const COOKIE_MAX_AGE = 9 * 60 * 60; // 9 hours

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof window === 'undefined') return;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function getCookie(name: string) {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.*+?^${}()|[\]\\])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function removeCookie(name: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function saveAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  setCookie(COOKIE_NAME, token, COOKIE_MAX_AGE);
}

export function saveAuthSession(session: AuthSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  setCookie(COOKIE_NAME, session.token, COOKIE_MAX_AGE);
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
  removeCookie(COOKIE_NAME);
}

export function getAuthToken() {
  const session = loadAuthSession();
  if (session?.token) return session.token;
  return getCookie(COOKIE_NAME);
}

export function getAuthUser() {
  const session = loadAuthSession();
  return session?.user ?? null;
}
