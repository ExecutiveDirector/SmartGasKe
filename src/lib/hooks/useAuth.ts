// ============================================================
// FILE: src/lib/hooks/useAuth.ts
// Custom hook for authentication (re-export from context)
// ============================================================

import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = useAuthContext;
