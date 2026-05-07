// ============================================================
// FILE: src/pages/shop/index.tsx
// FULL VERSION — uses shared BottomNav component
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Search,
  Loader,
  MapPin,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Zap,
  ChevronDown,
  X,
  Navigation,
  ArrowUpDown,
  Tag,
  Expand,
} from 'lucide-react';

import ProductCard from '@/components/ProductCard';
import OutletProductsSection from '@/components/OutletProductsSection';
import BottomNav from '@/components/BottomNav';
import { Product, Outlet } from '@/lib/types';

import toast from 'react-hot-toast';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://aquagas-backend.onrender.com/api/v1';

interface OutletWithProducts {
  outlet: Outlet;
  products: Product[];
}

// ============================================================
// SORT OPTIONS
// ============================================================

const SORT_OPTIONS = [
  { value: 'nearest',    label: 'Nearest First',      icon: Navigation },
  { value: 'price-asc',  label: 'Price: Low → High',  icon: TrendingUp },
  { value: 'price-desc', label: 'Price: High → Low',  icon: TrendingUp },
  { value: 'rating',     label: 'Highest Rated',      icon: Star       },
];

// ============================================================
// MAIN SHOP PAGE
// ============================================================

export default function ShopPage() {
  const [outletsWithProducts, setOutletsWithProducts] =
    useState<OutletWithProducts[]>([]);

  const [featuredProducts, setFeaturedProducts] =
    useState<Product[]>([]);

  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState('');
  const [searchInput, setSearchInput]       = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories]         = useState<string[]>(['All']);
  const [radiusKm, setRadiusKm]             = useState(20);
  const [userLocation, setUserLocation]     = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy]                 = useState<'nearest' | 'price-asc' | 'price-desc' | 'rating'>('nearest');
  const [sortOpen, setSortOpen]             = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => { getUserLocation(); }, []);

  useEffect(() => {
    if (userLocation) fetchNearbyProducts();
  }, [userLocation, radiusKm, searchTerm, categoryFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ============================================================
  // GET LOCATION
  // ============================================================

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setUserLocation({ lat: -1.2921, lng: 36.8219 });
        toast.error('Could not get your location. Showing Nairobi results.');
      }
    );
  };

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  const fetchNearbyProducts = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/products/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radiusKm}`
      );

      if (!response.ok) throw new Error('Failed to fetch products');

      const data    = await response.json();
      const vendors = Array.isArray(data.vendors) ? data.vendors : [];

      const allOutlets: OutletWithProducts[] = [];
      const featured: Product[]              = [];
      const categorySet                      = new Set<string>();

      vendors.forEach((vendor: any) => {
        (vendor.outlets || []).forEach((outletData: any) => {
          let products: Product[] = (outletData.products || [])
            .filter((p: any) => p.is_available || p.isActive)
            .map((p: any) => parseProduct(p, vendor, outletData));

          if (categoryFilter !== 'All') {
            products = products.filter((p: Product) => p.category === categoryFilter);
          }

          if (searchTerm) {
            const s = searchTerm.toLowerCase();
            products = products.filter((p: Product) =>
              p.name?.toLowerCase().includes(s) ||
              p.description?.toLowerCase().includes(s) ||
              p.brand?.toLowerCase().includes(s)
            );
          }

          if (products.length > 0) {
            products.forEach((product: Product) => {
              if (product.category) categorySet.add(String(product.category));
              if (product.featured || product.is_featured) featured.push(product);
            });

            const outlet: Outlet = {
              id:            outletData.outlet_id?.toString() || '',
              outlet_id:     outletData.outlet_id,
              name:          outletData.outlet_name || '',
              outlet_name:   outletData.outlet_name || '',
              vendor:        vendor.name || vendor.business_name || '',
              vendor_id:     vendor.vendor_id,
              vendor_name:   vendor.name || vendor.business_name || '',
              distance:      outletData.distance_km || 0,
              distance_km:   outletData.distance_km || 0,
              rating:        vendor.rating || 4.5,
              reviews:       vendor.total_reviews || 0,
              address:       outletData.location?.address || outletData.address_line_1 || '',
              phone:         vendor.business_phone || outletData.phone || '',
              contact_phone: vendor.business_phone || outletData.phone || '',
              featured:      vendor.is_featured || false,
              is_active:     vendor.is_active !== false,
              latitude:      outletData.location?.latitude,
              longitude:     outletData.location?.longitude,
              city:          outletData.city,
              county:        outletData.county,
            };

            allOutlets.push({ outlet, products });
          }
        });
      });

      // SORTING
      allOutlets.sort((a, b) => {
        if (sortBy === 'nearest')    return (a.outlet.distance || 0) - (b.outlet.distance || 0);
        if (sortBy === 'price-asc')  return Math.min(...a.products.map((p) => p.price)) - Math.min(...b.products.map((p) => p.price));
        if (sortBy === 'price-desc') return Math.max(...b.products.map((p) => p.price)) - Math.max(...a.products.map((p) => p.price));
        if (sortBy === 'rating')     return (b.outlet.rating || 0) - (a.outlet.rating || 0);
        return 0;
      });

      setOutletsWithProducts(allOutlets);
      setFeaturedProducts(featured.slice(0, 10));
      setCategories(['All', ...Array.from(categorySet)]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PARSE PRODUCT
  // ============================================================

  const parseProduct = (p: any, vendor: any, outlet: any): Product => ({
    id:                 p.product_id?.toString() || p.id?.toString() || '',
    product_id:         p.product_id,
    name:               p.product_name || p.name || '',
    title:              p.product_name || p.name || '',
    product_name:       p.product_name || p.name || '',
    description:        p.description || '',
    price:              p.price || p.base_price || 0,
    base_price:         p.base_price || p.price || 0,
    image:              parseProductImage(p.product_images || p.image),
    product_images:     p.product_images,
    category:           p.category_name || p.category || 'Other',
    rating:             p.rating || 4.5,
    reviews:            p.reviews || 0,
    inStock:            p.stock > 0,
    stock:              p.stock || 0,
    featured:           p.is_featured || false,
    is_featured:        p.is_featured || false,
    brand:              p.brand || '',
    size:               p.size_specification || '',
    size_specification: p.size_specification,
    unit:               p.unit_of_measure || '',
    unit_of_measure:    p.unit_of_measure,
    is_active:          p.is_available !== false,
    isActive:           p.is_available !== false,
    outlet_id:          outlet.outlet_id?.toString(),
    outlet_name:        outlet.outlet_name,
    vendor_name:        vendor.name || vendor.business_name,
    vendor_id:          vendor.vendor_id,
  });

  const parseProductImage = (images: any): string => {
    if (!images) return '/images/placeholder-product.jpg';
    try {
      const parsed = typeof images === 'string' ? JSON.parse(images) : images;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      return '/images/placeholder-product.jpg';
    } catch {
      return typeof images === 'string' ? images : '/images/placeholder-product.jpg';
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="animate-spin text-emerald-600" />
      </div>
    );
  }

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <>
      <Head>
        <title>Shop Nearby — AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-blue-50/40">

        {/* YOUR HERO SECTION */}
        {/* YOUR FILTER SECTION */}

        {/* CONTENT — extra bottom padding to clear the BottomNav */}
        <div className="container mx-auto px-4 py-10 pb-36">

          {/* FEATURED PRODUCTS */}
          {featuredProducts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                    <Star size={20} className="text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                      Featured Products
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Trending products from nearby trusted outlets
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 font-semibold">
                  <TrendingUp size={16} />
                  Auto scrolling showcase
                </div>
              </div>

              {/* AUTO SCROLL */}
              <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-5 animate-scroll-x min-w-max hover:[animation-play-state:paused] will-change-transform">
                  {[...featuredProducts, ...featuredProducts].map((product, index) => {
                    const outlet = outletsWithProducts.find((o) =>
                      o.products.some((p) => p.id === product.id)
                    )?.outlet;

                    return outlet ? (
                      <div key={`${product.id}-${index}`} className="w-[260px] sm:w-[280px] flex-shrink-0">
                        <ProductCard product={product} outlet={outlet} compact={true} />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <style jsx>{`
                @keyframes scrollX {
                  from { transform: translate3d(0, 0, 0); }
                  to   { transform: translate3d(-50%, 0, 0); }
                }
                .animate-scroll-x {
                  animation: scrollX 40s linear infinite;
                }
              `}</style>
            </section>
          )}

          {/* OUTLETS */}
          <div className="space-y-10">
            {outletsWithProducts.map((item) => (
              <OutletProductsSection
                key={item.outlet.id || item.outlet.outlet_id}
                outlet={item.outlet}
                products={item.products}
                showOutletHeader={true}
              />
            ))}
          </div>
        </div>

        {/* SHARED BOTTOM NAVIGATION */}
        <BottomNav />
      </div>
    </>
  );
}
