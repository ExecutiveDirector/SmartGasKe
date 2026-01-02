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

      setOrders(response.data);
      setTotalPages(response.pagination.pages);
      setCurrentPage(response.pagination.page);
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

// ============================================================
// FILE: src/lib/hooks/useOutlets.ts
// Custom hook for fetching and managing outlets
// ============================================================

import { useState, useEffect } from 'react';
import { outletService } from '../api';
import { Outlet, OutletQueryParams, NearbyOutletsParams } from '../types';

interface UseOutletsOptions {
  autoFetch?: boolean;
  params?: OutletQueryParams;
}

interface UseOutletsReturn {
  outlets: Outlet[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  refetch: (params?: OutletQueryParams) => Promise<void>;
  setPage: (page: number) => void;
}

export const useOutlets = (options: UseOutletsOptions = {}): UseOutletsReturn => {
  const { autoFetch = true, params: initialParams } = options;

  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialParams?.page || 1);
  const [params, setParams] = useState<OutletQueryParams | undefined>(initialParams);

  const fetchOutlets = async (fetchParams?: OutletQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = fetchParams || params || {};
      const response = await outletService.getAllOutlets(queryParams);

      setOutlets(response.data);
      setTotalPages(response.pagination.pages);
      setCurrentPage(response.pagination.page);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch outlets');
      console.error('Error fetching outlets:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (newParams?: OutletQueryParams) => {
    if (newParams) {
      setParams(newParams);
    }
    await fetchOutlets(newParams || params);
  };

  const setPage = (page: number) => {
    setCurrentPage(page);
    refetch({ ...params, page });
  };

  useEffect(() => {
    if (autoFetch) {
      fetchOutlets(params);
    }
  }, [autoFetch]);

  return {
    outlets,
    loading,
    error,
    totalPages,
    currentPage,
    refetch,
    setPage,
  };
};

// Hook for fetching nearby outlets
interface UseNearbyOutletsOptions {
  latitude: number | null;
  longitude: number | null;
  radius?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseNearbyOutletsReturn {
  outlets: Outlet[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNearbyOutlets = (options: UseNearbyOutletsOptions): UseNearbyOutletsReturn => {
  const { latitude, longitude, radius, limit, autoFetch = true } = options;

  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyOutlets = async () => {
    if (latitude === null || longitude === null) return;

    try {
      setLoading(true);
      setError(null);

      const params: NearbyOutletsParams = {
        latitude,
        longitude,
        radius,
        limit,
      };

      const response = await outletService.getNearbyOutlets(params);
      setOutlets(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch nearby outlets');
      console.error('Error fetching nearby outlets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && latitude !== null && longitude !== null) {
      fetchNearbyOutlets();
    }
  }, [latitude, longitude, radius, limit, autoFetch]);

  return {
    outlets,
    loading,
    error,
    refetch: fetchNearbyOutlets,
  };
};

// Hook for fetching a single outlet
interface UseOutletOptions {
  outletId: string | null;
  autoFetch?: boolean;
}

interface UseOutletReturn {
  outlet: Outlet | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOutlet = (options: UseOutletOptions): UseOutletReturn => {
  const { outletId, autoFetch = true } = options;

  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOutlet = async () => {
    if (!outletId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await outletService.getOutlet(outletId);
      setOutlet(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch outlet');
      console.error('Error fetching outlet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && outletId) {
      fetchOutlet();
    }
  }, [outletId, autoFetch]);

  return {
    outlet,
    loading,
    error,
    refetch: fetchOutlet,
  };
};
