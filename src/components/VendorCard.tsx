import { Outlet } from '@/lib/types';
import { MapPin, Star, Phone, Clock, Navigation, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface VendorCardProps {
  outlet: Outlet;
}

export default function VendorCard({ outlet }: VendorCardProps) {
  return (
    <Link href={`/shop/${outlet.id}`}>
      <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 hover:-translate-y-1">
        
        {/* Header Image with Gradient Overlay */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.3)_0%,_transparent_50%)]"></div>
          </div>
          
          {/* Featured Badge */}
          {outlet.featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
              <Award size={14} />
              Featured
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            {outlet.is_active ? (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Open Now
              </span>
            ) : (
              <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                Closed
              </span>
            )}
          </div>

          {/* Decorative Icon */}
          <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="white">
              <circle cx="50" cy="30" r="15" />
              <rect x="35" y="45" width="30" height="40" rx="5" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title & Vendor */}
          <div className="mb-4">
            <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition">
              {outlet.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">{outlet.vendor}</p>
          </div>

          {/* Info Grid */}
          <div className="space-y-2.5 mb-4">
            {/* Location */}
            <div className="flex items-start gap-2.5 text-sm">
              <div className="bg-blue-50 p-2 rounded-lg mt-0.5 group-hover:bg-blue-100 transition">
                <MapPin size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed">{outlet.address}</p>
                {outlet.distance !== undefined && (
                  <p className="text-blue-600 font-semibold text-xs mt-0.5 flex items-center gap-1">
                    <Navigation size={12} />
                    {outlet.distance} km away
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2.5 text-sm">
              <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition">
                <Phone size={16} className="text-green-600" />
              </div>
              <span className="text-gray-700 font-medium">{outlet.phone}</span>
            </div>

            {/* Opening Hours (if available) */}
            {outlet.opening_hours && (
              <div className="flex items-center gap-2.5 text-sm">
                <div className="bg-purple-50 p-2 rounded-lg group-hover:bg-purple-100 transition">
                  <Clock size={16} className="text-purple-600" />
                </div>
                <span className="text-gray-700">{outlet.opening_hours}</span>
              </div>
            )}
          </div>

          {/* Rating & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg">
                <Star size={16} fill="currentColor" className="text-yellow-500" />
                <span className="font-bold text-gray-900">{outlet.rating}</span>
              </div>
              <span className="text-sm text-gray-500">
                ({outlet.reviews} {outlet.reviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* View Shop Button */}
            <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
              <span>View Shop</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 group-hover:h-1.5 transition-all"></div>
      </div>
    </Link>
  );
}