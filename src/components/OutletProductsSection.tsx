// ============================================================
// FILE: src/components/OutletProductsSection.tsx
// Display Products Grouped by Outlet/Vendor
// ============================================================

import { Product, Outlet } from '@/lib/types';
import ProductCard from './ProductCard';
import { MapPin, Star, Phone, ChevronRight, Store } from 'lucide-react';
import Link from 'next/link';

interface OutletProductsSectionProps {
  outlet: Outlet;
  products: Product[];
  showOutletHeader?: boolean;
}

export default function OutletProductsSection({
  outlet,
  products,
  showOutletHeader = true,
}: OutletProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Outlet Header */}
      {showOutletHeader && (
        <div className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between gap-4">
            {/* Outlet Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2.5 rounded-lg">
                  <Store size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {outlet.name || outlet.outlet_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {outlet.vendor || outlet.vendor_name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Location */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-gray-700">{outlet.address}</p>
                    {outlet.distance !== undefined && outlet.distance > 0 && (
                      <p className="text-blue-600 font-semibold mt-0.5">
                        {outlet.distance.toFixed(1)} km away
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact */}
                {outlet.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-green-600" />
                    <a
                      href={`tel:${outlet.phone}`}
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      {outlet.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Rating */}
              {outlet.rating > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg">
                    <Star size={16} fill="currentColor" className="text-yellow-500" />
                    <span className="font-bold text-gray-900">{outlet.rating.toFixed(1)}</span>
                  </div>
                  {outlet.reviews > 0 && (
                    <span className="text-sm text-gray-500">
                      ({outlet.reviews} {outlet.reviews === 1 ? 'review' : 'reviews'})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* View Outlet Button */}
            <Link
              href={`/shop/${outlet.id || outlet.outlet_id}`}
              className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <span>View Outlet</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          {/* Product Count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{products.length}</span>{' '}
              {products.length === 1 ? 'product' : 'products'} available
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id || product.product_id}
            product={product}
            outlet={outlet}
            compact={true}
          />
        ))}
      </div>
    </section>
  );
}
