// ============================================================
// FILE: src/lib/services/productService.ts
// Product Service - Enhanced wrapper around product API calls
// Updated to match backend API structure
// ============================================================

import { productService as productApi } from '../api';
import { 
  ProductQueryParams, 
  Product, 
  ProductCategory,
  NearbyProductsParams,
  NearbyProductsResponse,
  AvailabilityResponse,
  VendorLocation
} from '../types';

class ProductService {
  /**
   * Get all products with optional filters
   * Maps to: GET /api/products
   */
  async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    try {
      const response = await productApi.getProducts(params);
      return response;
    } catch (error) {
      console.error('ProductService: Error fetching products', error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   * Maps to: GET /api/products/:productId
   */
  async getProduct(productId: string | number): Promise<Product> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await productApi.getProduct(productId);
      return response;
    } catch (error) {
      console.error(`ProductService: Error fetching product ${productId}`, error);
      throw error;
    }
  }

  /**
   * Get featured products
   * Maps to: GET /api/products/featured
   */
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    try {
      const response = await productApi.getFeaturedProducts(limit);
      return response;
    } catch (error) {
      console.error('ProductService: Error fetching featured products', error);
      throw error;
    }
  }

  /**
   * Search products by query
   * Maps to: GET /api/products/search?q=...&category=...
   */
  async searchProducts(query: string, category?: string): Promise<Product[]> {
    if (!query?.trim()) {
      throw new Error('Search query is required');
    }

    try {
      const response = await productApi.searchProducts(query, category);
      return response;
    } catch (error) {
      console.error('ProductService: Error searching products', error);
      throw error;
    }
  }

  /**
   * Get all product categories
   * Maps to: GET /api/products/categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    try {
      const response = await productApi.getCategories();
      return response;
    } catch (error) {
      console.error('ProductService: Error fetching categories', error);
      throw error;
    }
  }

  /**
   * Filter products by category
   * Maps to: GET /api/products?category=...
   */
  async getProductsByCategory(
    category: string,
    params?: Omit<ProductQueryParams, 'category'>
  ): Promise<Product[]> {
    if (!category?.trim()) {
      throw new Error('Category is required');
    }

    try {
      const response = await productApi.getProducts({
        ...params,
        category,
      });
      return response;
    } catch (error) {
      console.error(`ProductService: Error fetching products for category ${category}`, error);
      throw error;
    }
  }

  /**
   * Get products in stock only
   * Maps to: GET /api/products?in_stock=true
   */
  async getInStockProducts(params?: ProductQueryParams): Promise<Product[]> {
    try {
      const response = await productApi.getProducts({
        ...params,
        in_stock: true,
      });
      return response;
    } catch (error) {
      console.error('ProductService: Error fetching in-stock products', error);
      throw error;
    }
  }

  /**
   * Get products by price range
   * Maps to: GET /api/products?min_price=...&max_price=...
   */
  async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    params?: ProductQueryParams
  ): Promise<Product[]> {
    if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
      throw new Error('Invalid price range');
    }

    try {
      const response = await productApi.getProducts({
        ...params,
        min_price: minPrice,
        max_price: maxPrice,
      });
      return response;
    } catch (error) {
      console.error('ProductService: Error fetching products by price range', error);
      throw error;
    }
  }

  /**
   * Get products by brand
   * Maps to: GET /api/products?brand=...
   */
  async getProductsByBrand(
    brand: string,
    params?: Omit<ProductQueryParams, 'brand'>
  ): Promise<Product[]> {
    if (!brand?.trim()) {
      throw new Error('Brand is required');
    }

    try {
      const response = await productApi.getProducts({
        ...params,
        brand,
      });
      return response;
    } catch (error) {
      console.error(`ProductService: Error fetching products for brand ${brand}`, error);
      throw error;
    }
  }

  /**
   * Get nearby products based on user location
   * Maps to: GET /api/products/nearby?lat=...&lng=...&radius=...
   */
  async getNearbyProducts(params: NearbyProductsParams): Promise<NearbyProductsResponse> {
    const { lat, lng, radius = 50 } = params;

    if (!lat || !lng) {
      throw new Error('Latitude and longitude are required');
    }

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Invalid latitude or longitude values');
    }

    try {
      const response = await productApi.getNearbyProducts({ lat, lng, radius });
      return response;
    } catch (error) {
      console.error('ProductService: Error fetching nearby products', error);
      throw error;
    }
  }

  /**
   * Check product availability at nearby locations
   * Maps to: GET /api/products/:productId/availability?lat=...&lng=...
   */
  async checkAvailability(
    productId: string | number,
    lat?: number,
    lng?: number
  ): Promise<AvailabilityResponse> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await productApi.checkAvailability(productId, lat, lng);
      return response;
    } catch (error) {
      console.error(`ProductService: Error checking availability for product ${productId}`, error);
      throw error;
    }
  }

  /**
   * Get vendors selling a specific product
   * Maps to: GET /api/products/:productId/vendors
   */
  async getProductVendors(productId: string | number): Promise<VendorLocation[]> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await productApi.getProductVendors(productId);
      return response;
    } catch (error) {
      console.error(`ProductService: Error fetching vendors for product ${productId}`, error);
      throw error;
    }
  }

  /**
   * Get multiple products by IDs (batch fetch)
   * Maps to: GET /api/products/batch?ids=1,2,3
   */
  async getProductsByIds(productIds: (string | number)[]): Promise<Product[]> {
    if (!productIds?.length) {
      throw new Error('Product IDs are required');
    }

    try {
      const response = await productApi.getProductsByIds(productIds);
      return response;
    } catch (error) {
      console.error('ProductService: Error fetching products by IDs', error);
      throw error;
    }
  }

  /**
   * Get related/similar products
   * Maps to: GET /api/products/:productId/related?limit=...
   */
  async getRelatedProducts(productId: string | number, limit: number = 4): Promise<Product[]> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await productApi.getRelatedProducts(productId, limit);
      return response;
    } catch (error) {
      console.error(`ProductService: Error fetching related products for ${productId}`, error);
      // Return empty array as fallback
      return [];
    }
  }

  /**
   * Get product reviews
   * Maps to: GET /api/products/:productId/reviews
   */
  async getProductReviews(productId: string | number): Promise<any[]> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await productApi.getProductReviews(productId);
      return response;
    } catch (error) {
      console.error(`ProductService: Error fetching reviews for product ${productId}`, error);
      return [];
    }
  }

  /**
   * Add product review
   * Maps to: POST /api/products/:productId/reviews
   */
  async addProductReview(
    productId: string | number,
    rating: number,
    comment: string
  ): Promise<any> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    if (!rating || rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (!comment?.trim() || comment.trim().length < 10) {
      throw new Error('Comment must be at least 10 characters');
    }

    try {
      const response = await productApi.addProductReview(productId, { rating, comment });
      return response;
    } catch (error) {
      console.error(`ProductService: Error adding review for product ${productId}`, error);
      throw error;
    }
  }

  // ============================================================
  // Helper Methods
  // ============================================================

  /**
   * Helper: Get category name from product.category (string or object)
   */
  private getCategoryName(category: string | ProductCategory | undefined): string | undefined {
    if (!category) return undefined;
    if (typeof category === 'string') return category;
    return category.category_name;
  }

  /**
   * Filter products by multiple criteria (client-side)
   */
  filterProducts(
    products: Product[],
    filters: {
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      featured?: boolean;
    }
  ): Product[] {
    return products.filter((product) => {
      if (filters.category) {
        const categoryName = this.getCategoryName(product.category);
        if (categoryName !== filters.category) {
          return false;
        }
      }

      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }

      if (filters.inStock && (product.stock ?? 0) === 0) {
        return false;
      }

      if (filters.featured !== undefined && product.is_featured !== filters.featured) {
        return false;
      }

      return true;
    });
  }

  /**
   * Sort products by various criteria (client-side)
   */
  sortProducts(
    products: Product[],
    sortBy: 'price' | 'name' | 'rating' | 'newest',
    order: 'asc' | 'desc' = 'asc'
  ): Product[] {
    const sorted = [...products];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          const aName = a.title || a.name || a.product_name || '';
          const bName = b.title || b.name || b.product_name || '';
          comparison = aName.localeCompare(bName);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'newest':
          comparison = a.product_id - b.product_id;
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * Group products by category (client-side)
   */
  groupByCategory(products: Product[]): Record<string, Product[]> {
    return products.reduce((acc, product) => {
      const categoryName = this.getCategoryName(product.category) || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }

  /**
   * Check if product is in stock
   */
  isInStock(product: Product): boolean {
    return product.is_active && (product.stock ?? 0) > 0;
  }

  /**
   * Get availability status text
   */
  getAvailabilityStatus(product: Product): string {
    if (!product.is_active) return 'Unavailable';
    if ((product.stock ?? 0) === 0) return 'Out of Stock';
    if ((product.stock ?? 0) < 10) return 'Low Stock';
    return 'Available';
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency: string = 'KES'): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
    }).format(price);
  }

  /**
   * Extract first image from product
   */
  getProductImage(product: Product): string {
    return product.image || 'https://via.placeholder.com/400x400?text=Product';
  }

  /**
   * Get all product images
   */
  getProductImages(product: Product): string[] {
    if (product.images && Array.isArray(product.images)) {
      return product.images;
    }
    return [this.getProductImage(product)];
  }
}

// Export singleton instance
export default new ProductService();
