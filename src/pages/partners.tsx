// Partners.jsx
import React from 'react';
import {
  Users,
  Truck,
  Building2,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Clock,
  Zap
} from 'lucide-react';

export default function Partners() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white pt-28 pb-36">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block mb-6 px-6 py-2 bg-white/15 rounded-full text-sm font-medium">
            AquaGas Partner Network • Kenya
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Partner With a Trusted <br />
            <span className="text-green-900">EPRA-Aligned LPG Platform</span>
          </h1>

          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            AquaGas connects verified LPG vendors and certified delivery riders
            to thousands of households — safely, reliably, and transparently.
          </p>

          {/* EPRA Badge */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-3 bg-white text-green-900 px-6 py-3 rounded-xl shadow-md">
              <ShieldCheck className="text-green-600" />
              <div className="text-left">
                <p className="font-semibold">EPRA Safety Aligned</p>
                <p className="text-sm text-gray-600">LPG handling & delivery standards</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-10 flex-wrap">
            <a href="#vendor" className="bg-green-900 hover:bg-green-800 px-10 py-4 rounded-xl font-bold flex items-center gap-3">
              Apply as LPG Vendor <ArrowRight />
            </a>
            <a href="#rider" className="border-2 border-white px-10 py-4 rounded-xl font-bold">
              Apply as Delivery Rider
            </a>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="-mt-24 relative z-10 pb-20">
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, title: "Verified Customers", desc: "Access thousands of active gas users" },
            { icon: Zap, title: "Fast Settlements", desc: "Mobile money payouts" },
            { icon: ShieldCheck, title: "Safety First", desc: "Compliance & training support" },
            { icon: DollarSign, title: "Predictable Earnings", desc: "Transparent commission model" }
          ].map((b, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md text-center">
              <b.icon className="mx-auto text-green-600 mb-3" size={32} />
              <h3 className="font-bold text-green-900">{b.title}</h3>
              <p className="text-gray-600 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VENDORS */}
      <section id="vendor" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              LPG Vendors
            </span>

            <h2 className="text-4xl font-bold text-green-950 mb-6">
              Scale Your LPG Business With Confidence
            </h2>

            <ul className="space-y-5 text-lg text-gray-700 mb-8">
              <li className="flex gap-3"><CheckCircle className="text-green-600" /> Order & inventory management</li>
              <li className="flex gap-3"><CheckCircle className="text-green-600" /> Access verified customers</li>
              <li className="flex gap-3"><CheckCircle className="text-green-600" /> Secure payments</li>
              <li className="flex gap-3"><CheckCircle className="text-green-600" /> EPRA-aligned safety standards</li>
            </ul>

            {/* Requirements */}
            <div className="bg-gray-50 border rounded-xl p-6 mb-8">
              <h4 className="font-bold mb-3">Vendor Requirements</h4>
              <ul className="text-gray-700 space-y-2">
                <li>• Business registration</li>
                <li>• LPG safety compliance</li>
                <li>• Minimum stock availability</li>
                <li>• Safety inspection readiness</li>
              </ul>
            </div>

            <a href="/contact?type=vendor" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center gap-3">
              Apply as Verified Vendor <ChevronRight />
            </a>
          </div>

          <div className="bg-green-50 rounded-3xl p-10">
            <h3 className="text-3xl font-bold mb-6 text-green-900">Vendor Metrics</h3>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div><p className="text-3xl font-bold text-green-600">60+</p><p>Verified Vendors</p></div>
              <div><p className="text-3xl font-bold text-green-600">30%</p><p>Avg Sales Growth</p></div>
              <div><p className="text-3xl font-bold text-green-600">98%</p><p>Payment Reliability</p></div>
              <div><p className="text-3xl font-bold text-green-600">Dedicated</p><p>Support</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* RIDERS */}
      <section id="rider" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              Delivery Riders
            </span>

            <h2 className="text-4xl font-bold text-green-950 mb-6">
              Certified LPG Delivery With Predictable Earnings
            </h2>

            <ul className="space-y-5 text-lg text-gray-700 mb-8">
              <li className="flex gap-3"><Truck className="text-green-600" /> Optimized delivery routes</li>
              <li className="flex gap-3"><DollarSign className="text-green-600" /> Per-delivery payments</li>
              <li className="flex gap-3"><Clock className="text-green-600" /> Flexible shifts</li>
              <li className="flex gap-3"><ShieldCheck className="text-green-600" /> Safety training & gear</li>
            </ul>

            <div className="bg-gray-50 border rounded-xl p-6 mb-8">
              <h4 className="font-bold mb-3">Rider Requirements</h4>
              <ul className="text-gray-700 space-y-2">
                <li>• Valid driving license</li>
                <li>• Motorcycle with carrier</li>
                <li>• Smartphone & data</li>
                <li>• Safety training (provided)</li>
              </ul>
            </div>

            <a href="/contact?type=rider" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center gap-3">
              Apply as Certified Rider <ChevronRight />
            </a>
          </div>

          <div className="bg-white rounded-3xl p-10">
            <h3 className="text-3xl font-bold mb-6 text-green-900">Rider Metrics</h3>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div><p className="text-3xl font-bold text-green-600">120+</p><p>Active Riders</p></div>
              <div><p className="text-3xl font-bold text-green-600">KES 500–900</p><p>Per Delivery</p></div>
              <div><p className="text-3xl font-bold text-green-600">95%</p><p>On-Time Rate</p></div>
              <div><p className="text-3xl font-bold text-green-600">Weekly</p><p>Payouts</p></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}