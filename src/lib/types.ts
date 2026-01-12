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

// Product Types (Updated to match backend)
export interface ProductCategory {
  category_id: number;
  category_name: string;
  description?: string;
  icon_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface Product {
  id: string;
  product_id: number;
  title: string;
  product_name: string;
  product_code?: string;
  brand?: string;
  description?: string;
  size_specification?: string;
  sizeSpecification?: string;
  unit_of_measure?: string;
  price: number;
  base_price: number;
  min_price?: number;
  max_price?: number;
  weight_kg?: number;
  image: string;
  images?: string[];
  product_images?: any;
  specifications?: any;
  safety_certifications?: any;
  storage_requirements?: any;
  is_active: boolean;
  isActive: boolean;
  is_featured: boolean;
  stock?: number;
  availability?: string;
  rating?: number;
  category?: ProductCategory;
  available_at?: VendorLocation[];
}

export interface ProductQueryParams {
  category?: string;
  brand?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  in_stock?: boolean;
  min_price?: number;
  minPrice?: number;
  max_price?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
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

// Vendor & Outlet Types (Updated to match backend)
export interface VendorLocation {
  outlet_id: number;
  outlet_name: string;
  vendor_name: string;
  vendor_id?: number;
  vendor_rating: number;
  price: number;
  stock: number;
  latitude: number;
  longitude: number;
  contact_phone?: string;
  address?: string;
  city?: string;
  county?: string;
  distance_km?: number;
}

export interface VendorOutlet {
  outlet_id: number;
  outlet_name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  city: string;
  county: string;
  contact_phone: string;
  distance_km: number;
  products: Product[];
}

export interface Vendor {
  vendor_id: number;
  name: string;
  business_name?: string;
  rating: number;
  outlets: VendorOutlet[];
  is_active?: boolean;
}

export interface Outlet {
  id: string;
  outlet_id?: number;
  name: string;
  outlet_name?: string;
  vendor: string;
  vendor_id?: string | number;
  vendor_name?: string;
  distance?: number;
  distance_km?: number;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  contact_phone?: string;
  email?: string;
  featured: boolean;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  opening_hours?: string;
  city?: string;
  county?: string;
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
  lat?: number;
  lng?: number;
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

// Nearby Products Response (matches backend structure)
export interface NearbyProductsParams {
  lat: number;
  lng: number;
  radius?: number;
}

export interface NearbyProductsResponse {
  success: boolean;
  count: number;
  total_outlets: number;
  total_products: number;
  radius_km: number;
  user_location: {
    latitude: number;
    longitude: number;
  };
  vendors: Vendor[];
  message?: string;
}

export interface AvailabilityResponse {
  available: boolean;
  total_stock: number;
  locations: VendorLocation[];
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

// API Response Types (Updated to match backend)
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  products?: T; // Backend returns products array in some endpoints
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success?: boolean;
  data?: T[];
  products?: T[]; // Backend returns products array
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    totalPages?: number;
  };
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  status?: number;
  }
