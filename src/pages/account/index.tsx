// ============================================================
// FILE: src/pages/account/index.tsx
// Account Dashboard - Main account page
// ============================================================

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  User,
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/account/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent orders
      const ordersResponse = await orderService.getOrders({ limit: 5 });
      setRecentOrders(ordersResponse.data);

      // Fetch wallet balance
      const balanceResponse = await walletService.getBalance();
      setWalletBalance(balanceResponse.data.balance);

      // Fetch recent transactions
      const transactionsResponse = await walletService.getTransactions({ limit: 5 });
      setRecentTransactions(transactionsResponse.data);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'in_transit':
        return <TrendingUp size={16} />;
      case 'processing':
        return <Clock size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>My Account - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Account</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center text-white text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Mail size={16} className="mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone size={16} className="mr-2" />
                    <span>{user.phone}</span>
                  </div>
                  {user.address && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin size={16} className="mr-2" />
                      <span>{user.address}</span>
                    </div>
                  )}
                </div>

                <Link
                  href="/account/profile"
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Settings size={18} />
                  Edit Profile
                </Link>
              </div>

              {/* Wallet Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Wallet Balance</h3>
                  <Wallet size={24} />
                </div>
                <p className="text-4xl font-bold mb-4">{formatPrice(walletBalance)}</p>
                <Link
                  href="/account/wallet"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold inline-flex items-center gap-2"
                >
                  Manage Wallet
                  <ChevronRight size={18} />
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/shop"
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart size={20} className="text-blue-600" />
                      <span className="font-semibold text-gray-800">Continue Shopping</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <Package size={20} className="text-blue-600" />
                      <span className="font-semibold text-gray-800">My Orders</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut size={20} className="text-red-600" />
                      <span className="font-semibold text-gray-800">Logout</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Orders & Transactions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-gray-600 text-sm font-semibold">Total Orders</h4>
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{recentOrders.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-gray-600 text-sm font-semibold">Cart Items</h4>
                    <ShoppingCart className="text-blue-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-gray-600 text-sm font-semibold">Wallet</h4>
                    <CreditCard className="text-blue-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{formatPrice(walletBalance)}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                  <Link
                    href="/orders"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                  >
                    View All
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <Link
                      href="/shop"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-800">
                              Order #{order.id.slice(0, 8)}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getOrderStatusColor(
                                order.status
                              )}`}
                            >
                              {getOrderStatusIcon(order.status)}
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <ChevronRight size={20} className="text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{formatDate(order.created_at)}</span>
                          <span className="font-bold text-blue-600">
                            {formatPrice(order.grand_total)}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
                  <Link
                    href="/account/wallet"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                  >
                    View All
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'credit'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDate(transaction.created_at)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-bold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'credit' ? '+' : '-'}
                          {formatPrice(transaction.amount)}
                        </span>
                      </div>
                    ))}
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
