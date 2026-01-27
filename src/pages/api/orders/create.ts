// ============================================================
// FILE: src/pages/api/orders/create.ts
// FIXED: Order Creation API with Proper Auth Token Forwarding
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
    const orderData = req.body;

    console.log('📦 Creating order:', {
      order_id: orderData.order_id,
      items_count: orderData.items?.length,
      total: orderData.total,
      user_id: orderData.user_id,
      is_guest: !orderData.user_id || orderData.user_id === 'guest',
    });

    // ✅ Transform Next.js order data to match backend expectations
    const backendOrderData = {
      user_id: orderData.user_id || 'guest',
      outlet_id: orderData.outlet_id,
      vendor_id: orderData.vendor_id,
      items: orderData.items.map((item: any) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      total_price: orderData.total,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      delivery_notes: orderData.order_notes,
      delivery_address: orderData.delivery_address,
      delivery_latitude: null,
      delivery_longitude: null,
      is_guest: !orderData.user_id || orderData.user_id === 'guest',
    };

    // ✅ Extract auth token from request header
    const authToken = req.headers.authorization;

    console.log('🚀 Sending to backend:', {
      url: `${API_URL}/orders/draft`,
      is_guest: backendOrderData.is_guest,
      has_auth_token: !!authToken,
    });

    // ✅ Create draft order with proper headers
    const response = await fetch(`${API_URL}/orders/draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ✅ Forward auth token to backend if present
        ...(authToken && {
          'Authorization': authToken,
        }),
      },
      body: JSON.stringify(backendOrderData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ Backend error:', responseData);
      return res.status(response.status).json({
        success: false,
        error: responseData.error || 'Failed to create order',
        details: responseData.details,
      });
    }

    console.log('✅ Order created successfully:', responseData.order?.order_id);

    // ✅ Return success response
    return res.status(201).json({
      success: true,
      order_id: responseData.order.order_id || responseData.order.id,
      order_number: responseData.order.order_number,
      message: 'Order created successfully',
      order: responseData.order,
    });
  } catch (error: any) {
    console.error('❌ Order creation error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
