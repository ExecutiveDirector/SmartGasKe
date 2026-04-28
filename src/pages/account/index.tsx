// ============================================================
// FILE: src/pages/account/index.tsx
// Account Dashboard — Professional Green & Blue Theme
// ============================================================

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Package,
  Wallet,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronRight,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle,
  Loader,
  ArrowUpRight,
  ArrowDownLeft,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import { orderService, walletService } from '@/lib/api';
import { Order, WalletTransaction } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AccountDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { cart } = useCart();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/account/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) fetchDashboardData();
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const ordersResponse = await orderService.getOrders({ limit: 5 });
      setRecentOrders(ordersResponse?.data ?? []);
    } catch { setRecentOrders([]); }
    try {
      const balanceResponse = await walletService.getBalance();
      setWalletBalance(balanceResponse?.data?.balance ?? 0);
    } catch { setWalletBalance(0); }
    try {
      const transactionsResponse = await walletService.getTransactions({ limit: 5 });
      setRecentTransactions(transactionsResponse?.data ?? []);
    } catch { setRecentTransactions([]); }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch { toast.error('Logout failed'); }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered':   return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle size={13} />, label: 'Delivered' };
      case 'in_transit':  return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: <TrendingUp size={13} />, label: 'In Transit' };
      case 'processing':  return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Clock size={13} />, label: 'Processing' };
      case 'cancelled':   return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <Package size={13} />, label: 'Cancelled' };
      default:            return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: <Package size={13} />, label: status };
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-teal-600" size={36} />
          <p className="text-sm text-slate-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <Head><title>My Account — AquaGas</title></Head>

      <div className="min-h-screen bg-slate-50">

        {/* ── Page header ─────────────────────────────── */}
        <div className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 text-teal-600 p-2 rounded-xl">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">My Account</h1>
                <p className="text-sm text-slate-400">Welcome back, {user.name.split(' ')[0]}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left sidebar ──────────────────────────── */}
            <div className="lg:col-span-1 space-y-5">

              {/* Profile card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Banner */}
                <div className="h-20 bg-gradient-to-r from-teal-500 via-teal-600 to-sky-600 relative">
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 0%, transparent 60%)' }}
                  />
                </div>
                {/* Avatar */}
                <div className="px-5 pb-5">
                  <div className="-mt-8 mb-3 flex items-end justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-sky-600 flex items-center justify-center text-white text-xl font-bold shadow-lg border-2 border-white">
                      {initials}
                    </div>
                    <Link
                      href="/account/profile"
                      className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Settings size={13} />
                      Edit
                    </Link>
                  </div>
                  <h2 className="font-bold text-slate-900 text-lg leading-tight">{user.name}</h2>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2.5 text-sm text-slate-500">
                      <Mail size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-500">
                      <Phone size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                    {user.address && (
                      <div className="flex items-start gap-2.5 text-sm text-slate-500">
                        <MapPin size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Wallet card */}
              <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-sky-700 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-10 -translate-x-8" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-teal-100 text-xs font-semibold uppercase tracking-wider">Wallet Balance</p>
                    <Wallet size={18} className="text-teal-200" />
                  </div>
                  <p className="text-3xl font-extrabold tracking-tight mt-1 mb-4">
                    {formatPrice(walletBalance)}
                  </p>
                  <Link
                    href="/account/wallet"
                    className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    Manage Wallet
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Quick Actions</p>
                <nav className="space-y-1">
                  {[
                    { href: '/shop', icon: <ShoppingCart size={17} />, label: 'Continue Shopping', color: 'text-teal-600 bg-teal-50' },
                    { href: '/orders', icon: <Package size={17} />, label: 'My Orders', color: 'text-sky-600 bg-sky-50' },
                    { href: '/account/wallet', icon: <CreditCard size={17} />, label: 'Wallet', color: 'text-emerald-600 bg-emerald-50' },
                  ].map(({ href, icon, label, color }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-1.5 rounded-lg ${color}`}>{icon}</span>
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                      </div>
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 rounded-lg text-red-500 bg-red-50 group-hover:bg-red-100 transition-colors">
                        <LogOut size={17} />
                      </span>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-red-600 transition-colors">Logout</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-300" />
                  </button>
                </nav>
              </div>
            </div>

            {/* ── Right main ────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Orders', value: recentOrders.length, icon: <Package size={18} />, accent: 'text-teal-600 bg-teal-50' },
                  { label: 'Cart Items', value: cartCount, icon: <ShoppingCart size={18} />, accent: 'text-sky-600 bg-sky-50' },
                  { label: 'Balance', value: formatPrice(walletBalance), icon: <CreditCard size={18} />, accent: 'text-emerald-600 bg-emerald-50', small: true },
                ].map(({ label, value, icon, accent, small }) => (
                  <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                      <span className={`p-1.5 rounded-lg ${accent}`}>{icon}</span>
                    </div>
                    <p className={`font-extrabold text-slate-900 ${small ? 'text-lg' : 'text-3xl'}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Recent Orders</h3>
                  <Link href="/orders" className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                    View All <ChevronRight size={15} />
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="py-12 flex flex-col items-center gap-3 text-center px-6">
                    <div className="bg-slate-100 text-slate-400 p-4 rounded-2xl">
                      <Package size={32} />
                    </div>
                    <p className="text-slate-500 text-sm">No orders yet</p>
                    <Link
                      href="/shop"
                      className="mt-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {recentOrders.map((order) => {
                      const sc = getStatusConfig(order.status);
                      return (
                        <Link
                          key={order.id}
                          href={`/orders/${order.id}`}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                        >
                          <div className={`p-2 rounded-xl ${sc.bg} ${sc.text} flex-shrink-0`}>
                            {sc.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-slate-800">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                                {sc.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              {formatDate(order.created_at)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-sm font-bold text-teal-700">{formatPrice(order.grand_total)}</span>
                            <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent transactions */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Recent Transactions</h3>
                  <Link href="/account/wallet" className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                    View All <ChevronRight size={15} />
                  </Link>
                </div>

                {recentTransactions.length === 0 ? (
                  <div className="py-12 flex flex-col items-center gap-3">
                    <div className="bg-slate-100 text-slate-400 p-4 rounded-2xl">
                      <Wallet size={32} />
                    </div>
                    <p className="text-slate-500 text-sm">No transactions yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {recentTransactions.map((tx) => {
                      const isCredit = tx.type === 'credit';
                      return (
                        <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
                          <div className={`p-2 rounded-xl flex-shrink-0 ${isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                            {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{tx.description}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.created_at)}</p>
                          </div>
                          <span className={`text-sm font-bold flex-shrink-0 ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isCredit ? '+' : '-'}{formatPrice(tx.amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}