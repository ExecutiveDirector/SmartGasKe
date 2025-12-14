// src/components/VendorCard.tsx
interface VendorCardProps {
  name: string;
  outletName: string;
  location: string;
  distance: string;
  rating: number;
}

export default function VendorCard({ name, outletName, location, distance, rating }: VendorCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-gray-600">{outletName}</p>
      <p className="text-gray-500">{location} • {distance} away</p>
      <p className="text-yellow-500">Rating: {rating} ⭐</p>
    </div>
  );
}