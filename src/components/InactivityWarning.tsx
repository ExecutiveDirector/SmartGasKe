// ============================================================
// FILE: src/components/InactivityWarning.tsx
// Shows a countdown banner 1 minute before auto-logout.
// Drop this inside your _app.tsx just above <Footer />.
// ============================================================

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // must match AuthContext
const WARN_BEFORE_MS      =  1 * 60 * 1000; // warn 1 minute before
const LAST_ACTIVE_KEY     = 'lastActiveAt';

function msSinceLastActive(): number {
  try {
    const raw = localStorage.getItem(LAST_ACTIVE_KEY);
    if (!raw) return 0;
    return Date.now() - parseInt(raw, 10);
  } catch {
    return 0;
  }
}

export default function InactivityWarning() {
  const { isAuthenticated, logout } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startChecking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const idle    = msSinceLastActive();
      const remaining = INACTIVITY_LIMIT_MS - idle;

      if (remaining <= 0) {
        setSecondsLeft(0);
        clearInterval(intervalRef.current!);
        return;
      }

      if (remaining <= WARN_BEFORE_MS) {
        setSecondsLeft(Math.ceil(remaining / 1000));
      } else {
        setSecondsLeft(null); // hide banner
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setSecondsLeft(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    startChecking();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, startChecking]);

  if (!isAuthenticated || secondsLeft === null) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const label   = minutes > 0
    ? `${minutes}m ${seconds}s`
    : `${seconds}s`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-yellow-50 border-2 border-yellow-400 text-yellow-900 px-6 py-3 rounded-xl shadow-xl text-sm font-medium">
      <span>⏱ You'll be logged out in <strong>{label}</strong> due to inactivity.</span>
      <button
        onClick={() => {
          // Touching this button counts as activity — AuthContext will reset the timer
          window.dispatchEvent(new MouseEvent('mousemove'));
          setSecondsLeft(null);
        }}
        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-3 py-1 rounded-lg font-semibold transition"
      >
        Stay logged in
      </button>
      <button
        onClick={logout}
        className="text-yellow-700 hover:text-yellow-900 underline"
      >
        Log out now
      </button>
    </div>
  );
}