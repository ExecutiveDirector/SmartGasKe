// ============================================================
// FILE: src/lib/utils/productTransform.ts
// Product Transformation Utilities (UPDATED)
// ============================================================

import { Product, BackendProduct, Outlet, BackendVendor, BackendOutlet } from '@/lib/types';

/**
 * Parse product images from JSON string or return existing URL
 */
export const parseProductImage = (images: string | string[] | any): string => {
  // If already a string URL, return it
  if (typeof images === 'string' && !images.startsWith('[')) {
    return images || '/images/placeholder-product.jpg';
  }
  
  // If it's an array, return first item
  if (Array.isArray(images)) {
    return images[0] || '/images/placeholder-product.jpg';
  }
  
  // Try to parse JSON
  try {
    const imageArray = JSON.parse(images);
    if (Array.isArray(imageArray)) {
      return imageArray[0] || '/images/placeholder-product.jpg';
    }
    return imageArray || '/images/placeholder-product.jpg';
  } catch {
    return '/images/placeholder-product.jpg';
  }
};

/**
 * Transform backend product to frontend Product type
 * Ensures ALL required fields are present for ProductCard compatibility
 */
export const transformBackendProduct = (backendProduct: BackendProduct): Product => {
  const image = parseProductImage(backendProduct.product_images);
  const isAvailable = backendProduct.is_available && backendProduct.stock > 0;
  
  return {
    // Primary identifiers (REQUIRED)
    id: backendProduct.product_id.toString(),
    product_id: backendProduct.product_id,
    
    // Product names (all variants for compatibility)
    name: backendProduct.product_name,
    title: backendProduct.product_name,
    product_name: backendProduct.product_name,
    product_code: backendProduct.product_code,
    
    // Product details
    brand: backendProduct.brand || '',
    description: backendProduct.description || '',
    size: backendProduct.size_specification || '',
    size_specification: backendProduct.size_specification,
    sizeSpecification: backendProduct.size_specification,
    unit: backendProduct.unit_of_measure || '',
    unit_of_measure: backendProduct.unit_of_measure,
    
    // Pricing (REQUIRED)
    price: backendProduct.price || backendProduct.base_price,
    base_price: backendProduct.base_price,
    
    // Images
    image: image,
    images: [image],
    product_images: backendProduct.product_images,
    
    // Status flags (CRITICAL - REQUIRED by ProductCard)
    is_active: backendProduct.is_available,
    isActive: backendProduct.is_available,
    is_featured: backendProduct.is_featured || false,
    featured: backendProduct.is_featured || false,
    
    // Inventory (REQUIRED)
    stock: backendProduct.stock,
    inStock: isAvailable,
    
    // Ratings & Reviews (defaults)
    rating: 4.5,
    reviews: 0,
    
    // Category
    category: backendProduct.category_name || 'Other',
    category_id: backendProduct.category_id,
    
    // Outlet information
    outlet_name: backendProduct.outlet_name,
    vendor_name: backendProduct.vendor_name,
  };
};

/**
 * Transform backend outlet to frontend Outlet type
 */
export const transformBackendOutlet = (
  outlet: BackendOutlet,
  vendor: BackendVendor
): Outlet => {
  return {
    id: outlet.outlet_id.toString(),
    outlet_id: outlet.outlet_id,
    name: outlet.outlet_name,
    outlet_name: outlet.outlet_name,
    vendor: vendor.business_name,
    vendor_id: vendor.vendor_id,
    vendor_name: vendor.business_name,
    address: `${outlet.address_line_1}, ${outlet.city}`,
    city: outlet.city,
    county: outlet.county,
    distance: 0,
    distance_km: 0,
    rating: vendor.rating || 0,
    reviews: vendor.total_reviews || 0,
    phone: vendor.business_phone,
    contact_phone: vendor.business_phone,
    email: vendor.business_email,
    featured: vendor.is_featured,
    is_active: vendor.is_active,
    latitude: outlet.latitude,
    longitude: outlet.longitude,
  };
};

/**
 * Create a fallback outlet when product outlet is not found
 * Ensures cart functionality works even without outlet data
 */
export const createFallbackOutlet = (product: Product): Outlet => {
  return {
    id: product.outlet_id || 'unknown',
    outlet_id: product.outlet_id ? parseInt(product.outlet_id) : 0,
    name: product.outlet_name || 'Product Available',
    outlet_name: product.outlet_name || 'Product Available',
    vendor: product.vendor_name || 'AquaGas',
    vendor_name: product.vendor_name || 'AquaGas',
    rating: 4.0,
    reviews: 0,
    address: 'Multiple locations',
    phone: '',
    featured: false,
    is_active: true,
  };
};

/**
 * Find outlet for a product from outlets array
 */
export const getOutletForProduct = (
  product: Product,
  outlets: Outlet[]
): Outlet | null => {
  if (!outlets || outlets.length === 0) {
    return null;
  }
  
  // Try to find by outlet_name
  if (product.outlet_name) {
    const found = outlets.find((o) => 
      o.name === product.outlet_name || 
      o.outlet_name === product.outlet_name
    );
    if (found) return found;
  }
  
  // Try to find by outlet_id
  if (product.outlet_id) {
    const found = outlets.find((o) => 
      o.id === product.outlet_id ||
      o.outlet_id?.toString() === product.outlet_id
    );
    if (found) return found;
  }
  
  // Return first active outlet as fallback
  return outlets.find(o => o.is_active) || outlets[0] || null;
};

/**
 * Filter products by search term
 * Searches across multiple fields
 */
export const filterProductsBySearch = (
  products: Product[],
  searchTerm: string
): Product[] => {
  if (!searchTerm || searchTerm.trim() === '') {
    return products;
  }
  
  const search = searchTerm.toLowerCase().trim();
  
  return products.filter((p) => {
    // Search in product name
    if (p.name && p.name.toLowerCase().includes(search)) return true;
    if (p.title && p.title.toLowerCase().includes(search)) return true;
    if (p.product_name && p.product_name.toLowerCase().includes(search)) return true;
    
    // Search in description
    if (p.description && p.description.toLowerCase().includes(search)) return true;
    
    // Search in brand
    if (p.brand && p.brand.toLowerCase().includes(search)) return true;
    
    // Search in vendor name
    if (p.vendor_name && p.vendor_name.toLowerCase().includes(search)) return true;
    
    // Search in category
    if (typeof p.category === 'string' && p.category.toLowerCase().includes(search)) return true;
    
    // Search in product code
    if (p.product_code && p.product_code.toLowerCase().includes(search)) return true;
    
    return false;
  });
};

/**
 * Filter products by category
 */
export const filterProductsByCategory = (
  products: Product[],
  category: string
): Product[] => {
  if (!category || category === 'All' || category.trim() === '') {
    return products;
  }
  
  return products.filter((p) => {
    if (typeof p.category === 'string') {
      return p.category === category;
    }
    return false;
  });
};

/**
 * Filter products by price range
 */
export const filterProductsByPriceRange = (
  products: Product[],
  minPrice?: number,
  maxPrice?: number
): Product[] => {
  return products.filter((p) => {
    if (minPrice !== undefined && p.price < minPrice) return false;
    if (maxPrice !== undefined && p.price > maxPrice) return false;
    return true;
  });
};

/**
 * Filter products by stock availability
 */
export const filterProductsByStock = (
  products: Product[],
  inStockOnly: boolean
): Product[] => {
  if (!inStockOnly) return products;
  return products.filter((p) => p.inStock && p.stock > 0);
};

/**
 * Sort products by various criteria
 */
export const sortProducts = (
  products: Product[],
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'featured' | 'rating'
): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
      
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
      
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
    case 'featured':
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
    default:
      return sorted;
  }
};

/**
 * Paginate products array
 */
export const paginateProducts = (
  products: Product[],
  page: number,
  itemsPerPage: number
): { paginatedProducts: Product[]; totalPages: number; startIndex: number; endIndex: number } => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  
  return { 
    paginatedProducts, 
    totalPages,
    startIndex,
    endIndex: Math.min(endIndex, products.length)
  };
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
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Sort outlets by distance from user location
 */
export const sortOutletsByDistance = (
  outlets: Outlet[],
  userLat: number,
  userLon: number
): Outlet[] => {
  return outlets.map(outlet => ({
    ...outlet,
    distance: outlet.latitude && outlet.longitude 
      ? calculateDistance(userLat, userLon, outlet.latitude, outlet.longitude)
      : 999,
    distance_km: outlet.latitude && outlet.longitude
      ? calculateDistance(userLat, userLon, outlet.latitude, outlet.longitude)
      : 999,
  })).sort((a, b) => (a.distance || 999) - (b.distance || 999));
};

/**
 * Format price in KES currency
 */
export const formatPrice = (price: number): string => {
  return `KES ${price.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Get product display name (handles multiple name formats)
 */
export const getProductDisplayName = (product: Product): string => {
  return product.name || product.title || product.product_name || 'Unnamed Product';
};

/**
 * Check if product is in stock
 */
export const isProductInStock = (product: Product): boolean => {
  return product.inStock && product.stock > 0 && product.is_active;
};

/**
 * Get stock status message
 */
export const getStockStatusMessage = (product: Product): string => {
  if (!product.is_active) return 'Not available';
  if (product.stock === 0) return 'Out of stock';
  if (product.stock <= 5) return `Only ${product.stock} left`;
  if (product.stock <= 10) return `${product.stock} available`;
  return 'In stock';
};

/**
 * Extract unique categories from products
 */
export const extractCategories = (products: Product[]): string[] => {
  const categorySet = new Set<string>();
  
  products.forEach(product => {
    if (typeof product.category === 'string' && product.category) {
      categorySet.add(product.category);
    }
  });
  
  return ['All', ...Array.from(categorySet).sort()];
};

/**
 * Extract unique brands from products
 */
export const extractBrands = (products: Product[]): string[] => {
  const brandSet = new Set<string>();
  
  products.forEach(product => {
    if (product.brand && product.brand.trim()) {
      brandSet.add(product.brand);
    }
  });
  
  return Array.from(brandSet).sort();
};
