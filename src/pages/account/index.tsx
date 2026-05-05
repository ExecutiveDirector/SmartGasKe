// FILE: src/pages/account/index.tsx

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Package, Wallet, ShoppingCart, Settings, LogOut,
  ChevronRight, CreditCard, Phone, Mail, TrendingUp,
  Clock, CheckCircle, Loader, ArrowUpRight, ArrowDownLeft,
  MapPin, User,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import { orderService, walletService } from '@/lib/api';
import { Order, WalletTransaction } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  delivered:  { label: 'Delivered',  className: 'badge-green'  },
  in_transit: { label: 'In Transit', className: 'badge-blue'   },
  processing: { label: 'Processing', className: 'badge-yellow' },
  confirmed:  { label: 'Confirmed',  className: 'badge-purple' },
  cancelled:  { label: 'Cancelled',  className: 'badge-red'    },
  pending:    { label: 'Pending',    className: 'badge-gray'   },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: 'badge-gray' };
  return <span className={`badge ${cfg.className}`}>{cfg.label}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AccountDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { cart } = useCart();
  const [recentOrders, setRecentOrders]           = useState<Order[]>([]);
  const [walletBalance, setWalletBalance]         = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading]                     = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/account/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) fetchDashboardData();
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [orders, balance, txns] = await Promise.allSettled([
      orderService.getOrders({ limit: 5 }),
      walletService.getBalance(),
      walletService.getTransactions({ limit: 4 }),
    ]);
    if (orders.status    === 'fulfilled') setRecentOrders(orders.value?.data ?? []);
    if (balance.status   === 'fulfilled') setWalletBalance(balance.value?.data?.balance ?? 0);
    if (txns.status      === 'fulfilled') setRecentTransactions(txns.value?.data ?? []);
    setLoading(false);
  };

  const handleLogout = async () => {
    try { await logout(); router.push('/'); }
    catch { toast.error('Logout failed'); }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  if (!user) return null;

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const initials  = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <Head><title>My Account — AquaGas</title></Head>

      <style jsx global>{`
        /* ── Badge system ── */
        .badge {
          display: inline-flex; align-items: center;
          padding: 2px 10px; border-radius: 9999px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
        }
        .badge-green  { background: #dcfce7; color: #15803d; }
        .badge-blue   { background: #dbeafe; color: #1d4ed8; }
        .badge-yellow { background: #fef9c3; color: #a16207; }
        .badge-purple { background: #f3e8ff; color: #7e22ce; }
        .badge-red    { background: #fee2e2; color: #b91c1c; }
        .badge-gray   { background: #f3f4f6; color: #374151; }
      `}</style>

      <div className="min-h-screen bg-gray-50">

        {/* ── Top nav breadcrumb ── */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">My Account</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-1 space-y-4">

              {/* Account card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-0.5">
                  {[
                    { href: '/account',         icon: <User size={15} />,         label: 'Dashboard',          active: true  },
                    { href: '/orders',           icon: <Package size={15} />,      label: 'Orders'                            },
                    { href: '/account/wallet',   icon: <Wallet size={15} />,       label: 'Wallet'                            },
                    { href: '/account/profile',  icon: <Settings size={15} />,     label: 'Profile Settings'                  },
                    { href: '/shop',             icon: <ShoppingCart size={15} />, label: 'Continue Shopping'                  },
                  ].map(({ href, icon, label, active }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-gray-400">{icon}</span>
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <span className="text-gray-400"><LogOut size={15} /></span>
                    Sign Out
                  </button>
                </nav>
              </div>

              {/* Contact info */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={13} className="text-gray-400 flex-shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{user.address}</span>
                    </div>
                  )}
                </div>
                <Link
                  href="/account/profile"
                  className="mt-4 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <Settings size={12} /> Edit profile
                </Link>
              </div>
            </aside>

            {/* ── Main content ── */}
            <main className="lg:col-span-3 space-y-6">

              {/* Summary row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Orders',  value: recentOrders.length, icon: <Package size={16} />,      href: '/orders'           },
                  { label: 'Cart Items',    value: cartCount,            icon: <ShoppingCart size={16} />, href: '/cart'             },
                  { label: 'Wallet',        value: formatPrice(walletBalance), icon: <CreditCard size={16} />, href: '/account/wallet', isText: true },
                ].map(({ label, value, icon, href, isText }) => (
                  <Link
                    key={label}
                    href={href}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 group-hover:text-gray-600 transition-colors">{icon}</span>
                      <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                    </div>
                    <p className={`font-bold text-gray-900 ${isText ? 'text-base' : 'text-2xl'}`}>{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </Link>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
                  <Link href="/orders" className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-0.5 transition-colors">
                    View all <ChevronRight size={13} />
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="py-14 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Package size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No orders yet</p>
                    <Link href="/shop" className="text-sm font-medium text-gray-900 underline underline-offset-2 hover:no-underline">
                      Start shopping
                    </Link>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Order</th>
                        <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                        <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="text-right px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <span className="font-medium text-gray-900">#{order.order_number || order.id.slice(0, 8).toUpperCase()}</span>
                            <span className="block text-xs text-gray-400 mt-0.5">
                              {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{formatDate(order.created_at)}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                          <td className="px-5 py-3.5 text-right font-medium text-gray-900">{formatPrice(order.grand_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Wallet + transactions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Balance */}
                <div className="bg-gray-900 rounded-lg p-5 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Wallet Balance</p>
                    <Wallet size={15} className="text-gray-500" />
                  </div>
                  <p className="text-2xl font-bold tracking-tight mb-4">{formatPrice(walletBalance)}</p>
                  <Link
                    href="/account/wallet"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Manage wallet <ChevronRight size={12} />
                  </Link>
                </div>

                {/* Recent transactions */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transactions</p>
                    <Link href="/account/wallet" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">View all</Link>
                  </div>
                  {recentTransactions.length === 0 ? (
                    <div className="py-8 flex flex-col items-center gap-2">
                      <Wallet size={18} className="text-gray-300" />
                      <p className="text-xs text-gray-400">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {recentTransactions.map((tx) => {
                        const isCredit = tx.type === 'credit';
                        return (
                          <div key={tx.id} className="flex items-center gap-3 px-4 py-2.5">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                            }`}>
                              {isCredit
                                ? <ArrowDownLeft size={12} />
                                : <ArrowUpRight  size={12} />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">{tx.description}</p>
                              <p className="text-xs text-gray-400">{formatDate(tx.created_at)}</p>
                            </div>
                            <span className={`text-xs font-semibold ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
                              {isCredit ? '+' : '-'}{formatPrice(tx.amount)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>
    </>
  );
}
