// ============================================================
// FILE: src/pages/api/orders/create.ts
// FULLY FIXED: Order Creation API with Proper Error Handling
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const orderData = req.body;

    // Validate required fields
    if (!orderData.outlet_id) {
      return res.status(400).json({
        success: false,
        error: 'outlet_id is required',
      });
    }

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item',
      });
    }

    if (!orderData.total || orderData.total <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Total amount must be greater than 0',
      });
    }

    if (!orderData.customer_email || !orderData.customer_phone) {
      return res.status(400).json({
        success: false,
        error: 'Customer email and phone are required',
      });
    }

    console.log('📦 API: Creating order:', {
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
      delivery_notes: orderData.order_notes || '',
      delivery_address: orderData.delivery_address,
      delivery_latitude: null,
      delivery_longitude: null,
      is_guest: !orderData.user_id || orderData.user_id === 'guest',
    };

    // ✅ Extract auth token from request header
    const authToken = req.headers.authorization;

    console.log('🚀 API: Sending to backend:', {
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

    // ✅ Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Backend returned non-JSON response:', {
        status: response.status,
        contentType,
      });
      
      const text = await response.text();
      console.error('Response body:', text.substring(0, 500));
      
      return res.status(500).json({
        success: false,
        error: 'Backend service error',
        details: 'Backend returned invalid response format',
      });
    }

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ Backend error:', responseData);
      return res.status(response.status).json({
        success: false,
        error: responseData.error || 'Failed to create order',
        details: responseData.details,
      });
    }

    console.log('✅ API: Order created successfully:', responseData.order?.order_id);

    // ✅ Return success response
    return res.status(201).json({
      success: true,
      order_id: responseData.order.order_id || responseData.order.id,
      order_number: responseData.order.order_number,
      message: 'Order created successfully',
      order: responseData.order,
    });
  } catch (error: any) {
    console.error('❌ API: Order creation error:', error);
    
    // Handle network errors
    if (error.message.includes('fetch failed') || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'Backend service unavailable',
        details: 'Could not connect to backend server',
      });
    }

    // Handle JSON parsing errors
    if (error.message.includes('JSON')) {
      return res.status(500).json({
        success: false,
        error: 'Invalid response from backend',
        details: 'Backend returned non-JSON response',
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
