// src/components/ProductCard.tsx
import { Product, Outlet } from '@/lib/types';
import { useCart } from '@/lib/hooks/useCart';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  outlet: Outlet;
  compact?: boolean;
}

export default function ProductCard({ product, outlet, compact = false }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // Fallback product name
  const productDisplayName = product.name || product.title || 'Unnamed Product';

  const handleAddToCart = () => {
    addToCart(product, outlet);
    toast.success(`${productDisplayName} added to cart!`);
  };

  if (compact) {
    return (
      <div className="min-w-[200px] bg-white rounded-lg shadow p-2 flex-shrink-0 hover:shadow-md transition">
        <img 
          src={product.image || '/placeholder-product.jpg'} 
          alt={productDisplayName} 
          className="w-full h-32 object-cover rounded"
        />
        <h3 className="mt-2 font-semibold text-sm">{productDisplayName}</h3>
        <p className="text-blue-600 font-bold">KES {product.price}</p>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-2 w-full bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          Add to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <img 
        src={product.image || '/placeholder-product.jpg'} 
        alt={productDisplayName} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{productDisplayName}</h3>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 font-bold text-xl">KES {product.price}</p>
            {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
              <p className="text-sm text-orange-600">Only {product.stock} left</p>
            )}
            {product.stock === 0 && (
              <p className="text-sm text-red-600 font-semibold">Out of stock</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            title="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
