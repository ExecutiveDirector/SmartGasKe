// src/pages/shop/[vendorId].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import Filter from '../../components/Filter';
import VendorCard from '../../components/VendorCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Vendor {
  id: string;
  name: string;
  outletName: string;
  location: string;
  distance: string;
  rating: number;
  products: Product[];
}

export default function VendorPage() {
  const router = useRouter();
  const { vendorId } = router.query;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (vendorId) {
      axios.get(`/vendors/${vendorId}`)
        .then(res => {
          setVendor(res.data);
          setFilteredProducts(res.data.products);
        })
        .catch(err => console.error(err));
    }
  }, [vendorId]);

  const handleFilter = (category: string) => {
    setActiveFilter(category);
    if (category === 'all') {
      setFilteredProducts(vendor?.products || []);
    } else {
      setFilteredProducts(vendor?.products.filter(p => p.category === category) || []);
    }
  };

  if (!vendor) return <p>Loading vendor details...</p>;

  return (
    <div className="container mx-auto p-4">
      <VendorCard
        name={vendor.name}
        outletName={vendor.outletName}
        location={vendor.location}
        distance={vendor.distance}
        rating={vendor.rating}
      />

      <Filter activeFilter={activeFilter} onFilter={handleFilter} />

      <div className="overflow-x-auto flex gap-4 py-4">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>

      <button
        onClick={() => router.push(`/shop`)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        View All Products
      </button>
    </div>
  );
}