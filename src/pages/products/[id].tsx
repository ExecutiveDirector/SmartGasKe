// ============================================================
// FILE: src/pages/products/[id].tsx
// Product Detail Page — shows full description, images,
// brand, size, category, price, stock and add-to-cart.
//
// This route was missing entirely, which is why ProductCard's
// "View Details" link (/products/[id]) was 404-ing.
// ============================================================

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ChevronLeft,
  ShoppingCart,
  Star,
  Package,
  MapPin,
  Award,
  Loader,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useProduct } from '@/lib/hooks/useProducts';
import { useCart } from '@/lib/hooks/useCart';
import {
  extractAllImages,
  getProductImageUrl,
} from '@/lib/utils/imageUtils';
import {
  getProductDisplayName,
  getStockStatusMessage,
  formatPrice,
  createFallbackOutlet,
} from '@/lib/utils/productTransform';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const productId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : null;

  const { product, loading, error } = useProduct({ productId });
  const { addToCart } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }

  // ── Error / not found state ───────────────────────────────
  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle size={40} className="text-amber-400 mb-3" />
        <h1 className="text-lg font-bold text-slate-800 mb-1">
          Product not found
        </h1>
        <p className="text-sm text-slate-500 mb-5 max-w-sm">
          {error || "We couldn't find the product you're looking for. It may have been removed or is no longer available."}
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Shop
        </Link>
      </div>
    );
  }

  const displayName = getProductDisplayName(product);
  const images = extractAllImages(product.images || product.product_images || getProductImageUrl(product));
  const sizeLabel = product.size || product.size_specification || product.sizeSpecification;
  const stockMessage = getStockStatusMessage(product);
  const isOutOfStock = (product.stock ?? 0) === 0 || product.is_active === false;
  const outlet = createFallbackOutlet(product);

  const handleAddToCart = () => {
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, outlet);
      }
      toast.success(`${displayName} added to cart!`, { icon: '🛒' });
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <>
      <Head>
        <title>{displayName} — AquaGas</title>
        <meta
          name="description"
          content={product.description || `Buy ${displayName} on AquaGas`}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-blue-50/40 pb-16">
        <div className="container mx-auto px-4 md:px-6 py-6 max-w-5xl">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-teal-700 transition-colors mb-5"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* ── Images ───────────────────────────────── */}
              <div className="p-4 md:p-6">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                  <img
                    src={images[activeImage]}
                    alt={displayName}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                    }}
                  />

                  {product.featured && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
                      <Award size={11} />
                      Featured
                    </span>
                  )}

                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                          activeImage === idx ? 'border-teal-500' : 'border-slate-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${displayName} ${idx + 1}`}
                          className="absolute inset-0 w-full h-full object-contain p-1 bg-slate-50"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Details ──────────────────────────────── */}
              <div className="p-4 md:p-6 md:border-l border-slate-100 flex flex-col">
                {/* Category / brand tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {typeof product.category === 'string' && product.category && (
                    <span className="bg-sky-50 text-sky-700 text-[11px] font-medium px-2.5 py-1 rounded-lg">
                      {product.category}
                    </span>
                  )}
                  {product.brand && (
                    <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-lg">
                      {product.brand}
                    </span>
                  )}
                  {sizeLabel && (
                    <span className="flex items-center gap-1 bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-lg">
                      <Package size={11} />
                      {sizeLabel}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-2xl font-extrabold text-slate-800 leading-snug mb-2">
                  {displayName}
                </h1>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star size={15} fill="currentColor" className="text-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      {product.rating.toFixed(1)}
                    </span>
                    {product.reviews > 0 && (
                      <span className="text-sm text-slate-400">
                        ({product.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <p className="text-3xl font-extrabold text-teal-700 mb-1">
                  {formatPrice(product.price)}
                </p>
                <p
                  className={`text-sm font-medium mb-4 ${
                    isOutOfStock ? 'text-red-500' : 'text-emerald-600'
                  }`}
                >
                  {stockMessage}
                </p>

                {/* Description */}
                {product.description && (
                  <div className="mb-4">
                    <h2 className="text-sm font-bold text-slate-700 mb-1.5">
                      Description
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Outlet / vendor */}
                {(product.outlet_name || product.vendor_name) && (
                  <div className="flex items-start gap-2.5 mb-5 pb-5 border-b border-slate-100">
                    <div className="bg-sky-50 p-1.5 rounded-lg mt-0.5 flex-shrink-0">
                      <MapPin size={14} className="text-sky-600" />
                    </div>
                    <div className="min-w-0">
                      {product.outlet_name && (
                        <p className="text-sm font-semibold text-slate-700 truncate">
                          {product.outlet_name}
                        </p>
                      )}
                      {product.vendor_name && (
                        <p className="text-xs text-slate-400 truncate">
                          Sold by {product.vendor_name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to cart */}
                <div className="mt-auto flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-slate-700">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                      className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-teal-700 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                  >
                    <ShoppingCart size={17} />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
