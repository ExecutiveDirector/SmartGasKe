// Partners.jsx
import React from 'react';
import { 
  Users, Truck, Building2, CheckCircle, 
  ArrowRight, ChevronRight, Zap, 
  ShieldCheck, DollarSign, Clock 
} from 'lucide-react';

export default function Partners() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Inviting & Benefit-Focused */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 text-white pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-medium">
            <span className="text-sm">Join the AquaGas Network • Nairobi & Beyond</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
            Grow Your Business
            <span className="block text-blue-950 mt-3">As an AquaGas Partner</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            Whether you're a gas vendor or delivery rider, partner with us to reach more customers, streamline operations, and earn more — all while making LPG delivery safer in Kenya.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="#vendor" className="bg-blue-950 hover:bg-blue-900 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-400/30 transition-all flex items-center gap-3 group">
              Become a Vendor <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#rider" className="border-2 border-white text-white hover:bg-white/10 px-10 py-5 rounded-xl font-bold text-lg transition-all">
              Join as Rider →
            </a>
          </div>
        </div>
      </section>

      {/* Quick Benefits - Cards */}
      <section className="-mt-24 md:-mt-32 relative z-10 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Reach 5K+ Customers", desc: "Tap into our growing Nairobi user base" },
              { icon: Zap, title: "Faster Payments", desc: "Weekly settlements via mobile money" },
              { icon: ShieldCheck, title: "Safety Certified", desc: "We handle verifications & training" },
              { icon: DollarSign, title: "Earn More", desc: "Competitive commissions & bonuses" }
            ].map((benefit, i) => (
              <div key={i} 
                   className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                  <benefit.icon size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Section */}
      <section id="vendor" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-block mb-6 px-5 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              For Gas Vendors
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-8">
              Scale Your LPG Business with AquaGas
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Join as a verified vendor and access tools that make selling gas easier, safer, and more profitable.
            </p>
            
            <ul className="space-y-6 mb-10">
              {[
                { icon: Building2, text: "Automated order management & real-time inventory" },
                { icon: Users, text: "Reach thousands of new customers in Nairobi" },
                { icon: Clock, text: "10-15% commission with premium subscriptions" },
                { icon: CheckCircle, text: "Marketing support & analytics insights" },
                { icon: ShieldCheck, text: "Secure payments & fraud protection" }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <item.icon size={22} className="text-orange-600" />
                  </div>
                  <span className="text-lg text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>

            <a href="/contact?type=vendor" className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-orange-400/30 transition-all">
              Register as Vendor <ChevronRight />
            </a>
          </div>

          {/* Right: Visual/Stats */}
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-sm h-full">
              <h3 className="text-3xl font-bold text-blue-950 mb-8">Vendor Success Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "60+", label: "Active Vendors" },
                  { num: "30%", label: "Avg Sales Growth" },
                  { num: "98%", label: "Payment Reliability" },
                  { num: "24/7", label: "Support Access" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{stat.num}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rider Section */}
      <section id="rider" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-12 lg:gap-16 items-center md:flex-row-reverse">
          {/* Left: Content (reversed) */}
          <div>
            <div className="inline-block mb-6 px-5 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
              For Delivery Riders
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-8">
              Ride with Purpose & Earn Flexibly
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Become an AquaGas rider and enjoy flexible hours, competitive pay, and the satisfaction of powering Kenyan homes.
            </p>
            
            <ul className="space-y-6 mb-10">
              {[
                { icon: Truck, text: "Optimized routes & real-time navigation" },
                { icon: DollarSign, text: "Earn per delivery + bonuses" },
                { icon: Clock, text: "Choose your own schedule" },
                { icon: CheckCircle, text: "Training, safety gear & insurance" },
                { icon: Users, text: "Community support & growth opportunities" }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <item.icon size={22} className="text-blue-600" />
                  </div>
                  <span className="text-lg text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>

            <a href="/contact?type=rider" className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-blue-400/30 transition-all">
              Become a Rider <ChevronRight />
            </a>
          </div>

          {/* Right: Visual/Stats (reversed) */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-sm h-full">
              <h3 className="text-3xl font-bold text-blue-950 mb-8">Rider Network Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "120+", label: "Active Riders" },
                  { num: "KES 500+", label: "Avg Per Delivery" },
                  { num: "95%", label: "On-Time Rate" },
                  { num: "Weekly", label: "Payment Cycle" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stat.num}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Process & CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-500 text-white">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            Simple Onboarding in 4 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {[
              { num: 1, title: "Apply Online", desc: "Fill our quick form" },
              { num: 2, title: "Verify Docs", desc: "Submit ID & certs" },
              { num: 3, title: "Get Trained", desc: "Free safety session" },
              { num: 4, title: "Start Earning", desc: "Go live same week" }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold text-white">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/80">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 right-0 w-1/2 h-0.5 bg-white/30 translate-x-1/2" />
                )}
              </div>
            ))}
          </div>

          <a href="/contact" className="bg-white text-blue-600 px-12 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 hover:scale-[1.02] transition-all">
            Start Your Partnership Today
          </a>
        </div>
      </section>
    </div>
  );
}