import Head from 'next/head';
import Link from 'next/link';
import { 
  Code, Database, Smartphone, Server, 
  Lock, Zap, Globe, Cpu, 
  ArrowRight, CheckCircle, Shield, TrendingUp 
} from 'lucide-react';

export default function Technology() {
  return (
    <>
      <Head>
        <title>Our Technology - AquaGas Delivery</title>
        <meta name="description" content="Learn about the technology powering AquaGas - modern stack for fast, secure, and reliable gas delivery." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
              Built for Scale & Security
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
              Powering Reliable Delivery
              <span className="block text-green-300 mt-2">With Modern Technology</span>
            </h1>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Flutter apps, Node.js backend, and real-time tracking—all designed for Kenya's LPG delivery needs.
            </p>

            <a href="#stack" 
               className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition group">
              Explore Our Stack <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </a>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 -mt-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Real-time updates with sub-second response times", color: "blue" },
                { icon: Lock, title: "Secure by Design", desc: "JWT authentication and encrypted data", color: "green" },
                { icon: Globe, title: "Scalable", desc: "Built to grow across Kenya and beyond", color: "purple" }
              ].map((feature, i) => (
                <div key={i} 
                     className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center">
                  <div className={`w-16 h-16 mb-4 rounded-xl bg-${feature.color}-100 flex items-center justify-center mx-auto`}>
                    <feature.icon size={32} className={`text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section id="stack" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm">
                  Our Technology Stack
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Built with Modern Tools
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  We use industry-leading technologies for reliability, speed, and security.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Frontend */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Frontend</h3>
                  <ul className="space-y-6">
                    {[
                      { icon: Smartphone, title: "Flutter", desc: "Cross-platform mobile apps for iOS & Android" },
                      { icon: Code, title: "React.js", desc: "Responsive web dashboard and admin panel" }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                          <item.icon size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-1 text-gray-900">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Backend */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Backend & Infrastructure</h3>
                  <ul className="space-y-6">
                    {[
                      { icon: Server, title: "Node.js", desc: "High-performance API server with Express" },
                      { icon: Database, title: "MySQL", desc: "Reliable relational database" },
                      { icon: Lock, title: "JWT Auth", desc: "Secure authentication system" },
                      { icon: Cpu, title: "REST API", desc: "Clean, documented API architecture" }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                          <item.icon size={24} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-1 text-gray-900">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium text-sm">
                  Why It Matters
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Technology That Delivers Results
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Our technology stack ensures efficiency, safety, and scalability.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { 
                    icon: CheckCircle, 
                    title: "Real-Time Updates", 
                    desc: "Instant order tracking and notifications keep everyone informed",
                    color: "blue"
                  },
                  { 
                    icon: Shield, 
                    title: "Enterprise Security", 
                    desc: "Bank-level encryption protects user data and transactions",
                    color: "green"
                  },
                  { 
                    icon: TrendingUp, 
                    title: "Scalable Growth", 
                    desc: "Architecture designed to handle 10x growth seamlessly",
                    color: "purple"
                  }
                ].map((benefit, i) => (
                  <div key={i} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-${benefit.color}-100 flex items-center justify-center`}>
                      <benefit.icon size={32} className={`text-${benefit.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features List */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Platform Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "Real-time GPS tracking",
                  "Push notifications",
                  "In-app payments",
                  "Order history & receipts",
                  "Multi-language support",
                  "Offline mode capability",
                  "Analytics dashboard",
                  "SMS notifications"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience the Technology Difference
            </h2>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              See how our platform transforms gas delivery with modern technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition">
                Try It Now
              </Link>
              <Link href="/investors" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition">
                Partner With Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
                          }
