// ============================================================
// FILE: src/lib/api.ts
// Updated to match backend API endpoints and responses
// ============================================================

import axios, { AxiosInstance, AxiosError } from 'axios';
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
  ProductCategory,
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
  NearbyProductsParams,
  NearbyProductsResponse,
  AvailabilityResponse,
  VendorLocation,
} from './types';

// API Base URL from environment variable
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1').replace(/\/$/, '');

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
  const response = await api.post('/auth/register', {
    fullName: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
  });
  
  // Backend returns: { message, token, role, redirect, user }
  const backendData = response.data;
  
  const user: User = {
    id: backendData.user.user_id,
    name: backendData.user.full_name,
    email: backendData.user.email,
    phone: backendData.user.phone_number || '',
    wallet: 0,
  };
  
  return {
    success: true,
    data: {
      token: backendData.token,
      user,
    },
  };
},

  /**
   * Login user
   */
login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post('/auth/login', credentials);
  
  // Backend returns: { message, token, role, redirect, account, roleData }
  // Transform to match AuthResponse format
  const backendData = response.data;
  
  // Build user object from roleData (for 'user' role)
  let user: User | null = null;
  
  if (backendData.roleData && backendData.role === 'user') {
    user = {
      id: backendData.account.account_id,
      name: `${backendData.roleData.first_name || ''} ${backendData.roleData.last_name || ''}`.trim(),
      email: backendData.account.email,
      phone: backendData.roleData.phone_number || backendData.account.phone_number || '',
      wallet: backendData.roleData.wallet_balance || 0,
      address: backendData.roleData.address || undefined,
    };
  }
  
  return {
    success: true,
    data: {
      token: backendData.token,
      user: user as User,
    },
  };
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
// Product Service - UPDATED TO MATCH BACKEND
// ============================================================

export const productService = {
  /**
   * Get all products with filters
   * Backend endpoint: GET /api/products
   */
  getProducts: async (params?: ProductQueryParams, signal?: AbortSignal): Promise<Product[]> => {
    try {
      const response = await api.get<{ products: Product[] }>('/products', {
        params,
        signal,
      });
      
      // Backend returns { products: [...] }
      return response.data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get single product by ID
   * Backend endpoint: GET /api/products/:productId
   */
  getProduct: async (productId: string | number, signal?: AbortSignal): Promise<Product> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await api.get<Product>(`/products/${productId}`, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Get featured products
   * Backend endpoint: GET /api/products/featured
   */
  getFeaturedProducts: async (limit: number = 10, signal?: AbortSignal): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>('/products/featured', {
        params: { limit },
        signal,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  /**
   * Search products
   * Backend endpoint: GET /api/products/search?q=query&category=category
   */
  searchProducts: async (
    query: string,
    category?: string,
    signal?: AbortSignal
  ): Promise<Product[]> => {
    if (!query?.trim()) {
      throw new Error('Search query is required');
    }

    try {
      const response = await api.get<Product[]>('/products/search', {
        params: { q: query, category },
        signal,
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  /**
   * Get product categories
   * Backend endpoint: GET /api/products/categories
   */
  getCategories: async (signal?: AbortSignal): Promise<ProductCategory[]> => {
    try {
      const response = await api.get<ProductCategory[]>('/products/categories', {
        signal,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get nearby products based on location
   * Backend endpoint: GET /api/products/nearby?lat=...&lng=...&radius=...
   */
  getNearbyProducts: async (
    params: NearbyProductsParams,
    signal?: AbortSignal
  ): Promise<NearbyProductsResponse> => {
    const { lat, lng, radius = 50 } = params;

    if (!lat || !lng) {
      throw new Error('Latitude and longitude are required');
    }

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Invalid latitude or longitude values');
    }

    try {
      const response = await api.get<NearbyProductsResponse>('/products/nearby', {
        params: { lat, lng, radius },
        signal,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby products:', error);
      throw error;
    }
  },

  /**
   * Check product availability at nearby locations
   * Backend endpoint: GET /api/products/:productId/availability?lat=...&lng=...
   */
  checkAvailability: async (
    productId: string | number,
    lat?: number,
    lng?: number,
    signal?: AbortSignal
  ): Promise<AvailabilityResponse> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await api.get<AvailabilityResponse>(
        `/products/${productId}/availability`,
        {
          params: { lat, lng },
          signal,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error checking availability for product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Get vendors selling a specific product
   * Backend endpoint: GET /api/products/:productId/vendors
   */
  getProductVendors: async (
    productId: string | number,
    signal?: AbortSignal
  ): Promise<VendorLocation[]> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await api.get<VendorLocation[]>(
        `/products/${productId}/vendors`,
        { signal }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching vendors for product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Get products by multiple IDs (batch fetch)
   * Backend endpoint: GET /api/products/batch?ids=1,2,3
   */
  getProductsByIds: async (
    productIds: (string | number)[],
    signal?: AbortSignal
  ): Promise<Product[]> => {
    if (!productIds?.length) {
      throw new Error('Product IDs are required');
    }

    try {
      const response = await api.get<{ success: boolean; products: Product[] }>(
        '/products/batch',
        {
          params: { ids: productIds.join(',') },
          signal,
        }
      );
      return response.data.products || [];
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      throw error;
    }
  },

  /**
   * Get related/similar products
   * Backend endpoint: GET /api/products/:productId/related?limit=4
   */
  getRelatedProducts: async (
    productId: string | number,
    limit: number = 4,
    signal?: AbortSignal
  ): Promise<Product[]> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await api.get<{ success: boolean; data: Product[] }>(
        `/products/${productId}/related`,
        {
          params: { limit },
          signal,
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching related products for ${productId}:`, error);
      // Return empty array as fallback instead of throwing
      return [];
    }
  },

  /**
   * Get product reviews
   * Backend endpoint: GET /api/products/:productId/reviews
   */
  getProductReviews: async (
    productId: string | number,
    signal?: AbortSignal
  ): Promise<any[]> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await api.get<{ success: boolean; reviews: any[] }>(
        `/products/${productId}/reviews`,
        { signal }
      );
      return response.data.reviews || [];
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      return [];
    }
  },

  /**
   * Add product review
   * Backend endpoint: POST /api/products/:productId/reviews
   */
  addProductReview: async (
    productId: string | number,
    reviewData: { rating: number; comment: string },
    signal?: AbortSignal
  ): Promise<any> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    try {
      const response = await api.post(
        `/products/${productId}/reviews`,
        reviewData,
        { signal }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding review for product ${productId}:`, error);
      throw error;
    }
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
    const response = await api.get<PaginatedResponse<Order>>('/orders/user', { params });
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
