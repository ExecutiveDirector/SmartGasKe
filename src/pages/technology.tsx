// Technology.jsx
import React from 'react';
import { 
  Code, Database, Smartphone, Server, 
  Lock, Zap, Globe, Cpu, 
  ArrowRight, CheckCircle 
} from 'lucide-react';

export default function Technology() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Tech-Focused */}
      <section className="relative bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900 text-white pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,165,0,0.18),transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-orange-500/20 backdrop-blur-md rounded-full text-orange-300 font-medium">
            <span className="text-sm">Built for Scale & Security</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
            Powering Reliable Delivery
            <span className="block text-orange-400 mt-3">With Modern Tech</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            Flutter apps, Node.js backend, real-time tracking — all designed for Kenya's LPG needs.
          </p>

          <a href="#stack" 
             className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-400/30 transition-all flex items-center gap-3 mx-auto group max-w-fit">
            Explore Our Stack <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Key Features Cards */}
      <section className="-mt-24 md:-mt-32 relative z-10 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Real-time updates & quick load times" },
              { icon: Lock, title: "Secure by Design", desc: "JWT auth & end-to-end encryption" },
              { icon: Globe, title: "Scalable Architecture", desc: "Ready for nationwide expansion" }
            ].map((feature, i) => (
              <div key={i} 
                   className="bg-white rounded-2xl p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 text-center">
                <div className="w-16 h-16 mb-6 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                  <feature.icon size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="stack" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-5 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
              Our Core Technologies
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Built with the Best Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern stack for reliability, speed, and security in delivery logistics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-12 shadow-sm">
              <h3 className="text-3xl font-bold text-blue-950 mb-8">Frontend</h3>
              <ul className="space-y-6">
                {[
                  { icon: Smartphone, title: "Flutter Apps", desc: "Cross-platform for User, Vendor & Rider mobile apps" },
                  { icon: Code, title: "React.js", desc: "Responsive web dashboard & admin panel" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                      <item.icon size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-8 md:p-12 shadow-sm">
              <h3 className="text-3xl font-bold text-blue-950 mb-8">Backend & Infrastructure</h3>
              <ul className="space-y-6">
                {[
                  { icon: Server, title: "Node.js + Express", desc: "High-performance API server" },
                  { icon: Database, title: "MySQL Database", desc: "Reliable data storage for orders & users" },
                  { icon: Lock, title: "JWT Authentication", desc: "Secure access & OTP via Twilio SMS" },
                  { icon: Cpu, title: "RESTful APIs", desc: "Seamless integration across apps" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                      <item.icon size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-5 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              Why Our Tech Matters
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Innovation for Real Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our stack ensures efficiency, safety, and scalability for all users.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle, title: "Real-Time Efficiency", desc: "Instant updates reduce wait times by 70%" },
              { icon: Shield, title: "Top-Tier Security", desc: "Protect user data & prevent fraud" },
              { icon: TrendingUp, title: "Built to Grow", desc: "Handle 10x more orders without slowdown" }
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow text-center">
                <benefit.icon size={48} className="mx-auto mb-6 text-orange-500" />
                <h3 className="text-2xl font-bold text-blue-950 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Experience the Tech Difference
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Join AquaGas and see how our platform transforms LPG delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/download" className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 hover:scale-[1.02] transition-all">
              Download App
            </a>
            <a href="/investors" className="border-2 border-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition flex items-center gap-3">
              Invest in Innovation <ChevronRight />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}