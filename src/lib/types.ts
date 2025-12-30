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
