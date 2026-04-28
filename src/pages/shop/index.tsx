// ============================================================
// FILE: src/pages/shop/index.tsx
// ENHANCED: Professional shop page — hero search, refined filters
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';

interface OutletWithProducts {
  outlet: Outlet;
  products: Product[];
}

// ── Pill / Chip ──────────────────────────────────────────────
const Chip: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200
      ${active
        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 scale-105'
        : 'bg-white/70 backdrop-blur-sm text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50'
      }
    `}
  >
    {label}
  </button>
);

// ── Sort Dropdown ────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'nearest',    label: 'Nearest First',       icon: Navigation },
  { value: 'price-asc',  label: 'Price: Low → High',   icon: TrendingUp },
  { value: 'price-desc', label: 'Price: High → Low',   icon: TrendingUp },
  { value: 'rating',     label: 'Highest Rated',        icon: Star },
];

// ============================================================
// Main ShopPage
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
  const [sortBy, setSortBy]                           = useState<'nearest' | 'price-asc' | 'price-desc' | 'rating'>('nearest');
  const [sortOpen, setSortOpen]                       = useState(false);
  const [filtersVisible, setFiltersVisible]           = useState(false);
  const searchRef                                     = useRef<HTMLInputElement>(null);

  useEffect(() => { getUserLocation(); }, []);
  useEffect(() => {
    if (userLocation) fetchNearbyProducts();
  }, [userLocation, radiusKm, searchTerm, categoryFilter, sortBy]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), 420);
    return () => clearTimeout(t);
  }, [searchInput]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
          toast.error('Could not get your location. Showing Nairobi results.');
        }
      );
    } else {
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
    }
  };

  const fetchNearbyProducts = async () => {
    if (!userLocation) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/products/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radiusKm}`
      );
      if (!res.ok) throw new Error('Failed to fetch');
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
            products = products.filter((p: Product) => {
              const cat = typeof p.category === 'string' ? p.category : (p.category as any)?.category_name;
              return cat === categoryFilter;
            });
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
            products.forEach((p: Product) => {
              const cat = typeof p.category === 'string' ? p.category : (p.category as any)?.category_name;
              if (cat) catSet.add(cat);
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
            allOutlets.push({ outlet, products });
          }
        });
      });

      // Sort
      allOutlets.sort((a, b) => {
        if (sortBy === 'nearest')    return (a.outlet.distance || 0) - (b.outlet.distance || 0);
        if (sortBy === 'price-asc')  return Math.min(...a.products.map(p => p.price)) - Math.min(...b.products.map(p => p.price));
        if (sortBy === 'price-desc') return Math.max(...b.products.map(p => p.price)) - Math.max(...a.products.map(p => p.price));
        if (sortBy === 'rating')     return b.outlet.rating - a.outlet.rating;
        return 0;
      });

      setOutletsWithProducts(allOutlets);
      setFeaturedProducts(featured.slice(0, 4));
      setCategories(['All', ...Array.from(catSet)]);
    } catch {
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseProduct = (p: any, vendor: any, outlet: any): Product => ({
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
  });

  const parseProductImage = (images: any): string => {
    if (!images) return '/images/placeholder-product.jpg';
    try {
      const arr = typeof images === 'string' ? JSON.parse(images) : images;
      return Array.isArray(arr) && arr[0] ? arr[0] : '/images/placeholder-product.jpg';
    } catch {
      return typeof images === 'string' ? images : '/images/placeholder-product.jpg';
    }
  };

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy)!;
  const totalProducts = outletsWithProducts.reduce((s, o) => s + o.products.length, 0);

  // ── Loading Screen ───────────────────────────────────────
  if (loading) {
    return (
      <>
        <Head><title>Shop - AquaGas</title></Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 opacity-20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <Loader className="animate-spin text-white" size={28} />
              </div>
            </div>
            <p className="text-gray-600 font-semibold text-lg">Finding nearby products…</p>
            <p className="text-gray-400 text-sm mt-1">Locating outlets in your area</p>
          </div>
        </div>
      </>
    );
  }

  // ── Main Render ──────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Shop Nearby — AquaGas</title>
        <meta name="description" content="Shop for LPG products from nearby outlets" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-blue-50/40">

        {/* ════════════════════════════════════════════════
            HERO — full-bleed search header
        ════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-700">
          {/* Decorative layers */}
          <div className="absolute inset-0">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-300/10 rounded-full blur-2xl" />
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div className="relative container mx-auto px-4 py-16 md:py-20">
            {/* Headline */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-5 border border-white/20">
                <Zap size={13} className="text-yellow-300" />
                Fast delivery · Quality guaranteed
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
                Gas &amp; LPG
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-blue-200">
                  Near You
                </span>
              </h1>
              <p className="text-emerald-100 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                Browse products from trusted outlets within{' '}
                <span className="font-bold text-white">{radiusKm} km</span> of your location
              </p>
            </div>

            {/* ── Search Bar ── */}
            <div className="max-w-2xl mx-auto">
              <div className="relative flex items-center gap-3 bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 ring-4 ring-white/20">
                <div className="flex-1 flex items-center gap-3 pl-3">
                  <Search size={22} className="text-gray-400 flex-shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search products, brands…"
                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-base font-medium outline-none py-2"
                  />
                  {searchInput && (
                    <button
                      onClick={() => { setSearchInput(''); setSearchTerm(''); }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  )}
                </div>
                <button
                  onClick={fetchNearbyProducts}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-emerald-300 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
                >
                  Search
                </button>
              </div>

              {/* Location tag */}
              {userLocation && (
                <div className="flex items-center justify-center gap-1.5 mt-4 text-emerald-100 text-sm">
                  <MapPin size={14} />
                  <span>Searching within {radiusKm} km of your location</span>
                </div>
              )}
            </div>

            {/* ── Category Chips — inside hero ── */}
            {categories.length > 1 && (
              <div className="max-w-3xl mx-auto mt-8">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`
                        px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0
                        ${categoryFilter === cat
                          ? 'bg-white text-emerald-700 shadow-lg scale-105'
                          : 'bg-white/15 backdrop-blur-sm text-white border border-white/25 hover:bg-white/25'
                        }
                      `}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wave divider */}
          <div className="relative h-10 -mb-1">
            <svg viewBox="0 0 1440 40" className="absolute bottom-0 w-full" preserveAspectRatio="none">
              <path
                d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z"
                fill="rgb(248 250 252)"
                fillOpacity="0.5"
              />
              <path
                d="M0,40 C480,10 960,10 1440,40 L1440,40 L0,40 Z"
                fill="rgb(240 253 250)"
                fillOpacity="0.3"
              />
            </svg>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            STICKY FILTER BAR
        ════════════════════════════════════════════════ */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">

              {/* Result count */}
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 whitespace-nowrap mr-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  <span className="text-gray-900">{totalProducts}</span> products ·{' '}
                  <span className="text-gray-900">{outletsWithProducts.length}</span> outlets
                </span>
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-emerald-400 transition-all"
                >
                  <ArrowUpDown size={15} className="text-emerald-600" />
                  {currentSort.label}
                  <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-50">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value as any); setSortOpen(false); }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors
                          ${sortBy === opt.value
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <opt.icon size={15} />
                        {opt.label}
                        {sortBy === opt.value && <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Radius + filters toggle */}
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2
                  ${filtersVisible
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-400'
                  }
                `}
              >
                <SlidersHorizontal size={15} />
                Filters
                {filtersVisible && <X size={13} />}
              </button>
            </div>

            {/* Expandable filter panel */}
            <div className={`overflow-hidden transition-all duration-300 ${filtersVisible ? 'max-h-40 mt-3' : 'max-h-0'}`}>
              <div className="flex items-center gap-6 py-3 border-t border-gray-100 flex-wrap md:flex-nowrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Expand size={16} className="text-emerald-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-600">Search radius</span>
                      <span className="text-xs font-bold text-emerald-600">{radiusKm} km</span>
                    </div>
                    <input
                      type="range"
                      min="5" max="50" step="5"
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none bg-gradient-to-r from-emerald-400 to-teal-500 accent-emerald-500"
                    />
                    <div className="flex justify-between mt-0.5">
                      <span className="text-[10px] text-gray-400">5 km</span>
                      <span className="text-[10px] text-gray-400">50 km</span>
                    </div>
                  </div>
                </div>
                {searchTerm && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-sm font-semibold">
                    <Tag size={13} />
                    "{searchTerm}"
                    <button onClick={() => { setSearchTerm(''); setSearchInput(''); }}>
                      <X size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            CONTENT
        ════════════════════════════════════════════════ */}
        <div className="container mx-auto px-4 py-10">

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl shadow-md">
                  <Star size={18} className="text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Featured Products</h2>
                  <p className="text-gray-500 text-sm">Hand-picked top sellers near you</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredProducts.map((product) => {
                  const outlet = outletsWithProducts.find(
                    o => o.products.some(p => p.id === product.id)
                  )?.outlet;
                  return outlet ? (
                    <ProductCard key={product.id} product={product} outlet={outlet} compact={true} />
                  ) : null;
                })}
              </div>
            </section>
          )}

          {/* Outlets with Products */}
          {outletsWithProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Search size={40} className="text-gray-400 -rotate-3" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                No products within {radiusKm} km match your filters. Try expanding your search radius.
              </p>
              <button
                onClick={() => {
                  setRadiusKm(50);
                  setSearchTerm('');
                  setSearchInput('');
                  setCategoryFilter('All');
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <Expand size={18} />
                Expand to 50 km
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Close sort dropdown on outside click */}
      {sortOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setSortOpen(false)}
        />
      )}
    </>
  );
}