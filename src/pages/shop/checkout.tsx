// ============================================================
// FILE: src/pages/shop/checkout.tsx
// Checkout Page - Customer information and payment
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Check,
  Loader,
  Wallet as WalletIcon,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { orderService, walletService } from '@/lib/api';
import { PaymentMethod } from '@/lib/types';
import { DELIVERY_FEE } from '@/lib/constants';
import { formatPrice, isValidEmail, isValidPhone } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'mpesa' as PaymentMethod,
    notes: '',
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push('/shop/cart');
    }
  }, [cart, orderPlaced, router]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  // Fetch wallet balance if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletBalance();
    }
  }, [isAuthenticated]);

  const fetchWalletBalance = async () => {
  try {
    const response = await walletService.getBalance();

    if (!response.data) {
      throw new Error('Wallet data missing');
    }

    setWalletBalance(response.data.balance);
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
  }
};

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.address || formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete delivery address';
    }

    if (formData.paymentMethod === 'wallet' && walletBalance < total + DELIVERY_FEE) {
      newErrors.paymentMethod = 'Insufficient wallet balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          outlet_id: item.outlet.id,
        })),
        delivery_address: formData.address,
        delivery_phone: formData.phone,
        payment_method: formData.paymentMethod,
        notes: formData.notes || undefined,
      };
// Create order
const response = await orderService.createOrder(orderData);

if (!response.data) {
  throw new Error('Order creation failed: no data returned');
}

setOrderId(response.data.id);
setOrderPlaced(true);
clearCart();
toast.success('Order placed successfully!');

  // Success screen
  if (orderPlaced) {
    return (
      <>
        <Head>
          <title>Order Confirmed - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-2">Thank you for your order</p>
            <p className="text-2xl font-bold text-blue-600 mb-6">Order #{orderId.slice(0, 8)}</p>
            <p className="text-gray-600 mb-8">
              We'll deliver your products soon. You can track your order status in your orders page.
            </p>
            <div className="space-y-3">
              <Link
                href={`/orders/${orderId}`}
                className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                View Order Details
              </Link>
              <Link
                href="/orders"
                className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                View All Orders
              </Link>
              <Link
                href="/shop"
                className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <Link
            href="/shop/cart"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold transition"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>

          <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Information</h2>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+254712345678"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                        <textarea
                          rows={3}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="123 Main Street, Apartment 4B, Nairobi"
                        />
                      </div>
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    {/* Order Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any special instructions for delivery..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

                  <div className="space-y-3">
                    {/* M-Pesa */}
                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === 'mpesa'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mpesa"
                        checked={formData.paymentMethod === 'mpesa'}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })
                        }
                        className="w-4 h-4"
                      />
                      <Phone size={20} className="text-green-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">M-Pesa</p>
                        <p className="text-xs text-gray-600">Pay via M-Pesa mobile money</p>
                      </div>
                    </label>

                    {/* Card */}
                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === 'card'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })
                        }
                        className="w-4 h-4"
                      />
                      <CreditCard size={20} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Credit/Debit Card</p>
                        <p className="text-xs text-gray-600">Visa, Mastercard accepted</p>
                      </div>
                    </label>

                    {/* Wallet */}
                    {isAuthenticated && (
                      <label
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.paymentMethod === 'wallet'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="wallet"
                          checked={formData.paymentMethod === 'wallet'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMethod: e.target.value as PaymentMethod,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <WalletIcon size={20} className="text-purple-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">Wallet</p>
                          <p className="text-xs text-gray-600">
                            Balance: {formatPrice(walletBalance)}
                          </p>
                        </div>
                      </label>
                    )}

                    {/* Cash on Delivery */}
                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === 'cash_on_delivery'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })
                        }
                        className="w-4 h-4"
                      />
                      <Truck size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Cash on Delivery</p>
                        <p className="text-xs text-gray-600">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>

                  {errors.paymentMethod && (
                    <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-600 text-sm">{errors.paymentMethod}</p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-bold text-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {submitting ? (
                    <>
                      <Loader className="animate-spin" size={24} />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Check size={24} />
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.outlet.id}`}
                      className="flex items-center gap-3 pb-3 border-b border-gray-200"
                    >
                      <div className="bg-gradient-to-br from-orange-100 to-red-100 w-16 h-16 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">{formatPrice(DELIVERY_FEE)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(total + DELIVERY_FEE)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure checkout with encrypted payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  }
