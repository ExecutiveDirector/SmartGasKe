// ============================================================
// FILE: src/pages/payment/callback.tsx
// Payment Result Page (UI ONLY)
// ============================================================

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check, X, Loader, AlertCircle } from 'lucide-react';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const { OrderTrackingId, OrderMerchantReference } = router.query;

  const [status, setStatus] =
    useState<'loading' | 'success' | 'failed' | 'error'>('loading');
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

  const confirmPayment = async (trackingId: string, orderId: string) => {
    try {
      setStatus('loading');
      setMessage('Verifying your payment...');

      const response = await fetch('/api/payments/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          tracking_id: trackingId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Verification failed');
      }

      setOrderId(orderId);

      if (result.payment_status === 'paid') {
        setStatus('success');
        setMessage('Payment successful! Your order has been confirmed.');
      } else if (result.payment_status === 'failed') {
        setStatus('failed');
        setMessage('Payment failed. Please try again.');
      } else {
        setStatus('error');
        setMessage('Payment status unclear. Please contact support.');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'Payment verification error');
    }
  };

  // UI rendering stays exactly as you already wrote it
  // (loader / success / failed / error blocks unchanged)

  if (status === 'loading') {
    return (
      <>
        <Head><title>Verifying Payment</title></Head>
        <div className="min-h-screen flex items-center justify-center">
          <Loader className="animate-spin" size={48} />
        </div>
      </>
    );
  }

  if (status === 'success') {
    return (
      <>
        <Head><title>Payment Successful</title></Head>
        <div className="text-center">
          <Check size={64} />
          <p>{message}</p>
          <Link href="/orders">View Orders</Link>
        </div>
      </>
    );
  }

  if (status === 'failed') {
    return (
      <>
        <Head><title>Payment Failed</title></Head>
        <div className="text-center">
          <X size={64} />
          <p>{message}</p>
          <Link href="/checkout">Try Again</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Payment Error</title></Head>
      <div className="text-center">
        <AlertCircle size={64} />
        <p>{message}</p>
        <Link href="/contact">Contact Support</Link>
      </div>
    </>
  );
}
