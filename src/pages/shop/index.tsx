// ============================================================
// FILE: src/pages/shop/index.tsx
// Shop Main Page - Display all products with filters
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, Loader } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import VendorCard from '@/components/VendorCard';
import FilterComponent from '@/components/Filter';
import productService from '@/lib/services/productService';
import { outletService } from '@/lib/api';
import { Product, Outlet } from '@/lib/types';
import toast from 'react-hot-toast';

// Extended Product type to include outlet_id from backend
interface ProductWithOutlet extends Product {
  outlet_id?: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<ProductWithOutlet[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithOutlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch products when filters or page change
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, currentPage]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch categories
      const categoriesResponse = await productService.getCategories();
      
      // Extract category names from ProductCategory objects
      const categoryNames = categoriesResponse.map((cat) => cat.category_name);
      setCategories(['All', ...categoryNames]);

      // Fetch featured products
      const featuredResponse = await productService.getFeaturedProducts(4);
      setFeaturedProducts(featuredResponse);

      // Fetch outlets
      const outletsResponse = await outletService.getAllOutlets({ limit: 20 });
      
      // Handle different response formats
      const outletsData = outletsResponse.data || outletsResponse;
      setOutlets(Array.isArray(outletsData) ? outletsData : []);
    } catch (error: any) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load shop data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (searchTerm) params.search = searchTerm;
      if (categoryFilter !== 'All') params.category = categoryFilter;

      const response = await productService.getProducts(params);
      
      // productService.getProducts returns Product[] directly
      setProducts(response);
      
      // For now, we'll calculate pages from products length
      // You may want to enhance the API to return pagination info
      setTotalPages(Math.ceil(response.length / 20) || 1);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const getOutletForProduct = (product: ProductWithOutlet): Outlet | null => {
    // If product has outlet_id, find matching outlet
    if (product.outlet_id) {
      return outlets.find((o) => o.id === product.outlet_id) || null;
    }
    
    // Fallback: return first outlet if available
    return outlets.length > 0 ? outlets[0] : null;
  };

  const createFallbackOutlet = (productOutletId?: string): Outlet => {
    return {
      id: productOutletId || 'unknown',
      name: 'Product Available',
      vendor: 'AquaGas',
      rating: 4.0,
      reviews: 0,
      address: 'Multiple locations',
      phone: '',
      featured: false,
      is_active: true,
    };
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Shop - AquaGas</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={48} />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shop - AquaGas</title>
        <meta name="description" content="Shop for LPG cylinders and accessories" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop LPG Products</h1>
            <p className="text-xl">Find the best gas cylinders and accessories near you</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Featured Products Section */}
          {featuredProducts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
                <a
                  href="#all-products"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  View All
                  <ChevronRight size={18} />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => {
                  const outlet = getOutletForProduct(product);
                  return (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      outlet={outlet || createFallbackOutlet(product.outlet_id)} 
                      compact={true} 
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Nearby Outlets */}
          {outlets.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Shop by Outlet</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outlets.slice(0, 6).map((outlet) => (
                  <VendorCard key={outlet.id} outlet={outlet} />
                ))}
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div id="all-products" className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">All Products</h2>
            <FilterComponent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={categories}
            />
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No products found</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('All');
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => {
                  const outlet = getOutletForProduct(product);
                  return (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      outlet={outlet || createFallbackOutlet(product.outlet_id)} 
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-12 h-12 rounded-lg font-semibold transition ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

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
