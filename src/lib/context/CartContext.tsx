// ============================================================
// FILE: src/lib/context/CartContext.tsx
// Cart Context - Global shopping cart state management
// ============================================================

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Outlet } from '../types';

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, outlet: Outlet) => void;
  removeFromCart: (productId: string, outletId: string) => void;
  updateQuantity: (productId: string, outletId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (isClient) {
      const savedCart = localStorage.getItem('aquagas_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, [isClient]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isClient && cart.length >= 0) {
      localStorage.setItem('aquagas_cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  // Add item to cart
  const addToCart = (product: Product, outlet: Outlet) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.outlet.id === outlet.id
      );

      if (existingItem) {
        // If item exists, increment quantity (check stock limit)
        if (existingItem.quantity >= product.stock) {
          console.warn('Cannot add more items - stock limit reached');
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id && item.outlet.id === outlet.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Add new item to cart
      return [...prevCart, { ...product, outlet, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: string, outletId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === productId && item.outlet.id === outletId))
    );
  };

  // Update item quantity
  const updateQuantity = (productId: string, outletId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, outletId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId && item.outlet.id === outletId) {
          // Check stock limit
          const newQuantity = Math.min(quantity, item.stock);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate total item count
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;


