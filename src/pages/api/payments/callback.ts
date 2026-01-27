// ============================================================
// FILE: src/pages/api/payment/callback.ts
// Pesapal IPN / Verification Callback (AUTHORITATIVE)
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import pesapalService from '@/lib/services/pesapalService';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://aquagas-backend.onrender.com/api/v1';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { order_id, tracking_id } = req.body;

    if (!order_id || !tracking_id) {
      return res.status(400).json({
        success: false,
        error: 'order_id and tracking_id are required',
      });
    }

    // 🔍 Always verify with Pesapal directly
    const transaction = await pesapalService.getTransactionStatus(tracking_id);

    /**
     * Pesapal status codes
     * 1 = COMPLETED
     * 2 = FAILED
     * 3 = REVERSED
     * 0 = INVALID
     */
    const statusMap: Record<string, string> = {
      '1': 'paid',
      '2': 'failed',
      '3': 'refunded',
      '0': 'failed',
    };

    const mappedStatus =
      statusMap[transaction.payment_status_code] || 'pending';

    // 🔐 Update backend (single source of truth)
    const response = await fetch(
      `${API_URL}/orders/${order_id}/payment-status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && {
            Authorization: req.headers.authorization,
          }),
        },
        body: JSON.stringify({
          payment_status: mappedStatus,
          transaction_id: transaction.confirmation_code || tracking_id,
          payment_reference: tracking_id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Backend update failed:', data);
      return res.status(response.status).json(data);
    }

    console.log('✅ Payment verified & updated:', mappedStatus);

    return res.status(200).json({
      success: true,
      payment_status: mappedStatus,
      order: data.order,
    });
  } catch (error: any) {
    console.error('❌ Payment callback error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed',
    });
  }
}
