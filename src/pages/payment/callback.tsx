// ============================================================
// FILE: src/pages/payment/callback.tsx
// SIMPLER APPROACH: No internal secret needed.
// The frontend page already has the user's auth token in
// localStorage, so it calls the backend directly with it.
// ============================================================

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check, X, Loader, AlertCircle } from 'lucide-react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://aquagas-backend.onrender.com/api/v1';

type Status = 'loading' | 'success' | 'failed' | 'error';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const { OrderTrackingId, OrderMerchantReference } = router.query;

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Verifying your payment…');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (OrderTrackingId && OrderMerchantReference) {
      verifyAndUpdate(
        OrderTrackingId as string,
        OrderMerchantReference as string
      );
    }
  }, [OrderTrackingId, OrderMerchantReference]);

  const verifyAndUpdate = async (
    trackingId: string,
    merchantReference: string
  ) => {
    setOrderId(merchantReference);

    try {
      // ── Step 1: Verify with Pesapal via your Next.js proxy ───────────
      // The Next.js API route handles the Pesapal credentials server-side.
      // No user auth needed for this call.
      setMessage('Checking payment with Pesapal…');

      const verifyRes = await fetch('/api/payments/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_id: trackingId }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Pesapal verification failed');
      }

      const pesapalStatus: string = verifyData.payment_status;

      // ── Step 2: Update backend directly with the user's own token ────
      // localStorage is available here because this runs in the browser.
      // The user's token survived the Pesapal redirect — no secret needed.
      setMessage('Updating your order…');

      const token = localStorage.getItem('authToken');

      const updateRes = await fetch(
        `${API_URL}/orders/${merchantReference}/payment-status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            payment_status: pesapalStatus,
            transaction_id: trackingId,
            payment_reference: trackingId,
          }),
        }
      );

      // ── Step 3: Show result based on Pesapal's answer ─────────────────
      // We trust Pesapal's status even if the DB write fails.
      if (pesapalStatus === 'paid') {
        setStatus('success');
        setMessage(
          updateRes.ok
            ? 'Payment successful! Your order has been confirmed.'
            : 'Payment received. Your order will be confirmed shortly — check the orders page.'
        );
      } else if (pesapalStatus === 'failed' || pesapalStatus === 'refunded') {
        setStatus('failed');
        setMessage('Payment was not completed. Please try again.');
      } else {
        setStatus('error');
        setMessage('Payment status is unclear. Please check your orders page.');
      }
    } catch (err: any) {
      console.error('Payment callback error:', err);
      setStatus('error');
      setMessage(err.message || 'Could not verify payment. Please contact support.');
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Head><title>Verifying Payment – AquaGas</title></Head>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-700">
          <Loader className="animate-spin text-blue-600" size={48} />
          <p className="text-lg font-medium">{message}</p>
        </div>
      </>
    );
  }

  if (status === 'success') {
    return (
      <>
        <Head><title>Payment Successful – AquaGas</title></Head>
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
              <Link href="/orders"
                className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                View My Orders
              </Link>
              <Link href="/shop"
                className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-400 transition">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (status === 'failed') {
    return (
      <>
        <Head><title>Payment Failed – AquaGas</title></Head>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={40} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link href="/cart"
                className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                Try Again
              </Link>
              <Link href="/contact"
                className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-400 transition">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Payment Status Unknown – AquaGas</title></Head>
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Status Unknown</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-y-3">
            <Link href="/orders"
              className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Check My Orders
            </Link>
            <Link href="/contact"
              className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-400 transition">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}