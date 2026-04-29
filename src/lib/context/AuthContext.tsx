// ============================================================
// FILE: src/lib/context/AuthContext.tsx
// UPDATED:
//  - Survives page refreshes and payment redirects
//  - Auto-logout after 10 minutes of inactivity
//  - Does NOT log out just because getProfile() fails temporarily
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
const USER_KEY             = 'authUser';       // cache user data locally
const LAST_ACTIVE_KEY      = 'lastActiveAt';   // track last activity time

// ── Types ────────────────────────────────────────────────────
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
  fullName: string;   // ← was name
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

/** Read token from localStorage (client only) */
function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Read cached user from localStorage */
function readCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

/** Persist user to localStorage so a refresh doesn't clear state */
function writeCachedUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch { /* ignore */ }
}

/** Record the current time as the last activity timestamp */
function touchLastActive() {
  try {
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  } catch { /* ignore */ }
}

/** How many ms have passed since the user last did something */
function msSinceLastActive(): number {
  try {
    const raw = localStorage.getItem(LAST_ACTIVE_KEY);
    if (!raw) return 0;
    return Date.now() - parseInt(raw, 10);
  } catch {
    return 0;
  }
}

/** Clear all auth data from localStorage */
function clearAuthStorage() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_ACTIVE_KEY);
  } catch { /* ignore */ }
}

// ── Provider ─────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer       = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    // Cancel any running timer
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }

    try {
      await authService.logout();
    } catch {
      // Ignore API errors — clear locally regardless
    }

    clearAuthStorage();
    setUser(null);
  }, []);

  // ── Inactivity timer ──────────────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    touchLastActive();

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      console.info('⏱ Auto-logout: 10 minutes of inactivity');
      logout();
    }, INACTIVITY_LIMIT_MS);
  }, [logout]);

  // ── Attach activity listeners ─────────────────────────────
  useEffect(() => {
    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click',
    ] as const;

    const handleActivity = () => {
      // Only reset the timer if the user is actually logged in
      if (readToken()) {
        resetInactivityTimer();
      }
    };

    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [resetInactivityTimer]);

  // ── Boot: restore session on page load / refresh ──────────
  useEffect(() => {
    const init = async () => {
      const token = readToken();

      if (!token) {
        // No token — definitely logged out
        setLoading(false);
        return;
      }

      // Check if the user was already inactive for too long BEFORE the refresh
      // (e.g. they left the tab open for 30 mins, then came back)
      const idle = msSinceLastActive();
      if (idle > INACTIVITY_LIMIT_MS && idle > 0) {
        console.info('⏱ Session expired due to inactivity before refresh');
        clearAuthStorage();
        setLoading(false);
        return;
      }

      // ── Restore from cache immediately so UI doesn't flicker ──
      const cached = readCachedUser();
      if (cached) {
        setUser(cached);
      }

      // ── Try to refresh from server in background ───────────
      // If it fails (e.g. payment redirect, brief network hiccup)
      // we keep the cached user — we do NOT log them out.
      try {
        const response = await authService.getProfile();
        const freshUser = response?.data ?? null;
        if (freshUser) {
          setUser(freshUser);
          writeCachedUser(freshUser);
        }
      } catch (err) {
        // Network error or 401 — only log out on explicit 401
        const status = (err as any)?.response?.status ?? (err as any)?.status;
        if (status === 401) {
          // Token is genuinely invalid/expired — clear everything
          clearAuthStorage();
          setUser(null);
        } else {
          // Temporary failure (network, 5xx, Pesapal redirect, etc.)
          // Keep the cached user logged in
          console.warn('⚠️ Could not refresh profile — keeping cached session:', err);
        }
      }

      // Start inactivity timer now that we have a session
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
    const loggedInUser = response.data.user ?? null;
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

  // Backend returns user with first_name/last_name, so normalize here
  const raw = response.data.user;
  const newUser: User | null = raw
    ? {
        ...raw,
        name: `${raw.first_name ?? ''} ${raw.last_name ?? ''}`.trim(),
      }
    : null;

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
    const fresh = response?.data ?? null;
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