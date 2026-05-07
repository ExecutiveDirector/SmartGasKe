// ============================================================
// FILE: src/components/BottomNav.tsx
// FULL WIDTH RESPONSIVE BOTTOM NAVIGATION
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
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Shop',
    href: '/shop',
    icon: Store,
  },
  {
    label: 'Orders',
    href: '/orders',
    icon: ClipboardList,
  },
  {
    label: 'Cart',
    href: '/cart',
    icon: ShoppingCart,
  },
  {
    label: 'Account',
    href: '/profile',
    icon: User,
  },
];

export default function BottomNav() {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">

      {/* BACKDROP */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl border-t border-gray-200/80 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]" />

      {/* SAFE AREA CONTAINER */}
      <div className="relative">

        {/* FULL WIDTH WRAPPER */}
        <div
          className="
            w-full
            pb-[max(env(safe-area-inset-bottom),0.5rem)]
          "
        >

          {/* NAV CONTAINER */}
          <nav
            className="
              flex items-center justify-between

              w-full

              gap-1 sm:gap-2

              px-2
              sm:px-4
              md:px-6

              py-2
            "
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              const isActive =
                router.pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    relative
                    flex flex-1 flex-col
                    items-center justify-center

                    min-w-0

                    rounded-2xl

                    px-1 py-2

                    transition-all duration-300
                    active:scale-95

                    ${
                      isActive
                        ? 'bg-emerald-50'
                        : 'hover:bg-gray-100'
                    }
                  `}
                >

                  {/* ACTIVE GLOW */}
                  {isActive && (
                    <div
                      className="
                        absolute inset-0
                        rounded-2xl
                        bg-gradient-to-b
                        from-emerald-100/60
                        to-transparent
                        pointer-events-none
                      "
                    />
                  )}

                  {/* ICON CONTAINER */}
                  <div
                    className={`
                      relative z-10
                      flex items-center justify-center

                      rounded-2xl

                      transition-all duration-300

                      w-10 h-10
                      sm:w-11 sm:h-11
                      md:w-12 md:h-12

                      ${
                        isActive
                          ? `
                            bg-gradient-to-br
                            from-emerald-500
                            to-teal-600
                            text-white
                            shadow-lg
                            shadow-emerald-200/50
                            scale-105
                          `
                          : `
                            bg-gray-100
                            text-gray-500
                          `
                      }
                    `}
                  >
                    <Icon
                      className="
                        w-[18px] h-[18px]
                        sm:w-5 sm:h-5
                      "
                    />
                  </div>

                  {/* LABEL */}
                  <span
                    className={`
                      relative z-10

                      mt-1

                      truncate
                      text-center

                      font-bold

                      transition-colors duration-300

                      text-[10px]
                      sm:text-[11px]

                      ${
                        isActive
                          ? 'text-emerald-700'
                          : 'text-gray-500'
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {/* ACTIVE INDICATOR */}
                  {isActive && (
                    <div
                      className="
                        mt-1
                        h-1 w-1
                        rounded-full
                        bg-emerald-500
                      "
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
