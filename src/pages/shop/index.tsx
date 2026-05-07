// ============================================================
// FILE: src/pages/shop/index.tsx
// ENHANCED: Professional shop page — upgraded UI + auto-scroll featured
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
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
  { value: 'nearest', label: 'Nearest First', icon: Navigation },
  { value: 'price-asc', label: 'Price: Low → High', icon: TrendingUp },
  { value: 'price-desc', label: 'Price: High → Low', icon: TrendingUp },
  { value: 'rating', label: 'Highest Rated', icon: Star },
];

// ============================================================
// MAIN PAGE
// ============================================================
export default function ShopPage() {
  const [outletsWithProducts, setOutletsWithProducts] = useState<
    OutletWithProducts[]
  >([]);

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  const [radiusKm, setRadiusKm] = useState(20);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [sortBy, setSortBy] =
    useState<'nearest' | 'price-asc' | 'price-desc' | 'rating'>('nearest');

  const [sortOpen, setSortOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // EFFECTS
  // ============================================================
  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) fetchNearbyProducts();
  }, [userLocation, radiusKm, searchTerm, categoryFilter, sortBy]);

  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ============================================================
  // LOCATION
  // ============================================================
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => {
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
          toast.error('Using Nairobi default location');
        }
      );
    } else {
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
    }
  };

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================
  const fetchNearbyProducts = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/products/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radiusKm}`
      );

      const data = await res.json();

      const vendors = Array.isArray(data.vendors) ? data.vendors : [];

      const allOutlets: OutletWithProducts[] = [];
      const catSet = new Set<string>();
      const featured: Product[] = [];

      vendors.forEach((vendor: any) => {
        (vendor.outlets || []).forEach((outletData: any) => {
          let products = (outletData.products || [])
            .filter((p: any) => p.is_available || p.isActive)
            .map((p: any) => parseProduct(p, vendor, outletData));

          if (categoryFilter !== 'All') {
            products = products.filter((p) => p.category === categoryFilter);
          }

          if (searchTerm) {
            const s = searchTerm.toLowerCase();
            products = products.filter(
              (p) =>
                p.name?.toLowerCase().includes(s) ||
                p.description?.toLowerCase().includes(s) ||
                p.brand?.toLowerCase().includes(s)
            );
          }

          if (products.length > 0) {
            products.forEach((p) => {
              if (p.category) catSet.add(p.category);
              if (p.is_featured || p.featured) featured.push(p);
            });

            const outlet: Outlet = {
              id: outletData.outlet_id?.toString() || '',
              outlet_id: outletData.outlet_id,
              name: outletData.outlet_name || '',
              outlet_name: outletData.outlet_name,
              vendor: vendor.name,
              vendor_id: vendor.vendor_id,
              distance: outletData.distance_km || 0,
              rating: vendor.rating || 4.2,
              address: outletData.location?.address || '',
            };

            allOutlets.push({ outlet, products });
          }
        });
      });

      // SORT
      allOutlets.sort((a, b) => {
        if (sortBy === 'nearest')
          return a.outlet.distance - b.outlet.distance;

        if (sortBy === 'price-asc')
          return (
            Math.min(...a.products.map((p) => p.price)) -
            Math.min(...b.products.map((p) => p.price))
          );

        if (sortBy === 'price-desc')
          return (
            Math.max(...b.products.map((p) => p.price)) -
            Math.max(...a.products.map((p) => p.price))
          );

        if (sortBy === 'rating') return b.outlet.rating - a.outlet.rating;

        return 0;
      });

      setOutletsWithProducts(allOutlets);
      setFeaturedProducts(featured);
      setCategories(['All', ...Array.from(catSet)]);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PARSE PRODUCT
  // ============================================================
  const parseProduct = (p: any, vendor: any, outlet: any): Product => ({
    id: p.product_id?.toString() || '',
    name: p.product_name,
    description: p.description,
    price: p.price || 0,
    image: Array.isArray(p.product_images)
      ? p.product_images[0]
      : '/placeholder.jpg',
    category: p.category_name || 'Other',
    rating: p.rating || 4.5,
    brand: p.brand || '',
    featured: p.is_featured || false,
    is_featured: p.is_featured || false,
  });

  const totalProducts = outletsWithProducts.reduce(
    (sum, o) => sum + o.products.length,
    0
  );

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={30} />
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      <Head>
        <title>Shop — AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50">

        {/* ======================================================
            HERO (UPGRADED PROFESSIONAL VERSION)
        ====================================================== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800">

          <div className="relative container mx-auto px-4 pt-20 pb-28 text-center">

            <h1 className="text-5xl font-black text-white">
              Shop Gas & LPG Near You
            </h1>

            <p className="text-emerald-100 mt-4 max-w-2xl mx-auto">
              Discover trusted LPG outlets and order fast delivery
            </p>

            {/* SEARCH */}
            <div className="mt-10 max-w-3xl mx-auto flex gap-3 bg-white p-3 rounded-2xl">
              <input
                ref={searchRef}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="flex-1 outline-none"
              />
              <button className="bg-emerald-600 text-white px-6 rounded-xl">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================
            FEATURED PRODUCTS (AUTO SCROLL)
        ====================================================== */}
        {featuredProducts.length > 0 && (
          <section className="mb-16 mt-10 px-4">

            <h2 className="text-2xl font-bold mb-6">
              Featured Products
            </h2>

            <div className="overflow-hidden relative">

              <div className="flex gap-5 w-max animate-scroll">
                {[...featuredProducts, ...featuredProducts].map(
                  (p, i) => (
                    <div key={i} className="w-[220px]">
                      <ProductCard product={p} />
                    </div>
                  )
                )}
              </div>

              <style jsx>{`
                @keyframes scroll {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .animate-scroll {
                  animation: scroll 30s linear infinite;
                }
              `}</style>
            </div>
          </section>
        )}

        {/* ======================================================
            OUTLETS
        ====================================================== */}
        <div className="container mx-auto px-4 space-y-10">
          {outletsWithProducts.map((item) => (
            <OutletProductsSection
              key={item.outlet.id}
              outlet={item.outlet}
              products={item.products}
              showOutletHeader
            />
          ))}
        </div>
      </div>
    </>
  );
}
