// ============================================================
// FILE: src/pages/shop/index.tsx
// Shop Page - Fetches data like Flutter app (outlet-based)
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, Loader, MapPin } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import VendorCard from '@/components/VendorCard';
import FilterComponent from '@/components/Filter';
import { Product, Outlet } from '@/lib/types';
import toast from 'react-hot-toast';

// Matches Flutter's OutletProducts structure
interface OutletProducts {
  outletId: string;
  outletName: string;
  vendorName: string;
  distance?: number;
  products: Product[];
}

export default function ShopPage() {
  const [nearbyOutlets, setNearbyOutlets] = useState<OutletProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [sortFilter, setSortFilter] = useState<'nearest' | 'priceAsc' | 'priceDesc' | 'rating' | 'availability'>('nearest');
  const [radius, setRadius] = useState(20); // km
  
  // User location - get from browser geolocation or use default
  const [userLat, setUserLat] = useState(-1.2921); // Default: Nairobi
  const [userLng, setUserLng] = useState(36.8219);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLat && userLng) {
      fetchProducts(userLat, userLng);
    }
  }, [userLat, userLng, radius]);

  useEffect(() => {
    applyFilters();
  }, [sortFilter, categoryFilter, searchTerm]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Use default location (Nairobi)
          toast.info('Using default location: Nairobi');
        }
      );
    }
  };

  // Mirrors Flutter's _fetchProducts method
  const fetchProducts = async (lat: number, lng: number) => {
    setLoading(true);
    
    try {
      // Call your backend API that returns outlets with products
      // This matches your Flutter ProductService.fetchProducts
      const token = localStorage.getItem('token'); // Adjust based on your auth implementation
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?lat=${lat}&lng=${lng}&radius=${radius}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      
      // Backend should return: { [vendorName]: { [outletId]: OutletProducts } }
      // Flatten the nested structure like Flutter does
      const allOutlets: OutletProducts[] = [];
      
      for (const vendorName in data) {
        for (const outletId in data[vendorName]) {
          allOutlets.push(data[vendorName][outletId]);
        }
      }

      // If no outlets found within radius, try fetching ALL products (radius = 0)
      if (allOutlets.length === 0 && radius > 0) {
        console.log('No outlets within radius. Fetching all products...');
        const fallbackResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?lat=${lat}&lng=${lng}&radius=0`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          }
        );
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          for (const vendorName in fallbackData) {
            for (const outletId in fallbackData[vendorName]) {
              allOutlets.push(fallbackData[vendorName][outletId]);
            }
          }
        }
      }

      setNearbyOutlets(allOutlets);
      
      // Extract unique categories
      const uniqueCategories = new Set<string>();
      allOutlets.forEach(outlet => {
        outlet.products.forEach(product => {
          if (product.category) {
            const categoryName = typeof product.category === 'string' 
              ? product.category 
              : product.category.category_name;
            uniqueCategories.add(categoryName);
          }
        });
      });
      setCategories(['All', ...Array.from(uniqueCategories).sort()]);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mirrors Flutter's _applyFilter method
  const applyFilters = () => {
    let filteredOutlets = [...nearbyOutlets];

    // Apply category filter
    if (categoryFilter !== 'All') {
      filteredOutlets = filteredOutlets.map(outlet => ({
        ...outlet,
        products: outlet.products.filter(product => {
          const categoryName = typeof product.category === 'string' 
            ? product.category 
            : product.category?.category_name;
          return categoryName === categoryFilter;
        })
      })).filter(outlet => outlet.products.length > 0);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filteredOutlets = filteredOutlets.map(outlet => ({
        ...outlet,
        products: outlet.products.filter(product => 
          product.title.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search) ||
          product.brand?.toLowerCase().includes(search)
        )
      })).filter(outlet => outlet.products.length > 0);
    }

    // Apply sorting
    switch (sortFilter) {
      case 'nearest':
        filteredOutlets.sort((a, b) => {
          const distA = a.distance ?? Infinity;
          const distB = b.distance ?? Infinity;
          return distA - distB;
        });
        break;

      case 'priceAsc':
        filteredOutlets.sort((a, b) => {
          const minPriceA = a.products.length === 0 ? Infinity : Math.min(...a.products.map(p => p.price));
          const minPriceB = b.products.length === 0 ? Infinity : Math.min(...b.products.map(p => p.price));
          return minPriceA - minPriceB;
        });
        break;

      case 'priceDesc':
        filteredOutlets.sort((a, b) => {
          const maxPriceA = a.products.length === 0 ? 0 : Math.max(...a.products.map(p => p.price));
          const maxPriceB = b.products.length === 0 ? 0 : Math.max(...b.products.map(p => p.price));
          return maxPriceB - maxPriceA;
        });
        break;

      case 'rating':
        filteredOutlets.sort((a, b) => {
          const avgRatingA = a.products.length === 0 ? 0 : 
            a.products.reduce((sum, p) => sum + (p.rating || 0), 0) / a.products.length;
          const avgRatingB = b.products.length === 0 ? 0 : 
            b.products.reduce((sum, p) => sum + (p.rating || 0), 0) / b.products.length;
          return avgRatingB - avgRatingA;
        });
        break;

      case 'availability':
        filteredOutlets.sort((a, b) => {
          const availableA = a.products.filter(p => p.stock > 0).length;
          const availableB = b.products.filter(p => p.stock > 0).length;
          return availableB - availableA;
        });
        break;
    }

    setNearbyOutlets(filteredOutlets);
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
            <p className="text-gray-600">Loading nearby outlets...</p>
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
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop LPG Products</h1>
            <p className="text-xl mb-4">Find the best gas cylinders and accessories near you</p>
            <div className="flex items-center gap-2 text-green-100">
              <MapPin size={20} />
              <span>Showing outlets within {radius} km</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filter Bar */}
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="nearest">Nearest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="availability">In Stock</option>
                </select>
              </div>

              {/* Radius Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Radius: {radius} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Outlets List - Mirrors Flutter's VendorProductsSection */}
          {nearbyOutlets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No outlets found</h3>
                <p className="text-gray-600 mb-6">
                  Try increasing the search radius or adjusting your filters
                </p>
                <button
                  onClick={() => {
                    setRadius(50);
                    setCategoryFilter('All');
                    setSearchTerm('');
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {nearbyOutlets.map((outlet) => (
                <OutletSection
                  key={outlet.outletId}
                  outlet={outlet}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Component that mirrors Flutter's VendorProductsSection
function OutletSection({ outlet }: { outlet: OutletProducts }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Outlet Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin size={28} className="text-green-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{outlet.outletName}</h3>
              <p className="text-sm text-gray-600">{outlet.vendorName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {outlet.distance && (
              <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
                outlet.distance <= 5 
                  ? 'bg-green-100 text-green-800'
                  : outlet.distance <= 10
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                <MapPin size={14} className="inline mr-1" />
                {outlet.distance.toFixed(1)} km
              </div>
            )}
            
            <Link
              href={`/shop/${outlet.outletId}`}
              className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
            >
              View All
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal Product Scroll */}
      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {outlet.products.map((product) => (
            <div key={product.id} className="flex-shrink-0" style={{ width: '280px' }}>
              <ProductCard 
                product={product} 
                outlet={{
                  id: outlet.outletId,
                  name: outlet.outletName,
                  vendor: outlet.vendorName,
                  is_active: true,
                  rating: 0,
                  reviews: 0,
                  address: '',
                  phone: '',
                  featured: false
                }} 
                compact={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Add this CSS to hide scrollbar but keep functionality
const styles = `
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
