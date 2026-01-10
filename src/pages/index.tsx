Update my index.tsx import Head from 'next/head';  
import { Outlet } from '@/lib/types';  
import Carousel from '@/components/Carousel';  
import VendorCard from '@/components/VendorCard';  
  
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
  
  const carouselImages = ['/images/banners/hero-banner.jpg', '/images/banners/promo-banner.jpg'];  
  
  return (  
    <>  
      {/* Next.js Head for SEO */}  
      <Head>  
        <title>AquaGas Delivery | Fast Gas Delivery in Kenya</title>  
        <meta name="description" content="AquaGas delivers cooking gas cylinders quickly and reliably across Nairobi and surrounding areas." />  
        <link rel="icon" href="/favicon.ico" />  
  
        {/* Open Graph */}  
        <meta property="og:title" content="AquaGas Delivery | Fast Gas Delivery in Kenya" />  
        <meta property="og:description" content="AquaGas delivers cooking gas cylinders quickly and reliably across Nairobi and surrounding areas." />  
        <meta property="og:image" content="/images/banners/hero-banner.jpg" />  
        <meta property="og:type" content="website" />  
        <meta property="og:url" content="https://www.aquagas.co.ke" />  
  
        {/* Twitter Card */}  
        <meta name="twitter:card" content="summary_large_image" />  
        <meta name="twitter:title" content="AquaGas Delivery | Fast Gas Delivery in Kenya" />  
        <meta name="twitter:description" content="AquaGas delivers cooking gas cylinders quickly and reliably across Nairobi and surrounding areas." />  
        <meta name="twitter:image" content="/images/banners/hero-banner.jpg" />  
      </Head>  
  
      {/* Page content */}  
      <div className="container mx-auto p-4">  
        <Carousel images={carouselImages} />  
        <h2 className="text-2xl font-bold my-4">Vendors Near You</h2>  
        <div className="grid md:grid-cols-2 gap-4">  
          {vendors.map(vendor => (  
            <VendorCard key={vendor.id} outlet={vendor} />  
          ))}  
        </div>  
      </div>  
    </>  
  );  
}