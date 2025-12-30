// ============================================================
// FILE: src/lib/types.ts
// ============================================================

// User & Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet: number;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Outlet/Vendor Types
export interface Outlet {
  id: string;
  name: string;
  vendor: string;
  vendor_id?: string;
  distance?: number;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  email?: string;
  featured: boolean;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  opening_hours?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OutletQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  featured?: boolean;
}

export interface NearbyOutletsParams {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers
  limit?: number;
}

export interface OutletProductsParams {
  category?: string;
  search?: string;
  in_stock?: boolean;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
}

// Product Types
export interface Product {
  id: string;
  outlet_id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  featured: boolean;
  specifications?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  in_stock?: boolean;
  min_price?: number;
  max_price?: number;
  outlet_id?: string;
}

export interface CreateProductData {
  outlet_id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  featured?: boolean;
  specifications?: Record<string, any>;
}

// Cart Types
export interface CartItem extends Product {
  outlet: Outlet;
  quantity: number;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
export type PaymentMethod = 'mpesa' | 'card' | 'cash_on_delivery' | 'wallet';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  outlet_id: string;
  outlet_name: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  delivery_fee: number;
  grand_total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  delivery_address: string;
  delivery_phone: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  delivered_at?: string;
}

export interface CreateOrderData {
  items: {
    product_id: string;
    quantity: number;
    outlet_id: string;
  }[];
  delivery_address: string;
  delivery_phone: string;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  from_date?: string;
  to_date?: string;
}

// Wallet Types
export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  balance_after: number;
  created_at: string;
}

export interface AddMoneyData {
  amount: number;
  payment_method: 'mpesa' | 'card';
  phone_number?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  status?: number;
}

// ============================================================
// FILE: src/lib/api.ts
// ============================================================

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  Outlet,
  OutletQueryParams,
  NearbyOutletsParams,
  OutletProductsParams,
  Product,
  ProductQueryParams,
  CreateProductData,
  Order,
  CreateOrderData,
  OrderQueryParams,
  WalletTransaction,
  AddMoneyData,
  ApiResponse,
  PaginatedResponse,
  ApiError,
} from './types';

// API Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/account/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        success: false,
        error: 'Network Error',
        message: 'Unable to connect to server. Please check your internet connection.',
      });
    }

    // Return formatted error
    return Promise.reject(
      error.response?.data || {
        success: false,
        error: 'Unknown Error',
        message: 'An unexpected error occurred',
      }
    );
  }
);

// ============================================================
// Authentication Service
// ============================================================

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', profileData);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: { current_password: string; new_password: string }): Promise<ApiResponse<null>> => {
    const response = await api.put<ApiResponse<null>>('/auth/password', data);
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },
};

// ============================================================
// Outlet Service
// ============================================================

export const outletService = {
  /**
   * Get nearby outlets based on location
   */
  getNearbyOutlets: async (params: NearbyOutletsParams): Promise<ApiResponse<Outlet[]>> => {
    const response = await api.get<ApiResponse<Outlet[]>>('/outlets/nearby', { params });
    return response.data;
  },

  /**
   * Get single outlet by ID
   */
  getOutlet: async (outletId: string): Promise<ApiResponse<Outlet>> => {
    const response = await api.get<ApiResponse<Outlet>>(`/outlets/${outletId}`);
    return response.data;
  },

  /**
   * Get all outlets with pagination
   */
  getAllOutlets: async (params?: OutletQueryParams): Promise<PaginatedResponse<Outlet>> => {
    const response = await api.get<PaginatedResponse<Outlet>>('/outlets', { params });
    return response.data;
  },

  /**
   * Get products for a specific outlet
   */
  getOutletProducts: async (
    outletId: string,
    params?: OutletProductsParams
  ): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>(`/outlets/${outletId}/products`, { params });
    return response.data;
  },

  /**
   * Search outlets
   */
  searchOutlets: async (query: string): Promise<ApiResponse<Outlet[]>> => {
    const response = await api.get<ApiResponse<Outlet[]>>('/outlets/search', {
      params: { q: query },
    });
    return response.data;
  },
};

// ============================================================
// Product Service
// ============================================================

export const productService = {
  /**
   * Get all products with filters
   */
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  /**
   * Get single product by ID
   */
  getProduct: async (productId: string): Promise<ApiResponse<Product>> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${productId}`);
    return response.data;
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit?: number): Promise<ApiResponse<Product[]>> => {
    const response = await api.get<ApiResponse<Product[]>>('/products/featured', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Search products
   */
  searchProducts: async (query: string): Promise<ApiResponse<Product[]>> => {
    const response = await api.get<ApiResponse<Product[]>>('/products/search', {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * Get product categories
   */
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get<ApiResponse<string[]>>('/products/categories');
    return response.data;
  },
};

// ============================================================
// Order Service
// ============================================================

export const orderService = {
  /**
   * Create a new order
   */
  createOrder: async (orderData: CreateOrderData): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data;
  },

  /**
   * Get all orders for current user
   */
  getOrders: async (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  },

  /**
   * Get single order by ID
   */
  getOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (orderId: string, reason?: string): Promise<ApiResponse<Order>> => {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  /**
   * Track order status
   */
  trackOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}/track`);
    return response.data;
  },

  /**
   * Rate an order
   */
  rateOrder: async (orderId: string, rating: number, review?: string): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(`/orders/${orderId}/rate`, {
      rating,
      review,
    });
    return response.data;
  },
};

// ============================================================
// Wallet Service
// ============================================================

export const walletService = {
  /**
   * Get wallet balance
   */
  getBalance: async (): Promise<ApiResponse<{ balance: number }>> => {
    const response = await api.get<ApiResponse<{ balance: number }>>('/wallet/balance');
    return response.data;
  },

  /**
   * Get wallet transactions
   */
  getTransactions: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<WalletTransaction>> => {
    const response = await api.get<PaginatedResponse<WalletTransaction>>('/wallet/transactions', { params });
    return response.data;
  },

  /**
   * Add money to wallet
   */
  addMoney: async (data: AddMoneyData): Promise<ApiResponse<WalletTransaction>> => {
    const response = await api.post<ApiResponse<WalletTransaction>>('/wallet/add-money', data);
    return response.data;
  },

  /**
   * Withdraw money from wallet
   */
  withdrawMoney: async (amount: number, bankDetails: any): Promise<ApiResponse<WalletTransaction>> => {
    const response = await api.post<ApiResponse<WalletTransaction>>('/wallet/withdraw', {
      amount,
      bank_details: bankDetails,
    });
    return response.data;
  },
};

// ============================================================
// Vendor Service (for vendor/admin users)
// ============================================================

export const vendorService = {
  /**
   * Get vendor's outlets
   */
  getVendorOutlets: async (params?: OutletQueryParams): Promise<PaginatedResponse<Outlet>> => {
    const response = await api.get<PaginatedResponse<Outlet>>('/vendor/outlets', { params });
    return response.data;
  },

  /**
   * Create new outlet
   */
  createOutlet: async (outletData: Partial<Outlet>): Promise<ApiResponse<Outlet>> => {
    const response = await api.post<ApiResponse<Outlet>>('/vendor/outlets', outletData);
    return response.data;
  },

  /**
   * Update outlet
   */
  updateOutlet: async (outletId: string, outletData: Partial<Outlet>): Promise<ApiResponse<Outlet>> => {
    const response = await api.put<ApiResponse<Outlet>>(`/vendor/outlets/${outletId}`, outletData);
    return response.data;
  },

  /**
   * Delete outlet
   */
  deleteOutlet: async (outletId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/vendor/outlets/${outletId}`);
    return response.data;
  },

  /**
   * Create product for outlet
   */
  createProduct: async (productData: CreateProductData): Promise<ApiResponse<Product>> => {
    const response = await api.post<ApiResponse<Product>>('/vendor/products', productData);
    return response.data;
  },

  /**
   * Update product
   */
  updateProduct: async (productId: string, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await api.put<ApiResponse<Product>>(`/vendor/products/${productId}`, productData);
    return response.data;
  },

  /**
   * Delete product
   */
  deleteProduct: async (productId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/vendor/products/${productId}`);
    return response.data;
  },

  /**
   * Get vendor orders
   */
  getVendorOrders: async (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/vendor/orders', { params });
    return response.data;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    const response = await api.put<ApiResponse<Order>>(`/vendor/orders/${orderId}/status`, { status });
    return response.data;
  },
};

// ============================================================
// Export default api instance
// ============================================================

export default api;

// ============================================================
// FILE: src/lib/utils.ts
// ============================================================

/**
 * Format price to KES currency
 */
export const formatPrice = (price: number): string => {
  return `KES ${price.toLocaleString('en-KE')}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Kenyan format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Generate order ID
 */
export const generateOrderId = (): string => {
  return `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};


