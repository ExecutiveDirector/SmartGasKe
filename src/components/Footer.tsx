import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-400">

      {/* ================= Newsletter ================= */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm">
              Get gas offers, delivery updates and useful tips from AquaGas.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg flex items-center gap-2 font-medium"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* ================= Main Footer ================= */}
<div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">

  {/* Brand + Contact */}
  <div className="space-y-5">
    <Link href="/" className="inline-block">
      <h2 className="text-3xl font-bold">
        <span className="text-blue-500">Aqua</span>
        <span className="text-white">Gas</span>
      </h2>
    </Link>

    <p className="text-gray-400 text-sm leading-relaxed max-w-md">
      AquaGas is a smart gas delivery service in Kenya, providing fast,
      reliable and convenient LPG delivery for homes and businesses.
    </p>

    <div className="space-y-3 text-sm">
      <a href="tel:+254710820666" className="flex items-center gap-3 hover:text-white">
        <Phone size={16} />
        +254 710 820 666
      </a>

      <a href="mailto:info@aquagas.co.ke" className="flex items-center gap-3 hover:text-white">
        <Mail size={16} />
        info@aquagas.co.ke
      </a>

      <div className="flex items-center gap-3">
        <MapPin size={16} />
        Nairobi, Kenya
      </div>
    </div>
  </div>

  {/* Links Section (Horizontal) */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

    {/* Company */}
    <div>
      <h4 className="text-white font-semibold mb-4">Company</h4>
      <ul className="space-y-3 text-sm">
        <li><Link href="/about" className="hover:text-white">About Us</Link></li>
        <li><Link href="/founder" className="hover:text-white">Our Founder</Link></li>
        <li><Link href="/technology" className="hover:text-white">Technology</Link></li>
        <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
        <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
      </ul>
    </div>

    {/* Services */}
    <div>
      <h4 className="text-white font-semibold mb-4">Services</h4>
      <ul className="space-y-3 text-sm">
        <li><Link href="/shop" className="hover:text-white">Order Gas</Link></li>
        <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
        <li><Link href="/orders" className="hover:text-white">Track Order</Link></li>
        <li><Link href="/account/wallet" className="hover:text-white">Wallet</Link></li>
        <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
      </ul>
    </div>

    {/* Legal */}
    <div>
      <h4 className="text-white font-semibold mb-4">Legal</h4>
      <ul className="space-y-3 text-sm">
        <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
        <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
        <li><Link href="/refund" className="hover:text-white">Refund Policy</Link></li>
        <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
      </ul>
    </div>

  </div>
</div>

      
      

      {/* ================= Bottom Bar ================= */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {year} AquaGas Delivery. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <a href="https://facebook.com" className="hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" className="hover:text-white">
              <Instagram size={18} />
            </a>
            <a href="https://twitter.com" className="hover:text-white">
              <Twitter size={18} />
            </a>
            <a
              href="https://wa.me/254710820666"
              className="flex items-center gap-2 text-green-500 hover:text-green-400"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}