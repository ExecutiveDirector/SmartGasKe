// ============================================================
// FILE: src/pages/checkout/index.tsx
// UPDATED: Simplified checkout without payment method selection
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
  Truck,
  Check,
  Loader,
  ArrowLeft,
  AlertCircle,
  Shield,
  Package,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total: cartTotal, itemCount, clearCart, getCartOutlet } = useCart();
  const { user, isAuthenticated, getToken } = useAuth();
  
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Pricing
  const subtotal = cartTotal;
  const tax = subtotal * 0.16;
  const deliveryFee = subtotal > 5000 ? 0 : 200;
  const total = subtotal + tax + deliveryFee;

  // Form state - NO payment method field
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push('/cart');
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

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const phoneRegex = /^(\+?254|0)[17]\d{8}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid Kenyan phone number (e.g., 0712345678)';
    }

    if (!formData.address || formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete delivery address (at least 10 characters)';
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
      const outlet = getCartOutlet();
      if (!outlet) {
        throw new Error('No outlet found for cart items');
      }

      const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const outletId = outlet.id || outlet.outlet_id;
      const vendorId = outlet.vendor_id;

      if (!outletId) {
        throw new Error('Outlet ID is missing');
      }

      // Prepare order data (NO payment_method field)
      const orderData = {
        order_id: newOrderId,
        user_id: user?.id || 'guest',
        outlet_id: outletId,
        vendor_id: vendorId,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_address: formData.address,
        order_notes: formData.notes || '',
        items: cart.map((item) => ({
          product_id: item.id || item.product_id,
          product_name: item.name || item.title || item.product_name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        subtotal,
        tax,
        delivery_fee: deliveryFee,
        total,
        status: 'draft',
      };

      console.log('📦 Creating order:', {
        order_id: newOrderId,
        outlet_id: outletId,
        is_guest: !user || user.id === 'guest',
      });

      // Get auth token if available
      const token = getToken ? getToken() : null;

      // Step 1: Create draft order
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderResult = await orderResponse.json();
      const createdOrderId = orderResult.order_id || orderResult.order?.order_id || newOrderId;
      setOrderId(createdOrderId);

      console.log('✅ Order created:', createdOrderId);

      // Step 2: Initiate Pesapal payment (user selects payment method on Pesapal page)
      const paymentResponse = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          order_id: createdOrderId,
          customer_email: formData.email,
          customer_phone: formData.phone,
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || 'Failed to initialize payment');
      }

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success || !paymentResult.redirect_url) {
        throw new Error('Payment redirect URL not received');
      }

      // Clear cart before redirect
      clearCart();

      // Redirect to Pesapal payment page
      // User will select payment method (M-Pesa, Card, etc.) on Pesapal
      window.location.href = paymentResult.redirect_url;

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to process checkout. Please try again.');
      setSubmitting(false);
    }
  };

  // Success screen (shown after payment callback)
  if (orderPlaced) {
    return (
      <>
        <Head>
          <title>Order Confirmed - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check size={48} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Order Confirmed!
            </h2>
            
            <p className="text-gray-600 mb-2">Thank you for your order</p>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-blue-600">
                #{orderId.slice(0, 12)}
              </p>
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              We'll deliver your gas cylinder soon. You can track your order status in your orders page.
            </p>
            
            <div className="space-y-3">
              <Link
                href="/orders"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg hover:shadow-xl"
              >
                View My Orders
              </Link>
              
              <Link
                href="/shop"
                className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition font-semibold"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield size={18} className="text-green-600" />
                <span>Your order is secure and protected</span>
              </div>
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
        <meta name="description" content="Complete your order for fast gas delivery" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold transition"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">Complete your order for fast delivery</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User size={24} className="text-blue-600" />
                    Customer Information
                  </h2>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.name ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.phone ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="0712345678"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.phone}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Format: 0712345678 or +254712345678
                      </p>
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
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.address ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Building name, Street, Area, Nairobi"
                        />
                      </div>
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.address}
                        </p>
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Any special instructions for delivery..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Info Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    💳 Payment Options
                  </h3>
                  <p className="text-gray-700 mb-4">
                    After placing your order, you'll be redirected to Pesapal's secure payment page where you can choose:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <Phone size={16} className="text-green-600" />
                      <span><strong>M-Pesa</strong> - Pay with mobile money</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield size={16} className="text-blue-600" />
                      <span><strong>Credit/Debit Card</strong> - Visa, Mastercard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} className="text-purple-600" />
                      <span><strong>Bank Transfer</strong> - Direct bank payment</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Shield size={16} className="text-green-600" />
                      All payments are secured by Pesapal with 256-bit encryption
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold text-lg transition disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader className="animate-spin" size={24} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check size={24} />
                      Proceed to Payment - KES {total.toFixed(0).toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  By placing your order, you agree to our terms and conditions
                </p>
              </form>
            </div>

            {/* Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.outlet?.id}`}
                      className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-0"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image || '/images/placeholder-product.jpg'}
                          alt={item.name || item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate text-sm">
                          {item.name || item.title}
                        </p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-800 text-sm">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">KES {subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Tax (16%)</span>
                    <span className="font-bold">KES {tax.toFixed(0).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <div className="flex items-center gap-1">
                      <Truck size={16} />
                      <span className="font-medium">Delivery</span>
                    </div>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                      {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  
                  <div className="border-t-2 border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        KES {total.toFixed(0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <Shield size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">Secure Checkout</p>
                      <p className="text-xs text-gray-600">Powered by Pesapal</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Package size={20} className="mx-auto text-blue-600 mb-1" />
                    <p className="text-xs font-medium text-gray-700">Quality Products</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Truck size={20} className="mx-auto text-green-600 mb-1" />
                    <p className="text-xs font-medium text-gray-700">Fast Delivery</p>
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
