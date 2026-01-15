import Head from 'next/head';
import { 
  Zap, Shield, Bike, Code, GraduationCap, 
  MapPin, ArrowRight, Heart, Target
} from 'lucide-react';

export default function Founder() {
  return (
    <>
      <Head>
        <title>Meet Our Founder - Peter Maina | AquaGas</title>
        <meta name="description" content="Learn about Peter Maina, the founder of AquaGas, and his journey from delivery rider to tech entrepreneur." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                <Heart size={16} />
                The Journey Behind AquaGas
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                From Delivery Rider to
                <span className="block text-green-300 mt-2">Tech Entrepreneur</span>
              </h1>

              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Meet Peter Maina, the founder who transformed his firsthand experience in gas delivery into a platform that's changing the industry.
              </p>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section className="py-16 -mt-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="md:flex">
                {/* Photo Side */}
                <div className="md:w-2/5 bg-gradient-to-br from-gray-100 to-gray-50 p-8 flex flex-col items-center justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden border-4 border-white shadow-lg mb-6">
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-6xl font-bold text-white">
                      PM
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Peter Maina</h2>
                  <p className="text-lg text-gray-600 mb-6">Founder & CEO</p>

                  <div className="space-y-3 w-full max-w-xs">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <GraduationCap size={20} className="text-blue-600" />
                      </div>
                      <span className="text-sm">BSc Physics, CUEA</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <MapPin size={20} className="text-green-600" />
                      </div>
                      <span className="text-sm">Nairobi, Kenya</span>
                    </div>
                  </div>
                </div>

                {/* Story Side */}
                <div className="p-8 md:p-12 flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    The Journey
                  </h3>

                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Peter Maina's journey to founding AquaGas began on the streets of Nairobi as a Bolt and Uber rider, followed by years as a JG Gas supplier.
                    </p>
                    <p>
                      During this time, he witnessed firsthand the challenges facing the LPG delivery industry: long wait times, lack of transparency, safety concerns, and inefficient coordination between customers, vendors, and riders.
                    </p>
                    <p className="font-medium text-gray-900">
                      "I realized that the problem wasn't just about delivery—it was about creating a system that works for everyone in the supply chain."
                    </p>
                    <p>
                      Drawing on his physics background and passion for technology, Peter built AquaGas to solve these problems through smart logistics, real-time tracking, and a customer-first approach.
                    </p>
                  </div>

                  {/* Experience Highlights */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {[
                      { icon: Bike, label: "Delivery Experience" },
                      { icon: Code, label: "Tech Innovation" },
                      { icon: Shield, label: "Safety First" },
                      { icon: Heart, label: "Customer Focus" },
                      { icon: Target, label: "Problem Solver" },
                      { icon: Zap, label: "Fast Execution" }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 mb-2 rounded-lg bg-blue-50 flex items-center justify-center">
                          <item.icon size={24} className="text-blue-600" />
                        </div>
                        <p className="text-xs font-medium text-gray-600">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Vision for the Future
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  To create a platform where no Kenyan household ever worries about running out of gas—where deliveries are fast, transparent, and reliable for everyone involved.
                </p>
              </div>

              {/* Key Principles */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    title: "For Customers",
                    description: "Fast, reliable delivery with real-time tracking and transparent pricing"
                  },
                  {
                    title: "For Vendors",
                    description: "Efficient order management and expanded customer reach"
                  },
                  {
                    title: "For Riders",
                    description: "Fair earnings, optimized routes, and safety support"
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/contact" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition flex items-center gap-2 group"
                >
                  Get in Touch
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </a>

                <a 
                  href="/shop" 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition"
                >
                  Order Gas Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
                  }
