
// ============================================================
// FILE: src/lib/services/productService.ts
// Product Service - Wrapper around product API calls
// ============================================================

import { productService as productApi } from '../api';
import { ProductQueryParams } from '../types';

class ProductService {
  /**
   * Get all products with optional filters
   */
  async getProducts(params?: ProductQueryParams) {
    const response = await productApi.getProducts(params);
    return response;
  }

  /**
   * Get single product by ID
   */
  async getProduct(productId: string) {
    const response = await productApi.getProduct(productId);
    return response;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit?: number) {
    const response = await productApi.getFeaturedProducts(limit);
    return response;
  }

  /**
   * Search products by query
   */
  async searchProducts(query: string) {
    const response = await productApi.searchProducts(query);
    return response;
  }

  /**
   * Get all product categories
   */
  async getCategories() {
    const response = await productApi.getCategories();
    return response;
  }

  /**
   * Filter products by category
   */
  async getProductsByCategory(category: string, params?: ProductQueryParams) {
    const response = await productApi.getProducts({
      ...params,
      category,
    });
    return response;
  }

  /**
   * Get products in stock only
   */
  async getInStockProducts(params?: ProductQueryParams) {
    const response = await productApi.getProducts({
      ...params,
      in_stock: true,
    });
    return response;
  }

  /**
   * Get products by price range
   */
  async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    params?: ProductQueryParams
  ) {
    const response = await productApi.getProducts({
      ...params,
      min_price: minPrice,
      max_price: maxPrice,
    });
    return response;
  }
}

export default new ProductService();

