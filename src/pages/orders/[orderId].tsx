// ============================================================
// FILE: src/pages/orders/[orderId].tsx
// Order Details Page - View detailed order information
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  Loader,
  CheckCircle,
  Clock,
  TrendingUp,
  XCircle,
  AlertCircle,
  Truck,
  Star,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { orderService } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/account/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch order details
  useEffect(() => {
    if (orderId && isAuthenticated) {
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated]);

  const fetchOrderDetails = async () => {
  try {
    setLoading(true);
    const response = await orderService.getOrder(orderId as string);
    setOrder(response.data ?? null); // safe fallback
  } catch (error: any) {
    console.error('Error fetching order:', error);
    toast.error('Failed to load order details');
  } finally {
    setLoading(false);
  }
};

  const handleCancelOrder = async () => {
    if (!order) return;

    if (
      !window.confirm(
        'Are you sure you want to cancel this order? This action cannot be undone.'
      )
    ) {
      return;
    }

    setCancelling(true);
    try {
      await orderService.cancelOrder(order.id);
      toast.success('Order cancelled successfully');
      fetchOrderDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!order) return;

    try {
      await orderService.rateOrder(order.id, rating, review);
      toast.success('Thank you for your feedback!');
      setShowRatingModal(false);
      setRating(5);
      setReview('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit rating');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={24} />;
      case 'in_transit':
        return <TrendingUp size={24} />;
      case 'processing':
        return <Clock size={24} />;
      case 'confirmed':
        return <CheckCircle size={24} />;
      case 'cancelled':
        return <XCircle size={24} />;
      default:
        return <Package size={24} />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancelOrder = (status: OrderStatus) => {
    return status === 'pending' || status === 'confirmed';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <Link
            href="/orders"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order #{order.id.slice(0, 8)} - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold transition"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </Link>

          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Order #{order.id.slice(0, 8)}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Calendar size={16} />
                  Placed on {formatDateTime(order.created_at)}
                </p>
              </div>
              <span
                className={`px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2 border-2 ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                {order.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {order.status === 'delivered' && order.delivered_at && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="text-green-600" size={24} />
                <p className="text-green-800">
                  Delivered on {formatDateTime(order.delivered_at)}
                </p>
              </div>
            )}

            {canCancelOrder(order.status) && (
              <div className="mt-4">
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle size={18} />
                      Cancel Order
                    </>
                  )}
                </button>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="mt-4">
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
                >
                  <Star size={18} />
                  Rate Order
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{item.product_name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{item.outlet_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">
                          {formatPrice(item.price)} each
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Delivery Address</p>
                      <p className="text-gray-600">{order.delivery_address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Contact Number</p>
                      <p className="text-gray-600">{order.delivery_phone}</p>
                    </div>
                  </div>
                  {order.notes && (
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">Order Notes</p>
                        <p className="text-gray-600">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(order.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">{formatPrice(order.delivery_fee)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(order.grand_total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-blue-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Payment Method</p>
                      <p className="text-gray-600 capitalize">
                        {order.payment_method.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Payment Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                          order.payment_status
                        )}`}
                      >
                        {order.payment_status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Truck className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-blue-800 mb-1">Need Help?</p>
                    <p className="text-sm text-blue-700">
                      Contact support at support@aquagas.com or call +254 700 000 000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rate Your Order</h2>
            <p className="text-gray-600 mb-6">How was your experience?</p>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about your experience..."
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmitRating}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  }
