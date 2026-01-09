// src/components/ProductCard.tsx
import { Product, Outlet } from '@/lib/types';
import { useCart } from '@/lib/hooks/useCart';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  outlet: Outlet;
}

export default function ProductCard({ product, outlet }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, outlet);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <img 
        src={product.image || '/placeholder-product.jpg'} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 font-bold text-xl">KES {product.price}</p>
            {product.stock <= 10 && product.stock > 0 && (
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