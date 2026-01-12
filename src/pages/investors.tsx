// Investors.jsx
import React from 'react';
import {
  TrendingUp, BarChart2, Users, Globe,
  DollarSign, PieChart, ArrowRight,
  ChevronRight, Zap, Shield, LayoutDashboard
} from 'lucide-react';

export default function Investors() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-green-900 via-emerald-900 to-green-950 text-white pt-28 pb-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_40%,rgba(34,197,94,0.3),transparent_60%)]" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block mb-6 px-5 py-2 bg-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium">
            Regulated • EPRA-Aligned • Investor Ready
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Scaling <span className="text-emerald-400">Clean LPG Energy</span><br />
            Across Urban Kenya
          </h1>

          <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto mb-10">
            AquaGas is building Kenya’s most trusted digital LPG delivery platform — focused on safety, speed, and scalable returns.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#opportunity"
              className="bg-emerald-500 hover:bg-emerald-600 px-10 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-3"
            >
              View Opportunity <ArrowRight />
            </a>
            <a
              href="/contact?type=investor"
              className="border-2 border-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10"
            >
              Speak to Founders →
            </a>
          </div>
        </div>
      </section>

      {/* KEY METRICS */}
      <section className="-mt-20 relative z-10 pb-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, num: "5,000+", label: "Verified Users" },
            { icon: TrendingUp, num: "1,200+", label: "Monthly Deliveries" },
            { icon: DollarSign, num: "KES 8M+", label: "Annual Run Rate" },
            { icon: Globe, num: "Nairobi+", label: "Expansion Ready" }
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-lg text-center">
              <m.icon className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <div className="text-3xl font-bold text-green-900">{m.num}</div>
              <div className="text-gray-600 font-medium">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MARKET OPPORTUNITY */}
      <section id="opportunity" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              Market Opportunity
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-green-900">
              $1B+ LPG Market<br />
              <span className="text-emerald-500">Ready for Digital Control</span>
            </h2>

            <ul className="space-y-4">
              {[
                { icon: TrendingUp, text: "15% annual LPG demand growth" },
                { icon: Users, text: "2M+ urban households adopting LPG" },
                { icon: Zap, text: "Mobile-first ordering behavior" },
                { icon: Shield, text: "Safety compliance driving vendor consolidation" }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <item.icon className="text-emerald-600" size={20} />
                  </div>
                  <p className="text-lg text-gray-700">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-10 shadow-lg">
            <h3 className="text-2xl font-bold text-green-900 mb-6">2026 Market Snapshot</h3>
            <div className="space-y-6 text-center">
              <div className="text-5xl font-bold text-emerald-600">$1.2B</div>
              <p className="text-gray-600">Total Market Size</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-[15%] bg-emerald-500" />
              </div>
              <p className="text-gray-600">Digital Penetration: 15%</p>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS MODEL */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-green-900 mb-12">
            Scalable Revenue Engine
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: PieChart, title: "Order Commissions", desc: "10–15% per successful LPG transaction" },
              { icon: DollarSign, title: "Vendor Subscriptions", desc: "Premium dashboards & compliance tools" },
              { icon: BarChart2, title: "Logistics & Ads", desc: "Delivery fees + promoted vendor listings" }
            ].map((b, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <b.icon className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-4">{b.title}</h3>
                <p className="text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADMIN DASHBOARD PREVIEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block mb-4 px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              Operational Transparency
            </span>
            <h2 className="text-4xl font-bold text-green-900 mb-6">
              Investor-Grade Admin Dashboard
            </h2>
            <ul className="space-y-4 text-lg text-gray-700">
              <li>• Real-time orders & revenue tracking</li>
              <li>• Vendor compliance & EPRA safety logs</li>
              <li>• Rider performance & delivery SLAs</li>
              <li>• City-level expansion analytics</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-3xl p-10 text-white shadow-2xl">
            <LayoutDashboard size={48} className="mb-6 text-emerald-300" />
            <p className="text-xl font-semibold mb-2">Live Admin View</p>
            <p className="text-green-100">
              Designed for founders, operators, and investors — not a demo UI.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-br from-emerald-500 to-green-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Invest in Kenya’s Clean Energy Infrastructure
        </h2>
        <p className="text-xl max-w-3xl mx-auto mb-10 opacity-90">
          AquaGas combines regulation, technology, and logistics into a defensible LPG platform built to scale.
        </p>
        <div className="flex justify-center gap-6">
          <a href="/pitch-deck.pdf" className="bg-white text-green-700 px-10 py-4 rounded-xl font-bold shadow-lg">
            Download Pitch Deck
          </a>
          <a href="/contact?type=investor" className="border-2 border-white px-10 py-4 rounded-xl font-bold">
            Book Meeting →
          </a>
        </div>
      </section>

    </div>
  );
}