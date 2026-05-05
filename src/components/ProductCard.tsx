// ============================================================
// FILE: src/components/ProductCard.tsx
// Enhanced Product Card — Green & Blue Professional Theme
// ============================================================

import { Product, Outlet } from '@/lib/types';
import { useCart } from '@/lib/hooks/useCart';
import { ShoppingCart, MapPin, Star, Package, Award, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  outlet: Outlet;
  compact?: boolean;
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
        return product.product_images || '/images/placeholder-product.jpg';
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
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // ── Compact card ─────────────────────────────────────────
  if (compact) {
    return (
      <div
        className="
          min-w-[200px] flex-shrink-0 bg-white rounded-2xl overflow-hidden
          border border-slate-100 shadow-sm
          hover:shadow-md hover:border-emerald-200
          transition-all duration-300
        "
      >
        {/* Image */}
        <div className="relative h-32 overflow-hidden bg-slate-50">
          {/* FIX: absolute inset-0 ensures the image fills the container fully */}
          <img
            src={getProductImage()}
            alt={productDisplayName}
            className="absolute inset-0 w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
          />
          {product.featured && (
            <span className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
              <Award size={10} />
              Featured
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] leading-snug">
            {productDisplayName}
          </h3>
          {product.brand && (
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{product.brand}</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-teal-700 font-bold text-base leading-none">
                KES {product.price.toLocaleString()}
              </p>
              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-[10px] text-amber-600 font-medium mt-0.5">
                  {product.stock} left
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="
                bg-teal-600 text-white p-2 rounded-lg
                hover:bg-teal-700 active:scale-95
                disabled:bg-slate-300 disabled:cursor-not-allowed
                transition-all duration-200 shadow-sm
              "
              title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Full card ─────────────────────────────────────────────
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
      <div className="relative h-52 overflow-hidden bg-slate-50">
        {/* FIX: absolute inset-0 ensures the image fills the container fully */}
        <img
          src={getProductImage()}
          alt={productDisplayName}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
              <Award size={11} />
              Featured
            </span>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <span className="flex items-center gap-1 bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
              <TrendingUp size={11} />
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
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
          {(product.size || product.size_specification || product.sizeSpecification) && (
            <span className="flex items-center gap-1 bg-sky-50 text-sky-700 text-[11px] font-medium px-2.5 py-1 rounded-lg">
              <Package size={11} />
              {product.size || product.size_specification || product.sizeSpecification}
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
              <p className="text-xs text-slate-400 truncate">
                {outlet.vendor || outlet.vendor_name}
              </p>
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
            disabled={product.stock === 0}
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
          href={`/products/${product.id || product.product_id}`}
          className="
            mt-3 block text-center text-sm text-sky-600 font-medium
            hover:text-sky-700 hover:underline underline-offset-2
            transition-colors
          "
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
