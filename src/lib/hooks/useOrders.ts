// ============================================================
// FILE: src/lib/hooks/useOrders.ts
// Custom hook for fetching and managing orders
// ============================================================

import { useState, useEffect } from 'react';
import { orderService } from '../api';
import { Order, OrderQueryParams, OrderStatus } from '../types';

interface UseOrdersOptions {
  autoFetch?: boolean;
  params?: OrderQueryParams;
}

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  refetch: (params?: OrderQueryParams) => Promise<void>;
  setPage: (page: number) => void;
  filterByStatus: (status: OrderStatus | 'all') => void;
}

export const useOrders = (options: UseOrdersOptions = {}): UseOrdersReturn => {
  const { autoFetch = true, params: initialParams } = options;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialParams?.page || 1);
  const [params, setParams] = useState<OrderQueryParams | undefined>(initialParams);

  const fetchOrders = async (fetchParams?: OrderQueryParams) => {
  try {
    setLoading(true);
    setError(null);

    const queryParams = fetchParams || params || {};
    const response = await orderService.getOrders(queryParams);

    // Provide a fallback empty array if response.data is undefined
    setOrders(response.data ?? []);
    setTotalPages(response.pagination?.pages ?? 1);
    setCurrentPage(response.pagination?.page ?? 1);
  } catch (err: any) {
    setError(err.message || 'Failed to fetch orders');
    console.error('Error fetching orders:', err);
  } finally {
    setLoading(false);
  }
};

  const refetch = async (newParams?: OrderQueryParams) => {
    if (newParams) {
      setParams(newParams);
    }
    await fetchOrders(newParams || params);
  };

  const setPage = (page: number) => {
    setCurrentPage(page);
    refetch({ ...params, page });
  };

  const filterByStatus = (status: OrderStatus | 'all') => {
    const newParams = { ...params };
    if (status === 'all') {
      delete newParams.status;
    } else {
      newParams.status = status;
    }
    setParams(newParams);
    refetch(newParams);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchOrders(params);
    }
  }, [autoFetch]);

  return {
    orders,
    loading,
    error,
    totalPages,
    currentPage,
    refetch,
    setPage,
    filterByStatus,
  };
};

// Hook for fetching a single order
interface UseOrderOptions {
  orderId: string | null;
  autoFetch?: boolean;
}

interface UseOrderReturn {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  cancelOrder: (reason?: string) => Promise<void>;
  trackOrder: () => Promise<void>;
}

export const useOrder = (options: UseOrderOptions): UseOrderReturn => {
  const { orderId, autoFetch = true } = options;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getOrder(orderId);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (reason?: string) => {
    if (!orderId) return;

    try {
      const response = await orderService.cancelOrder(orderId, reason);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
      console.error('Error cancelling order:', err);
      throw err;
    }
  };

  const trackOrder = async () => {
    if (!orderId) return;

    try {
      const response = await orderService.trackOrder(orderId);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to track order');
      console.error('Error tracking order:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && orderId) {
      fetchOrder();
    }
  }, [orderId, autoFetch]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
    cancelOrder,
    trackOrder,
  };
};

// Hook for creating orders
interface UseCreateOrderReturn {
  createOrder: (orderData: any) => Promise<Order>;
  loading: boolean;
  error: string | null;
}

export const useCreateOrder = (): UseCreateOrderReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: any): Promise<Order> => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.createOrder(orderData);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      console.error('Error creating order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error,
  };
};

