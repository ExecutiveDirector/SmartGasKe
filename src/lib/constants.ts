// ============================================================
// FILE: src/lib/constants.ts
// ============================================================

export const APP_NAME = 'AquaGas';
export const APP_DESCRIPTION = 'Smart LPG Distribution Platform';
export const SUPPORT_EMAIL = 'support@aquagas.co.ke';
export const SUPPORT_PHONE = '+254 710 820 666';

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  CARD: 'card',
  CASH_ON_DELIVERY: 'cash_on_delivery',
  WALLET: 'wallet',
} as const;

export const PRODUCT_CATEGORIES = [
  'Cylinders',
  'Accessories',
  'Cookers',
  'Regulators',
  'Hoses',
  'Safety Equipment',
] as const;

export const DELIVERY_FEE = 100; // KES

export const PAGINATION_LIMITS = {
  DEFAULT: 10,
  PRODUCTS: 20,
  ORDERS: 15,
  OUTLETS: 10,
} as const;

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  CART: '/shop/cart',
  CHECKOUT: '/shop/checkout',
  ORDERS: '/orders',
  ACCOUNT: '/account',
  LOGIN: '/account/login',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;
