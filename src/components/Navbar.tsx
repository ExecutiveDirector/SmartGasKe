import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X, LogOut, Settings, Package } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { items, itemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/founder', label: 'Founder' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/technology', label: 'Technology' },
    { href: '/investors', label: 'Investors' },
    { href: '/partners', label: 'Partners' },
    { href: '/contact', label: 'Contact' },
    { href: '/shop', label: 'Shop' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="font-bold text-2xl">
              <span className="text-green-600">Aqua</span>
              <span className="text-gray-800">Gas</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-700 hover:text-green-600 transition font-medium ${
                  router.pathname === link.href ? 'text-green-600 font-bold underline' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 relative">
            {/* Cart Icon */}
            <div className="relative">
              <Link href="/shop/cart" className="relative hover:text-green-600 transition">
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              {/* Cart dropdown */}
              {itemCount > 0 && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="p-4 border-b text-gray-700 font-medium">Cart Items</div>
                  <div className="max-h-48 overflow-y-auto">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center px-4 py-2 hover:bg-gray-50">
                        <span className="text-gray-800">{item.name}</span>
                        <span className="text-gray-600 font-semibold">{item.quantity}x</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/shop/cart"
                    className="block text-center bg-green-600 text-white font-semibold py-2 hover:bg-green-700 transition"
                  >
                    View Cart
                  </Link>
                </div>
              )}
            </div>

            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
                >
                  <User size={24} />
                  <span className="hidden md:inline font-medium">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={16} /> Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Package size={16} /> Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/account/login"
                className="hidden md:inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-gray-700 hover:text-green-600 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-slide-down">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition font-medium ${
                    router.pathname === link.href ? 'bg-green-50 text-green-600 font-bold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  href="/account/login"
                  onClick={() => setIsOpen(false)}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-center"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
}