// ============================================================
// FILE: src/lib/types.ts
// Comprehensive Type Definitions for AquaGas Application
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
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

// src/lib/types.ts

export interface AuthResponse {
  token: string;
  role?: string;
  admin_role?: string | null;
  redirect?: string;
  message?: string;
  
  // Login response shape: { account, roleData }
  account?: {
    account_id: string | number;
    email: string;
    role: string;
    user_id?: string | number;
    vendor_id?: string | number;
    rider_id?: string | number;
    admin_id?: string | number;
    admin_role?: string;
  };
  roleData?: Record<string, any> | null;
  
  // Register response shape: { user }
  user?: User & {
    user_id?: string | number;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    phone_number?: string;
    referral_code?: string;
  };
}

// Product Category Types
export interface ProductCategory {
  category_id: number;
  category_name: string;
  description?: string;
  icon_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

// Product Types (UPDATED - Fixed to resolve build errors)
export interface Product {
  // Primary identifiers
  id: string;
  product_id: number;
  
  // Product names (both formats for compatibility)
  name: string;
  title: string;
  product_name: string;
  product_code?: string;
  
  // Product details
  brand?: string;
  description?: string;
  size?: string; // Frontend format
  size_specification?: string; // Backend format
  sizeSpecification?: string; // Alternative format
  unit?: string; // Frontend format
  unit_of_measure?: string; // Backend format
  
  // Pricing
  price: number;
  base_price: number;
  min_price?: number;
  max_price?: number;
  
  // Physical properties
  weight_kg?: number;
  
  // Images (multiple formats for compatibility)
  image: string; // Primary display image
  images?: string[]; // Array of image URLs
  product_images?: any; // Raw backend format (JSON string or array)
  
  // Technical specifications
  specifications?: any;
  safety_certifications?: any;
  storage_requirements?: any;
  
  // Status flags (CRITICAL - Required by ProductCard)
  is_active: boolean;
  isActive: boolean;
  is_featured: boolean;
  featured: boolean; // Frontend alias
  
  // Inventory
  stock: number;
  inStock: boolean; // Computed from stock
  availability?: string;
  
  // Ratings & Reviews
  rating: number;
  reviews: number;
  
  // Category
  category: string | ProductCategory;
  category_id?: number;
  
  // Vendor/Outlet information
  outlet_id?: string;
  outlet_name?: string;
  vendor_name?: string;
  vendor_id?: number;
  
  // Availability locations
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

// Backend Product Types (for API responses)
export interface BackendProduct {
  product_id: number;
  product_name: string;
  product_code: string;
  brand: string;
  base_price: number;
  description: string;
  product_images: string; // JSON string
  category_name: string;
  stock: number;
  price: number;
  is_available: boolean;
  outlet_name: string;
  vendor_name: string;
  size_specification: string;
  unit_of_measure: string;
  is_featured?: boolean;
  category_id?: number;
}

export interface BackendCategory {
  category_id: number;
  category_name: string;
  description: string;
}

// Vendor & Outlet Types
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

export interface BackendVendor {
  vendor_id: number;
  business_name: string;
  business_email: string;
  business_phone: string;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  total_reviews: number;
  vendor_outlets?: BackendOutlet[];
}

export interface BackendOutlet {
  outlet_id: number;
  outlet_name: string;
  outlet_code: string;
  latitude: number;
  longitude: number;
  address_line_1: string;
  city: string;
  county: string;
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

// Cart Types (UPDATED - Fixed for ProductCard compatibility)
export interface CartItem {
  product: Product; // Full product object
  outlet: Outlet; // Associated outlet
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
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

// Filter Types (for shop page)
export interface FilterOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  featured?: boolean;
  brand?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'featured' | 'rating';
}

// Product with Outlet (extended type for shop pages)
export interface ProductWithOutlet extends Product {
  // This type is already compatible since Product now includes all required fields
}
