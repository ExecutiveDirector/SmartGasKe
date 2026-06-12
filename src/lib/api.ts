// ============================================================
// FILE: src/lib/api.ts
// Updated to match backend API endpoints and responses
//
// FIX 1: register() was calling POST /auth/register → 404
//         Correct endpoint: POST /auth/register/user
//
// FIX 2: getProfile() was returning response.data (raw axios body)
//         which is { account, profile, role, ... }.
//         AuthContext.refreshUser() then reads response.data again,
//         getting undefined → normalizeUser(null) → user never set.
//         Now wrapped: { success: true, data: response.data } so
//         AuthContext receives the backend body at response.data ✓
//
// FIX 3: updateProfile() had the same double-unwrap issue as getProfile.
//         Wrapped consistently.
//
// FIX 4: outletService.getOutlet() — backend GET /outlets/:outletId
//         returns { outlet: {...} }, not the outlet directly.
//         Now unwrapped and normalized into the Outlet shape.
//
// FIX 5: outletService.getOutletProducts() — backend
//         GET /outlets/:outletId/products returns a flat object
//         { outlet_id, outlet_name, vendor_name, ..., products: [...], product_count },
//         not { data: [...], pagination: {...} }.
//         Now mapped into PaginatedResponse<Product> with each raw
//         product normalized into the full Product shape.
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
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1'
).replace(/\/$/, '');

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ──────────────────────────────────────────────
// Reads token fresh on every request so tokens written just before
// a refreshUser() call (phone OTP flow) are picked up immediately.
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/account/login';
      }
    }

    if (!error.response) {
      return Promise.reject({
        success: false,
        error: 'Network Error',
        message: 'Unable to connect to server. Please check your internet connection.',
      });
    }

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
   * Endpoint: POST /auth/register/user
   * Backend returns: { message, token, role, redirect, user }
   */
  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register/user', {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
    });

    const backendData = response.data;

    const user: User = {
      id: backendData.user.user_id,
      name:
        backendData.user.full_name ||
        `${backendData.user.first_name ?? ''} ${backendData.user.last_name ?? ''}`.trim(),
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
   * Endpoint: POST /auth/login
   * Backend returns: { message, token, role, redirect, account, roleData }
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', credentials);

    const backendData = response.data;

    let user: User | null = null;

    if (backendData.roleData && backendData.role === 'user') {
      user = {
        id: backendData.account.account_id,
        name: `${backendData.roleData.first_name || ''} ${backendData.roleData.last_name || ''}`.trim(),
        email: backendData.account.email,
        phone:
          backendData.roleData.phone_number ||
          backendData.account.phone_number ||
          '',
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
   * Endpoint: GET /auth/profile
   * Backend returns: { account, profile, role, profile_completed, password_set }
   *
   * FIX: Previously returned response.data directly (the raw backend body).
   * AuthContext.refreshUser() then did response.data again → undefined.
   * Now wrapped so AuthContext receives the backend body at response.data.
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/profile');
    // response.data = { account, profile, role, ... }
    // Wrap so callers get: { success, data: { account, profile, role, ... } }
    return { success: true, data: response.data };
  },

  /**
   * Update user profile
   * FIX: Same wrapping fix applied for consistency.
   */
  updateProfile: async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', profileData);
    return { success: true, data: response.data };
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<null>> => {
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
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<null>> => {
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
  getNearbyOutlets: async (
    params: NearbyOutletsParams
  ): Promise<ApiResponse<Outlet[]>> => {
    const response = await api.get<ApiResponse<Outlet[]>>('/outlets/nearby', { params });
    return response.data;
  },

  /**
   * Get single outlet by ID
   * Endpoint: GET /outlets/:outletId
   * Backend (getOutletById) returns: { outlet: { outlet_id, outlet_name, vendor_id,
   *   vendor_name, location: { lat, lng }, address: { line_1, line_2, city, county,
   *   postal_code }, phone, email, is_active, is_open, opening_time, closing_time,
   *   created_at, ... } }
   *
   * FIX: Previously returned response.data as if it were the Outlet directly.
   * Now unwraps `outlet` and normalizes into the frontend Outlet shape.
   */
  getOutlet: async (outletId: string): Promise<ApiResponse<Outlet>> => {
    const response = await api.get<{ outlet: any }>(`/outlets/${outletId}`);
    const o = response.data.outlet;

    if (!o) {
      return { success: false, data: undefined as unknown as Outlet, error: 'Outlet not found' };
    }

    const outlet: Outlet = {
      id: o.outlet_id?.toString() || outletId,
      outlet_id: o.outlet_id,
      name: o.outlet_name || '',
      outlet_name: o.outlet_name,
      vendor: o.vendor_name || '',
      vendor_id: o.vendor_id,
      vendor_name: o.vendor_name,
      rating: o.rating ?? 0,
      reviews: o.reviews ?? 0,
      address: [
        o.address?.line_1,
        o.address?.line_2,
        o.address?.city,
        o.address?.county,
      ]
        .filter(Boolean)
        .join(', '),
      phone: o.phone || '',
      contact_phone: o.phone,
      email: o.email,
      featured: o.featured ?? false,
      latitude: o.location?.lat ?? undefined,
      longitude: o.location?.lng ?? undefined,
      is_active: o.is_active ?? true,
      opening_hours:
        o.opening_time && o.closing_time
          ? `${o.opening_time} - ${o.closing_time}`
          : undefined,
      city: o.address?.city,
      county: o.address?.county,
      created_at: o.created_at,
      isOpen: o.is_open,
    };

    return { success: true, data: outlet };
  },

  getAllOutlets: async (
    params?: OutletQueryParams
  ): Promise<PaginatedResponse<Outlet>> => {
    const response = await api.get<PaginatedResponse<Outlet>>('/outlets', { params });
    return response.data;
  },

  /**
   * Get products for a specific outlet
   * Endpoint: GET /outlets/:outletId/products
   * Backend (getOutletWithProducts) returns a FLAT object:
   *   { outlet_id, outlet_name, vendor_id, vendor_name, location, address, phone,
   *     email, is_open, opening_time, closing_time, products: [...], product_count }
   *
   * Each raw product item is shaped as:
   *   { product_id, product_name, description, price, current_price, image_url,
   *     category, category_id, stock_quantity, unit, is_available }
   *
   * FIX: Previously assumed { data: [...], pagination: {...} }.
   * Now maps the flat response into PaginatedResponse<Product>, normalizing
   * each raw product into the full Product shape required by ProductCard etc.
   */
  getOutletProducts: async (
    outletId: string,
    params?: OutletProductsParams
  ): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<{
      outlet_id: string;
      outlet_name: string;
      vendor_id?: string;
      vendor_name?: string;
      products: any[];
      product_count: number;
    }>(`/outlets/${outletId}/products`, { params });

    const rawProducts = response.data.products || [];
    const total = response.data.product_count ?? rawProducts.length;

    const products: Product[] = rawProducts.map((p) => ({
      id: p.product_id?.toString() || '',
      product_id: p.product_id,
      name: p.product_name || '',
      title: p.product_name || '',
      product_name: p.product_name || '',
      description: p.description || '',

      price: p.current_price ?? p.price ?? 0,
      base_price: p.current_price ?? p.price ?? 0,

      image: p.image_url || 'https://via.placeholder.com/400x400?text=Product',

      is_active: p.is_available ?? true,
      isActive: p.is_available ?? true,
      is_featured: false,
      featured: false,

      stock: p.stock_quantity ?? 0,
      inStock: (p.stock_quantity ?? 0) > 0,
      availability:
        p.is_available && (p.stock_quantity ?? 0) > 0 ? 'Available' : 'Out of Stock',

      unit: p.unit,
      unit_of_measure: p.unit,

      rating: 0,
      reviews: 0,

      category: p.category || '',
      category_id: p.category_id ? Number(p.category_id) : undefined,

      outlet_id: outletId,
      outlet_name: response.data.outlet_name,
      vendor_id: response.data.vendor_id ? Number(response.data.vendor_id) : undefined,
      vendor_name: response.data.vendor_name,
    }));

    return {
      success: true,
      data: products,
      pagination: {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || total,
        total,
        pages: 1, // backend endpoint does not currently paginate
      },
    };
  },

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
  getProducts: async (
    params?: ProductQueryParams,
    signal?: AbortSignal
  ): Promise<Product[]> => {
    const response = await api.get<{ products: Product[] }>('/products', {
      params,
      signal,
    });
    return response.data.products || [];
  },

  getProduct: async (
    productId: string | number,
    signal?: AbortSignal
  ): Promise<Product> => {
    if (!productId) throw new Error('Product ID is required');
    const response = await api.get<Product>(`/products/${productId}`, { signal });
    return response.data;
  },

  getFeaturedProducts: async (
    limit: number = 10,
    signal?: AbortSignal
  ): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/featured', {
      params: { limit },
      signal,
    });
    return response.data;
  },

  searchProducts: async (
    query: string,
    category?: string,
    signal?: AbortSignal
  ): Promise<Product[]> => {
    if (!query?.trim()) throw new Error('Search query is required');
    const response = await api.get<Product[]>('/products/search', {
      params: { q: query, category },
      signal,
    });
    return response.data;
  },

  getCategories: async (signal?: AbortSignal): Promise<ProductCategory[]> => {
    const response = await api.get<ProductCategory[]>('/products/categories', {
      signal,
    });
    return response.data;
  },

  getNearbyProducts: async (
    params: NearbyProductsParams,
    signal?: AbortSignal
  ): Promise<NearbyProductsResponse> => {
    const { lat, lng, radius = 50 } = params;
    if (!lat || !lng) throw new Error('Latitude and longitude are required');
    if (
      isNaN(lat) || isNaN(lng) ||
      lat < -90 || lat > 90 ||
      lng < -180 || lng > 180
    ) {
      throw new Error('Invalid latitude or longitude values');
    }
    const response = await api.get<NearbyProductsResponse>('/products/nearby', {
      params: { lat, lng, radius },
      signal,
    });
    return response.data;
  },

  checkAvailability: async (
    productId: string | number,
    lat?: number,
    lng?: number,
    signal?: AbortSignal
  ): Promise<AvailabilityResponse> => {
    if (!productId) throw new Error('Product ID is required');
    const response = await api.get<AvailabilityResponse>(
      `/products/${productId}/availability`,
      { params: { lat, lng }, signal }
    );
    return response.data;
  },

  getProductVendors: async (
    productId: string | number,
    signal?: AbortSignal
  ): Promise<VendorLocation[]> => {
    if (!productId) throw new Error('Product ID is required');
    const response = await api.get<VendorLocation[]>(
      `/products/${productId}/vendors`,
      { signal }
    );
    return response.data;
  },

  getProductsByIds: async (
    productIds: (string | number)[],
    signal?: AbortSignal
  ): Promise<Product[]> => {
    if (!productIds?.length) throw new Error('Product IDs are required');
    const response = await api.get<{ success: boolean; products: Product[] }>(
      '/products/batch',
      { params: { ids: productIds.join(',') }, signal }
    );
    return response.data.products || [];
  },

  getRelatedProducts: async (
    productId: string | number,
    limit: number = 4,
    signal?: AbortSignal
  ): Promise<Product[]> => {
    if (!productId) throw new Error('Product ID is required');
    try {
      const response = await api.get<{ success: boolean; data: Product[] }>(
        `/products/${productId}/related`,
        { params: { limit }, signal }
      );
      return response.data.data || [];
    } catch {
      return [];
    }
  },

  getProductReviews: async (
    productId: string | number,
    signal?: AbortSignal
  ): Promise<any[]> => {
    if (!productId) throw new Error('Product ID is required');
    try {
      const response = await api.get<{ success: boolean; reviews: any[] }>(
        `/products/${productId}/reviews`,
        { signal }
      );
      return response.data.reviews || [];
    } catch {
      return [];
    }
  },

  addProductReview: async (
    productId: string | number,
    reviewData: { rating: number; comment: string },
    signal?: AbortSignal
  ): Promise<any> => {
    if (!productId) throw new Error('Product ID is required');
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    const response = await api.post(
      `/products/${productId}/reviews`,
      reviewData,
      { signal }
    );
    return response.data;
  },
};

// ============================================================
// Order Service
// ============================================================
export const orderService = {
  createOrder: async (orderData: CreateOrderData): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>('/orders/draft', orderData);
    return response.data;
  },

  getOrders: async (
    params?: OrderQueryParams
  ): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders/user', {
      params,
    });
    return response.data;
  },

  getOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
  },

  cancelOrder: async (
    orderId: string,
    reason?: string
  ): Promise<ApiResponse<Order>> => {
    const response = await api.put<ApiResponse<Order>>(
      `/orders/${orderId}/cancel`,
      { reason }
    );
    return response.data;
  },

  trackOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}/track`);
    return response.data;
  },

  rateOrder: async (
    orderId: string,
    rating: number,
    review?: string
  ): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(
      `/orders/${orderId}/rate`,
      { rating, review }
    );
    return response.data;
  },
};

// ============================================================
// Wallet Service
// ============================================================
export const walletService = {
  getBalance: async (): Promise<ApiResponse<{ balance: number }>> => {
    const response = await api.get<ApiResponse<{ balance: number }>>(
      '/wallet/balance'
    );
    return response.data;
  },

  getTransactions: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<WalletTransaction>> => {
    const response = await api.get<PaginatedResponse<WalletTransaction>>(
      '/wallet/transactions',
      { params }
    );
    return response.data;
  },

  addMoney: async (
    data: AddMoneyData
  ): Promise<ApiResponse<WalletTransaction>> => {
    const response = await api.post<ApiResponse<WalletTransaction>>(
      '/wallet/add-money',
      data
    );
    return response.data;
  },

  withdrawMoney: async (
    amount: number,
    bankDetails: any
  ): Promise<ApiResponse<WalletTransaction>> => {
    const response = await api.post<ApiResponse<WalletTransaction>>(
      '/wallet/withdraw',
      { amount, bank_details: bankDetails }
    );
    return response.data;
  },
};

// ============================================================
// Vendor Service
// ============================================================
export const vendorService = {
  getVendorOutlets: async (
    params?: OutletQueryParams
  ): Promise<PaginatedResponse<Outlet>> => {
    const response = await api.get<PaginatedResponse<Outlet>>('/vendor/outlets', {
      params,
    });
    return response.data;
  },

  createOutlet: async (
    outletData: Partial<Outlet>
  ): Promise<ApiResponse<Outlet>> => {
    const response = await api.post<ApiResponse<Outlet>>(
      '/vendor/outlets',
      outletData
    );
    return response.data;
  },

  updateOutlet: async (
    outletId: string,
    outletData: Partial<Outlet>
  ): Promise<ApiResponse<Outlet>> => {
    const response = await api.put<ApiResponse<Outlet>>(
      `/vendor/outlets/${outletId}`,
      outletData
    );
    return response.data;
  },

  deleteOutlet: async (outletId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(
      `/vendor/outlets/${outletId}`
    );
    return response.data;
  },

  createProduct: async (
    productData: CreateProductData
  ): Promise<ApiResponse<Product>> => {
    const response = await api.post<ApiResponse<Product>>(
      '/vendor/products',
      productData
    );
    return response.data;
  },

  updateProduct: async (
    productId: string,
    productData: Partial<Product>
  ): Promise<ApiResponse<Product>> => {
    const response = await api.put<ApiResponse<Product>>(
      `/vendor/products/${productId}`,
      productData
    );
    return response.data;
  },

  deleteProduct: async (productId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(
      `/vendor/products/${productId}`
    );
    return response.data;
  },

  getVendorOrders: async (
    params?: OrderQueryParams
  ): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/vendor/orders', {
      params,
    });
    return response.data;
  },

  updateOrderStatus: async (
    orderId: string,
    status: string
  ): Promise<ApiResponse<Order>> => {
    const response = await api.put<ApiResponse<Order>>(
      `/vendor/orders/${orderId}/status`,
      { status }
    );
    return response.data;
  },
};

// ============================================================
// Export default api instance
// ============================================================
export default api;