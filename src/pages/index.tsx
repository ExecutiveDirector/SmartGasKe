// ============================================================
// FILE: src/pages/index.tsx
// Enhanced Homepage with Featured Products & Nearby Vendors
// ============================================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Outlet, Product } from '@/lib/types';
import Carousel from '@/components/Carousel';
import VendorCard from '@/components/VendorCard';
import ProductCard from '@/components/ProductCard';
import { ShoppingBag, MapPin, TrendingUp, Award, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';

interface Vendor {
  vendor_id: number;
  business_name: string;
  business_email: string;
  business_phone: string;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  total_reviews: number;
  vendor_outlets?: VendorOutlet[];
}

interface VendorOutlet {
  outlet_id: number;
  outlet_name: string;
  outlet_code: string;
  latitude: number;
  longitude: number;
  address_line_1: string;
  city: string;
  county: string;
}

export default function Home() {
  const [vendors, setVendors] = useState<Outlet[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carouselImages = [
    '/images/banners/hero-banner.jpg',
    '/images/banners/promo-banner.jpg',
    '/images/banners/special-offer.jpg',
  ];

  useEffect(() => {
    getUserLocation();
    fetchData();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchData();
    }
  }, [userLocation]);

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
        }
      );
    } else {
      // Default to Nairobi coordinates
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
    }
  };

  /**
   * Calculate distance between two points using Haversine formula
   */
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /**
   * Fetch vendors and featured products
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch vendors and featured products in parallel
      const [vendorsResponse, productsResponse] = await Promise.all([
        fetch(`${API_URL}/vendors?page=1&limit=20`),
        fetch(`${API_URL}/products/featured?limit=8`),
      ]);

      // Handle vendors
      if (vendorsResponse.ok) {
        const vendorsData: Vendor[] = await vendorsResponse.json();
        const transformedVendors = transformVendors(vendorsData);
        setVendors(transformedVendors);
      }

      // Handle featured products
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        setFeaturedProducts(products.slice(0, 8));
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Transform vendor data to Outlet format
   */
  const transformVendors = (vendorsData: Vendor[]): Outlet[] => {
    return vendorsData.flatMap((vendor) => {
      // If vendor has outlets, create an Outlet entry for each
      if (vendor.vendor_outlets && vendor.vendor_outlets.length > 0) {
        return vendor.vendor_outlets
          .map((outlet) => {
            const distance = userLocation
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  outlet.latitude,
                  outlet.longitude
                )
              : 0;

            return {
              id: outlet.outlet_id.toString(),
              outlet_id: outlet.outlet_id,
              name: outlet.outlet_name,
              outlet_name: outlet.outlet_name,
              vendor: vendor.business_name,
              vendor_name: vendor.business_name,
              vendor_id: vendor.vendor_id,
              address: `${outlet.address_line_1}, ${outlet.city}`,
              distance: Math.round(distance * 10) / 10,
              rating: vendor.rating || 0,
              reviews: vendor.total_reviews || 0,
              phone: vendor.business_phone,
              contact_phone: vendor.business_phone,
              featured: vendor.is_featured,
              is_active: vendor.is_active,
              latitude: outlet.latitude,
              longitude: outlet.longitude,
              city: outlet.city,
              county: outlet.county,
            };
          })
          .sort((a, b) => a.distance - b.distance); // Sort by distance
      } else {
        // If no outlets, create a single entry with vendor info
        return [{
          id: vendor.vendor_id.toString(),
          vendor_id: vendor.vendor_id,
          name: vendor.business_name,
          vendor: vendor.business_name,
          vendor_name: vendor.business_name,
          address: 'Multiple locations',
          distance: 0,
          rating: vendor.rating || 0,
          reviews: vendor.total_reviews || 0,
          phone: vendor.business_phone,
          contact_phone: vendor.business_phone,
          featured: vendor.is_featured,
          is_active: vendor.is_active,
          latitude: 0,
          longitude: 0,
        }];
      }
    });
  };

  /**
   * Get outlet for featured product
   */
  const getOutletForProduct = (product: any): Outlet | null => {
    if (product.outlet_name || product.vendor_name) {
      return vendors.find(
        (v) => 
          v.name === product.outlet_name || 
          v.vendor === product.vendor_name
      ) || createFallbackOutlet(product);
    }
    return vendors.length > 0 ? vendors[0] : createFallbackOutlet(product);
  };

  /**
   * Create fallback outlet for products without outlet info
   */
  const createFallbackOutlet = (product: any): Outlet => {
    return {
      id: product.outlet_id?.toString() || 'default',
      name: product.outlet_name || 'AquaGas Outlet',
      vendor: product.vendor_name || 'AquaGas',
      rating: 4.0,
      reviews: 0,
      address: 'Multiple locations',
      phone: '',
      featured: false,
      is_active: true,
    };
  };

  return (
    <>
      {/* Next.js Head for SEO */}
      <Head>
        <title>AquaGas Delivery | Fast Gas Delivery in Kenya</title>
        <meta
          name="description"
          content="AquaGas delivers cooking gas cylinders quickly and reliably across Nairobi and surrounding areas. Order online for same-day delivery."
        />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="AquaGas Delivery | Fast Gas Delivery in Kenya" />
        <meta
          property="og:description"
          content="AquaGas delivers cooking gas cylinders quickly and reliably across Nairobi and surrounding areas."
        />
        <meta property="og:image" content="/images/banners/hero-banner.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aquagas.co.ke" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AquaGas Delivery | Fast Gas Delivery in Kenya" />
        <meta
          name="twitter:description"
          content="AquaGas delivers cooking gas cylinders quickly and reliably across Nairobi and surrounding areas."
        />
        <meta name="twitter:image" content="/images/banners/hero-banner.jpg" />
      </Head>

      {/* Page content */}
      <div className="min-h-screen bg-gray-50">
        {/* Hero Carousel */}
        <Carousel images={carouselImages} />

        <div className="container mx-auto px-4 py-8">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{vendors.length}+</p>
                  <p className="text-blue-100">Active Outlets</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <p className="text-2xl font-bold">Fast Delivery</p>
                  <p className="text-green-100">Within 2 Hours</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Award size={28} />
                </div>
                <div>
                  <p className="text-2xl font-bold">Trusted</p>
                  <p className="text-purple-100">Safe & Reliable</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-8 shadow-md">
              <p className="font-semibold">Error loading data</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={fetchData}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Featured Products Section */}
          {featuredProducts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
                  <p className="text-gray-600 mt-1">Popular gas cylinders and accessories</p>
                </div>
                <Link
                  href="/shop"
                  className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg"
                >
                  <span>View All</span>
                  <ArrowRight size={18} />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => {
                    const outlet = getOutletForProduct(product);
                    return outlet ? (
                      <ProductCard
                        key={product.id || product.product_id}
                        product={product}
                        outlet={outlet}
                        compact={true}
                      />
                    ) : null;
                  })}
                </div>
              )}

              {/* Mobile View All Button */}
              <Link
                href="/shop"
                className="sm:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition font-semibold mt-6 shadow-md"
              >
                <span>View All Products</span>
                <ArrowRight size={18} />
              </Link>
            </section>
          )}

          {/* Vendors Near You Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MapPin size={28} className="text-blue-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Outlets Near You</h2>
                  <p className="text-gray-600 mt-1">
                    {userLocation ? 'Based on your location' : 'Available outlets'}
                  </p>
                </div>
              </div>
              <Link
                href="/shop"
                className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span>View All</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Vendors grid */}
            {!loading && vendors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.slice(0, 6).map((vendor) => (
                  <VendorCard key={vendor.id} outlet={vendor} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && vendors.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg">No outlets available at the moment.</p>
                <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Order Gas?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Get your cooking gas delivered fast and safely to your doorstep
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  Shop Now
                </Link>
                <Link
                  href="/about"
                  className="bg-blue-700 text-white px-8 py-4 rounded-xl hover:bg-blue-800 transition font-bold text-lg border-2 border-white"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
