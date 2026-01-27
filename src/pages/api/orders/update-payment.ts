// ============================================================
// FILE: src/pages/api/orders/update-payment.ts
// Payment Status Update API Route
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';

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
      tracking_id,
      payment_status,
      payment_method,
      confirmation_code,
      amount,
    } = req.body;

    console.log('💳 Updating payment status:', {
      order_id,
      tracking_id,
      payment_status,
    });

    if (!order_id) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required',
      });
    }

    // Map Pesapal payment status codes to backend status
    const statusMapping: { [key: string]: string } = {
      '0': 'failed',      // INVALID
      '1': 'paid',        // COMPLETED
      '2': 'failed',      // FAILED
      '3': 'refunded',    // REVERSED
    };

    const mappedStatus = statusMapping[payment_status] || 'pending';

    // Update payment status in backend
    const response = await fetch(`${API_URL}/orders/${order_id}/payment-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && {
          'Authorization': req.headers.authorization,
        }),
      },
      body: JSON.stringify({
        payment_status: mappedStatus,
        transaction_id: tracking_id || confirmation_code,
        payment_reference: tracking_id,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ Backend payment update error:', responseData);
      return res.status(response.status).json({
        success: false,
        error: responseData.error || 'Failed to update payment status',
      });
    }

    console.log('✅ Payment status updated:', mappedStatus);

    return res.status(200).json({
      success: true,
      message: 'Payment status updated',
      order: responseData.order,
    });

  } catch (error: any) {
    console.error('❌ Payment update error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update payment status',
    });
  }
}
