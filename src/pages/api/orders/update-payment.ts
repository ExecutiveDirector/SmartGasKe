// ============================================================
// FILE: src/pages/api/orders/update-payment.ts
// Payment Status Update API Route (Pesapal Callback)
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

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
    const {
      order_id,
      payment_status,
      tracking_id,
      confirmation_code,
    } = req.body;

    if (!order_id || payment_status === undefined) {
      return res.status(400).json({
        success: false,
        error: 'order_id and payment_status are required',
      });
    }

    console.log('💳 Pesapal payment update:', {
      order_id,
      payment_status,
      tracking_id,
    });

    /**
     * Pesapal status codes:
     * 0 - INVALID
     * 1 - COMPLETED
     * 2 - FAILED
     * 3 - REVERSED
     */
    const statusMap: Record<string, string> = {
      '0': 'failed',
      '1': 'paid',
      '2': 'failed',
      '3': 'refunded',
    };

    const mappedStatus =
      statusMap[String(payment_status)] || 'pending';

    const backendResponse = await fetch(
      `${API_URL}/orders/${order_id}/payment-status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && {
            Authorization: req.headers.authorization,
          }),
        },
        body: JSON.stringify({
          payment_status: mappedStatus,
          transaction_id:
            tracking_id || confirmation_code,
          payment_reference: tracking_id,
          payment_method: 'pesapal',
        }),
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error(
        '❌ Backend rejected payment update:',
        data
      );
      return res
        .status(backendResponse.status)
        .json({
          success: false,
          error:
            data.error ||
            'Failed to update payment status',
        });
    }

    console.log(
      '✅ Payment updated successfully:',
      mappedStatus
    );

    return res.status(200).json({
      success: true,
      message: 'Payment status updated',
      order: data.order,
    });
  } catch (error: any) {
    console.error('❌ Payment update error:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
