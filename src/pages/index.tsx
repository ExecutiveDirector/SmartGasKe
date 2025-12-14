import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import VendorCard from '../components/VendorCard';

export default function Home() {
  const vendors = [
    { id: 1, name: 'AquaGas Outlet 1', location: 'Nairobi CBD', distance: '2km', rating: 4.8 },
    { id: 2, name: 'AquaGas Outlet 2', location: 'Westlands', distance: '5km', rating: 4.6 },
  ];
  const carouselImages = ['/images/banner1.jpg', '/images/banner2.jpg'];

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <Carousel images={carouselImages} />
        <h2 className="text-2xl font-bold my-4">Vendors Near You</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {vendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
