// ============================================================
// FILE: src/pages/account/wallet.tsx
// Wallet Management Page - Add money, view transactions
// ============================================================

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Wallet,
  Plus,
  ArrowLeft,
  CreditCard,
  Phone,
  Loader,
  TrendingUp,
  TrendingDown,
  X,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { walletService } from '@/lib/api';
import { WalletTransaction } from '@/lib/types';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function WalletPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Add money form
  const [addMoneyForm, setAddMoneyForm] = useState({
    amount: '',
    paymentMethod: 'mpesa' as 'mpesa' | 'card',
    phoneNumber: '',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/account/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch wallet data
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWalletData();
    }
  }, [isAuthenticated, user, currentPage]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      // Fetch balance
      const balanceResponse = await walletService.getBalance();
      setBalance(balanceResponse.data.balance);

      // Fetch transactions
      const transactionsResponse = await walletService.getTransactions({
        page: currentPage,
        limit: 10,
      });
      setTransactions(transactionsResponse.data);
      setTotalPages(transactionsResponse.pagination.pages);
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  // Handle add money
  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(addMoneyForm.amount);

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < 100) {
      toast.error('Minimum amount is KES 100');
      return;
    }

    if (addMoneyForm.paymentMethod === 'mpesa' && !addMoneyForm.phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    setSubmitting(true);
    try {
      await walletService.addMoney({
        amount,
        payment_method: addMoneyForm.paymentMethod,
        phone_number: addMoneyForm.phoneNumber || undefined,
      });

      toast.success('Money added successfully!');
      setShowAddMoneyModal(false);
      setAddMoneyForm({ amount: '', paymentMethod: 'mpesa', phoneNumber: '' });
      fetchWalletData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add money');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate statistics
  const totalCredits = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

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
        <title>My Wallet - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Wallet</h1>
            <p className="text-gray-600">Manage your wallet balance and transactions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Available Balance</h3>
                  <Wallet size={32} />
                </div>
                <p className="text-5xl font-bold mb-6">{formatPrice(balance)}</p>
                <button
                  onClick={() => setShowAddMoneyModal(true)}
                  className="w-full bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Money
                </button>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-gray-600 text-sm font-semibold">Total Credits</h4>
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-green-600">{formatPrice(totalCredits)}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-gray-600 text-sm font-semibold">Total Debits</h4>
                    <TrendingDown className="text-red-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-red-600">{formatPrice(totalDebits)}</p>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h3>

                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">No transactions yet</p>
                    <p className="text-gray-500 text-sm mb-6">
                      Add money to your wallet to get started
                    </p>
                    <button
                      onClick={() => setShowAddMoneyModal(true)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      <Plus size={20} />
                      Add Money
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                transaction.type === 'credit'
                                  ? 'bg-green-100'
                                  : 'bg-red-100'
                              }`}
                            >
                              {transaction.type === 'credit' ? (
                                <ArrowDownLeft
                                  className="text-green-600"
                                  size={24}
                                />
                              ) : (
                                <ArrowUpRight
                                  className="text-red-600"
                                  size={24}
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 mb-1">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDateTime(transaction.created_at)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Balance: {formatPrice(transaction.balance_after)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-2xl font-bold ${
                                transaction.type === 'credit'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {transaction.type === 'credit' ? '+' : '-'}
                              {formatPrice(transaction.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowAddMoneyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Money to Wallet</h2>

            <form onSubmit={handleAddMoney} className="space-y-6">
              {/* Amount Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (KES)
                </label>
                <input
                  type="number"
                  min="100"
                  step="10"
                  value={addMoneyForm.amount}
                  onChange={(e) => setAddMoneyForm({ ...addMoneyForm, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                  placeholder="1000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum amount: KES 100</p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                      addMoneyForm.paymentMethod === 'mpesa'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={addMoneyForm.paymentMethod === 'mpesa'}
                      onChange={(e) =>
                        setAddMoneyForm({
                          ...addMoneyForm,
                          paymentMethod: e.target.value as 'mpesa',
                        })
                      }
                      className="w-4 h-4"
                    />
                    <Phone size={20} className="text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">M-Pesa</p>
                      <p className="text-xs text-gray-600">Pay via M-Pesa</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                      addMoneyForm.paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={addMoneyForm.paymentMethod === 'card'}
                      onChange={(e) =>
                        setAddMoneyForm({
                          ...addMoneyForm,
                          paymentMethod: e.target.value as 'card',
                        })
                      }
                      className="w-4 h-4"
                    />
                    <CreditCard size={20} className="text-blue-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Credit/Debit Card</p>
                      <p className="text-xs text-gray-600">Visa, Mastercard</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Phone Number (for M-Pesa) */}
              {addMoneyForm.paymentMethod === 'mpesa' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={addMoneyForm.phoneNumber}
                      onChange={(e) =>
                        setAddMoneyForm({ ...addMoneyForm, phoneNumber: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+254712345678"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Confirm Payment
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMoneyModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
    }
