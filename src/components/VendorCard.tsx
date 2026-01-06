// src/components/VendorCard.tsx
interface VendorCardProps {
  vendor: {
    id: number;
    name: string;
    location: string;
    distance: string;
    rating: number;
  };
}

export default function VendorCard({ vendor }: VendorCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold">{vendor.name}</h2>
      <p className="text-gray-500">{vendor.location} • {vendor.distance} away</p>
      <p className="text-yellow-500">Rating: {vendor.rating} ⭐</p>
    </div>
  );
}