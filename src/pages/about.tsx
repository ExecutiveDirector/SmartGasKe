import Head from 'next/head';
import Link from 'next/link';
import { 
  Shield, Zap, Users, Truck, Heart, 
  ChevronRight, ArrowRight, 
  Building2, Target, CheckCircle
} from 'lucide-react';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - AquaGas Delivery</title>
        <meta name="description" content="Learn about AquaGas - Kenya's trusted gas delivery platform making LPG delivery safer, faster, and more reliable." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
              Established 2024 • Nairobi, Kenya
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
              Making Gas Delivery in Kenya
              <span className="block text-green-300 mt-2">Safer, Faster, and More Reliable</span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              We're transforming how Kenyans access cooking gas through technology, transparency, and a customer-first approach.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="#our-story" 
                 className="group bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg">
                Learn More <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <Link href="/contact" 
                    className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 -mt-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "5,000+", label: "Happy Customers", icon: Heart, color: "red" },
                { number: "1,200+", label: "Deliveries Completed", icon: Truck, color: "blue" },
                { number: "60+", label: "Verified Vendors", icon: Building2, color: "green" },
                { number: "98%", label: "On-time Delivery", icon: Target, color: "purple" }
              ].map((stat, i) => (
                <div key={i} 
                     className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <stat.icon className={`text-${stat.color}-600`} size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="our-story" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Story */}
              <div>
                <div className="inline-block mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm">
                  Our Beginning
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Born from Real Experience
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Our founder, Peter Maina, spent years working as an Uber/Bolt rider and JG Gas supplier in Nairobi. Through this experience, he witnessed the daily challenges facing the LPG delivery industry:
                  </p>
                  
                  <ul className="space-y-3">
                    {[
                      "Long waiting times (2-5 days) for delivery",
                      "Lack of transparency in pricing and delivery status",
                      "Safety concerns with untracked deliveries",
                      "Poor coordination between customers, vendors, and riders"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="font-medium text-gray-900 pt-4">
                    These challenges inspired the creation of AquaGas - a platform designed to solve real problems with modern technology.
                  </p>
                </div>
              </div>

              {/* Right - Mission & Values */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Promise</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-blue-600">Mission</h4>
                    <p className="text-gray-700">
                      To deliver LPG in Kenya faster, safer, and more transparently using modern technology and a customer-first approach.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-blue-600">Core Values</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {['Safety', 'Speed', 'Transparency', 'Reliability', 'Innovation', 'Respect'].map(v => (
                        <div key={v} className="bg-gray-50 px-4 py-2 rounded-lg text-center font-medium text-gray-700 text-sm border border-gray-200">
                          {v}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose AquaGas?
              </h2>
              <p className="text-xl text-gray-600">
                We've built a platform that benefits everyone in the supply chain
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "For Customers",
                  points: ["Fast, reliable delivery", "Real-time tracking", "Transparent pricing", "24/7 customer support"]
                },
                {
                  icon: Building2,
                  title: "For Vendors",
                  points: ["Expanded customer reach", "Efficient order management", "Digital payment solutions", "Business analytics"]
                },
                {
                  icon: Truck,
                  title: "For Riders",
                  points: ["Fair earnings", "Optimized routes", "Safety support", "Flexible schedules"]
                }
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
                  <div className="w-14 h-14 mb-4 rounded-xl bg-blue-100 flex items-center justify-center">
                    <item.icon className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.points.map((point, j) => (
                      <li key={j} className="flex items-center gap-2 text-gray-700 text-sm">
                        <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Card */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-green-600 p-10 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold">
                      PM
                    </div>
                    <h3 className="text-2xl font-bold">Peter Maina</h3>
                    <p className="text-blue-100 mt-2">Founder & CEO</p>
                  </div>
                </div>
                
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">From Rider to Founder</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    After years of firsthand experience in the delivery industry, Peter decided to build a solution that addresses the real challenges facing customers, vendors, and riders.
                  </p>
                  <Link href="/founder" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 group">
                    Read Peter's Full Story <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready for a Better Gas Delivery Experience?
            </h2>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Join thousands of Nairobi households who trust AquaGas for their cooking gas needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition">
                Order Gas Now
              </Link>
              <Link href="/partners" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition">
                Become a Partner
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
                                                  }
