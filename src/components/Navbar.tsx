import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/partners', label: 'Partners' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-950/5 bg-white/95 shadow-[0_4px_24px_rgba(16,37,31,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 rounded-xl focus-visible:outline-emerald-600" aria-label="AquaGas home">
          <img src="/logo.png" alt="AquaGas" className="h-10 w-auto object-contain sm:h-11" />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                isActive(link.href)
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/shop/cart" aria-label={`Shopping cart, ${itemCount} items`} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
            <ShoppingCart size={19} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link href="/account" className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 sm:flex">
              <User size={16} />
              <span className="max-w-[110px] truncate">{user?.name || 'My Account'}</span>
            </Link>
          ) : (
            <Link href="/account/login" className="hidden rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md sm:inline-flex">
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-navigation" className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-lg lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href) ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link href="/account" onClick={() => setIsOpen(false)} className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white">
                <User size={17} /> My Account
              </Link>
            ) : (
              <Link href="/account/login" onClick={() => setIsOpen(false)} className="mt-2 rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white">
                Sign in / Create account
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
