import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Outlet } from '@/lib/types';
import Carousel from '@/components/Carousel';
import VendorCard from '@/components/VendorCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carouselImages = [
    '/images/banners/hero-banner.jpg',
    '/images/banners/promo-banner.jpg'
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/vendors?page=1&limit=20`);

      if (!response.ok) {
        throw new Error(`Failed to fetch vendors: ${response.statusText}`);
      }

      const data: Vendor[] = await response.json();

      // Transform vendor data to match Outlet interface
      const transformedVendors: Outlet[] = data.flatMap((vendor) => {
        // If vendor has outlets, create an Outlet entry for each
        if (vendor.vendor_outlets && vendor.vendor_outlets.length > 0) {
          return vendor.vendor_outlets.map((outlet) => ({
            id: outlet.outlet_id.toString(),
            name: outlet.outlet_name,
            vendor: vendor.business_name,
            address: `${outlet.address_line_1}, ${outlet.city}`,
            distance: calculateDistance(outlet.latitude, outlet.longitude), // Implement distance calculation
            rating: vendor.rating || 0,
            reviews: vendor.total_reviews || 0,
            phone: vendor.business_phone,
            featured: vendor.is_featured,
            is_active: vendor.is_active,
            latitude: outlet.latitude,
            longitude: outlet.longitude,
          }));
        } else {
          // If no outlets, create a single entry with vendor info
          return [{
            id: vendor.vendor_id.toString(),
            name: vendor.business_name,
            vendor: vendor.business_name,
            address: 'Multiple locations',
            distance: 0,
            rating: vendor.rating || 0,
            reviews: vendor.total_reviews || 0,
            phone: vendor.business_phone,
            featured: vendor.is_featured,
            is_active: vendor.is_active,
            latitude: 0,
            longitude: 0,
          }];
        }
      });

      setVendors(transformedVendors);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate distance
  // You can implement actual distance calculation using user's location
  const calculateDistance = (lat: number, lon: number): number => {
    // Placeholder - implement with actual user location
    // For now, return a random distance
    return Math.round(Math.random() * 10);
  };

  return (
    <>
      {/* Next.js Head for SEO */}
      <Head>
        <title>AquaGas Delivery | Fast Gas Delivery in Kenya</title>
        <meta
          name="description"
          content="AquaGas delivers cooking gas cylinders quickly and reliably across Nairobi and surrounding areas."
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
      <div className="container mx-auto p-4">
        <Carousel images={carouselImages} />

        <h2 className="text-2xl font-bold my-4">Vendors Near You</h2>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            <p className="font-medium">Error loading vendors</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchVendors}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Vendors grid */}
        {!loading && !error && vendors.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} outlet={vendor} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && vendors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No vendors available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
          </div>
        )}
      </div>
    </>
  );
    }
