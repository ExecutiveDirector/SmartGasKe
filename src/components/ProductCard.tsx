// ============================================================
// FILE: src/components/ProductCard.tsx
// Enhanced Product Card with Outlet Information
// ============================================================

import { Product, Outlet } from '@/lib/types';
import { useCart } from '@/lib/hooks/useCart';
import { ShoppingCart, MapPin, Star, Package, Award } from 'lucide-react';
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
  
  // Fallback product name
  const productDisplayName = product.name || product.title || product.product_name || 'Unnamed Product';
  
  // Parse product image (handle JSON string from backend)
  const getProductImage = (): string => {
    if (product.image) return product.image;
    
    if (product.product_images) {
      try {
        const images = typeof product.product_images === 'string' 
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
    // Validate product has required fields
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

  // Compact view for featured/carousel products
  if (compact) {
    return (
      <div className="min-w-[200px] bg-white rounded-xl shadow-md p-3 flex-shrink-0 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300">
        {/* Product Image */}
        <div className="relative">
          <img 
            src={getProductImage()} 
            alt={productDisplayName} 
            className="w-full h-32 object-cover rounded-lg"
          />
          {product.featured && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Award size={12} />
              Featured
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3">
          <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 min-h-[40px]">
            {productDisplayName}
          </h3>
          
          {product.brand && (
            <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
          )}
          
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-bold text-lg">
                KES {product.price.toLocaleString()}
              </p>
              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-xs text-orange-600">Only {product.stock} left</p>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full product card
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:-translate-y-1 group">
      {/* Product Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={getProductImage()} 
          alt={productDisplayName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Award size={14} />
              Featured
            </div>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <div className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
              Only {product.stock} left
            </div>
          )}
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              Out of Stock
            </span>
          </div>
        )}

        {/* Rating (if available) */}
        {product.rating > 0 && (
          <div className="absolute bottom-3 right-3 bg-white bg-opacity-95 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
            <Star size={14} fill="currentColor" className="text-yellow-500" />
            <span className="font-bold text-sm text-gray-800">{product.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[56px] group-hover:text-blue-600 transition">
          {productDisplayName}
        </h3>

        {/* Brand & Size */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {product.brand && (
            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium">
              {product.brand}
            </span>
          )}
          {(product.size || product.size_specification || product.sizeSpecification) && (
            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
              <Package size={12} />
              {product.size || product.size_specification || product.sizeSpecification}
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Outlet Information */}
        {!compact && outlet && (
          <div className="mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {outlet.name || outlet.outlet_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {outlet.vendor || outlet.vendor_name}
                </p>
                {outlet.distance !== undefined && outlet.distance > 0 && (
                  <p className="text-xs text-blue-600 font-medium mt-0.5">
                    {outlet.distance.toFixed(1)} km away
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-blue-600 font-bold text-2xl">
              KES {product.price.toLocaleString()}
            </p>
            {product.stock > 0 && (
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                <Package size={12} />
                {product.stock} in stock
              </p>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
            title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* View Details Link */}
        <Link 
          href={`/products/${product.id || product.product_id}`}
          className="block mt-3 text-center text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
