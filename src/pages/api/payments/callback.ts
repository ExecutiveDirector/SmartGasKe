// ============================================================
// FILE: src/pages/api/payments/callback.ts
// Payment Callback Handler - Pesapal Redirect After Payment
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import pesapalService from '@/lib/services/pesapalService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';
const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aquagas.co.ke';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { OrderTrackingId, OrderMerchantReference } = req.query;

    console.log('📥 Payment callback received:', {
      tracking_id: OrderTrackingId,
      merchant_ref: OrderMerchantReference,
    });

    if (!OrderTrackingId || !OrderMerchantReference) {
      console.error('❌ Missing callback parameters');
      return res.redirect(`${FRONTEND_URL}/checkout?error=invalid_callback`);
    }

    const trackingId = OrderTrackingId as string;
    const merchantRef = OrderMerchantReference as string;

    // Verify the callback
    if (!pesapalService.verifyCallback(trackingId, merchantRef)) {
      console.error('❌ Callback verification failed');
      return res.redirect(`${FRONTEND_URL}/checkout?error=verification_failed`);
    }

    // Get transaction status from Pesapal
    console.log('🔍 Checking payment status...');
    const transactionStatus = await pesapalService.getTransactionStatus(trackingId);

    console.log('📊 Transaction status:', {
      status: transactionStatus.payment_status_description,
      amount: transactionStatus.amount,
      method: transactionStatus.payment_method,
    });

    // Determine payment status
    const paymentSuccess = 
      transactionStatus.payment_status_description?.toLowerCase() === 'completed' ||
      transactionStatus.status_code === 1;

    // Update order in backend
    try {
      const updateResponse = await fetch(`${API_URL}/orders/${merchantRef}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_tracking_id: trackingId,
          payment_status: paymentSuccess ? 'completed' : 'failed',
          payment_method: transactionStatus.payment_method || 'card',
          transaction_reference: transactionStatus.reference || trackingId,
          payment_amount: transactionStatus.amount,
          payment_confirmed_at: new Date().toISOString(),
        }),
      });

      if (!updateResponse.ok) {
        console.error('⚠️ Failed to update order payment status');
      } else {
        console.log('✅ Order payment status updated');
      }
    } catch (updateError) {
      console.error('❌ Error updating order:', updateError);
    }

    // Redirect user based on payment status
    if (paymentSuccess) {
      console.log('✅ Payment successful - redirecting to success page');
      return res.redirect(`${FRONTEND_URL}/orders/${merchantRef}?payment=success`);
    } else {
      console.log('❌ Payment failed - redirecting to error page');
      return res.redirect(`${FRONTEND_URL}/checkout?error=payment_failed&order_id=${merchantRef}`);
    }
  } catch (error: any) {
    console.error('❌ Callback handler error:', error);
    return res.redirect(`${FRONTEND_URL}/checkout?error=callback_error`);
  }
}
