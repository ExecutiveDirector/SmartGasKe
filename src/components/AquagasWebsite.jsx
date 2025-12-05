import React, { useState } from 'react';
import { Menu, X, Phone, Mail, MapPin, ChevronRight, CheckCircle, Users, TrendingUp, Shield, Zap, Download, ExternalLink } from 'lucide-react';

const AquagasWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Founder', id: 'founder' },
    { name: 'How It Works', id: 'howitworks' },
    { name: 'Technology', id: 'technology' },
    { name: 'Investors', id: 'investors' },
    { name: 'Partners', id: 'partners' },
    { name: 'Contact', id: 'contact' }
  ];

  const HomePage = () => (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Revolutionizing LPG Delivery in Kenya
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Making gas refills faster, safer, and more efficient through modern technology
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2">
                  <Download size={20} />
                  Download App
                </button>
                <button className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold">
                  Become a Vendor
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Platform Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold text-orange-400">1000+</div>
                  <div className="text-blue-200">Orders Delivered</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-400">50+</div>
                  <div className="text-blue-200">Active Vendors</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-400">100+</div>
                  <div className="text-blue-200">Delivery Riders</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-400">5000+</div>
                  <div className="text-blue-200">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Aquagas?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Fast Delivery', desc: 'Get your gas delivered within hours, not days' },
              { icon: Shield, title: 'Safe & Reliable', desc: 'Certified vendors and tracked deliveries for your peace of mind' },
              { icon: Users, title: 'Easy to Use', desc: 'Simple ordering process with real-time tracking' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform LPG Delivery?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers across Nairobi</p>
          <button className="bg-white text-orange-500 hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-lg">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );

  const AboutPage = () => (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">About Aquagas Delivery-App</h1>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Our Story</h2>
            <p className="text-lg text-gray-700 mb-4">
              Aquagas Delivery-App was born from firsthand experience in Kenya's delivery and LPG sectors. Founder Peter Maina, who worked as an Uber/Bolt rider and JG Gas supplier, witnessed the inefficiencies and safety concerns in traditional gas delivery methods.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              We set out to create a platform that brings reliability, safety, and convenience to the LPG market through modern technology.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-orange-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">The Problem We Solve</h3>
            <ul className="space-y-4">
              {[
                'Long wait times for gas delivery',
                'Unreliable vendors and pricing',
                'Safety concerns with untracked deliveries',
                'Lack of transparency in the supply chain',
                'Inefficient order management'
              ].map((problem, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-orange-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{problem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-blue-900 text-white rounded-2xl p-12 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold mb-3">Mission</h3>
              <p className="text-blue-100">To make gas delivery in Kenya safer, faster, and more efficient through reliable technology</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-3">Vision</h3>
              <p className="text-blue-100">To become Kenya's leading LPG delivery platform trusted by customers, vendors, and delivery teams nationwide</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-3">Values</h3>
              <p className="text-blue-100">Safety • Efficiency • Innovation • Integrity • Customer-first Thinking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const FounderPage = () => (
    <div className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-12">
            <h1 className="text-5xl font-bold mb-4">Peter Maina</h1>
            <p className="text-2xl text-blue-100">Founder & CEO, Aquagas Delivery-App</p>
          </div>
          
          <div className="p-12">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-blue-900">Professional Summary</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                I am a tech-driven founder and delivery logistics specialist passionate about building digital solutions that improve everyday services. As the founder of the Aquagas Delivery-App, I blend my experience in software development, delivery operations, and customer service to create efficient, reliable, and scalable systems for the LPG industry in Kenya.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-blue-900">Education</h3>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="font-bold text-lg">Bachelor of Science in Physics</div>
                  <div className="text-gray-600">The Catholic University of Eastern Africa (CUEA)</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-blue-900">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="text-orange-500" size={20} />
                    <span>+254 700 655624</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-orange-500" size={20} />
                    <span>1033235@cuea.edu</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-orange-500" size={20} />
                    <span>Nairobi, Kenya</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-blue-900">Technical & Professional Skills</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { category: 'App Development', skills: 'Flutter (User, Vendor, Rider Apps), React.js' },
                  { category: 'Backend Development', skills: 'Node.js, Express.js, MySQL' },
                  { category: 'APIs & Integrations', skills: 'JWT Auth, Twilio SMS, RESTful APIs' },
                  { category: 'Cybersecurity', skills: 'Ethical hacking, malware analysis (beginner-intermediate)' },
                  { category: 'Logistics Experience', skills: 'Uber/Bolt rider, JG Gas supplier' },
                  { category: 'Business Operations', skills: 'Client engagement, delivery management, vendor coordination' }
                ].map((skill, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-orange-50 to-blue-50 p-6 rounded-lg">
                    <div className="font-bold text-lg mb-2 text-blue-900">{skill.category}</div>
                    <div className="text-gray-700">{skill.skills}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-blue-900">Career Experience</h3>
              <div className="space-y-3">
                {[
                  'Chaitea.ke Bakery – Staff',
                  'Gravity Supermarket – Back Office',
                  'Felij Supermarket – Back Office',
                  'Bolt & Uber Rider',
                  'JG Gas Supplier'
                ].map((exp, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <ChevronRight className="text-orange-500" size={20} />
                    <span>{exp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900 to-orange-600 text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Vision</h3>
              <p className="text-lg">
                To build scalable digital platforms that transform delivery operations in Kenya, starting with the LPG industry through the Aquagas Delivery-App.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const HowItWorksPage = () => (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-16">How Aquagas Works</h1>
        
        {[
          {
            title: 'For Customers',
            color: 'blue',
            steps: [
              { num: '1', title: 'Download & Register', desc: 'Get the Aquagas app and create your account' },
              { num: '2', title: 'Place Order', desc: 'Select gas type, quantity, and delivery address' },
              { num: '3', title: 'Track Delivery', desc: 'Watch your order in real-time on the map' },
              { num: '4', title: 'Receive & Pay', desc: 'Get your gas and pay via mobile money' }
            ]
          },
          {
            title: 'For Vendors',
            color: 'orange',
            steps: [
              { num: '1', title: 'Register Business', desc: 'Sign up and get verified by our team' },
              { num: '2', title: 'List Products', desc: 'Add your gas types, prices, and stock levels' },
              { num: '3', title: 'Receive Orders', desc: 'Get notified when customers place orders' },
              { num: '4', title: 'Coordinate Delivery', desc: 'Assign riders and manage fulfillment' }
            ]
          },
          {
            title: 'For Riders',
            color: 'green',
            steps: [
              { num: '1', title: 'Join Platform', desc: 'Register and get approved as a delivery partner' },
              { num: '2', title: 'Accept Orders', desc: 'Receive delivery requests in your area' },
              { num: '3', title: 'Navigate Route', desc: 'Use in-app navigation to reach customers' },
              { num: '4', title: 'Complete Delivery', desc: 'Confirm delivery and receive payment' }
            ]
          }
        ].map((section, idx) => (
          <div key={idx} className="mb-16">
            <h2 className={`text-3xl font-bold mb-8 text-${section.color}-900`}>{section.title}</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {section.steps.map((step, stepIdx) => (
                <div key={stepIdx} className="relative">
                  <div className={`bg-${section.color}-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4`}>
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                  {stepIdx < 3 && (
                    <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TechnologyPage = () => (
    <div className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">Our Technology Stack</h1>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Built with modern, scalable technologies to ensure reliability, speed, and security
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Frontend Technologies</h2>
            <div className="space-y-4">
              {[
                { tech: 'Flutter', apps: 'User App, Vendor App, Rider App', desc: 'Cross-platform mobile development' },
                { tech: 'React.js', apps: 'Admin Dashboard', desc: 'Modern web interface for administrators' }
              ].map((item, idx) => (
                <div key={idx} className="border-l-4 border-orange-500 pl-4">
                  <div className="font-bold text-lg">{item.tech}</div>
                  <div className="text-gray-600">{item.apps}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Backend & Infrastructure</h2>
            <div className="space-y-4">
              {[
                { tech: 'Node.js + Express.js', desc: 'High-performance API server' },
                { tech: 'MySQL', desc: 'Reliable relational database' },
                { tech: 'RESTful API', desc: 'Standardized communication protocol' },
                { tech: 'JWT Authentication', desc: 'Secure user authentication' },
                { tech: 'Twilio SMS', desc: 'OTP verification system' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-bold">{item.tech}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Security First', desc: 'End-to-end encryption and secure payment processing' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Optimized performance for quick load times' },
              { icon: TrendingUp, title: 'Scalable', desc: 'Architecture designed to grow with demand' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <feature.icon className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-blue-100">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const InvestorsPage = () => (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">Investment Opportunity</h1>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Join us in revolutionizing Kenya's LPG delivery market
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Market Opportunity</h2>
            <div className="space-y-4">
              {[
                'Kenya\'s LPG market growing at 15% annually',
                'Over 2 million households using LPG in Nairobi',
                'Fragmented market with no dominant digital player',
                'Rising smartphone penetration enabling mobile ordering',
                'Government push for cleaner cooking fuels'
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <TrendingUp className="text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-orange-50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Business Model</h2>
            <div className="space-y-6">
              {[
                { title: 'Commission per Order', desc: '10-15% commission on each transaction' },
                { title: 'Vendor Subscription', desc: 'Monthly fees for premium features' },
                { title: 'Delivery Fees', desc: 'Per-delivery charges to customers' },
                { title: 'Premium Listings', desc: 'Featured placement for vendors' }
              ].map((model, idx) => (
                <div key={idx}>
                  <div className="font-bold text-lg mb-1">{model.title}</div>
                  <div className="text-gray-600">{model.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-900 text-white p-12 rounded-2xl mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Growth Projections</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { period: 'Year 1', metric: '10K Orders', value: 'KES 5M Revenue' },
              { period: 'Year 2', metric: '50K Orders', value: 'KES 25M Revenue' },
              { period: 'Year 3', metric: '200K Orders', value: 'KES 100M Revenue' },
              { period: 'Year 5', metric: '1M Orders', value: 'KES 500M Revenue' }
            ].map((projection, idx) => (
              <div key={idx} className="border-l-4 border-orange-400 pl-4 text-left">
                <div className="text-orange-400 font-bold mb-2">{projection.period}</div>
                <div className="text-xl font-bold mb-1">{projection.metric}</div>
                <div className="text-blue-200">{projection.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Invest?</h2>
          <p className="text-xl text-gray-600 mb-8">Download our pitch deck or schedule a meeting</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2">
              <Download size={20} />
              Download Pitch Deck
            </button>
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-bold">
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PartnersPage = () => (
    <div className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">Become a Partner</h1>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Join the Aquagas network and grow your business with us
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-orange-600">For Vendors</h2>
            <div className="space-y-4 mb-8">
              {[
                'Reach thousands of new customers',
                'Automated order management',
                'Real-time inventory tracking',
                'Secure payment processing',
                'Marketing and promotional support',
                'Analytics and sales insights'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold">
              Register as Vendor
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-blue-600">For Riders</h2>
            <div className="space-y-4 mb-8">
              {[
                'Flexible working hours',
                'Competitive earnings per delivery',
                'Route optimization tools',
                'Weekly payments',
                'Training and support',
                'Safety equipment provided'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold">
              Become a Rider
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-orange-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Onboarding Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Apply', desc: 'Fill out the registration form' },
              { num: '2', title: 'Verify', desc: 'Submit required documents' },
              { num: '3', title: 'Train', desc: 'Complete platform training' },
              { num: '4', title: 'Launch', desc: 'Start receiving orders' }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-white text-blue-900 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-blue-100">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">Get In Touch</h1>
        <p className="text-xl text-center text-gray-600 mb-16">
          Have questions? We'd love to hear from you
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
            <div className="space-y-6 mb-12">
                              <div className="flex items-start gap-4">
                <Phone className="text-orange-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <div className="font-bold mb-1">Phone</div>
                  <div className="text-gray-600">+254 700 655624</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-orange-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <div className="font-bold mb-1">Email</div>
                  <div className="text-gray-600">1033235@cuea.edu</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-orange-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <div className="font-bold mb-1">Location</div>
                  <div className="text-gray-600">Nairobi, Kenya</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-orange-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Office Hours</h3>
              <div className="space-y-2 text-gray-700">
                <div>Monday - Friday: 8:00 AM - 6:00 PM</div>
                <div>Saturday: 9:00 AM - 5:00 PM</div>
                <div>Sunday: Closed</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Full Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Phone</label>
                <input type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="+254 700 000000" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Message Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>General Inquiry</option>
                  <option>Vendor Partnership</option>
                  <option>Rider Application</option>
                  <option>Investment Opportunity</option>
                  <option>Technical Support</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Your Message</label>
                <textarea rows="4" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Tell us how we can help..."></textarea>
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const PageRenderer = () => {
    switch(currentPage) {
      case 'home': return <HomePage />;
      case 'about': return <AboutPage />;
      case 'founder': return <FounderPage />;
      case 'howitworks': return <HowItWorksPage />;
      case 'technology': return <TechnologyPage />;
      case 'investors': return <InvestorsPage />;
      case 'partners': return <PartnersPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="bg-gradient-to-r from-blue-900 to-orange-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-blue-900">Aquagas</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`font-semibold transition ${
                    currentPage === item.id
                      ? 'text-orange-500'
                      : 'text-gray-700 hover:text-orange-500'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold">
                Download App
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 font-semibold ${
                    currentPage === item.id
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold mt-4">
                Download App
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <PageRenderer />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-orange-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-xl font-bold">Aquagas</span>
              </div>
              <p className="text-gray-400">
                Making gas delivery in Kenya safer, faster, and more efficient.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <div className="cursor-pointer hover:text-white" onClick={() => setCurrentPage('about')}>About Us</div>
                <div className="cursor-pointer hover:text-white" onClick={() => setCurrentPage('founder')}>Founder</div>
                <div className="cursor-pointer hover:text-white" onClick={() => setCurrentPage('contact')}>Contact</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <div className="space-y-2 text-gray-400">
                <div className="cursor-pointer hover:text-white" onClick={() => setCurrentPage('howitworks')}>How It Works</div>
                <div className="cursor-pointer hover:text-white" onClick={() => setCurrentPage('technology')}>Technology</div>
                <div className="cursor-pointer hover:text-white" onClick={() => setCurrentPage('partners')}>Become a Partner</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <div className="space-y-2 text-gray-400">
                <div>+254 700 655624</div>
                <div>1033235@cuea.edu</div>
                <div>Nairobi, Kenya</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Aquagas Delivery-App. All rights reserved. Founded by Peter Maina</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AquagasWebsite;
