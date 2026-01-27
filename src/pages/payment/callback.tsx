// ============================================================
// FILE: src/pages/payment/callback.tsx
// Payment Callback Handler - Processes Pesapal payment responses
// ============================================================

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check, X, Loader, AlertCircle } from 'lucide-react';
import pesapalService from '@/lib/services/pesapalService';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const { OrderTrackingId, OrderMerchantReference } = router.query;
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (OrderTrackingId && OrderMerchantReference) {
      verifyPayment(OrderTrackingId as string, OrderMerchantReference as string);
    }
  }, [OrderTrackingId, OrderMerchantReference]);

  const verifyPayment = async (trackingId: string, merchantRef: string) => {
    try {
      setStatus('loading');
      setMessage('Verifying your payment...');

      // Get transaction status from Pesapal
      const transactionStatus = await pesapalService.getTransactionStatus(trackingId);

      // Update order status in backend
      const response = await fetch('/api/orders/update-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: merchantRef,
          tracking_id: trackingId,
          payment_status: transactionStatus.payment_status_code,
          payment_method: transactionStatus.payment_method,
          confirmation_code: transactionStatus.confirmation_code,
          amount: transactionStatus.amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const result = await response.json();
      setOrderId(merchantRef);

      // Check payment status
      if (transactionStatus.payment_status_code === '1') {
        setStatus('success');
        setMessage('Payment successful! Your order has been confirmed.');
      } else if (transactionStatus.payment_status_code === '2') {
        setStatus('failed');
        setMessage('Payment failed. Please try again or choose a different payment method.');
      } else {
        setStatus('error');
        setMessage('Payment status is unclear. Please contact support.');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to verify payment. Please contact support.');
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Verifying Payment - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader className="animate-spin text-blue-600" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Verifying Payment
            </h2>
            <p className="text-gray-600 text-lg">
              Please wait while we confirm your payment...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (status === 'success') {
    return (
      <>
        <Head>
          <title>Payment Successful - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
              <Check size={48} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Payment Successful!
            </h2>
            
            <p className="text-gray-600 mb-6">
              {message}
            </p>

            {orderId && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-xl font-bold text-green-600">
                  #{orderId.slice(0, 12)}
                </p>
              </div>
            )}
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your order is being processed and will be delivered soon. You'll receive updates via email and SMS.
            </p>
            
            <div className="space-y-3">
              <Link
                href="/orders"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg hover:shadow-xl"
              >
                View My Orders
              </Link>
              
              <Link
                href="/shop"
                className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition font-semibold"
              >
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
        <Head>
          <title>Payment Failed - AquaGas</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <X size={48} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Payment Failed
            </h2>
            
            <p className="text-gray-600 mb-8">
              {message}
            </p>
            
            <div className="space-y-3">
              <Link
                href="/checkout"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg"
              >
                Try Again
              </Link>
              
              <Link
                href="/cart"
                className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition font-semibold"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  return (
    <>
      <Head>
        <title>Payment Error - AquaGas</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle size={48} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Something Went Wrong
          </h2>
          
          <p className="text-gray-600 mb-8">
            {message}
          </p>
          
          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg"
            >
              Check Order Status
            </Link>
            
            <Link
              href="/contact"
              className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
