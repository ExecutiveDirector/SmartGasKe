import Link from 'next/link';
import { Facebook, Instagram, Twitter, MessageCircle, Mail, Phone, MapPin, ArrowRight, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Stay Updated with AquaGas
              </h3>
              <p className="text-gray-400">
                Get exclusive deals, gas tips, and delivery updates straight to your inbox
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap"
              >
                Subscribe
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Horizontal Snap Scroll */}
      <div className="container mx-auto px-6 py-12 relative">
        {/* Scroll Arrows */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-blue-600 p-2 rounded-full z-10"
          aria-label="Scroll Left"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-blue-600 p-2 rounded-full z-10"
          aria-label="Scroll Right"
        >
          <ChevronRight size={24} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {/* Column 1 - Brand */}
          <div className="flex-shrink-0 w-64 snap-start">
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-3xl font-bold">
                <span className="text-blue-500">Aqua</span>
                <span className="text-white">Gas</span>
              </h2>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              Kenya's leading smart gas delivery service. We bring cooking gas to your doorstep using IoT technology for seamless ordering and delivery tracking.
            </p>
            <div className="space-y-3">
              <a href="tel:+254710820666" className="flex items-center gap-3 text-gray-400 hover:text-white transition group">
                <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-600 transition">
                  <Phone size={18} />
                </div>
                <span>+254 710 820 666</span>
              </a>
              <a href="mailto:info@aquagas.co.ke" className="flex items-center gap-3 text-gray-400 hover:text-white transition group">
                <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-600 transition">
                  <Mail size={18} />
                </div>
                <span>info@aquagas.co.ke</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <MapPin size={18} />
                </div>
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Company */}
          <div className="flex-shrink-0 w-48 snap-start">
            <h3 className="text-white font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/founder', label: 'Our Founder' },
                { href: '/technology', label: 'Technology' },
                { href: '/investors', label: 'Investors' },
                { href: '/partners', label: 'Partners' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div className="flex-shrink-0 w-48 snap-start">
            <h3 className="text-white font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {[
                { href: '/shop', label: 'Order Gas' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/orders', label: 'Track Order' },
                { href: '/account/wallet', label: 'Wallet' },
                { href: '/blog', label: 'Blog' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div className="flex-shrink-0 w-48 snap-start">
            <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/refund', label: 'Refund Policy' },
                { href: '/faq', label: 'FAQs' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition flex items-center gap-2 group">
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {year} AquaGas Delivery. All rights reserved. Built with ❤️ in Kenya
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden md:inline">Follow us:</span>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-600 p-3 rounded-lg transition" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-pink-600 p-3 rounded-lg transition" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-400 p-3 rounded-lg transition" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://wa.me/254710820666" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-green-600 p-3 rounded-lg transition" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/254710820666"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition z-50 animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Hide default scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </footer>
  );
}