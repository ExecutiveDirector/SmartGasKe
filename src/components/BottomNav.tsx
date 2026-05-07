// ============================================================
// FILE: src/components/BottomNav.tsx
// Shared bottom navigation bar — used across all shop pages
// ============================================================

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  ShoppingCart,
  ClipboardList,
  Store,
  User,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home',   href: '/',        icon: Home         },
  { label: 'Shop',   href: '/shop',    icon: Store        },
  { label: 'Orders', href: '/orders',  icon: ClipboardList },
  { label: 'Cart',   href: '/cart',    icon: ShoppingCart  },
  { label: 'Account',href: '/profile', icon: User         },
];

export default function BottomNav() {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glass backdrop */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-2xl" />

      {/* Centred pill container */}
      <div className="relative flex justify-center px-4 py-2">
        <nav className="flex items-center gap-1 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 px-3 py-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon     = item.icon;
            const isActive = router.pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  group flex flex-col items-center justify-center
                  px-3 py-1.5 rounded-2xl
                  transition-all duration-300 active:scale-95
                  ${isActive ? 'bg-emerald-50' : 'hover:bg-emerald-50'}
                `}
              >
                <div
                  className={`
                    w-10 h-10 rounded-2xl
                    flex items-center justify-center
                    shadow-md transition-all duration-300
                    group-hover:scale-110
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-200'
                        : 'bg-gray-100 text-gray-500'
                    }
                  `}
                >
                  <Icon size={19} />
                </div>
                <span
                  className={`
                    mt-1 text-[10px] font-bold tracking-wide
                    ${isActive ? 'text-emerald-700' : 'text-gray-400'}
                  `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
