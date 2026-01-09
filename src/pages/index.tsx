import Head from 'next/head';
import { Outlet } from '@/lib/types';
import Carousel from '@/components/Carousel';
import VendorCard from '@/components/VendorCard';
import SEO from '@/components/SEO';
import Link from 'next/link';

export default function Home() {
  // Sample vendor data
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

  const carouselImages = [
    '/images/banners/hero-banner.jpg',
    '/images/banners/promo-banner.jpg'
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title="AquaGas Delivery | Fast Gas Delivery in Kenya"
        description="AquaGas delivers cooking gas cylinders quickly and reliably across Nairobi and surrounding areas."
        image="/images/banners/hero-banner.jpg"
        url="https://www.aquagas.co.ke"
      />

      {/* Hero Section / Carousel */}
      <section className="mb-8">
        <Carousel images={carouselImages} />
      </section>

      {/* Vendors Near You */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Vendors Near You</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {vendors.map(vendor => (
            <VendorCard key={vendor.id} outlet={vendor} />
          ))}
        </div>
        <div className="mt-4">
          <Link href="/shop" className="text-blue-600 hover:underline">
            View All Vendors
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">About AquaGas</h2>
        <p className="mb-2">
          AquaGas is Kenya’s leading LPG distributor, offering fast and reliable gas delivery with IoT-enabled cylinders for real-time monitoring and safety.
        </p>
        <Link href="/about" className="text-blue-600 hover:underline">
          Read More About Us
        </Link>
      </section>

      {/* How It Works Section */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">How It Works</h2>
        <p className="mb-2">
          Ordering gas has never been easier! Choose your cylinder, place your order, and track your delivery in real time.
        </p>
        <Link href="/how-it-works" className="text-blue-600 hover:underline">
          Learn More
        </Link>
      </section>
    </>
  );
}