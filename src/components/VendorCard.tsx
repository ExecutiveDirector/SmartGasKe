// ============================================================
// FILE: src/components/VendorCard.tsx
// Enhanced Vendor Card — Green & Blue Professional Theme
// ============================================================

import { Outlet } from '@/lib/types';
import { MapPin, Star, Phone, Clock, Navigation, Award, ChevronRight, Store } from 'lucide-react';
import Link from 'next/link';

interface VendorCardProps {
  outlet: Outlet;
}

export default function VendorCard({ outlet }: VendorCardProps) {
  return (
    <Link href={`/shop/${outlet.id}`} className="block group">
      <div
        className="
          bg-white rounded-2xl overflow-hidden
          border border-slate-100 shadow-sm
          hover:shadow-lg hover:border-emerald-200 hover:-translate-y-0.5
          transition-all duration-300
        "
      >
        {/* ── Header banner ──────────────────────────────── */}
        <div className="relative h-44 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-sky-800" />

          {/* Subtle mesh overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 60%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 45%)',
            }}
          />

          {/* Decorative store icon */}
          <div className="absolute bottom-4 right-5 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <Store size={72} className="text-white" strokeWidth={1} />
          </div>

          {/* Status badge */}
          <div className="absolute top-4 left-4">
            {outlet.is_active ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Open Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-slate-600/80 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Closed
              </span>
            )}
          </div>

          {/* Featured badge */}
          {outlet.featured && (
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              <Award size={12} />
              Featured
            </div>
          )}

          {/* Outlet name on banner */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8 bg-gradient-to-t from-teal-900/60 to-transparent">
            <h3 className="text-white font-bold text-xl leading-tight truncate drop-shadow">
              {outlet.name}
            </h3>
            <p className="text-teal-100 text-xs font-medium mt-0.5 truncate">{outlet.vendor}</p>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────── */}
        <div className="p-4 space-y-2.5">

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="bg-sky-50 rounded-lg p-2 flex-shrink-0 group-hover:bg-sky-100 transition-colors">
              <MapPin size={15} className="text-sky-600" />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm text-slate-700 leading-relaxed">{outlet.address}</p>
              {outlet.distance !== undefined && (
                <p className="text-xs text-sky-600 font-semibold mt-0.5 flex items-center gap-1">
                  <Navigation size={11} />
                  {outlet.distance} km away
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 rounded-lg p-2 flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
              <Phone size={15} className="text-emerald-600" />
            </div>
            <span className="text-sm text-slate-700 font-medium">{outlet.phone}</span>
          </div>

          {/* Hours */}
          {outlet.opening_hours && (
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 rounded-lg p-2 flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                <Clock size={15} className="text-teal-600" />
              </div>
              <span className="text-sm text-slate-600">{outlet.opening_hours}</span>
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
              <Star size={14} fill="currentColor" className="text-amber-400" />
              <span className="text-sm font-bold text-slate-800">{outlet.rating}</span>
            </div>
            <span className="text-xs text-slate-400">
              {outlet.reviews} {outlet.reviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1 text-teal-600 font-semibold text-sm group-hover:text-teal-700 transition-colors">
            View Shop
            <ChevronRight
              size={16}
              className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
            />
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-[3px] bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500 group-hover:h-1 transition-all duration-300" />
      </div>
    </Link>
  );
}