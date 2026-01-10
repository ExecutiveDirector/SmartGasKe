// About.jsx
import React from 'react';
import { 
  Shield, Zap, Users, Truck, Heart, 
  ChevronRight, ArrowRight, 
  Building2, Scale, Target 
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Opening Section */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,165,0,0.15),transparent_50%)]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-orange-500/20 backdrop-blur-sm rounded-full text-orange-300 font-medium text-sm">
            Since 2024 • Nairobi, Kenya
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Making Gas Delivery in Kenya
            <br className="hidden sm:block" />
            <span className="text-orange-400">Safer • Faster • Fairer</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 font-light">
            We’re transforming how Kenyans get their cooking gas — one reliable, tracked, and stress-free delivery at a time.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <a href="#our-story" 
               className="group bg-white text-blue-950 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all flex items-center gap-3 shadow-lg">
              Our Story <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/contact" 
               className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats - Trust builders */}
      <section className="py-16 -mt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "5,000+", label: "Happy Customers", icon: Heart },
              { number: "1,200+", label: "Deliveries Completed", icon: Truck },
              { number: "60+", label: "Verified Vendors", icon: Building2 },
              { number: "98%", label: "On-time Delivery", icon: Target }
            ].map((stat, i) => (
              <div key={i} 
                   className="bg-white rounded-2xl p-6 md:p-8 shadow-xl text-center hover:-translate-y-2 transition-transform duration-300">
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-orange-500" />
                <div className="text-3xl md:text-4xl font-bold text-blue-950 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story + Problem we solve - side by side */}
      <section id="our-story" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Story */}
          <div>
            <div className="inline-block mb-6 px-5 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
              Our Beginning
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-8">
              Born from Real Experience on Kenyan Roads
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Our founder, Peter Maina, spent years as both an <strong>Uber/Bolt rider</strong> and <strong>JG Gas supplier</strong>. 
                He saw the same problems over and over again:
              </p>
              
              <ul className="space-y-4">
                {[
                  "Waiting 2–5 days for gas delivery",
                  "Unreliable vendors & surprise price changes",
                  "No tracking → safety anxiety",
                  "Poor communication between all parties"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1.5 flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                      <Shield size={16} className="text-orange-600" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right - Mission & Values */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
            <h3 className="text-3xl font-bold text-blue-950 mb-8">Our Promise</h3>
            
            <div className="space-y-10">
              <div>
                <h4 className="text-2xl font-semibold mb-3 text-orange-700">Mission</h4>
                <p className="text-gray-700 text-lg">
                  To deliver LPG in Kenya faster, safer and more transparently using modern technology.
                </p>
              </div>
              
              <div>
                <h4 className="text-2xl font-semibold mb-3 text-orange-700">Core Values</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['Safety', 'Speed', 'Transparency', 'Respect', 'Innovation', 'Reliability'].map(v => (
                    <div key={v} className="bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl text-center font-medium border border-orange-100">
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder mini card */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/5 bg-gradient-to-br from-blue-900 to-indigo-950 p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-5xl font-bold">
                    PM
                  </div>
                  <h3 className="text-3xl font-bold">Peter Maina</h3>
                  <p className="text-blue-200 mt-2">Founder & CEO</p>
                </div>
              </div>
              
              <div className="p-10 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-6">From Rider to Builder</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  After years on the road delivering gas and riding for ride-hailing apps, 
                  I decided to solve the problems I experienced every single day.
                </p>
                <a href="/founder" className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 group">
                  Read Peter's full story <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready for better gas delivery experience?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Join thousands of Nairobi households who no longer stress about running out of gas
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-white text-orange-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-orange-400/30 hover:scale-[1.02] transition-all">
              Download App Now
            </button>
            <button className="border-2 border-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition">
              Become a Vendor →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}