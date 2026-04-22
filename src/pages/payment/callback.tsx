// ============================================================
// FILE: src/pages/payment/callback.tsx
// Payment Result Page
// FIX: Show correct UI even when DB update fails but Pesapal
//      already confirmed the payment.
// ============================================================

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check, X, Loader, AlertCircle } from 'lucide-react';

type Status = 'loading' | 'success' | 'failed' | 'error';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const { OrderTrackingId, OrderMerchantReference } = router.query;

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (OrderTrackingId && OrderMerchantReference) {
      confirmPayment(
        OrderTrackingId as string,
        OrderMerchantReference as string
      );
    }
  }, [OrderTrackingId, OrderMerchantReference]);

  const confirmPayment = async (trackingId: string, merchantReference: string) => {
    try {
      setStatus('loading');
      setMessage('Verifying your payment with Pesapal…');

      // Retrieve the stored auth token so the API route can forward it
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('authToken')
          : null;

      const response = await fetch('/api/payments/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          order_id: merchantReference,
          tracking_id: trackingId,
        }),
      });

      const result = await response.json();

      setOrderId(merchantReference);

      // ✅ Key fix: trust the verified Pesapal status (result.payment_status)
      // even when the DB write failed (result.success === false).
      const verifiedStatus: string = result.payment_status ?? '';

      if (verifiedStatus === 'paid') {
        setStatus('success');
        setMessage(
          result.success
            ? 'Payment successful! Your order has been confirmed.'
            : 'Payment received by Pesapal. Your order will be confirmed shortly — please check your orders page.'
        );
        return;
      }

      if (verifiedStatus === 'failed' || verifiedStatus === 'refunded') {
        setStatus('failed');
        setMessage('Payment was not completed. Please try again or contact support.');
        return;
      }

      // HTTP-level error with no usable payment_status
      if (!response.ok) {
        throw new Error(result.error || `Server error (${response.status})`);
      }

      // Pending / unknown
      setStatus('error');
      setMessage(
        'Payment status is unclear. Please check your orders page or contact support.'
      );
    } catch (err: any) {
      console.error('Payment verification error:', err);
      setStatus('error');
      setMessage(
        err.message || 'Could not verify payment. Please contact support.'
      );
    }
  };

  // ── Loading ────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Verifying Payment – AquaGas</title>
        </Head>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-700">
          <Loader className="animate-spin text-blue-600" size={48} />
          <p className="text-lg font-medium">{message || 'Verifying your payment…'}</p>
        </div>
      </>
    );
  }

  // ── Success ────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <>
        <Head>
          <title>Payment Successful – AquaGas</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Payment Successful</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            {orderId && (
              <p className="text-sm text-gray-500 mb-6">
                Reference: <span className="font-mono font-semibold">{orderId}</span>
              </p>
            )}
            <div className="space-y-3">
              <Link
                href="/orders"
                className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                View My Orders
              </Link>
              <Link
                href="/shop"
                className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-400 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Failed ─────────────────────────────────────────────────
  if (status === 'failed') {
    return (
      <>
        <Head>
          <title>Payment Failed – AquaGas</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={40} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/cart"
                className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Try Again
              </Link>
              <Link
                href="/contact"
                className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-400 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Error / Unknown ────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Payment Status Unknown – AquaGas</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Status Unknown</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Check My Orders
            </Link>
            <Link
              href="/contact"
              className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-400 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}