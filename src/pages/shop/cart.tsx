// ============================================================
// FILE: src/pages/shop/cart.tsx
// Shopping Cart Page - View and manage cart items
// ============================================================

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Plus, Minus, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { DELIVERY_FEE } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useCart();

  const handleUpdateQuantity = (productId: string, outletId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }
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
      acc[outletId] = {
        outlet: item.outlet,
        items: [],
      };
    }
    acc[outletId].items.push(item);
    return acc;
  }, {} as Record<string, { outlet: any; items: any[] }>);

  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>Shopping Cart - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <ShoppingCart size={80} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Start adding products to your cart to place an order
            </p>
            <Link
              href="/shop"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart ({cart.length}) - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
              </p>
            </div>
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition"
            >
              <Trash2 size={20} />
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.values(itemsByOutlet).map(({ outlet, items }) => (
                <div key={outlet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Outlet Header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-bold text-gray-800">{outlet.name}</h3>
                    <p className="text-sm text-gray-600">{outlet.address}</p>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.outlet.id}`} className="p-6">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                            {item.image}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-1">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-600">{item.category}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item.id, item.outlet.id, item.name)}
                                className="text-red-500 hover:text-red-700 transition"
                                title="Remove from cart"
                              >
                                <X size={24} />
                              </button>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 font-semibold">
                                  Quantity:
                                </span>
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.outlet.id,
                                        item.quantity - 1
                                      )
                                    }
                                    className="p-2 hover:bg-gray-200 rounded-l-lg transition"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="px-4 font-bold text-lg">{item.quantity}</span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.outlet.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="p-2 hover:bg-gray-200 rounded-r-lg transition"
                                    disabled={item.quantity >= item.stock}
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                                {item.quantity >= item.stock && (
                                  <span className="text-sm text-orange-600 font-semibold">
                                    Max stock reached
                                  </span>
                                )}
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-gray-600 mb-1">
                                  {formatPrice(item.price)} each
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">{formatPrice(DELIVERY_FEE)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-gray-800">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(total + DELIVERY_FEE)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 mb-3">We Accept:</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="px-3 py-2 border border-gray-300 rounded text-sm font-semibold text-gray-700">
                      M-Pesa
                    </div>
                    <div className="px-3 py-2 border border-gray-300 rounded text-sm font-semibold text-gray-700">
                      Card
                    </div>
                    <div className="px-3 py-2 border border-gray-300 rounded text-sm font-semibold text-gray-700">
                      Cash
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Free delivery on orders over KES 5,000</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600 mt-3">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Secure checkout with encrypted payment</p>
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
