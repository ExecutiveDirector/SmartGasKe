// ============================================================
// FILE: src/pages/cart/index.tsx
// Enhanced Cart Page - Uses Pre-Extracted Images from CartContext
// ============================================================

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '@/lib/context/CartContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  MapPin, 
  Store, 
  AlertCircle,
  Package,
  Truck,
  Shield,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateCartPricing } from '@/lib/utils/pricing';

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
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const cartOutlet = getCartOutlet();
  
  // Calculate pricing
  //const subtotal = cartTotal;
  //const tax = subtotal * 0.06; // 16% VAT
  //const deliveryFee = subtotal > 5000 ? 0 : 100; // Free delivery over KES 5,000
  //const total = subtotal + tax + deliveryFee;
const { subtotal, tax, deliveryFee, total } = calculateCartPricing(cartTotal);

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      setIsClearing(true);
      try {
        clearCart();
        toast.success('Cart cleared successfully');
      } catch (error) {
        toast.error('Failed to clear cart');
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleRemoveItem = async (productId: string, outletId: string) => {
    const itemKey = `${productId}-${outletId}`;
    setRemovingItems(prev => new Set(prev).add(itemKey));
    
    try {
      await removeFromCart(productId, outletId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const handleUpdateQuantity = async (productId: string, outletId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId, outletId);
      return;
    }

    try {
      await updateQuantity(productId, outletId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  // Empty cart state
  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>Shopping Cart - AquaGas</title>
          <meta name="description" content="Your AquaGas shopping cart" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="bg-blue-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={64} className="text-blue-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Your cart is empty
                </h2>
                
                <p className="text-gray-600 mb-8 text-lg">
                  Discover our range of quality gas cylinders and accessories
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBag size={20} />
                    <span>Start Shopping</span>
                  </Link>
                  
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition font-semibold"
                  >
                    <ArrowLeft size={20} />
                    <span>Go Home</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <Shield size={24} className="text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <Truck size={24} className="text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Fast Delivery</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <Package size={24} className="text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Quality Products</p>
                  </div>
                </div>
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
        <meta name="description" content={`Review your ${itemCount} item(s) and checkout`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link 
                href="/shop"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition"
              >
                <ArrowLeft size={20} />
                <span>Continue Shopping</span>
              </Link>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
            <p className="text-gray-600 text-lg">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Outlet Info Banner */}
              {cartOutlet && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-5 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500 p-3 rounded-xl shadow-md">
                      <Store size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg mb-1">
                        {cartOutlet.name || cartOutlet.outlet_name}
                      </p>
                      <p className="text-gray-700 font-medium mb-2">
                        {cartOutlet.vendor || cartOutlet.vendor_name}
                      </p>
                      {cartOutlet.distance !== undefined && cartOutlet.distance > 0 && (
                        <p className="text-sm text-blue-700 font-semibold flex items-center gap-1">
                          <MapPin size={16} />
                          {cartOutlet.distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Important Note */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 flex items-start gap-4 shadow-md">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <AlertCircle size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Single Outlet Policy</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    All items must be from the same outlet. To order from a different outlet, 
                    complete this order first or clear your cart.
                  </p>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cart.map((item) => {
                  const productId = (item.id || item.product_id)?.toString() || '';
                  const outletId = (item.outlet.id || item.outlet.outlet_id)?.toString() || '';
                  const itemKey = `${productId}-${outletId}`;
                  
                  if (!productId || !outletId) {
                    console.warn('Cart item missing required IDs:', item);
                    return null;
                  }

                  // Image is already extracted and stored in cart by CartContext
                  const productImage = item.image || '/images/placeholder-product.jpg';
                  const isRemoving = removingItems.has(itemKey);
                  const maxStock = item.stock || 999;
                  const atMaxStock = item.quantity >= maxStock;

                  return (
                    <div
                      key={itemKey}
                      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        isRemoving ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex gap-5">
                          {/* Product Image */}
                          <div className="relative flex-shrink-0">
                            <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shadow-md ring-2 ring-gray-100">
                              <img
                                src={productImage}
                                alt={item.name || item.title || 'Product'}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  if (target.src !== '/images/placeholder-product.jpg') {
                                    target.src = '/images/placeholder-product.jpg';
                                  }
                                }}
                              />
                            </div>
                            {item.brand && (
                              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10">
                                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                                  {item.brand}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1 pr-4">
                                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 leading-tight">
                                  {item.name || item.title || item.product_name}
                                </h3>

                                {(item.size || item.size_specification) && (
                                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                    <Package size={14} />
                                    <span>Size: {item.size || item.size_specification}</span>
                                  </p>
                                )}

                                {item.category && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {typeof item.category === 'string' ? item.category : String(item.category)}
                                  </p>
                                )}
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveItem(productId, outletId)}
                                disabled={isRemoving}
                                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition flex-shrink-0 group"
                                aria-label="Remove item"
                                title="Remove from cart"
                              >
                                <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 shadow-sm">
                                <button
                                  onClick={() => handleUpdateQuantity(productId, outletId, item.quantity - 1)}
                                  className="bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 p-2.5 rounded-lg transition shadow-sm hover:shadow active:scale-95"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={16} />
                                </button>

                                <span className="font-bold text-gray-900 min-w-[3rem] text-center text-lg px-2">
                                  {item.quantity}
                                </span>

                                <button
                                  onClick={() => handleUpdateQuantity(productId, outletId, item.quantity + 1)}
                                  disabled={atMaxStock}
                                  className="bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 p-2.5 rounded-lg transition shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-blue-600 font-bold text-xl">
                                  KES {(item.price * item.quantity).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                  KES {item.price.toLocaleString()} each
                                </p>
                              </div>
                            </div>

                            {/* Stock Warning */}
                            {atMaxStock && (
                              <div className="mt-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg px-3 py-2">
                                <p className="text-sm text-orange-700 font-medium flex items-center gap-2">
                                  <AlertCircle size={14} />
                                  Maximum available quantity reached
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart Button */}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 hover:bg-red-50 px-4 py-2.5 rounded-lg transition disabled:opacity-50 group"
                >
                  <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Clear All Items</span>
                </button>
                
                <p className="text-sm text-gray-500">
                  Total items: <span className="font-semibold text-gray-700">{itemCount}</span>
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">KES {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="text-xs text-gray-500 pl-4">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Srevice fee (6% VAT)</span>
                    <span className="font-bold">KES {tax.toFixed(0).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-gray-500" />
                      <span className="font-medium">Delivery</span>
                      {deliveryFee === 0 && (
                        <span className="ml-1 text-green-600 text-xs font-bold uppercase bg-green-50 px-2 py-0.5 rounded">
                          FREE
                        </span>
                      )}
                    </div>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                      {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>

                  {subtotal < 5000 && subtotal > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-3 my-4">
                      <p className="text-xs text-blue-800 font-semibold flex items-center gap-2 mb-2">
                        <Truck size={14} />
                        Add KES {(5000 - subtotal).toLocaleString()} more for free delivery!
                      </p>
                      <div className="bg-white rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                          style={{ width: `${(subtotal / 5000) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-blue-600">KES {total.toFixed(0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={22} />
                </button>

                <Link
                  href="/shop"
                  className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold mt-4 py-2.5 hover:bg-blue-50 rounded-lg transition"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center group">
                    <div className="bg-green-50 rounded-lg p-2 mx-auto w-fit group-hover:bg-green-100 transition">
                      <Shield size={20} className="text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-1">Secure</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-blue-50 rounded-lg p-2 mx-auto w-fit group-hover:bg-blue-100 transition">
                      <Truck size={20} className="text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-1">Fast</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-purple-50 rounded-lg p-2 mx-auto w-fit group-hover:bg-purple-100 transition">
                      <Package size={20} className="text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-1">Quality</p>
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
