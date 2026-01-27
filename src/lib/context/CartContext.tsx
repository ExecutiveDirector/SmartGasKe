// ============================================================
// FILE: src/lib/context/CartContext.tsx
// Enhanced Cart Context with Outlet Validation
// ============================================================
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Outlet } from '../types';
import toast from 'react-hot-toast';

// CartItem extends Product and adds outlet + quantity
export interface CartItem extends Product {
  outlet: Outlet;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, outlet: Outlet) => void;
  removeFromCart: (productId: string, outletId: string) => void;
  updateQuantity: (productId: string, outletId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getCartOutlet: () => Outlet | null;
  isInCart: (productId: string, outletId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag
  useEffect(() => setIsClient(true), []);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    if (isClient) {
      const savedCart = localStorage.getItem('aquagas_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          localStorage.removeItem('aquagas_cart');
        }
      }
    }
  }, [isClient]);

  // Save cart to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('aquagas_cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  /**
   * Add product to cart with outlet validation
   */
  const addToCart = (product: Product, outlet: Outlet) => {
    // Validation checks
    if (!product.id && !product.product_id) {
      toast.error('Product ID is missing');
      return;
    }

    if (!product.name && !product.title && !product.product_name) {
      toast.error('Product name is missing');
      return;
    }

    if (!product.price || product.price <= 0) {
      toast.error('Product price is invalid');
      return;
    }

    if (!outlet.id && !outlet.outlet_id) {
      toast.error('Outlet information is missing for this product');
      return;
    }

    // Normalize IDs
    const productId = (product.id || product.product_id).toString();
    const outletId = (outlet.id || outlet.outlet_id).toString();

    setCart((prevCart) => {
      // Check if product from same outlet is already in cart
      const existingItemIndex = prevCart.findIndex(
        (item) => 
          (item.id || item.product_id).toString() === productId &&
          (item.outlet.id || item.outlet.outlet_id).toString() === outletId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const currentQuantity = prevCart[existingItemIndex].quantity;
        const stockLimit = product.stock ?? Infinity;

        if (currentQuantity >= stockLimit) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prevCart;
        }

        return prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Validate cart outlet consistency (all items must be from same outlet)
      if (prevCart.length > 0) {
        const firstCartOutletId = (prevCart[0].outlet.id || prevCart[0].outlet.outlet_id).toString();
        
        if (firstCartOutletId !== outletId) {
          const firstOutletName = prevCart[0].outlet.name || prevCart[0].outlet.outlet_name || 'another outlet';
          const currentOutletName = outlet.name || outlet.outlet_name || 'this outlet';
          
          toast.error(
            `Your cart contains items from ${firstOutletName}. Please checkout or clear your cart before adding items from ${currentOutletName}.`,
            { duration: 5000 }
          );
          return prevCart;
        }
      }

      // Add new item - Create CartItem by merging product with outlet and quantity
      const newCartItem: CartItem = {
        ...product,
        id: productId,
        outlet: {
          ...outlet,
          id: outletId,
        },
        quantity: 1,
      };

      return [...prevCart, newCartItem];
    });
  };

  /**
   * Remove product from cart
   */
  const removeFromCart = (productId: string, outletId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => {
        const itemProductId = (item.id || item.product_id).toString();
        const itemOutletId = (item.outlet.id || item.outlet.outlet_id).toString();
        return !(itemProductId === productId && itemOutletId === outletId);
      })
    );
    toast.success('Item removed from cart');
  };

  /**
   * Update item quantity
   */
  const updateQuantity = (productId: string, outletId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, outletId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        const itemProductId = (item.id || item.product_id).toString();
        const itemOutletId = (item.outlet.id || item.outlet.outlet_id).toString();

        if (itemProductId === productId && itemOutletId === outletId) {
          const stockLimit = item.stock ?? Infinity;
          
          if (quantity > stockLimit) {
            toast.error(`Only ${item.stock} items available in stock`);
            return item;
          }
          
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  /**
   * Get cart outlet (all items should be from same outlet)
   */
  const getCartOutlet = (): Outlet | null => {
    return cart.length > 0 ? cart[0].outlet : null;
  };

  /**
   * Check if product is in cart
   */
  const isInCart = (productId: string, outletId: string): boolean => {
    return cart.some((item) => {
      const itemProductId = (item.id || item.product_id).toString();
      const itemOutletId = (item.outlet.id || item.outlet.outlet_id).toString();
      return itemProductId === productId && itemOutletId === outletId;
    });
  };

  // Calculate totals
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    getCartOutlet,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export default CartContext;
