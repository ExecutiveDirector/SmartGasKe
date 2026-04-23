// ============================================================
// FILE: src/pages/payment/callback.tsx
// FIX: If /api/payments/callback fails (route missing, network error,
//      Pesapal timeout) we fall back to checking the order status
//      directly from the backend instead of showing "Status Unknown".
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

  const [status, setStatus]   = useState<Status>('loading');
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

  // ── Get the user's auth token from localStorage ────────────
  const getToken = (): string | null => {
    try {
      return localStorage.getItem('authToken');
    } catch {
      return null;
    }
  };

  // ── Main verification flow ─────────────────────────────────
  const verifyAndUpdate = async (
    trackingId: string,
    merchantReference: string
  ) => {
    setOrderId(merchantReference);
    const token = getToken();

    // ── Step 1: Ask Pesapal for the payment status ─────────
    setMessage('Checking payment with Pesapal…');

    let pesapalStatus: string | null = null;

    try {
      const verifyRes = await fetch('/api/payments/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_id: trackingId }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.payment_status) {
        pesapalStatus = verifyData.payment_status;
      } else {
        console.warn('Pesapal verify returned non-OK:', verifyData);
      }
    } catch (err) {
      // /api/payments/verify doesn't exist yet or network failed
      console.warn('Pesapal verify call failed — will fall back to order check:', err);
    }

    // ── Step 2: If Pesapal verify failed, check the order ──
    // directly on the backend. The order may already be marked
    // paid by a Pesapal IPN webhook even before this page loaded.
    if (!pesapalStatus) {
      setMessage('Checking your order status…');
      try {
        const orderRes = await fetch(
          `${API_URL}/orders/${merchantReference}`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          const paymentStatus: string =
            orderData?.order?.payment_status ??
            orderData?.payment_status ??
            '';

          if (paymentStatus === 'paid') {
            pesapalStatus = 'paid';
          } else if (paymentStatus === 'failed') {
            pesapalStatus = 'failed';
          }
          // If still pending/unknown we'll handle below
        }
      } catch (err) {
        console.warn('Order status check also failed:', err);
      }
    }

    // ── Step 3: Update backend with verified status ────────
    if (pesapalStatus === 'paid' || pesapalStatus === 'failed' || pesapalStatus === 'refunded') {
      setMessage('Updating your order…');
      try {
        await fetch(`${API_URL}/orders/${merchantReference}/payment-status`, {
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
        });
      } catch (err) {
        // Non-fatal — order is still being processed
        console.warn('Payment status update failed (non-fatal):', err);
      }
    }

    // ── Step 4: Show the correct screen ───────────────────
    if (pesapalStatus === 'paid') {
      setStatus('success');
      setMessage('Payment successful! Your order has been confirmed.');
      return;
    }

    if (pesapalStatus === 'failed' || pesapalStatus === 'refunded') {
      setStatus('failed');
      setMessage('Payment was not completed. Please try again.');
      return;
    }

    // Could not determine status from either Pesapal or the backend.
    // Show a soft "check your orders" message instead of a scary error.
    setStatus('error');
    setMessage(
      'We could not confirm your payment status right now. ' +
      'If money was deducted, your order will be confirmed automatically — ' +
      'please check your orders page.'
    );
  };

  // ── Loading ────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <>
        <Head><title>Verifying Payment – AquaGas</title></Head>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader className="animate-spin text-blue-600" size={48} />
          <p className="text-lg font-medium text-gray-700">{message}</p>
        </div>
      </>
    );
  }

  // ── Success ────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <>
        <Head><title>Payment Successful – AquaGas</title></Head>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            {orderId && (
              <p className="text-sm text-gray-500 mb-6">
                Reference:{' '}
                <span className="font-mono font-semibold">{orderId}</span>
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

  // ── Failed ─────────────────────────────────────────────────
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

  // ── Unknown / Error ────────────────────────────────────────
  // Payment was likely successful — guide the user to their orders
  // rather than showing a scary error screen.
  return (
    <>
      <Head><title>Check Your Orders – AquaGas</title></Head>
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Almost There!</h1>
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