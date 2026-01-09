// src/components/VendorCard.tsx
import { Outlet } from '@/lib/types';
import { MapPin, Star, Phone } from 'lucide-react';
import Link from 'next/link';

interface VendorCardProps {
  outlet: Outlet;
}

export default function VendorCard({ outlet }: VendorCardProps) {
  return (
    <Link href={`/shop/${outlet.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 relative">
          {outlet.featured && (
            <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-xl text-gray-800 mb-2">{outlet.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{outlet.vendor}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} />
              <span className="truncate">{outlet.address}</span>
            </div>
            {outlet.distance && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{outlet.distance} km away</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={16} />
              <span>{outlet.phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Star size={18} fill="currentColor" className="text-yellow-400" />
              <span className="font-semibold">{outlet.rating}</span>
              <span className="text-sm text-gray-600">({outlet.reviews})</span>
            </div>
            <span className="text-blue-600 font-semibold text-sm">View Shop →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}