// ============================================================
// FILE: src/pages/shop/[vendorId].tsx
// Vendor Specific Page - Display vendor info and their products
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Clock, 
  ArrowLeft, 
  Loader,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { outletService } from '@/lib/api';
import { Outlet, Product, ProductCategory } from '@/lib/types';
import toast from 'react-hot-toast';

// Extended Product type to handle backend response format
interface ProductWithOutlet extends Omit<Product, 'category'> {
  outlet_id?: string;
  category?: ProductCategory | string | null;
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
  const [expandedDetails, setExpandedDetails] = useState(false);

  useEffect(() => {
    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId, categoryFilter, currentPage]);

  const getCategoryName = (category: ProductCategory | string | null | undefined): string | null => {
    if (!category) return null;

    if (typeof category === 'string') {
      return category;
    }

    // Handle ProductCategory object
    if (typeof category === 'object') {
      return (category as ProductCategory).category_name || null;
    }

    return null;
  };

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
        const categoryName = getCategoryName(product.category);
        if (categoryName) {
          uniqueCategories.add(categoryName);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
            <p className="text-slate-700 font-medium">Loading vendor information...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-20 h-20 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin size={40} className="text-slate-400" />
              </div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-3">Outlet Not Found</h2>
              <p className="text-slate-600 leading-relaxed">
                The outlet you're looking for doesn't exist or is no longer available.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              <ArrowLeft size={18} />
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Sticky Back Button */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
          <div className="container mx-auto">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Shop
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-slate-800 text-white">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full -ml-36 -mb-36"></div>
          </div>

          <div className="relative container mx-auto px-4 py-16 md:py-20">
            {/* Vendor Header Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                {/* Title with Badge */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                      {outlet.name}
                    </h1>
                    {outlet.featured && (
                      <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold">
                        <Star size={16} fill="currentColor" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-blue-100 font-medium">{outlet.vendor}</p>
                </div>

                {/* Rating Summary */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < Math.round(outlet.rating) ? 'fill-amber-400 text-amber-400' : 'text-blue-400'}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold ml-2">{outlet.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-sm text-blue-100">
                    <p className="font-semibold">{outlet.reviews} customer reviews</p>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`tel:${outlet.phone}`}
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Phone size={18} />
                    Call Now
                  </a>
                  {outlet.latitude && outlet.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${outlet.latitude},${outlet.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition-colors font-semibold shadow-lg hover:shadow-xl"
                    >
                      <MapPin size={18} />
                      Get Directions
                    </a>
                  )}
                </div>
              </div>

              {/* Rating Card */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Overall Rating</p>
                      <p className="text-5xl font-bold text-white">{outlet.rating.toFixed(1)}</p>
                      <p className="text-blue-100 text-sm">{outlet.reviews} reviews</p>
                    </div>
                    
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-blue-100 text-sm font-medium mb-3">Response Time</p>
                      <div className="inline-block bg-blue-500/30 rounded-full px-4 py-2">
                        <p className="text-white font-semibold">Usually within 30 mins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Details Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Location</p>
                  <p className="text-sm text-slate-900 font-medium mt-1">{outlet.address}</p>
                  {outlet.distance && (
                    <p className="text-xs text-slate-600 mt-1">{outlet.distance} km away</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">Phone</p>
                  <a href={`tel:${outlet.phone}`} className="text-sm text-blue-600 font-medium mt-1 hover:underline">
                    {outlet.phone}
                  </a>
                </div>
              </div>
            </div>

            {outlet.email && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500 font-semibold">Email</p>
                    <a href={`mailto:${outlet.email}`} className="text-sm text-blue-600 font-medium mt-1 hover:underline">
                      {outlet.email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {outlet.opening_hours && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500 font-semibold">Hours</p>
                    <p className="text-sm text-slate-900 font-medium mt-1">{outlet.opening_hours}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8 pb-16">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Products</h2>
                <p className="text-slate-600">
                  {products.length} product{products.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setCategoryFilter(category);
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-full whitespace-nowrap font-semibold transition-all ${
                      categoryFilter === category
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg 
                    className="w-10 h-10 text-slate-400" 
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
                <p className="text-slate-700 text-lg font-medium mb-2">
                  {categoryFilter === 'All' 
                    ? 'No products available yet'
                    : `No products in "${categoryFilter}"`
                  }
                </p>
                <p className="text-slate-600 text-sm mb-6">
                  Check back soon for new products
                </p>
                {categoryFilter !== 'All' && (
                  <button
                    onClick={() => {
                      setCategoryFilter('All');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View All Products
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as Product} outlet={outlet} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-slate-700"
                  >
                    <ChevronUp size={18} />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-slate-700"
                  >
                    Next
                    <ChevronDown size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-slate-200 bg-slate-50 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-700 mb-4">Have questions about this vendor?</p>
            <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              <MessageCircle size={18} />
              Contact Vendor
            </button>
          </div>
        </div>
      </div>
    </>
  );
}