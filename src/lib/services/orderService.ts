
// ============================================================
// FILE: src/lib/services/orderService.ts
// Order Service - Wrapper around order API calls
// ============================================================

import { orderService as orderApi } from '../api';
import { CreateOrderData, OrderQueryParams, OrderStatus } from '../types';

class OrderService {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderData) {
    const response = await orderApi.createOrder(orderData);
    return response;
  }

  /**
   * Get all orders for current user
   */
  async getOrders(params?: OrderQueryParams) {
    const response = await orderApi.getOrders(params);
    return response;
  }

  /**
   * Get single order by ID
   */
  async getOrder(orderId: string) {
    const response = await orderApi.getOrder(orderId);
    return response;
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, reason?: string) {
    const response = await orderApi.cancelOrder(orderId, reason);
    return response;
  }

  /**
   * Track order status
   */
  async trackOrder(orderId: string) {
    const response = await orderApi.trackOrder(orderId);
    return response;
  }

  /**
   * Rate an order
   */
  async rateOrder(orderId: string, rating: number, review?: string) {
    const response = await orderApi.rateOrder(orderId, rating, review);
    return response;
  }

  /**
   * Get orders by status
   */
  async getOrdersByStatus(status: OrderStatus, params?: OrderQueryParams) {
    const response = await orderApi.getOrders({
      ...params,
      status,
    });
    return response;
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(limit: number = 5) {
    const response = await orderApi.getOrders({
      limit,
      page: 1,
    });
    return response;
  }

  /**
   * Get orders by date range
   */
  async getOrdersByDateRange(
    fromDate: string,
    toDate: string,
    params?: OrderQueryParams
  ) {
    const response = await orderApi.getOrders({
      ...params,
      from_date: fromDate,
      to_date: toDate,
    });
    return response;
  }

  /**
   * Calculate order statistics
   */
  calculateOrderStats(orders: any[]) {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      in_transit: orders.filter((o) => o.status === 'in_transit').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      totalValue: orders.reduce((sum, o) => sum + o.grand_total, 0),
    };
  }
}

export default new OrderService();
