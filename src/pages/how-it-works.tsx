import Head from 'next/head';
import Link from 'next/link';
import { 
  Smartphone, ShoppingCart, MapPin, CreditCard, 
  UserCheck, Package, Truck, CheckCircle, 
  ArrowRight, ChevronRight 
} from 'lucide-react';

export default function HowItWorks() {
  return (
    <>
      <Head>
        <title>How It Works - AquaGas Delivery</title>
        <meta name="description" content="Learn how AquaGas works - simple steps for customers, vendors, and riders to use our gas delivery platform." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
              Simple • Safe • Seamless
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
              Gas Delivery Made Simple
              <span className="block text-green-300 mt-2">Track Every Step</span>
            </h1>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              From order to doorstep in hours. Real-time tracking, verified vendors, and secure payments.
            </p>

            <a href="#customers" 
               className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition group">
              See How It Works <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </a>
          </div>
        </section>

        {/* Quick Overview Cards */}
        <section className="py-16 -mt-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
              {[
                { icon: Smartphone, title: "Order", desc: "Place your order via app or web in seconds", color: "blue" },
                { icon: Truck, title: "Track", desc: "Watch your delivery in real-time on the map", color: "green" },
                { icon: CheckCircle, title: "Receive", desc: "Verified riders deliver safely to your door", color: "purple" }
              ].map((step, i) => (
                <div key={i} 
                     className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center">
                  <div className={`w-16 h-16 mb-4 rounded-xl bg-${step.color}-100 flex items-center justify-center mx-auto`}>
                    <step.icon size={32} className={`text-${step.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customers Section */}
        <section id="customers" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm">
                  For Customers
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Get Gas in 4 Simple Steps
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  No more waiting days for delivery. Order gas and track it in real-time.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { num: 1, icon: Smartphone, title: "Download App", desc: "Get AquaGas and create your account" },
                  { num: 2, icon: ShoppingCart, title: "Place Order", desc: "Select gas type, size, and delivery address" },
                  { num: 3, icon: MapPin, title: "Track Live", desc: "Monitor your delivery in real-time" },
                  { num: 4, icon: CreditCard, title: "Pay & Receive", desc: "Pay securely and receive your gas" }
                ].map((step, i) => (
                  <div key={i} className="relative text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                      {step.num}
                    </div>
                    <div className="mb-4 flex justify-center">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <step.icon size={32} className="text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                    {i < 3 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vendors Section */}
        <section id="vendors" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium text-sm">
                  For Vendors
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Grow Your Business
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Reach more customers and streamline your operations with our platform.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { num: 1, icon: UserCheck, title: "Register", desc: "Sign up and complete vendor verification" },
                  { num: 2, icon: Package, title: "List Products", desc: "Add your gas cylinders, prices, and stock" },
                  { num: 3, icon: ShoppingCart, title: "Receive Orders", desc: "Get instant order notifications" },
                  { num: 4, icon: Truck, title: "Coordinate", desc: "Manage deliveries with riders" }
                ].map((step, i) => (
                  <div key={i} className="relative text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-green-600 flex items-center justify-center text-2xl font-bold text-white">
                      {step.num}
                    </div>
                    <div className="mb-4 flex justify-center">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <step.icon size={32} className="text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                    {i < 3 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-green-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Riders Section */}
        <section id="riders" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium text-sm">
                  For Riders
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Deliver & Earn
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Join our network and earn flexibly delivering gas across Nairobi.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { num: 1, icon: UserCheck, title: "Join", desc: "Register and complete rider verification" },
                  { num: 2, icon: CheckCircle, title: "Accept Jobs", desc: "Choose deliveries that suit your schedule" },
                  { num: 3, icon: MapPin, title: "Navigate", desc: "Use GPS navigation to deliver" },
                  { num: 4, icon: CreditCard, title: "Get Paid", desc: "Confirm delivery and receive payment" }
                ].map((step, i) => (
                  <div key={i} className="relative text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                      {step.num}
                    </div>
                    <div className="mb-4 flex justify-center">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <step.icon size={32} className="text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                    {i < 3 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-purple-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Join thousands using AquaGas for fast, reliable gas delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition">
                Order Gas Now
              </Link>
              <Link href="/partners" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition flex items-center gap-2">
                Become a Partner <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
              }
