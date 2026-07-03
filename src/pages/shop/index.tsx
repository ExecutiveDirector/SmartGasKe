// ============================================================
// FILE: src/pages/shop/index.tsx
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
  ChevronRight,
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

const SORT_OPTIONS = [
  { value: 'nearest',    label: 'Nearest First',     icon: Navigation },
  { value: 'price-asc',  label: 'Price: Low → High', icon: TrendingUp },
  { value: 'price-desc', label: 'Price: High → Low', icon: TrendingUp },
  { value: 'rating',     label: 'Highest Rated',     icon: Star       },
];

// ============================================================
// HORIZONTAL SCROLL ROW — reusable wrapper
// ============================================================
function HorizontalScrollRow({
  title,
  subtitle,
  icon,
  iconBg,
  children,
  count,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
  count?: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl shadow-md ${iconBg}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {count !== undefined && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            {count} items
          </span>
        )}
      </div>

      {/* Scrollable row */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 md:px-0 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// OUTLET ROW — horizontal scroll of products from one outlet
// ============================================================
function OutletRow({ outlet, products }: { outlet: Outlet; products: Product[] }) {
  return (
    <section className="mb-10">
      {/* Outlet header */}
      <div className="flex items-center justify-between mb-3 px-4 md:px-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow">
            <Zap size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {outlet.outlet_name || outlet.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              {outlet.distance_km !== undefined && (
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {outlet.distance_km < 1
                    ? `${Math.round(outlet.distance_km * 1000)}m`
                    : `${outlet.distance_km.toFixed(1)}km`}
                </span>
              )}
              {outlet.rating && (
                <span className="flex items-center gap-1">
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  {outlet.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link
          href={`/shop/${outlet.outlet_id || outlet.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex-shrink-0 ml-3"
        >
          View all <ChevronRight size={14} />
        </Link>
      </div>

      {/* Scrollable products */}
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
        <div
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 md:px-0 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-[200px] sm:w-[220px] flex-shrink-0">
              <ProductCard product={product} outlet={outlet} compact={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MAIN SHOP PAGE
// ============================================================

export default function ShopPage() {
  const [outletsWithProducts, setOutletsWithProducts] = useState<OutletWithProducts[]>([]);
  const [featuredProducts, setFeaturedProducts]       = useState<Product[]>([]);
  const [loading, setLoading]                         = useState(true);
  const [searchTerm, setSearchTerm]                   = useState('');
  const [searchInput, setSearchInput]                 = useState('');
  const [categoryFilter, setCategoryFilter]           = useState('All');
  const [categories, setCategories]                   = useState<string[]>(['All']);
  const [radiusKm, setRadiusKm]                       = useState(20);
  const [userLocation, setUserLocation]               = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName]               = useState<string>('Locating…');
  const [sortBy, setSortBy]                           = useState<'nearest' | 'price-asc' | 'price-desc' | 'rating'>('nearest');
  const [sortOpen, setSortOpen]                       = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const heroRef   = useRef<HTMLDivElement>(null);

  useEffect(() => { getUserLocation(); }, []);

  useEffect(() => {
    if (userLocation) fetchNearbyProducts();
  }, [userLocation, radiusKm, searchTerm, categoryFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── reverse geocode to get area name ──────────────────────
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const addr = data.address || {};
      const name =
        addr.suburb ||
        addr.neighbourhood ||
        addr.quarter ||
        addr.village ||
        addr.town ||
        addr.city_district ||
        addr.city ||
        addr.county ||
        'Your Area';
      setLocationName(name);
    } catch {
      setLocationName('Nairobi');
    }
  };

  // ── geolocation ───────────────────────────────────────────
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      const fallback = { lat: -1.2921, lng: 36.8219 };
      setUserLocation(fallback);
      reverseGeocode(fallback.lat, fallback.lng);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(coords);
        reverseGeocode(coords.lat, coords.lng);
      },
      () => {
        const fallback = { lat: -1.2921, lng: 36.8219 };
        setUserLocation(fallback);
        reverseGeocode(fallback.lat, fallback.lng);
        toast.error('Could not get your location. Showing Nairobi results.');
      }
    );
  };

  // ── fetch products ────────────────────────────────────────
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
            .filter((p: any) => p.is_available !== false && p.isActive !== false && p.is_active !== false)
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
    is_active:          p.is_available !== false && p.is_active !== false,
    isActive:           p.is_available !== false && p.is_active !== false,
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

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Sort';

  // ── loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="animate-spin text-emerald-600" />
      </div>
    );
  }

  // ── render ────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Shop Nearby — AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-blue-50/40">

        {/* ════════════════════════════════════════════════════
            HERO SECTION — slim headline only
        ════════════════════════════════════════════════════ */}
        <div
          ref={heroRef}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 pt-14 pb-5"
        >
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="container mx-auto px-4 relative">
            <h1 className="text-white text-2xl font-black tracking-tight leading-tight">
              Gas delivered{' '}
              <span className="text-emerald-300">to your door</span>
            </h1>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            UNIFIED CONTROLS ROW
            location · search · category chips · radius · outlets count · sort
            All inline, horizontally scrollable, sticky
        ════════════════════════════════════════════════════ */}
        <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
          <div
            className="flex items-center gap-2 px-3 py-2 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >

            {/* ── Location pill ── */}
            <button
              onClick={getUserLocation}
              className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 hover:bg-emerald-100 transition-colors"
            >
              <MapPin size={12} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 max-w-[90px] truncate whitespace-nowrap">
                {locationName}
              </span>
              <ChevronDown size={11} className="text-emerald-500 flex-shrink-0" />
            </button>

            {/* ── Divider ── */}
            <div className="flex-shrink-0 h-5 w-px bg-gray-200" />

            {/* ── Search input ── */}
            <div className="flex-shrink-0 w-44 sm:w-52 relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-8 pr-7 py-1.5 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white transition-colors"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* ── Divider ── */}
            <div className="flex-shrink-0 h-5 w-px bg-gray-200" />

            {/* ── Category chips ── */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* ── Divider ── */}
            <div className="flex-shrink-0 h-5 w-px bg-gray-200" />

            {/* ── Radius selector ── */}
            <div className="flex-shrink-0 flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
              <Navigation size={11} className="text-emerald-600" />
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                {[5, 10, 15, 20, 30, 50].map((r) => (
                  <option key={r} value={r}>{r} km</option>
                ))}
              </select>
            </div>

            {/* ── Results count ── */}
            <span className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">
              <span className="font-bold text-gray-700">{outletsWithProducts.length}</span> outlets
            </span>

            {/* ── Divider ── */}
            <div className="flex-shrink-0 h-5 w-px bg-gray-200" />

            {/* ── Sort button ── */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:border-emerald-300 transition-colors whitespace-nowrap"
              >
                <ArrowUpDown size={11} className="text-emerald-600" />
                <span className="text-xs font-bold text-gray-700">{activeSortLabel}</span>
                <ChevronDown
                  size={11}
                  className={`text-gray-500 transition-transform flex-shrink-0 ${sortOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-44 z-50">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value as typeof sortBy); setSortOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <opt.icon size={13} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Click outside to close sort */}
        {sortOpen && (
          <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
        )}

        {/* ════════════════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════════════════ */}
        <div className="container mx-auto px-4 md:px-6 py-6 pb-36">

          {/* FEATURED PRODUCTS — horizontal auto-scroll */}
          {featuredProducts.length > 0 && (
            <HorizontalScrollRow
              title="Featured Products"
              subtitle="Trending picks from nearby outlets"
              icon={<Star size={16} className="text-white fill-white" />}
              iconBg="bg-gradient-to-br from-yellow-400 to-orange-500"
              count={featuredProducts.length}
            >
              {[...featuredProducts, ...featuredProducts].map((product, index) => {
                const outlet = outletsWithProducts.find((o) =>
                  o.products.some((p) => p.id === product.id)
                )?.outlet;

                return outlet ? (
                  <div
                    key={`${product.id}-${index}`}
                    className="w-[200px] sm:w-[220px] flex-shrink-0 animate-scroll-x"
                  >
                    <ProductCard product={product} outlet={outlet} compact={true} />
                  </div>
                ) : null;
              })}
            </HorizontalScrollRow>
          )}

          {/* DIVIDER */}
          {featuredProducts.length > 0 && outletsWithProducts.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Nearby Outlets</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}

          {/* OUTLET ROWS */}
          {outletsWithProducts.length > 0 ? (
            <div className="space-y-2">
              {outletsWithProducts.map((item) => (
                <OutletRow
                  key={item.outlet.id || item.outlet.outlet_id}
                  outlet={item.outlet}
                  products={item.products}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <MapPin size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-500">No outlets found nearby</p>
              <p className="text-sm mt-1">Try increasing the radius or clearing your search.</p>
            </div>
          )}
        </div>

        {/* SCROLL ANIMATION */}
        <style jsx global>{`
          @keyframes scrollX {
            from { transform: translate3d(0, 0, 0); }
            to   { transform: translate3d(-50%, 0, 0); }
          }
          .animate-scroll-x {
            /* applied to the container, not individual cards */
          }
          /* Hide scrollbars globally for horizontal rows */
          .overflow-x-auto::-webkit-scrollbar { display: none; }
        `}</style>

        <BottomNav />
      </div>
    </>
  );
}
