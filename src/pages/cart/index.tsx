// ============================================================
// FILE: src/pages/cart/index.tsx
// Enhanced Cart Page with Outlet Validation
// ============================================================

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '@/lib/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, Store, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: cartTotal,
    itemCount,
    getCartOutlet,
  } = useCart();

  const [isClearing, setIsClearing] = useState(false);

  const cartOutlet = getCartOutlet();
  const subtotal = cartTotal;
  const tax = subtotal * 0.16; // 16% VAT
  const deliveryFee = 200; // Fixed delivery fee
  const total = subtotal + tax + deliveryFee;

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove all items from your cart?'
    );

    if (confirmed) {
      setIsClearing(true);
      clearCart();
      setIsClearing(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Navigate to checkout page
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>Shopping Cart - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-md p-12">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-8">
                  Start shopping to add items to your cart
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight size={20} />
                </Link>
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
        <title>Shopping Cart ({itemCount}) - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Outlet Info Banner */}
              {cartOutlet && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Store size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-1">
                        Ordering from: {cartOutlet.name || cartOutlet.outlet_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {cartOutlet.vendor || cartOutlet.vendor_name}
                      </p>
                      {cartOutlet.distance !== undefined && cartOutlet.distance > 0 && (
                        <p className="text-sm text-blue-600 font-medium mt-1 flex items-center gap-1">
                          <MapPin size={14} />
                          {cartOutlet.distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Important Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Single Outlet Policy</p>
                  <p className="text-sm text-gray-600">
                    All items in your cart must be from the same outlet. To order from a different
                    outlet, please complete this order first or clear your cart.
                  </p>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cart.map((item) => {
                  // item is a CartItem which extends Product, so all product props are directly on item
                  const productId = (item.id || item.product_id).toString();
                  const outletId = (item.outlet.id || item.outlet.outlet_id).toString();
                  const productImage =
                    item.image ||
                    (item.product_images
                      ? (() => {
                          try {
                            const images =
                              typeof item.product_images === 'string'
                                ? JSON.parse(item.product_images)
                                : item.product_images;
                            return Array.isArray(images) && images[0]
                              ? images[0]
                              : '/images/placeholder-product.jpg';
                          } catch {
                            return '/images/placeholder-product.jpg';
                          }
                        })()
                      : '/images/placeholder-product.jpg');

                  return (
                    <div
                      key={`${productId}-${outletId}`}
                      className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <img
                          src={productImage}
                          alt={item.name || item.title}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800 mb-1">
                            {item.name || item.title || item.product_name}
                          </h3>

                          {item.brand && (
                            <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                          )}

                          {(item.size || item.size_specification) && (
                            <p className="text-sm text-gray-500 mb-2">
                              Size: {item.size || item.size_specification}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(productId, outletId, item.quantity - 1)}
                                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>

                              <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => updateQuantity(productId, outletId, item.quantity + 1)}
                                disabled={item.stock && item.quantity >= item.stock}
                                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-blue-600 font-bold text-lg">
                                KES {(item.price * item.quantity).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                KES {item.price.toLocaleString()} each
                              </p>
                            </div>
                          </div>

                          {/* Stock Warning */}
                          {item.stock && item.quantity >= item.stock && (
                            <p className="text-sm text-orange-600 font-medium mt-2">
                              Maximum available quantity
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(productId, outletId)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-6">
                <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 hover:underline disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (16%)</span>
                    <span className="font-semibold">KES {tax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">KES {deliveryFee.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-blue-600">KES {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={20} />
                </button>

                <Link
                  href="/shop"
                  className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
