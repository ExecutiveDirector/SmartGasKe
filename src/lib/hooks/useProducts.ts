// ============================================================
// FILE: src/lib/hooks/useProducts.ts
// Custom hook for fetching and managing products
// ============================================================

import { useState, useEffect } from 'react';
import { productService } from '../api';
import { Product, ProductQueryParams } from '../types';

interface UseProductsOptions {
  autoFetch?: boolean;
  params?: ProductQueryParams;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  refetch: (params?: ProductQueryParams) => Promise<void>;
  setPage: (page: number) => void;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const { autoFetch = true, params: initialParams } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialParams?.page || 1);
  const [params, setParams] = useState<ProductQueryParams | undefined>(initialParams);

  const fetchProducts = async (fetchParams?: ProductQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = fetchParams || params || {};
      const response = await productService.getProducts(queryParams);

      // Use response directly, no `.data`
      setProducts(Array.isArray(response) ? response : []);
      setTotalPages(1); // if your API doesn't provide pagination
      setCurrentPage(queryParams.page || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (newParams?: ProductQueryParams) => {
    if (newParams) setParams(newParams);
    await fetchProducts(newParams || params);
  };

  const setPage = (page: number) => {
    setCurrentPage(page);
    refetch({ ...params, page });
  };

  useEffect(() => {
    if (autoFetch) fetchProducts(params);
  }, [autoFetch]);

  return {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    refetch,
    setPage,
  };
};

// -----------------------------
// Hook for fetching a single product
// -----------------------------
interface UseProductOptions {
  productId: string | null;
  autoFetch?: boolean;
}

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProduct = (options: UseProductOptions): UseProductReturn => {
  const { productId, autoFetch = true } = options;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await productService.getProduct(productId);
      setProduct(response ?? null); // no `.data`
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      console.error('Error fetching product:', err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && productId) fetchProduct();
  }, [productId, autoFetch]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};
