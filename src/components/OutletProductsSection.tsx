// ============================================================
// FILE: src/components/OutletProductsSection.tsx
// Display Products Grouped by Outlet/Vendor
// ============================================================

import { Product, Outlet } from '@/lib/types';
import ProductCard from './ProductCard';
import { MapPin, Star, Phone, ChevronRight, Store, Package, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface OutletProductsSectionProps {
  outlet: Outlet;
  products: Product[];
  showOutletHeader?: boolean;
  isLoading?: boolean;
}

// ── Skeleton loader for the outlet header card ──────────────
function OutletHeaderSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-5 w-2/5 bg-slate-100 rounded-lg" />
          <div className="h-3.5 w-1/4 bg-slate-100 rounded-lg" />
          <div className="flex gap-2 mt-3">
            {[60, 72, 56].map((w) => (
              <div key={w} className="h-6 rounded-lg bg-slate-100" style={{ width: w }} />
            ))}
          </div>
        </div>
        <div className="hidden sm:block h-9 w-28 rounded-xl bg-slate-100 flex-shrink-0" />
      </div>
    </div>
  );
}

// ── Skeleton loader for a product card ──────────────────────
function ProductCardSkeleton() {
  return (
    <div className="w-44 flex-shrink-0 rounded-2xl bg-white border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-100" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
        <div className="h-5 w-1/3 bg-slate-100 rounded-lg mt-3" />
      </div>
    </div>
  );
}

// ── Open/Closed status badge ─────────────────────────────────
function StatusBadge({ isOpen }: { isOpen?: boolean }) {
  if (isOpen === undefined) return null;
  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
        isOpen
          ? 'text-emerald-700 bg-emerald-50'
          : 'text-rose-600 bg-rose-50'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
        }`}
      />
      {isOpen ? 'Open now' : 'Closed'}
    </span>
  );
}

export default function OutletProductsSection({
  outlet,
  products,
  showOutletHeader = true,
  isLoading = false,
}: OutletProductsSectionProps) {
  const [scrolled, setScrolled] = useState(false);

  if (!isLoading && products.length === 0) return null;

  const outletHref = `/shop/${outlet.id || outlet.outlet_id}`;
  const displayName = outlet.name || outlet.outlet_name;
  const vendorName = outlet.vendor || outlet.vendor_name;

  return (
    <section className="mb-10">
      {/* ── Outlet Header ─────────────────────────────────── */}
      {showOutletHeader && (
        <>
          {isLoading ? (
            <OutletHeaderSkeleton />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 mb-4 group">
              <div className="flex items-start justify-between gap-4">

                {/* Left: Icon + Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Avatar / Icon */}
                  <Link
                    href={outletHref}
                    className="bg-teal-50 hover:bg-teal-100 transition-colors p-3 rounded-xl flex-shrink-0 focus-visible:ring-2 focus-visible:ring-teal-400 outline-none"
                    aria-label={`View ${displayName}`}
                  >
                    <Store size={22} className="text-teal-600" />
                  </Link>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    {/* Name */}
                    <Link
                      href={outletHref}
                      className="group/link inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-teal-400 rounded outline-none"
                    >
                      <h2 className="text-base font-bold text-slate-800 leading-snug truncate group-hover/link:text-teal-700 transition-colors">
                        {displayName}
                      </h2>
                    </Link>

                    {/* Vendor sub-label */}
                    {vendorName && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{vendorName}</p>
                    )}

                    {/* Meta chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {/* Open/Closed */}
                      <StatusBadge isOpen={outlet.isOpen} />

                      {/* Distance / Nationwide */}
                      {outlet.nationwide ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <MapPin size={11} />
                          Delivers Nationwide
                        </span>
                      ) : outlet.distance !== undefined && outlet.distance > 0 && (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg">
                          <MapPin size={11} />
                          {outlet.distance.toFixed(1)} km
                        </span>
                      )}

                      {/* Rating */}
                      {outlet.rating > 0 && (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                          <Star size={11} fill="currentColor" className="text-amber-500" />
                          {outlet.rating.toFixed(1)}
                          {outlet.reviews > 0 && (
                            <span className="text-amber-500 font-normal">
                              ({outlet.reviews >= 1000
                                ? `${(outlet.reviews / 1000).toFixed(1)}k`
                                : outlet.reviews})
                            </span>
                          )}
                        </span>
                      )}

                      {/* Phone */}
                      {outlet.phone && (
                        <a
                          href={`tel:${outlet.phone}`}
                          className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <Phone size={11} />
                          {outlet.phone}
                        </a>
                      )}

                      {/* Product count */}
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                        <Package size={11} />
                        {products.length} {products.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Address */}
                    {outlet.address && (
                      <p className="flex items-start gap-1.5 text-xs text-slate-400 mt-2 leading-relaxed">
                        <MapPin size={11} className="mt-0.5 flex-shrink-0 text-slate-300" />
                        <span className="truncate">{outlet.address}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* View Shop CTA — desktop */}
                <Link
                  href={outletHref}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 border border-teal-200 hover:border-teal-300 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-all duration-200 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-teal-400 outline-none"
                >
                  View Shop
                  <ChevronRight size={15} />
                </Link>
              </div>

              {/* View Shop CTA — mobile (full-width, below content) */}
              <Link
                href={outletHref}
                className="sm:hidden mt-4 flex items-center justify-center gap-1.5 w-full text-sm font-semibold text-teal-600 border border-teal-200 bg-teal-50 hover:bg-teal-100 py-2.5 rounded-xl transition-all duration-200"
              >
                <ExternalLink size={14} />
                View Shop
              </Link>
            </div>
          )}
        </>
      )}

      {/* ── Products Horizontal Scroll ─────────────────────── */}
      <div className="relative">
        {/* Left fade — visible after user scrolls */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-3 w-8 z-10 bg-gradient-to-r from-slate-50 to-transparent transition-opacity duration-300 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Right fade — always visible as scroll affordance */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-12 z-10 bg-gradient-to-l from-slate-50 to-transparent" />

        <div
          role="list"
          aria-label={`Products from ${displayName}`}
          onScroll={(e) => setScrolled(e.currentTarget.scrollLeft > 16)}
          className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory pr-10"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} role="listitem">
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((product) => (
                <div key={product.id || product.product_id} role="listitem" className="snap-start">
                  <ProductCard
                    product={product}
                    outlet={outlet}
                    compact
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
