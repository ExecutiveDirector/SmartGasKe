// ============================================================
// FILE: src/lib/context/AuthContext.tsx
// UPDATED:
//  - Survives page refreshes and payment redirects
//  - Auto-logout after 10 minutes of inactivity
//  - Does NOT log out just because getProfile() fails temporarily
//  - Normalizes backend user shape (first_name/last_name → name)
// ============================================================
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { User } from '../types';
import { authService } from '../api';

// ── Constants ────────────────────────────────────────────────
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
const TOKEN_KEY            = 'authToken';
const USER_KEY             = 'authUser';
const LAST_ACTIVE_KEY      = 'lastActiveAt';

// ── Types ────────────────────────────────────────────────────
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Helpers ──────────────────────────────────────────────────

/**
 * The backend returns different shapes depending on the endpoint:
 *
 * register → { user_id, first_name, last_name, full_name, email, phone_number }
 * login    → { account: { account_id, email, role }, roleData: { first_name, ... } }
 * profile  → { account: {...}, profile: { first_name, last_name, ... } }
 *
 * We normalise all of these into the flat User shape the frontend expects,
 * which includes a `name` string field.
 */
function normalizeUser(raw: any): User | null {
  if (!raw) return null;

  // Already normalised (has a `name` string at the top level)
  if (typeof raw.name === 'string' && raw.name) return raw as User;

  // Shape coming from register / verifyOTP endpoints
  if (raw.first_name || raw.last_name) {
    const name = raw.full_name || `${raw.first_name ?? ''} ${raw.last_name ?? ''}`.trim();
    return {
      ...raw,
      name,
      // Surface account-level fields when they live one level up
      id:    raw.user_id   ?? raw.account_id ?? raw.id,
      email: raw.email,
      phone: raw.phone_number ?? raw.phone,
    } as User;
  }

  // Shape coming from getProfile: { account, profile }
  if (raw.account && raw.profile) {
    const profile = raw.profile;
    const account = raw.account;
    const name =
      profile.full_name ||
      `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() ||
      account.email;
    return {
      ...profile,
      ...account,
      name,
      id:    profile.user_id ?? account.account_id,
      email: account.email ?? profile.email,
      phone: account.phone_number ?? profile.phone_number,
    } as User;
  }

  // Fallback: just pass through and let the consumer handle it
  return raw as User;
}

function readToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function readCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}

function writeCachedUser(user: User | null) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else       localStorage.removeItem(USER_KEY);
  } catch { /* ignore */ }
}

function touchLastActive() {
  try { localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString()); } catch { /* ignore */ }
}

function msSinceLastActive(): number {
  try {
    const raw = localStorage.getItem(LAST_ACTIVE_KEY);
    return raw ? Date.now() - parseInt(raw, 10) : 0;
  } catch { return 0; }
}

function clearAuthStorage() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_ACTIVE_KEY);
  } catch { /* ignore */ }
}

// ── Provider ─────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer       = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
    try { await authService.logout(); } catch { /* ignore */ }
    clearAuthStorage();
    setUser(null);
  }, []);

  // ── Inactivity timer ──────────────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    touchLastActive();
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      console.info('⏱ Auto-logout: 10 minutes of inactivity');
      logout();
    }, INACTIVITY_LIMIT_MS);
  }, [logout]);

  // ── Activity listeners ────────────────────────────────────
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const;
    const handleActivity = () => { if (readToken()) resetInactivityTimer(); };
    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));
    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [resetInactivityTimer]);

  // ── Boot ──────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const token = readToken();
      if (!token) { setLoading(false); return; }

      const idle = msSinceLastActive();
      if (idle > INACTIVITY_LIMIT_MS && idle > 0) {
        console.info('⏱ Session expired due to inactivity before refresh');
        clearAuthStorage();
        setLoading(false);
        return;
      }

      // Show cached user immediately to prevent flicker
      const cached = readCachedUser();
      if (cached) setUser(cached);

      // Try to refresh from server
      try {
        const response = await authService.getProfile();
        const fresh = normalizeUser(response?.data ?? null);
        if (fresh) {
          setUser(fresh);
          writeCachedUser(fresh);
        }
      } catch (err) {
        const status = (err as any)?.response?.status ?? (err as any)?.status;
        if (status === 401) {
          clearAuthStorage();
          setUser(null);
        } else {
          console.warn('⚠️ Could not refresh profile — keeping cached session:', err);
        }
      }

      resetInactivityTimer();
      setLoading(false);
    };

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Login ─────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (!response?.data) throw new Error('Login failed');

    localStorage.setItem(TOKEN_KEY, response.data.token);

    // Login response: { token, account, roleData }
    // Merge account + roleData for the full user object
    const rawUser = response.data.roleData
      ? { ...response.data.account, ...response.data.roleData }
      : response.data.user ?? response.data.account ?? null;

    const loggedInUser = normalizeUser(rawUser);
    setUser(loggedInUser);
    writeCachedUser(loggedInUser);
    resetInactivityTimer();
  };

  // ── Register ──────────────────────────────────────────────
  const register = async (userData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    const response = await authService.register(userData);
    if (!response?.data) throw new Error('Registration failed');

    localStorage.setItem(TOKEN_KEY, response.data.token);

    // Register response: { token, user: { user_id, first_name, last_name, ... } }
    const newUser = normalizeUser(response.data.user ?? null);
    setUser(newUser);
    writeCachedUser(newUser);
    resetInactivityTimer();
  };

  // ── Update user locally ───────────────────────────────────
  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...userData };
      writeCachedUser(updated);
      return updated;
    });
  };

  // ── Refresh from server ───────────────────────────────────
  const refreshUser = async () => {
    const response = await authService.getProfile();
    const fresh = normalizeUser(response?.data ?? null);
    if (fresh) {
      setUser(fresh);
      writeCachedUser(fresh);
    }
  };

  // ── Get token ─────────────────────────────────────────────
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return readToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
