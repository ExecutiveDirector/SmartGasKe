import Carousel from '../components/Carousel';
import VendorCard from '../components/VendorCard';
import { Outlet } from '@/lib/types';

export default function Home() {
  // Convert vendor data to Outlet type
  const vendors: Outlet[] = [
    { 
      id: '1', 
      name: 'AquaGas Outlet 1', 
      vendor: 'AquaGas',
      address: 'Nairobi CBD', 
      distance: 2,
      rating: 4.8,
      reviews: 120,
      phone: '+254 700 000 001',
      featured: true,
      is_active: true,
      latitude: -1.286389,
      longitude: 36.817223,
    },
    { 
      id: '2', 
      name: 'AquaGas Outlet 2', 
      vendor: 'AquaGas',
      address: 'Westlands', 
      distance: 5,
      rating: 4.6,
      reviews: 89,
      phone: '+254 700 000 002',
      featured: false,
      is_active: true,
      latitude: -1.2676,
      longitude: 36.8070,
    },
  ];
  
  const carouselImages = ['/images/banner1.jpg', '/images/banner2.jpg'];

  return (
    <div className="container mx-auto p-4">
      <Carousel images={carouselImages} />
      <h2 className="text-2xl font-bold my-4">Vendors Near You</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {vendors.map(vendor => (
          <VendorCard key={vendor.id} outlet={vendor} />
        ))}
      </div>
    </div>
  );
}