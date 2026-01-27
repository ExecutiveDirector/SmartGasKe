// ============================================================
// FILE: src/pages/api/payments/initiate.ts
// Payment Initiation API Route - Pesapal Integration
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
    const { order_id, customer_email, customer_phone } = req.body;

    if (!order_id || !customer_email || !customer_phone) {
      return res.status(400).json({
        error:
          'order_id, customer_email and customer_phone are required',
      });
    }

    console.log('💳 Initiating Pesapal payment for order:', order_id);

    const authHeader = req.headers.authorization;

    // Fetch order details
    const orderResponse = await fetch(
      `${API_URL}/orders/${order_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
      }
    );

    if (!orderResponse.ok) {
      throw new Error('Order not found or unauthorized');
    }

    const orderPayload = await orderResponse.json();
    const order = orderPayload.order ?? orderPayload;

    const amount =
      Number(order.total_price ?? order.total ?? 0);

    if (amount <= 0) {
      throw new Error('Invalid order amount');
    }

    // Prepare Pesapal order
    const pesapalPayload = {
      orderId: order_id,
      amount,
      currency: 'KES',
      description: `AquaGas Order #${order_id.slice(0, 10)}`,
      customerEmail: customer_email,
      customerPhone: customer_phone,
      customerName:
        order.customer_name ||
        `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.trim() ||
        'Customer',
    };

    console.log('📤 Creating Pesapal order:', pesapalPayload);

    const pesapalResponse =
      await pesapalService.createOrder(pesapalPayload);

    if (
      !pesapalResponse?.redirect_url ||
      !pesapalResponse?.order_tracking_id
    ) {
      throw new Error('Invalid Pesapal response');
    }

    // Update order with tracking info (non-blocking)
    fetch(`${API_URL}/orders/${order_id}/payment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify({
        payment_tracking_id:
          pesapalResponse.order_tracking_id,
        payment_merchant_reference:
          pesapalResponse.merchant_reference,
        payment_status: 'pending',
        payment_method: 'pesapal',
      }),
    }).catch((err) =>
      console.error(
        '⚠️ Payment tracking update failed:',
        err
      )
    );

    return res.status(200).json({
      success: true,
      order_id,
      redirect_url: pesapalResponse.redirect_url,
      order_tracking_id:
        pesapalResponse.order_tracking_id,
      merchant_reference:
        pesapalResponse.merchant_reference,
    });
  } catch (error: any) {
    console.error('❌ Payment initiation failed:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to initiate payment',
      message: error.message,
    });
  }
}
