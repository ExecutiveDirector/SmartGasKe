// ============================================================
// FILE: src/pages/shop/index.tsx
// Enhanced Shop Page - Products Grouped by Outlets
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ChevronRight, Loader, MapPin, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import OutletProductsSection from '@/components/OutletProductsSection';
import FilterComponent from '@/components/Filter';
import { Product, Outlet } from '@/lib/types';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';

interface OutletWithProducts {
  outlet: Outlet;
  products: Product[];
}

export default function ShopPage() {
  const [outletsWithProducts, setOutletsWithProducts] = useState<OutletWithProducts[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [radiusKm, setRadiusKm] = useState(20);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy] = useState<'nearest' | 'price-asc' | 'price-desc' | 'rating'>('nearest');

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyProducts();
    }
  }, [userLocation, radiusKm, searchTerm, categoryFilter, sortBy]);

  /**
   * Get user's current location
   */
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Nairobi coordinates
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
          toast.error('Could not get your location. Showing results for Nairobi.');
        }
      );
    } else {
      // Default to Nairobi coordinates
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
      toast.error('Geolocation not supported. Showing results for Nairobi.');
    }
  };

  /**
   * Fetch products grouped by nearby outlets
   */
  const fetchNearbyProducts = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/products/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radiusKm}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby products');
      }

      const data = await response.json();
      
      console.log('Nearby products response:', data);

      // Parse the response structure (vendors -> outlets -> products)
      const vendors = Array.isArray(data.vendors) ? data.vendors : [];
      const allOutletsWithProducts: OutletWithProducts[] = [];
      const allCategories = new Set<string>();
      const featured: Product[] = [];

      vendors.forEach((vendor: any) => {
        const outlets = vendor.outlets || [];
        
        outlets.forEach((outletData: any) => {
          const products = (outletData.products || [])
            .filter((p: any) => p.is_available || p.isActive)
            .map((p: any) => parseProduct(p, vendor, outletData));

          // Apply filters
          let filteredProducts = products;

          // Category filter
          if (categoryFilter !== 'All') {
            filteredProducts = filteredProducts.filter((p: Product) => {
              const categoryName = typeof p.category === 'string' 
                ? p.category 
                : p.category?.category_name;
              return categoryName === categoryFilter;
            });
          }

          // Search filter
          if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(
              (p: Product) =>
                p.name?.toLowerCase().includes(search) ||
                p.description?.toLowerCase().includes(search) ||
                p.brand?.toLowerCase().includes(search)
            );
          }

          if (filteredProducts.length > 0) {
            // Collect categories
            filteredProducts.forEach((p: Product) => {
              if (p.category) {
                const categoryName = typeof p.category === 'string' 
                  ? p.category 
                  : p.category.category_name;
                allCategories.add(categoryName);
              }
              if (p.is_featured || p.featured) featured.push(p);
            });

            const outlet: Outlet = {
              id: outletData.outlet_id?.toString() || '',
              outlet_id: outletData.outlet_id,
              name: outletData.outlet_name || '',
              outlet_name: outletData.outlet_name,
              vendor: vendor.name || vendor.business_name || '',
              vendor_id: vendor.vendor_id,
              vendor_name: vendor.name || vendor.business_name,
              distance: outletData.distance_km || 0,
              distance_km: outletData.distance_km,
              rating: vendor.rating || 4.0,
              reviews: vendor.total_reviews || 0,
              address: outletData.location?.address || outletData.address_line_1 || '',
              phone: vendor.business_phone || outletData.phone || '',
              contact_phone: vendor.business_phone || outletData.phone,
              featured: vendor.is_featured || false,
              is_active: vendor.is_active !== false,
              latitude: outletData.location?.latitude,
              longitude: outletData.location?.longitude,
              city: outletData.city,
              county: outletData.county,
            };

            allOutletsWithProducts.push({
              outlet,
              products: filteredProducts,
            });
          }
        });
      });

      // Sort outlets
      sortOutlets(allOutletsWithProducts);

      setOutletsWithProducts(allOutletsWithProducts);
      setFeaturedProducts(featured.slice(0, 4));
      setCategories(['All', ...Array.from(allCategories)]);

    } catch (error: any) {
      console.error('Error fetching nearby products:', error);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Parse product from backend format
   */
  const parseProduct = (p: any, vendor: any, outlet: any): Product => {
    return {
      id: p.product_id?.toString() || p.id?.toString() || '',
      product_id: p.product_id,
      name: p.product_name || p.name || '',
      title: p.product_name || p.name || '',
      product_name: p.product_name || p.name,
      description: p.description || '',
      price: p.price || p.base_price || 0,
      base_price: p.base_price || p.price || 0,
      image: parseProductImage(p.product_images || p.image),
      product_images: p.product_images,
      category: p.category_name || p.category || 'Other',
      rating: p.rating || 4.5,
      reviews: p.reviews || 0,
      inStock: p.stock > 0,
      stock: p.stock || 0,
      featured: p.is_featured || false,
      is_featured: p.is_featured || false,
      brand: p.brand || '',
      size: p.size_specification || '',
      size_specification: p.size_specification,
      unit: p.unit_of_measure || '',
      unit_of_measure: p.unit_of_measure,
      is_active: p.is_available !== false,
      isActive: p.is_available !== false,
      outlet_id: outlet.outlet_id?.toString(),
      outlet_name: outlet.outlet_name,
      vendor_name: vendor.name || vendor.business_name,
      vendor_id: vendor.vendor_id,
    };
  };

  /**
   * Parse product image from JSON string or array
   */
  const parseProductImage = (images: any): string => {
    if (!images) return '/images/placeholder-product.jpg';
    
    try {
      const imageArray = typeof images === 'string' ? JSON.parse(images) : images;
      return Array.isArray(imageArray) && imageArray[0] 
        ? imageArray[0] 
        : '/images/placeholder-product.jpg';
    } catch {
      return typeof images === 'string' ? images : '/images/placeholder-product.jpg';
    }
  };

  /**
   * Sort outlets based on selected criteria
   */
  const sortOutlets = (outlets: OutletWithProducts[]) => {
    outlets.sort((a, b) => {
      switch (sortBy) {
        case 'nearest':
          return (a.outlet.distance || 0) - (b.outlet.distance || 0);
        
        case 'price-asc':
          const minPriceA = Math.min(...a.products.map(p => p.price));
          const minPriceB = Math.min(...b.products.map(p => p.price));
          return minPriceA - minPriceB;
        
        case 'price-desc':
          const maxPriceA = Math.max(...a.products.map(p => p.price));
          const maxPriceB = Math.max(...b.products.map(p => p.price));
          return maxPriceB - maxPriceA;
        
        case 'rating':
          return b.outlet.rating - a.outlet.rating;
        
        default:
          return 0;
      }
    });
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
            <p className="text-gray-600">Finding nearby products...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shop Nearby - AquaGas</title>
        <meta name="description" content="Shop for LPG products from nearby outlets" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Shop Nearby
            </h1>
            <p className="text-xl text-center mb-6">
              Find LPG products from outlets near you
            </p>
            
            {userLocation && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <MapPin size={16} />
                <span>Showing results within {radiusKm} km</span>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => {
                  const outlet = outletsWithProducts.find(
                    o => o.products.some(p => p.id === product.id)
                  )?.outlet;
                  
                  return outlet ? (
                    <ProductCard
                      key={product.id}
                      product={product}
                      outlet={outlet}
                      compact={true}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="nearest">Nearest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* Radius */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Radius: {radiusKm} km
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Outlets with Products */}
          {outletsWithProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No products found within {radiusKm} km
              </p>
              <button
                onClick={() => {
                  setRadiusKm(50);
                  setSearchTerm('');
                  setCategoryFilter('All');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Expand Search
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {outletsWithProducts.map((item) => (
                <OutletProductsSection
                  key={item.outlet.id || item.outlet.outlet_id}
                  outlet={item.outlet}
                  products={item.products}
                  showOutletHeader={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
