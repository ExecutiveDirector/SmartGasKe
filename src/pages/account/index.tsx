// ============================================================
// FILE: src/pages/account/index.tsx
// Account Dashboard — Enhanced (Production Safe)
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
    } catch {
      setRecentOrders([]);
    }

    try {
      const balanceResponse = await walletService.getBalance();
      setWalletBalance(balanceResponse?.data?.balance ?? 0);
    } catch {
      setWalletBalance(0);
    }

    try {
      const transactionsResponse = await walletService.getTransactions({ limit: 5 });
      setRecentTransactions(transactionsResponse?.data ?? []);
    } catch {
      setRecentTransactions([]);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle size={13} />, label: 'Delivered' };
      case 'in_transit':
        return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: <TrendingUp size={13} />, label: 'In Transit' };
      case 'processing':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Clock size={13} />, label: 'Processing' };
      case 'cancelled':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <Package size={13} />, label: 'Cancelled' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: <Package size={13} />, label: status };
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

  // ✅ SAFE DERIVED DATA
  const activeOrders = recentOrders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const totalSpent = recentOrders.reduce(
    (sum, o) => sum + (o.grand_total || 0),
    0
  );

  const lastTransactionDate = recentTransactions[0]?.created_at;

  return (
    <>
      <Head>
        <title>Dashboard — AquaGas</title>
      </Head>

      <div className="min-h-screen bg-slate-50">

        {/* Header */}
        <div className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 text-teal-600 p-2 rounded-xl">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-400">
                  Welcome back, {user.name.split(' ')[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/shop" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700">
                Shop
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ACTIVE ORDERS ALERT */}
          {activeOrders > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  You have {activeOrders} active order{activeOrders > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-blue-600">
                  Track your deliveries in real-time
                </p>
              </div>
              <Link href="/orders" className="text-sm font-semibold text-blue-700">
                Track →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="space-y-5">

              {/* Profile */}
              <div className="bg-white rounded-2xl border p-5">
                <h2 className="font-bold">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  Verified Account
                </p>
              </div>

              {/* Wallet */}
              <div className="bg-teal-600 text-white p-5 rounded-2xl">
                <p className="text-sm">Wallet Balance</p>
                <p className="text-2xl font-bold">{formatPrice(walletBalance)}</p>
                <p className="text-xs mt-1">
                  Last activity: {lastTransactionDate ? formatDate(lastTransactionDate) : '—'}
                </p>
                <Link href="/account/wallet" className="text-sm underline mt-2 inline-block">
                  Manage Wallet
                </Link>
              </div>

            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 space-y-5">

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl">
                  <p className="text-xs text-slate-400">Orders</p>
                  <p className="text-xl font-bold">{recentOrders.length}</p>
                </div>

                <div className="bg-white p-4 rounded-xl">
                  <p className="text-xs text-slate-400">Spent</p>
                  <p className="text-xl font-bold">{formatPrice(totalSpent)}</p>
                </div>

                <div className="bg-white p-4 rounded-xl">
                  <p className="text-xs text-slate-400">Active</p>
                  <p className="text-xl font-bold">{activeOrders}</p>
                </div>
              </div>

              {/* ORDERS */}
              <div className="bg-white rounded-2xl border">
                <div className="p-4 border-b flex justify-between">
                  <h3 className="font-bold">Recent Orders</h3>
                  <Link href="/orders">View All</Link>
                </div>

                {recentOrders.map((order) => {
                  const sc = getStatusConfig(order.status);
                  return (
                    <Link key={order.id} href={`/orders/${order.id}`} className="flex justify-between p-4 border-b">
                      <div>
                        <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-slate-400">
                          {formatDate(order.created_at)} • {order.payment_method || 'Payment'}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">{formatPrice(order.grand_total)}</p>
                        <span className={`text-xs ${sc.text}`}>{sc.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* TRANSACTIONS */}
              <div className="bg-white rounded-2xl border">
                <div className="p-4 border-b flex justify-between">
                  <h3 className="font-bold">Transactions</h3>
                  <Link href="/account/wallet">View All</Link>
                </div>

                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between p-4 border-b">
                    <p>{tx.description}</p>
                    <p>{formatPrice(tx.amount)}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
