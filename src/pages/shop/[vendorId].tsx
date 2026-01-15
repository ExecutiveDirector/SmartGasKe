// ============================================================
// FILE: src/pages/shop/[vendorId].tsx
// Vendor Specific Page - Display vendor info and their products
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapPin, Star, Phone, Mail, Clock, ArrowLeft, Loader } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { outletService } from '@/lib/api';
import { Outlet, Product } from '@/lib/types';
import toast from 'react-hot-toast';

// Extended Product type to include outlet_id from backend
interface ProductWithOutlet extends Product {
  outlet_id?: string;
  category?: string | null;
}

export default function VendorPage() {
  const router = useRouter();
  const { vendorId } = router.query;
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [products, setProducts] = useState<ProductWithOutlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId, categoryFilter, currentPage]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);

      // Fetch outlet details
      const outletResponse = await outletService.getOutlet(vendorId as string);
      const outletData = outletResponse.data;
      
      if (!outletData) {
        setOutlet(null);
        setLoading(false);
        return;
      }

      setOutlet(outletData);

      // Fetch outlet products
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (categoryFilter !== 'All') {
        params.category = categoryFilter;
      }

      const productsResponse = await outletService.getOutletProducts(
        vendorId as string,
        params
      );

      const productsData = productsResponse.data ?? [];
      setProducts(productsData);
      setTotalPages(productsResponse.pagination?.pages ?? 1);

      // Extract unique categories from products
      const uniqueCategories = new Set<string>();
      productsData.forEach((product) => {
        if (product.category) {
          // Handle both string and object categories
          const categoryName = typeof product.category === 'string' 
            ? product.category 
            : (product.category as any)?.category_name || (product.category as any)?.name;
          
          if (categoryName) {
            uniqueCategories.add(categoryName);
          }
        }
      });

      setCategories(['All', ...Array.from(uniqueCategories).sort()]);

    } catch (error: any) {
      console.error('Error fetching vendor data:', error);
      toast.error(error?.message || 'Failed to load vendor information');
      setOutlet(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... - AquaGas</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading vendor information...</p>
          </div>
        </div>
      </>
    );
  }

  if (!outlet) {
    return (
      <>
        <Head>
          <title>Outlet Not Found - AquaGas</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={48} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Outlet Not Found</h2>
              <p className="text-gray-600 mb-6">
                The outlet you're looking for doesn't exist or is no longer available.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <ArrowLeft size={20} />
              Back to Shop
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{outlet.name} - AquaGas</title>
        <meta name="description" content={`Shop products from ${outlet.name}`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Vendor Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 font-semibold transition"
            >
              <ArrowLeft size={20} />
              Back to Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-start gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-bold">{outlet.name}</h1>
                  {outlet.featured && (
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xl text-blue-100 mb-6">{outlet.vendor}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{outlet.address}</span>
                  </div>
                  {outlet.distance && (
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>{outlet.distance} km away</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span>{outlet.phone}</span>
                  </div>
                  {outlet.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={18} />
                      <span>{outlet.email}</span>
                    </div>
                  )}
                  {outlet.opening_hours && (
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span>{outlet.opening_hours}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Star size={24} fill="currentColor" className="text-yellow-400" />
                      <span className="text-3xl font-bold">{outlet.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold">Rating</p>
                      <p className="text-blue-200">{outlet.reviews} reviews</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a
                      href={`tel:${outlet.phone}`}
                      className="block w-full bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition text-center font-semibold"
                    >
                      Call Now
                    </a>
                    {outlet.latitude && outlet.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${outlet.latitude},${outlet.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition text-center font-semibold"
                      >
                        Get Directions
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
            {categories.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setCategoryFilter(category);
                      setCurrentPage(1);
                    }}
                    className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold transition ${
                      categoryFilter === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    className="w-10 h-10 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  {categoryFilter === 'All' 
                    ? 'No products available at this outlet yet'
                    : `No products available in the "${categoryFilter}" category`
                  }
                </p>
                {categoryFilter !== 'All' && (
                  <button
                    onClick={() => {
                      setCategoryFilter('All');
                      setCurrentPage(1);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    View All Products
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} outlet={outlet} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600 font-semibold px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
      }
