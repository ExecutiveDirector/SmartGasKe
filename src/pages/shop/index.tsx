// ============================================================
// FILE: src/pages/shop/index.tsx
// ENHANCED PROFESSIONAL SHOP PAGE
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

const SORT_OPTIONS = [
  { value: 'nearest', label: 'Nearest First', icon: Navigation },
  { value: 'price-asc', label: 'Price: Low → High', icon: TrendingUp },
  { value: 'price-desc', label: 'Price: High → Low', icon: TrendingUp },
  { value: 'rating', label: 'Highest Rated', icon: Star },
];

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

  const [sortBy, setSortBy] = useState<
    'nearest' | 'price-asc' | 'price-desc' | 'rating'
  >('nearest');

  const [sortOpen, setSortOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // Effects
  // ============================================================

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyProducts();
    }
  }, [userLocation, radiusKm, searchTerm, categoryFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ============================================================
  // Location
  // ============================================================

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation({
        lat: -1.2921,
        lng: 36.8219,
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setUserLocation({
          lat: -1.2921,
          lng: 36.8219,
        });

        toast.error(
          'Could not get your location. Showing Nairobi results.'
        );
      }
    );
  };

  // ============================================================
  // Fetch Products
  // ============================================================

  const fetchNearbyProducts = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/products/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radiusKm}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      const vendors = Array.isArray(data.vendors)
        ? data.vendors
        : [];

      const allOutlets: OutletWithProducts[] = [];
      const featured: Product[] = [];

      const categorySet = new Set<string>();

      vendors.forEach((vendor: any) => {
        (vendor.outlets || []).forEach((outletData: any) => {
          let products: Product[] = (outletData.products || [])
            .filter((p: any) => p.is_available || p.isActive)
            .map((p: any) =>
              parseProduct(p, vendor, outletData)
            );

          // Category filter
          if (categoryFilter !== 'All') {
            products = products.filter(
              (p: Product) => p.category === categoryFilter
            );
          }

          // Search filter
          if (searchTerm) {
            const s = searchTerm.toLowerCase();

            products = products.filter(
              (p: Product) =>
                p.name?.toLowerCase().includes(s) ||
                p.description?.toLowerCase().includes(s) ||
                p.brand?.toLowerCase().includes(s)
            );
          }

          if (products.length > 0) {
            products.forEach((product: Product) => {
              if (product.category) {
                categorySet.add(String(product.category));
              }

              if (product.featured || product.is_featured) {
                featured.push(product);
              }
            });

            const outlet: Outlet = {
              id:
                outletData.outlet_id?.toString() || '',

              outlet_id: outletData.outlet_id,

              name:
                outletData.outlet_name || '',

              outlet_name:
                outletData.outlet_name || '',

              vendor:
                vendor.name ||
                vendor.business_name ||
                '',

              vendor_id: vendor.vendor_id,

              vendor_name:
                vendor.name ||
                vendor.business_name ||
                '',

              distance:
                outletData.distance_km || 0,

              distance_km:
                outletData.distance_km || 0,

              rating: vendor.rating || 4.5,

              reviews:
                vendor.total_reviews || 0,

              address:
                outletData.location?.address ||
                outletData.address_line_1 ||
                '',

              phone:
                vendor.business_phone ||
                outletData.phone ||
                '',

              contact_phone:
                vendor.business_phone ||
                outletData.phone ||
                '',

              featured:
                vendor.is_featured || false,

              is_active:
                vendor.is_active !== false,

              latitude:
                outletData.location?.latitude,

              longitude:
                outletData.location?.longitude,

              city: outletData.city,

              county: outletData.county,
            };

            allOutlets.push({
              outlet,
              products,
            });
          }
        });
      });

      // Sorting
      allOutlets.sort((a, b) => {
        if (sortBy === 'nearest') {
          return (
            (a.outlet.distance || 0) -
            (b.outlet.distance || 0)
          );
        }

        if (sortBy === 'price-asc') {
          return (
            Math.min(...a.products.map((p) => p.price)) -
            Math.min(...b.products.map((p) => p.price))
          );
        }

        if (sortBy === 'price-desc') {
          return (
            Math.max(...b.products.map((p) => p.price)) -
            Math.max(...a.products.map((p) => p.price))
          );
        }

        if (sortBy === 'rating') {
          return (
            (b.outlet.rating || 0) -
            (a.outlet.rating || 0)
          );
        }

        return 0;
      });

      setOutletsWithProducts(allOutlets);

      setFeaturedProducts(featured.slice(0, 10));

      setCategories([
        'All',
        ...Array.from(categorySet),
      ]);
    } catch (error) {
      console.error(error);

      toast.error(
        'Failed to load products. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Product Parser
  // ============================================================

  const parseProduct = (
    p: any,
    vendor: any,
    outlet: any
  ): Product => ({
    id:
      p.product_id?.toString() ||
      p.id?.toString() ||
      '',

    product_id: p.product_id,

    name:
      p.product_name ||
      p.name ||
      '',

    title:
      p.product_name ||
      p.name ||
      '',

    product_name:
      p.product_name ||
      p.name ||
      '',

    description:
      p.description || '',

    price:
      p.price ||
      p.base_price ||
      0,

    base_price:
      p.base_price ||
      p.price ||
      0,

    image: parseProductImage(
      p.product_images || p.image
    ),

    product_images:
      p.product_images,

    category:
      p.category_name ||
      p.category ||
      'Other',

    rating:
      p.rating || 4.5,

    reviews:
      p.reviews || 0,

    inStock:
      p.stock > 0,

    stock:
      p.stock || 0,

    featured:
      p.is_featured || false,

    is_featured:
      p.is_featured || false,

    brand:
      p.brand || '',

    size:
      p.size_specification || '',

    size_specification:
      p.size_specification,

    unit:
      p.unit_of_measure || '',

    unit_of_measure:
      p.unit_of_measure,

    is_active:
      p.is_available !== false,

    isActive:
      p.is_available !== false,

    outlet_id:
      outlet.outlet_id?.toString(),

    outlet_name:
      outlet.outlet_name,

    vendor_name:
      vendor.name ||
      vendor.business_name,

    vendor_id:
      vendor.vendor_id,
  });

  // ============================================================
  // Product Image
  // ============================================================

  const parseProductImage = (
    images: any
  ): string => {
    if (!images) {
      return '/images/placeholder-product.jpg';
    }

    try {
      const parsed =
        typeof images === 'string'
          ? JSON.parse(images)
          : images;

      if (
        Array.isArray(parsed) &&
        parsed.length > 0
      ) {
        return parsed[0];
      }

      return '/images/placeholder-product.jpg';
    } catch {
      return typeof images === 'string'
        ? images
        : '/images/placeholder-product.jpg';
    }
  };

  // ============================================================
  // Derived Values
  // ============================================================

  const currentSort =
    SORT_OPTIONS.find(
      (option) => option.value === sortBy
    ) || SORT_OPTIONS[0];

  const totalProducts =
    outletsWithProducts.reduce(
      (sum, item) =>
        sum + item.products.length,
      0
    );

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <>
        <Head>
          <title>Shop - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-blue-50 flex items-center justify-center">
          <div className="text-center">

            <div className="relative w-20 h-20 mx-auto mb-6">

              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 opacity-20 animate-ping" />

              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <Loader
                  className="animate-spin text-white"
                  size={28}
                />
              </div>
            </div>

            <p className="text-gray-700 font-bold text-lg">
              Finding nearby products...
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Locating trusted LPG outlets
            </p>
          </div>
        </div>
      </>
    );
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <>
      <Head>
        <title>
          Shop Nearby — AquaGas
        </title>

        <meta
          name="description"
          content="Shop LPG products near your location"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-blue-50/40">

        {/* HERO */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800">

          {/* Background */}
          <div className="absolute inset-0">

            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />

            <div className="absolute top-1/3 left-1/4 w-[320px] h-[320px] bg-emerald-300/10 rounded-full blur-3xl" />

            <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] bg-cyan-300/10 rounded-full blur-3xl" />

            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
                backgroundSize: '42px 42px',
              }}
            />
          </div>

          <div className="relative container mx-auto px-4 pt-14 pb-20 md:pt-20 md:pb-28">

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full shadow-lg">

                <Zap
                  size={14}
                  className="text-yellow-300"
                />

                <span className="text-sm font-bold tracking-wide">
                  Trusted LPG Delivery Marketplace
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center max-w-4xl mx-auto">

              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[0.95]">
                Shop Gas &
                <span className="block mt-2 bg-gradient-to-r from-emerald-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  LPG Near You
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-emerald-100 leading-relaxed max-w-2xl mx-auto">
                Discover trusted LPG outlets,
                compare prices and order gas
                products with fast delivery.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-10">

              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl">
                <p className="text-white text-2xl font-black">
                  {totalProducts}+
                </p>

                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">
                  Products
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl">
                <p className="text-white text-2xl font-black">
                  {outletsWithProducts.length}+
                </p>

                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">
                  Outlets
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl">
                <p className="text-white text-2xl font-black">
                  {radiusKm}km
                </p>

                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">
                  Search Radius
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-4xl mx-auto">

              <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/20 p-3 border border-white/30">

                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">

                  <div className="min-w-0 flex-1 flex items-center gap-3 px-4 h-16 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-400 focus-within:bg-white transition-all">

                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">

                      <Search
                        size={20}
                        className="text-white"
                      />
                    </div>

                    <input
                      ref={searchRef}
                      type="text"
                      value={searchInput}
                      onChange={(e) =>
                        setSearchInput(
                          e.target.value
                        )
                      }
                      placeholder="Search LPG, cylinders, accessories..."
                      className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-semibold text-base"
                    />

                    {searchInput && (
                      <button
                        onClick={() => {
                          setSearchInput('');
                          setSearchTerm('');
                        }}
                        className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all"
                      >
                        <X
                          size={16}
                          className="text-gray-500"
                        />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={fetchNearbyProducts}
                    className="
                      h-16 px-6 md:px-8
                      min-w-[160px]
                      rounded-2xl
                      bg-gradient-to-r from-emerald-500 to-teal-600
                      hover:from-emerald-600 hover:to-teal-700
                      text-white font-black text-base
                      shadow-lg shadow-emerald-300/40
                      hover:shadow-xl hover:-translate-y-0.5
                      active:translate-y-0
                      transition-all duration-300
                      flex items-center justify-center gap-2
                      whitespace-nowrap
                    "
                  >
                    <Search size={18} />
                    Search Products
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 px-2">

                  {userLocation && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">

                      <MapPin
                        size={15}
                        className="text-emerald-600"
                      />

                      Searching within

                      <span className="font-black text-emerald-700">
                        {radiusKm} km
                      </span>

                      of your location
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {categories.length > 1 && (
                <div className="mt-8">

                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 justify-start md:justify-center">

                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setCategoryFilter(cat)
                        }
                        className={`
                          px-5 py-3 rounded-2xl
                          text-sm font-bold whitespace-nowrap
                          border transition-all duration-300
                          flex-shrink-0 backdrop-blur-md
                          ${
                            categoryFilter === cat
                              ? 'bg-white text-emerald-700 border-white shadow-2xl scale-105'
                              : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
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
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">

          <div className="container mx-auto px-4 py-3">

            <div className="flex items-center gap-3 flex-wrap xl:flex-nowrap">

              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 whitespace-nowrap mr-auto">

                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                <span>
                  <span className="text-gray-900">
                    {totalProducts}
                  </span>{' '}
                  products ·{' '}
                  <span className="text-gray-900">
                    {outletsWithProducts.length}
                  </span>{' '}
                  outlets
                </span>
              </div>

              {/* Sort */}
              <div className="relative">

                <button
                  onClick={() =>
                    setSortOpen(!sortOpen)
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-emerald-400 transition-all"
                >
                  <ArrowUpDown
                    size={15}
                    className="text-emerald-600"
                  />

                  {currentSort.label}

                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      sortOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-50">

                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(
                            option.value as any
                          );

                          setSortOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors
                          ${
                            sortBy === option.value
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <option.icon size={15} />

                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() =>
                  setFiltersVisible(
                    !filtersVisible
                  )
                }
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2
                  ${
                    filtersVisible
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-400'
                  }
                `}
              >
                <SlidersHorizontal size={15} />

                Filters

                {filtersVisible && (
                  <X size={13} />
                )}
              </button>
            </div>

            {/* Expandable */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                filtersVisible
                  ? 'max-h-40 mt-3'
                  : 'max-h-0'
              }`}
            >
              <div className="flex items-center gap-6 py-3 border-t border-gray-100 flex-wrap md:flex-nowrap">

                <div className="flex items-center gap-3 flex-1 min-w-0">

                  <Expand
                    size={16}
                    className="text-emerald-600 flex-shrink-0"
                  />

                  <div className="flex-1">

                    <div className="flex justify-between mb-1">

                      <span className="text-xs font-semibold text-gray-600">
                        Search Radius
                      </span>

                      <span className="text-xs font-bold text-emerald-600">
                        {radiusKm} km
                      </span>
                    </div>

                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={radiusKm}
                      onChange={(e) =>
                        setRadiusKm(
                          Number(e.target.value)
                        )
                      }
                      className="w-full h-1.5 rounded-full appearance-none bg-gradient-to-r from-emerald-400 to-teal-500 accent-emerald-500"
                    />
                  </div>
                </div>

                {searchTerm && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-sm font-semibold">

                    <Tag size={13} />

                    "{searchTerm}"

                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSearchInput('');
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="container mx-auto px-4 py-10">

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section className="mb-16">

              <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">

                    <Star
                      size={20}
                      className="text-white fill-white"
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                      Featured Products
                    </h2>

                    <p className="text-gray-500 text-sm">
                      Trending products from
                      nearby trusted outlets
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 font-semibold">

                  <TrendingUp size={16} />

                  Auto scrolling showcase
                </div>
              </div>

              <div className="relative overflow-hidden">

                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />

                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-5 animate-scroll-x min-w-max hover:[animation-play-state:paused] will-change-transform">

                  {[...featuredProducts, ...featuredProducts].map(
                    (product, index) => {
                      const outlet =
                        outletsWithProducts.find(
                          (o) =>
                            o.products.some(
                              (p) =>
                                p.id === product.id
                            )
                        )?.outlet;

                      return outlet ? (
                        <div
                          key={`${product.id}-${index}`}
                          className="w-[260px] sm:w-[280px] flex-shrink-0"
                        >
                          <ProductCard
                            product={product}
                            outlet={outlet}
                            compact={true}
                          />
                        </div>
                      ) : null;
                    }
                  )}
                </div>
              </div>

              <style jsx>{`
                @keyframes scrollX {
                  from {
                    transform: translate3d(
                      0,
                      0,
                      0
                    );
                  }

                  to {
                    transform: translate3d(
                      -50%,
                      0,
                      0
                    );
                  }
                }

                .animate-scroll-x {
                  animation: scrollX 40s linear infinite;
                }
              `}</style>
            </section>
          )}

          {/* Empty State */}
          {outletsWithProducts.length === 0 ? (
            <div className="text-center py-24">

              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">

                <Search
                  size={40}
                  className="text-gray-400 -rotate-3"
                />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No products found
              </h3>

              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                No products within
                {radiusKm} km match your
                filters.
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

              {outletsWithProducts.map(
                (item) => (
                  <OutletProductsSection
                    key={
                      item.outlet.id ||
                      item.outlet.outlet_id
                    }
                    outlet={item.outlet}
                    products={item.products}
                    showOutletHeader={true}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Outside click */}
      {sortOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() =>
            setSortOpen(false)
          }
        />
      )}
    </>
  );
}
