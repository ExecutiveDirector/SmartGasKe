// Investors.jsx
import React from 'react';
import { 
  TrendingUp, BarChart2, Users, Globe, 
  DollarSign, PieChart, ArrowRight, 
  ChevronRight, Zap, Shield, Building 
} from 'lucide-react';

export default function Investors() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Compelling & Visionary */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,165,0,0.18),transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-orange-500/20 backdrop-blur-md rounded-full text-orange-300 font-medium">
            <span className="text-sm">Investment Opportunity • Kenya's LPG Revolution</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
            Power the Future of
            <span className="block text-orange-400 mt-3">Clean Energy Delivery in Kenya</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            Join AquaGas in transforming a $1B+ market — delivering safer, faster LPG to millions while building scalable returns.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="#opportunity" 
               className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-400/30 transition-all flex items-center gap-3 group">
              Explore Opportunity <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/contact?type=investor" 
               className="border-2 border-white text-white hover:bg-white/10 px-10 py-5 rounded-xl font-bold text-lg transition-all">
              Schedule a Call →
            </a>
          </div>
        </div>
      </section>

      {/* Key Metrics - Floating Cards */}
      <section className="-mt-24 md:-mt-32 relative z-10 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, num: "5,000+", label: "Active Users" },
              { icon: TrendingUp, num: "1,200+", label: "Deliveries/Month" },
              { icon: DollarSign, num: "KES 8M+", label: "Annual Run Rate" },
              { icon: Globe, num: "Nairobi+", label: "Expanding Cities" }
            ].map((metric, i) => (
              <div key={i} 
                   className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 text-center">
                <metric.icon className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <div className="text-3xl md:text-4xl font-bold text-blue-950 mb-2">{metric.num}</div>
                <div className="text-gray-600 font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Opportunity Section */}
      <section id="opportunity" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Narrative */}
          <div>
            <div className="inline-block mb-6 px-5 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
              Massive Market Potential
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-8">
              Kenya's LPG Boom: A $1B+ Opportunity
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              With government push for clean cooking, rising urban demand, and no dominant digital player — AquaGas is positioned to capture significant market share.
            </p>
            
            <ul className="space-y-6">
              {[
                { icon: TrendingUp, text: "LPG market growing 15% YoY to over $1B by 2030" },
                { icon: Users, text: "2M+ Nairobi households switching to gas" },
                { icon: Globe, text: "Fragmented supply chain ready for disruption" },
                { icon: Zap, text: "80% smartphone penetration enabling app-based orders" },
                { icon: Shield, text: "Focus on safety aligns with national clean energy goals" }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <item.icon size={22} className="text-blue-600" />
                  </div>
                  <span className="text-lg text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Visual Data */}
          <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-sm">
            <h3 className="text-3xl font-bold text-blue-950 mb-8">Market Snapshot (2026)</h3>
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">$1.2B</div>
                <div className="text-gray-600 font-medium">Kenya LPG Market Size</div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-[15%] h-full bg-orange-500" /> {/* Digital penetration */}
              </div>
              <p className="text-center text-gray-700">Current Digital Penetration: 15% (Huge Upside)</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">15%</div>
                  <div className="text-gray-600">Annual Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">4M+</div>
                  <div className="text-gray-600">Urban Households</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-5 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              Sustainable & Scalable
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Multi-Stream Revenue Model
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven marketplace economics with high margins and network effects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: PieChart, title: "Transaction Commissions", desc: "10-15% per order — core revenue from 1,200+ monthly deliveries" },
              { icon: DollarSign, title: "Vendor Subscriptions", desc: "Monthly premium tiers for advanced features & priority listings" },
              { icon: BarChart2, title: "Delivery & Ad Fees", desc: "Customer delivery charges + targeted promotions for vendors" }
            ].map((model, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 mb-6 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                  <model.icon size={32} className="text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-4 text-center">{model.title}</h3>
                <p className="text-gray-600 text-center">{model.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Projections Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-5 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
              Path to Scale
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Ambitious Yet Achievable Growth
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Backed by strong unit economics and expanding to new cities.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { year: "2026", orders: "15K", revenue: "KES 10M" },
              { year: "2027", orders: "60K", revenue: "KES 40M" },
              { year: "2028", orders: "250K", revenue: "KES 150M" },
              { year: "2029", orders: "800K", revenue: "KES 400M" },
              { year: "2030", orders: "2M+", revenue: "KES 1B+" }
            ].map((proj, i) => (
              <div key={i} className="relative text-center">
                <div className="bg-gradient-to-b from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
                  <div className="text-2xl font-bold mb-4">{proj.year}</div>
                  <div className="text-lg mb-2">{proj.orders} Orders</div>
                  <div className="text-xl font-semibold">{proj.revenue}</div>
                </div>
                {i < 4 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-1/2 h-0.5 bg-orange-200 translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Invest in Kenya's Energy Future
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
            With proven traction, a strong team, and massive market — AquaGas is ready to scale. Let's discuss how you can be part of it.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/pitch-deck.pdf" 
               className="bg-white text-orange-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 hover:scale-[1.02] transition-all flex items-center gap-3 group">
              Download Pitch Deck <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/contact?type=investor" 
               className="border-2 border-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition">
              Book Investor Meeting →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}