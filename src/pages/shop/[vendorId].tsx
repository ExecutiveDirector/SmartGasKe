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

export default function VendorPage() {
  const router = useRouter();
  const { vendorId } = router.query;
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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
      setOutlet(outletResponse.data);

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
      setProducts(productsResponse.data);
      setTotalPages(productsResponse.pagination.pages);

      // Extract unique categories
      const uniqueCategories = [
        'All',
        ...new Set(productsResponse.data.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error('Error fetching vendor data:', error);
      toast.error('Failed to load vendor information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Outlet Not Found</h2>
          <Link
            href="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Shop
          </Link>
        </div>
      </div>
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
                      <span className="text-3xl font-bold">{outlet.rating}</span>
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
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No products available in this category
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('All');
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                View All Products
              </button>
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
                  <span className="text-gray-600 font-semibold">
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
    