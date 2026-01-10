// HowItWorks.jsx
import React from 'react';
import { 
  Smartphone, ShoppingCart, MapPin, CreditCard, 
  UserCheck, Package, Truck, CheckCircle, 
  ArrowRight, ChevronRight 
} from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Simple & Engaging */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,165,0,0.18),transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-orange-500/20 backdrop-blur-md rounded-full text-orange-300 font-medium">
            <span className="text-sm">Simple • Safe • Seamless</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
            Gas Delivery,
            <span className="block text-orange-400 mt-3">Reimagined for Kenya</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            From order to doorstep in hours — track every step with our easy-to-use platform.
          </p>

          <a href="#customers" 
             className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-400/30 transition-all flex items-center gap-3 mx-auto group max-w-fit">
            See How It Works <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Quick Overview Cards */}
      <section className="-mt-24 md:-mt-32 relative z-10 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: "Download & Order", desc: "App or web — choose your gas in seconds" },
              { icon: Truck, title: "Real-Time Tracking", desc: "Watch your delivery on the map" },
              { icon: CheckCircle, title: "Safe Delivery", desc: "Verified riders & secure payments" }
            ].map((step, i) => (
              <div key={i} 
                   className="bg-white rounded-2xl p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 text-center">
                <div className="w-16 h-16 mb-6 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                  <step.icon size={32} className="text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customers Section */}
      <section id="customers" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-5 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              For Customers
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Get Gas Delivered in 4 Easy Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No more waiting days — reliable refills at your fingertips.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: 1, icon: Smartphone, title: "Download App", desc: "Get AquaGas on your phone & sign up" },
              { num: 2, icon: ShoppingCart, title: "Place Order", desc: "Choose gas type, size & address" },
              { num: 3, icon: MapPin, title: "Track Live", desc: "See rider location in real-time" },
              { num: 4, icon: CreditCard, title: "Pay & Receive", desc: "Mobile money payment on delivery" }
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-900">
                  {step.num}
                </div>
                <div className="mb-4"><step.icon size={40} className="mx-auto text-blue-600" /></div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 right-0 w-1/2 h-0.5 bg-blue-200 translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendors Section */}
      <section id="vendors" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-5 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
              For Vendors
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Manage & Grow Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline operations and reach more customers.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: 1, icon: UserCheck, title: "Register & Verify", desc: "Sign up and get certified" },
              { num: 2, icon: Package, title: "List Inventory", desc: "Add products, prices & stock" },
              { num: 3, icon: ShoppingCart, title: "Receive Orders", desc: "Get instant notifications" },
              { num: 4, icon: Truck, title: "Assign Delivery", desc: "Coordinate with riders" }
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center text-4xl font-bold text-orange-900">
                  {step.num}
                </div>
                <div className="mb-4"><step.icon size={40} className="mx-auto text-orange-600" /></div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 right-0 w-1/2 h-0.5 bg-orange-200 translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Riders Section */}
      <section id="riders" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-5 py-2 bg-green-100 text-green-800 rounded-full font-medium">
              For Riders
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Deliver & Earn Flexibly
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our network and power Nairobi's gas needs.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: 1, icon: UserCheck, title: "Join & Train", desc: "Register and get approved" },
              { num: 2, icon: CheckCircle, title: "Accept Jobs", desc: "Pick deliveries near you" },
              { num: 3, icon: MapPin, title: "Navigate", desc: "Use app GPS to deliver" },
              { num: 4, icon: CreditCard, title: "Complete & Earn", desc: "Confirm and get paid" }
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-4xl font-bold text-green-900">
                  {step.num}
                </div>
                <div className="mb-4"><step.icon size={40} className="mx-auto text-green-600" /></div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 right-0 w-1/2 h-0.5 bg-green-200 translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Download the app or join as a partner today.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/download" className="bg-white text-orange-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 hover:scale-[1.02] transition-all">
              Download App
            </a>
            <a href="/partners" className="border-2 border-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition flex items-center gap-3">
              Become a Partner <ChevronRight />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}