import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import VendorCard from "../../components/VendorCard";
import { fetchVendors } from "../../lib/api";
import { Vendor } from "../../types/vendor";

export default function ShopHome() {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    fetchVendors().then(setVendors); // Fetch all vendors from backend
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Shop LPG & Accessories</h1>
        <div className="space-y-8">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} showLimitedProducts={true} />
          ))}
        </div>
      </div>
    </Layout>
  );
}