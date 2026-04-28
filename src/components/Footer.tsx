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
    <footer className="bg-slate-900 text-slate-400">

      {/* ── Newsletter ─────────────────────────────────── */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Stay Updated</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
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
              className="
                flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700
                rounded-xl text-white placeholder-slate-500 text-sm
                focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40
                transition-colors
              "
              required
            />
            <button
              type="submit"
              className="
                bg-teal-600 hover:bg-teal-700 active:scale-95
                text-white px-4 rounded-xl
                flex items-center gap-2 font-medium text-sm
                transition-all duration-200 shadow-md
              "
            >
              <Send size={16} />
              <span className="hidden sm:inline">Subscribe</span>
            </button>
          </form>
        </div>
      </div>

      {/* ── Main footer ────────────────────────────────── */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Brand + contact */}
        <div className="space-y-5">
          <Link href="/" className="inline-block">
            <h2 className="text-2xl font-extrabold tracking-tight">
              <span className="text-teal-400">Aqua</span>
              <span className="text-white">Gas</span>
            </h2>
          </Link>

          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            AquaGas is a smart gas delivery service in Kenya — providing fast,
            reliable and convenient LPG delivery for homes and businesses.
          </p>

          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="tel:+254710820666"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <span className="bg-teal-900/60 text-teal-400 p-1.5 rounded-lg group-hover:bg-teal-800/60 transition-colors">
                  <Phone size={14} />
                </span>
                +254 710 820 666
              </a>
            </li>
            <li>
              <a
                href="mailto:info@aquagas.co.ke"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <span className="bg-sky-900/60 text-sky-400 p-1.5 rounded-lg group-hover:bg-sky-800/60 transition-colors">
                  <Mail size={14} />
                </span>
                info@aquagas.co.ke
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-slate-800 text-slate-400 p-1.5 rounded-lg">
                <MapPin size={14} />
              </span>
              Nairobi, Kenya
            </li>
          </ul>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/founder', label: 'Our Founder' },
                { href: '/technology', label: 'Technology' },
                { href: '/partners', label: 'Partners' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-teal-400 hover:translate-x-0.5 inline-block transition-all duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/shop', label: 'Order Gas' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/orders', label: 'Track Order' },
                { href: '/account/wallet', label: 'Wallet' },
                { href: '/blog', label: 'Blog' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-teal-400 hover:translate-x-0.5 inline-block transition-all duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/refund', label: 'Refund Policy' },
                { href: '/faq', label: 'FAQs' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-teal-400 hover:translate-x-0.5 inline-block transition-all duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────── */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {year} AquaGas Delivery. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            {/* Social icons */}
            {[
              { href: 'https://facebook.com', icon: <Facebook size={17} />, label: 'Facebook' },
              { href: 'https://instagram.com', icon: <Instagram size={17} />, label: 'Instagram' },
              { href: 'https://twitter.com', icon: <Twitter size={17} />, label: 'Twitter' },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="
                  text-slate-500 hover:text-white
                  bg-slate-800 hover:bg-slate-700
                  p-2 rounded-lg transition-all duration-200
                "
              >
                {icon}
              </a>
            ))}

            {/* WhatsApp — distinct */}
            <a
              href="https://wa.me/254710820666"
              className="
                flex items-center gap-1.5
                text-emerald-400 hover:text-emerald-300
                bg-emerald-900/40 hover:bg-emerald-900/60
                px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 ml-1
              "
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}