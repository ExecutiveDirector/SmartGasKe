// ============================================================
// FILE: src/components/ProductCard.tsx
// Fully Featured — compact & full cards have ALL features
// ============================================================

import { Product, Outlet } from '@/lib/types';
import { useCart } from '@/lib/hooks/useCart';
import {
  ShoppingCart,
  MapPin,
  Star,
  Package,
  Award,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  outlet: Outlet;
  compact?: boolean;
}

// ── Image with loading + error state ─────────────────────
function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100">
        <Package size={32} className="text-teal-300" />
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100">
          <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}

export default function ProductCard({
  product,
  outlet,
  compact = false,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const productDisplayName =
    product.name || product.title || product.product_name || 'Unnamed Product';

  const getProductImage = (): string => {
    if (product.image) return product.image;
    if (product.product_images) {
      try {
        const images =
          typeof product.product_images === 'string'
            ? JSON.parse(product.product_images)
            : product.product_images;
        return Array.isArray(images) && images.length > 0
          ? images[0]
          : '/images/placeholder-product.jpg';
      } catch {
        return typeof product.product_images === 'string'
          ? product.product_images
          : '/images/placeholder-product.jpg';
      }
    }
    return '/images/placeholder-product.jpg';
  };

  const handleAddToCart = () => {
    if (!product.id && !product.product_id) {
      toast.error('Product ID is missing');
      return;
    }
    if (!outlet.id && !outlet.outlet_id) {
      toast.error('Outlet information is missing for this product');
      return;
    }
    try {
      addToCart(product, outlet);
      toast.success(`${productDisplayName} added to cart!`, {
        icon: '🛒',
        duration: 2000,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add item to cart');
    }
  };

  // Shared derived values
  const productId = product.id || product.product_id;
  const sizeLabel =
    product.size || product.size_specification || product.sizeSpecification;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  // ── COMPACT CARD — all features, smaller footprint ───────
  if (compact) {
    return (
      <div
        className="
          w-[220px] flex-shrink-0 bg-white rounded-2xl overflow-hidden
          border border-slate-100 shadow-sm
          hover:shadow-lg hover:border-teal-200 hover:-translate-y-0.5
          transition-all duration-300 group flex flex-col
        "
      >
        {/* Image */}
        <div className="relative w-full h-40 overflow-hidden bg-slate-50 flex-shrink-0">
          <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
            <ProductImage src={getProductImage()} alt={productDisplayName} />
          </div>

          {/* Top-left badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                <Award size={9} />
                Featured
              </span>
            )}
            {isLowStock && (
              <span className="flex items-center gap-1 bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                <TrendingUp size={9} />
                {product.stock} left
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/95 text-slate-800 text-xs font-bold px-2 py-1 rounded-lg shadow">
              <Star size={11} fill="currentColor" className="text-amber-400" />
              {product.rating.toFixed(1)}
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-3 flex flex-col flex-1">
          {/* Name */}
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-teal-700 transition-colors mb-1.5">
            {productDisplayName}
          </h3>

          {/* Brand + Size tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.brand && (
              <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-md">
                {product.brand}
              </span>
            )}
            {sizeLabel && (
              <span className="flex items-center gap-0.5 bg-sky-50 text-sky-600 text-[10px] font-medium px-2 py-0.5 rounded-md">
                <Package size={9} />
                {sizeLabel}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
              {product.description}
            </p>
          )}

          {/* Outlet */}
          {outlet && (
            <div className="flex items-start gap-1.5 mb-2 pb-2 border-b border-slate-100">
              <MapPin size={11} className="text-sky-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-600 truncate">
                  {outlet.name || outlet.outlet_name}
                </p>
                {(outlet.vendor || outlet.vendor_name) && (
                  <p className="text-[10px] text-slate-400 truncate">
                    {outlet.vendor || outlet.vendor_name}
                  </p>
                )}
                {outlet.distance !== undefined && outlet.distance > 0 && (
                  <p className="text-[10px] text-sky-500 font-medium">
                    {outlet.distance.toFixed(1)} km away
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Price + Add to cart */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div>
              <p className="text-teal-700 font-extrabold text-base leading-none">
                KES {product.price.toLocaleString()}
              </p>
              {product.stock > 0 && (
                <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
                  {product.stock} in stock
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="
                bg-teal-600 text-white p-2 rounded-xl
                hover:bg-teal-700 active:scale-95
                disabled:bg-slate-200 disabled:cursor-not-allowed
                transition-all duration-200 shadow-sm flex-shrink-0
              "
              title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingCart size={14} />
            </button>
          </div>

          {/* View Details */}
          <Link
            href={`/products/${productId}`}
            className="
              mt-2 flex items-center justify-center gap-1
              text-[11px] text-sky-600 font-semibold
              hover:text-sky-700 transition-colors
            "
          >
            View Details
            <ChevronRight size={11} />
          </Link>
        </div>
      </div>
    );
  }

  // ── FULL CARD ─────────────────────────────────────────────
  return (
    <div
      className="
        bg-white rounded-2xl overflow-hidden
        border border-slate-100 shadow-sm
        hover:shadow-lg hover:border-teal-200 hover:-translate-y-0.5
        transition-all duration-300 group flex flex-col
      "
    >
      {/* Image */}
      <div className="relative w-full h-56 overflow-hidden bg-slate-50 flex-shrink-0">
        <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
          <ProductImage src={getProductImage()} alt={productDisplayName} />
        </div>

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
              <Award size={11} />
              Featured
            </span>
          )}
          {isLowStock && (
            <span className="flex items-center gap-1 bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
              <TrendingUp size={11} />
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/55 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Rating chip */}
        {product.rating > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 text-slate-800 text-sm font-bold px-2.5 py-1.5 rounded-xl shadow-md">
            <Star size={13} fill="currentColor" className="text-amber-400" />
            {product.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name */}
        <h3 className="font-bold text-[17px] text-slate-800 mb-2 line-clamp-2 min-h-[52px] group-hover:text-teal-700 transition-colors leading-snug">
          {productDisplayName}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.brand && (
            <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-lg">
              {product.brand}
            </span>
          )}
          {sizeLabel && (
            <span className="flex items-center gap-1 bg-sky-50 text-sky-700 text-[11px] font-medium px-2.5 py-1 rounded-lg">
              <Package size={11} />
              {sizeLabel}
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Outlet */}
        {outlet && (
          <div className="mb-3 pb-3 border-b border-slate-100 flex items-start gap-2.5">
            <div className="bg-sky-50 p-1.5 rounded-lg mt-0.5 flex-shrink-0">
              <MapPin size={14} className="text-sky-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">
                {outlet.name || outlet.outlet_name}
              </p>
              {(outlet.vendor || outlet.vendor_name) && (
                <p className="text-xs text-slate-400 truncate">
                  {outlet.vendor || outlet.vendor_name}
                </p>
              )}
              {outlet.distance !== undefined && outlet.distance > 0 && (
                <p className="text-xs text-sky-600 font-medium mt-0.5">
                  {outlet.distance.toFixed(1)} km away
                </p>
              )}
            </div>
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-teal-700 font-extrabold text-2xl leading-none">
              KES {product.price.toLocaleString()}
            </p>
            {product.stock > 0 && (
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <Package size={11} />
                {product.stock} in stock
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="
              flex items-center gap-2 bg-teal-600 text-white
              px-4 py-2.5 rounded-xl font-semibold text-sm
              hover:bg-teal-700 active:scale-95
              disabled:bg-slate-300 disabled:cursor-not-allowed
              transition-all duration-200 shadow-md hover:shadow-teal-200
            "
          >
            <ShoppingCart size={17} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* View details */}
        <Link
          href={`/products/${productId}`}
          className="
            mt-3 flex items-center justify-center gap-1
            text-sm text-sky-600 font-medium
            hover:text-sky-700 hover:underline underline-offset-2
            transition-colors
          "
        >
          View Details
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}


// ============================================================
// HORIZONTAL SCROLL USAGE
// ============================================================
//
// Compact (slim row, e.g. "Featured Products"):
//
//   <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
//     {products.map((product) => (
//       <ProductCard
//         key={product.id || product.product_id}
//         product={product}
//         outlet={outlet}
//         compact
//       />
//     ))}
//   </div>
//
// Full cards in a scroll row:
//
//   <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
//     {products.map((product) => (
//       <div key={product.id} className="w-[300px] flex-shrink-0 snap-start">
//         <ProductCard product={product} outlet={outlet} />
//       </div>
//     ))}
//   </div>
//
// globals.css — hide scrollbar:
//   .scrollbar-hide::-webkit-scrollbar { display: none; }
//   .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
