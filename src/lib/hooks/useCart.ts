// ===========================================================
// FILE: src/lib/hooks/useCart.ts
// Custom hook for cart operations (re-export from context)
// ============================================================

import { useCart as useCartContext } from '../context/CartContext';

export const useCart = useCartContext;

