// ============================================================
// FILE: src/pages/shop/cart.tsx
// ENHANCED: Professional green & blue design with image loading
// ============================================================

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  ArrowRight,
  Trash2,
  Shield,
  Truck,
  Package,
  Tag,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { DELIVERY_FEE } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { calculateCartPricing } from '@/lib/utils/pricing';

// ============================================================
// Product Image Component — matches checkout page pattern
// ============================================================
interface ProductImageProps {
  src?: string;
  alt: string;
  emoji?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt, emoji }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100 text-4xl">
        {emoji || '🛢️'}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
};

// ============================================================
// Main Cart Component
// ============================================================
export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, total: cartTotal } = useCart();

  const { subtotal, tax, deliveryFee, total } = calculateCartPricing(cartTotal);


  const handleUpdateQuantity = (productId: string, outletId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, outletId, newQuantity);
  };

  const handleRemoveItem = (productId: string, outletId: string, productName: string) => {
    removeFromCart(productId, outletId);
    toast.success(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/shop/checkout');
  };

  // Group items by outlet
  const itemsByOutlet = cart.reduce((acc, item) => {
    const outletId = item.outlet.id;
    if (!acc[outletId]) {
      acc[outletId] = { outlet: item.outlet, items: [] };
    }
    acc[outletId].items.push(item);
    return acc;
  }, {} as Record<string, { outlet: any; items: any[] }>);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── Empty State ──────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>Shopping Cart - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-blue-50 flex items-center justify-center px-4">
          {/* Decorative background blobs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          </div>

          <div className="relative text-center max-w-md">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200 rotate-3">
              <ShoppingCart size={52} className="text-white -rotate-3" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-10 text-lg leading-relaxed">
              Discover our selection of quality gas products and add them to your cart.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all font-bold text-lg shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 transform hover:-translate-y-0.5"
            >
              <Sparkles size={20} />
              Start Shopping
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ── Main Cart ────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Shopping Cart ({totalItems}) - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/50">
        {/* Decorative blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-10">

          {/* ── Page Header ── */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold text-sm mb-4 transition-all hover:gap-2.5"
              >
                <ArrowRight size={16} className="rotate-180" />
                Continue Shopping
              </Link>
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-500 text-lg">
                <span className="font-semibold text-emerald-600">{totalItems}</span>{' '}
                {totalItems === 1 ? 'item' : 'items'} ready for checkout
              </p>
            </div>
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 text-red-400 hover:text-red-600 font-semibold transition-all hover:bg-red-50 px-4 py-2 rounded-xl"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-5">
              {Object.values(itemsByOutlet).map(({ outlet, items }) => (
                <div
                  key={outlet.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/60 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Outlet Header */}
                  <div className="px-7 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Package size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{outlet.name}</h3>
                      {outlet.address && (
                        <p className="text-emerald-100 text-xs font-medium mt-0.5">{outlet.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-gray-100/80">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.outlet.id}`}
                        className="p-6 hover:bg-emerald-50/30 transition-colors group"
                      >
                        <div className="flex gap-5">
                          {/* Product Image */}
                          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-emerald-100 group-hover:ring-emerald-200 transition-all">
                            <ProductImage
                              src={typeof item.image === 'string' && item.image.startsWith('http') ? item.image : undefined}
                              alt={item.name || item.title}
                              emoji={typeof item.image === 'string' && !item.image.startsWith('http') ? item.image : undefined}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="min-w-0 flex-1 pr-3">
                                <h4 className="text-lg font-bold text-gray-900 truncate">
                                  {item.name || item.title}
                                </h4>
                                {item.category && (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mt-1">
                                    <Tag size={10} />
                                    {item.category}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item.id, item.outlet.id, item.name || item.title)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                                title="Remove item"
                              >
                                <X size={20} />
                              </button>
                            </div>

                            {item.description && (
                              <p className="text-gray-400 text-sm mt-1 mb-3 line-clamp-1">
                                {item.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.outlet.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                >
                                  <Minus size={15} />
                                </button>
                                <span className="w-10 text-center font-bold text-gray-800 text-base">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.outlet.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                >
                                  <Plus size={15} />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-xs text-gray-400 font-medium mb-0.5">
                                  {formatPrice(item.price)} × {item.quantity}
                                </p>
                                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>

                            {item.quantity >= item.stock && (
                              <p className="text-xs text-amber-600 font-semibold mt-2 bg-amber-50 px-3 py-1 rounded-full inline-block">
                                ⚠️ Maximum stock reached
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary Sidebar ── */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/60 p-7 sticky top-6 hover:shadow-xl transition-shadow">

                <h2 className="text-2xl font-bold text-gray-900 mb-7 tracking-tight">
                  Order Summary
                </h2>

                {/* Pricing Rows */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="font-medium">
                      Subtotal
                      <span className="text-gray-400 text-sm ml-1">({totalItems} items)</span>
                    </span>
                    <span className="font-bold text-gray-800">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span className="font-medium">Tax (16%)</span>
                    <span className="font-bold text-gray-800">{formatPrice(tax)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <Truck size={16} className="text-emerald-500" />
                      Delivery
                    </div>
                    {deliveryFee === 0 ? (
                      <span className="font-bold text-emerald-500 bg-emerald-50 px-2.5 py-0.5 rounded-lg text-sm">
                        FREE
                      </span>
                    ) : (
                      <span className="font-bold text-gray-800">{formatPrice(deliveryFee)}</span>
                    )}
                  </div>

                  {subtotal < 5000 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-xs text-blue-700 font-medium">
                      💡 Add{' '}
                      <span className="font-bold">{formatPrice(5000 - subtotal)}</span>{' '}
                      more for free delivery
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-emerald-200 via-teal-200 to-blue-200 mb-6" />

                {/* Total */}
                <div className="flex justify-between items-center mb-7">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white py-4 rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-blue-700 font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Proceed to Checkout
                  <ArrowRight size={22} />
                </button>

                {/* Payment Methods */}
                <div className="mt-7 pt-6 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    We Accept
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['M-Pesa', 'Visa', 'Mastercard', 'Cash'].map((method) => (
                      <span
                        key={method}
                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-default"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Truck size={15} className="text-white" />
                    </div>
                    <p className="font-medium">
                      Free delivery on orders over{' '}
                      <span className="text-emerald-600 font-bold">KES 5,000</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Shield size={15} className="text-white" />
                    </div>
                    <p className="font-medium">256-bit SSL encrypted checkout</p>
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
