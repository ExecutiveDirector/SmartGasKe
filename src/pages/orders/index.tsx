// ============================================================
// FILE: src/pages/orders/index.tsx
// Orders List Page - View all user orders
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Package,
  ChevronRight,
  Loader,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  XCircle,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { orderService } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/account/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch orders
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, statusFilter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await orderService.getOrders(params);
      setOrders(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={18} />;
      case 'in_transit':
        return <TrendingUp size={18} />;
      case 'processing':
        return <Clock size={18} />;
      case 'confirmed':
        return <CheckCircle size={18} />;
      case 'cancelled':
        return <XCircle size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Orders - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
            <p className="text-gray-600">View and track all your orders</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { value: 'all', label: 'All Orders', count: orders.length },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'processing', label: 'Processing' },
                { value: 'in_transit', label: 'In Transit' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setStatusFilter(tab.value as OrderStatus | 'all');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    statusFilter === tab.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
              <p className="text-gray-600 mb-6">
                {statusFilter === 'all'
                  ? "You haven't placed any orders yet"
                  : `No orders with status: ${statusFilter.replace('_', ' ')}`}
              </p>
              <Link
                href="/shop"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 rounded-full p-3">
                          <Package size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Order #{order.id.slice(0, 8)}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Calendar size={14} />
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <ChevronRight size={24} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Items</p>
                        <p className="font-semibold text-gray-800">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="font-semibold text-blue-600 text-lg">
                          {formatPrice(order.grand_total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Payment</p>
                        <p className="font-semibold text-gray-800 capitalize">
                          {order.payment_method.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Order Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span
                            key={index}
                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                          >
                            {item.product_name} x{item.quantity}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
         }
