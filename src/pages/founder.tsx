// Founder.jsx
import React from 'react';
import { 
  Zap, Shield, Bike, Code, GraduationCap, 
  MapPin, Phone, Mail, ChevronRight, Heart, 
  ArrowRight 
} from 'lucide-react';

export default function Founder() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Personal & Powerful */}
      <section className="relative bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900 text-white pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,165,0,0.18),transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-orange-500/20 backdrop-blur-md rounded-full text-orange-300 font-medium">
              <span className="text-sm">The Journey Behind AquaGas</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
              From Kenyan Roads to Digital Solutions
              <span className="block text-orange-400 mt-3">Peter Maina</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto font-light leading-relaxed">
              Ex-rider. Ex-supplier. Physics graduate. Now building the future of LPG delivery in Kenya — one reliable refill at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Profile + Photo Section */}
      <section className="-mt-24 md:-mt-32 relative z-10 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="md:flex">
              {/* Left: Visual + Quick Facts */}
              <div className="md:w-2/5 bg-gradient-to-br from-blue-900 to-indigo-950 p-10 md:p-12 flex flex-col items-center justify-center text-white relative">
                {/* Placeholder for real photo - replace with your image */}
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-500">
                  {/* Use a real photo here */}
                  {/* <img src="/peter-maina.jpg" alt="Peter Maina" className="w-full h-full object-cover" /> */}
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-8xl font-bold text-orange-400">
                    PM
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-3">Peter Maina</h2>
                <p className="text-xl text-blue-200 mb-8">Founder & CEO</p>

                <div className="space-y-4 w-full max-w-xs">
                  <div className="flex items-center gap-4 text-blue-100">
                    <GraduationCap size={24} className="text-orange-400" />
                    <span>BSc Physics • CUEA</span>
                  </div>
                  <div className="flex items-center gap-4 text-blue-100">
                    <MapPin size={24} className="text-orange-400" />
                    <span>Nairobi, Kenya</span>
                  </div>
                </div>
              </div>

              {/* Right: Story + Highlights */}
              <div className="p-10 md:p-12 lg:p-16 flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-950 mb-8">
                  The Road That Changed Everything
                </h3>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    I spent years on the streets of Nairobi — first as a <strong>Bolt & Uber rider</strong>, then delivering gas cylinders as a <strong>JG Gas supplier</strong>.
                  </p>
                  <p>
                    I lived the frustration: customers waiting days for gas, vendors struggling with orders, riders navigating blind. 
                    The same questions kept coming back:
                  </p>

                  <ul className="space-y-4 my-8">
                    {[
                      "Why does a simple refill take so long?",
                      "Why is there no transparency or tracking?",
                      "Why can't we make this safer and faster for everyone?"
                    ].map((q, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-1.5 flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <Zap size={18} className="text-orange-600" />
                        </div>
                        <span className="text-lg">{q}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="font-medium text-xl text-orange-700 mt-10">
                    That's when I decided: instead of just complaining about the system, I would build a better one.
                  </p>
                </div>

                {/* Quick Achievements / Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12">
                  {[
                    { icon: Code, label: "Built with Flutter & React" },
                    { icon: Shield, label: "Safety-first mindset" },
                    { icon: Bike, label: "Real rider experience" },
                    { icon: Heart, label: "Customer-obsessed" },
                    { icon: GraduationCap, label: "Physics background" },
                    { icon: Zap, label: "Innovation-driven" }
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-orange-50 flex items-center justify-center">
                        <item.icon size={28} className="text-orange-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-8">
            My Vision for AquaGas
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
            To create a platform where no Kenyan ever has to worry about running out of gas — 
            where deliveries are fast, safe, transparent, and fair for customers, vendors, and riders alike.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="/contact" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-400/30 transition-all flex items-center gap-3 group"
            >
              Let's Talk Business <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>

            <a 
              href="/" 
              className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-10 py-5 rounded-xl font-bold text-lg transition-all"
            >
              Download the App →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}