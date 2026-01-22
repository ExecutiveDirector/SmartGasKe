// ============================================================
// FILE: src/pages/shop/index.tsx
// Shop Main Page - Display all products with filters (FIXED TYPES)
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, Loader } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import VendorCard from '@/components/VendorCard';
import FilterComponent from '@/components/Filter';
import { Product, Outlet } from '@/lib/types';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api';

// Backend response types
interface BackendVendor {
  vendor_id: number;
  business_name: string;
  business_email: string;
  business_phone: string;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  total_reviews: number;
  vendor_outlets?: BackendOutlet[];
}

interface BackendOutlet {
  outlet_id: number;
  outlet_name: string;
  outlet_code: string;
  latitude: number;
  longitude: number;
  address_line_1: string;
  city: string;
  county: string;
}

interface BackendProduct {
  product_id: number;
  product_name: string;
  product_code: string;
  brand: string;
  base_price: number;
  description: string;
  product_images: string;
  category_name: string;
  stock: number;
  price: number;
  is_available: boolean;
  outlet_name: string;
  vendor_name: string;
  size_specification: string;
  unit_of_measure: string;
  is_featured?: boolean;
  category_id?: number;
}

interface BackendCategory {
  category_id: number;
  category_name: string;
  description: string;
}

// Extended Product type - properly typed
interface ProductWithOutlet extends Product {
  outlet_id?: string;
  outlet_name?: string;
  vendor_name?: string;
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
  const itemsPerPage = 20;

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch products when filters or page change
  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [searchTerm, categoryFilter, currentPage]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [vendorsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/vendors?page=1&limit=50`).then(r => r.json()),
        fetch(`${API_URL}/products/categories`).then(r => r.json()).catch(() => []),
      ]);

      // Process vendors and outlets
      const vendors: BackendVendor[] = vendorsRes;
      const allOutlets: Outlet[] = [];

      vendors.forEach((vendor) => {
        if (vendor.vendor_outlets && vendor.vendor_outlets.length > 0) {
          vendor.vendor_outlets.forEach((outlet) => {
            allOutlets.push({
              id: outlet.outlet_id.toString(),
              name: outlet.outlet_name,
              vendor: vendor.business_name,
              address: `${outlet.address_line_1}, ${outlet.city}`,
              distance: 0,
              rating: vendor.rating || 0,
              reviews: vendor.total_reviews || 0,
              phone: vendor.business_phone,
              featured: vendor.is_featured,
              is_active: vendor.is_active,
              latitude: outlet.latitude,
              longitude: outlet.longitude,
            });
          });
        }
      });

      setOutlets(allOutlets);

      // Process categories
      const cats: BackendCategory[] = categoriesRes;
      const categoryNames = cats.map((cat) => cat.category_name);
      setCategories(['All', ...categoryNames]);

      // Fetch initial products
      await fetchProducts();

    } catch (error: any) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load shop data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Build query params
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      
      // Fetch all vendors
      const vendorsRes = await fetch(`${API_URL}/vendors?page=1&limit=50`);
      const vendors: BackendVendor[] = await vendorsRes.json();

      // Fetch products from each vendor
      const allProductsPromises = vendors
        .filter(v => v.is_active)
        .map(async (vendor) => {
          try {
            const productsRes = await fetch(
              `${API_URL}/vendors/${vendor.vendor_id}/products?${params.toString()}`
            );
            if (!productsRes.ok) return [];
            const vendorProducts: BackendProduct[] = await productsRes.json();
            return vendorProducts;
          } catch (err) {
            console.error(`Error fetching products for vendor ${vendor.vendor_id}:`, err);
            return [];
          }
        });

      const productsArrays = await Promise.all(allProductsPromises);
      const allBackendProducts = productsArrays.flat();

      // Transform to frontend format with all required Product fields
      let transformedProducts: ProductWithOutlet[] = allBackendProducts.map((p) => ({
        // Required Product fields
        id: p.product_id.toString(),
        name: p.product_name,
        title: p.product_name,
        description: p.description || '',
        price: p.price || p.base_price,
        image: parseProductImage(p.product_images),
        category: p.category_name || 'Other',
        rating: 4.5,
        reviews: 0,
        inStock: p.is_available && p.stock > 0,
        stock: p.stock,
        featured: p.is_featured || false,
        brand: p.brand || '',
        size: p.size_specification || '',
        unit: p.unit_of_measure || '',
        is_active: p.is_available,
        isActive: p.is_available,
        is_featured: p.is_featured || false,
        
        // Additional backend fields
        product_id: p.product_id,
        product_name: p.product_name,
        product_code: p.product_code,
        base_price: p.base_price,
        product_images: p.product_images,
        outlet_id: p.outlet_name,
        outlet_name: p.outlet_name,
        vendor_name: p.vendor_name,
      }));

      // Apply category filter
      if (categoryFilter !== 'All') {
        transformedProducts = transformedProducts.filter(
          p => p.category === categoryFilter
        );
      }

      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        transformedProducts = transformedProducts.filter(
          p => 
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            (p.brand && p.brand.toLowerCase().includes(search)) ||
            (p.vendor_name && p.vendor_name.toLowerCase().includes(search))
        );
      }

      // Separate featured products
      const featured = transformedProducts.filter(p => p.featured).slice(0, 4);
      setFeaturedProducts(featured);

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProducts = transformedProducts.slice(startIndex, endIndex);
      
      setProducts(paginatedProducts);
      setTotalPages(Math.ceil(transformedProducts.length / itemsPerPage) || 1);

    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const parseProductImage = (images: string): string => {
    if (!images) return '/images/placeholder-product.jpg';
    try {
      const imageArray = JSON.parse(images);
      return imageArray[0] || '/images/placeholder-product.jpg';
    } catch {
      return images || '/images/placeholder-product.jpg';
    }
  };

  const getOutletForProduct = (product: ProductWithOutlet): Outlet | null => {
    // Find outlet by name match
    if (product.outlet_name) {
      return outlets.find((o) => o.name === product.outlet_name) || null;
    }
    
    // Fallback: return first outlet if available
    return outlets.length > 0 ? outlets[0] : null;
  };

  const createFallbackOutlet = (product: ProductWithOutlet): Outlet => {
    return {
      id: product.outlet_id || 'unknown',
      name: product.outlet_name || 'Product Available',
      vendor: product.vendor_name || 'AquaGas',
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
          <div className="text-center">
            <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading products...</p>
          </div>
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
                      outlet={outlet || createFallbackOutlet(product)} 
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
                      outlet={outlet || createFallbackOutlet(product)} 
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
