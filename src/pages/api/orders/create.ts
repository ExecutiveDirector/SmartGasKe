// ============================================================
// FILE: src/pages/api/orders/create.ts
// FINAL FIX: Matches your backend controller expectations
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const orderData = req.body;

    console.log('📦 Next.js API: Received order data:', {
      has_outlet_id: !!orderData.outlet_id,
      has_vendor_name: !!orderData.vendor_name || !!orderData.vendorName,
      items_count: orderData.items?.length,
      total: orderData.total,
      user_id: orderData.user_id,
    });

    // ✅ Minimal validation - let backend handle the rest
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

    // ✅ For guest orders, validate contact info
    const isGuest = !orderData.user_id || 
                    orderData.user_id === 'guest' || 
                    orderData.user_id?.toString().startsWith('guest_');
    
    if (isGuest && !orderData.customer_email && !orderData.customer_phone) {
      return res.status(400).json({
        success: false,
        error: 'Guest checkout requires customer email or phone',
      });
    }

    // ✅ Transform to backend format - handle all field variations
    const backendOrderData = {
      // User identification
      user_id: orderData.user_id || `guest_${Date.now()}`,
      is_guest: isGuest,
      
      // Vendor/Outlet - send all variations, backend will handle
      outlet_id: orderData.outlet_id || null,
      vendor_id: orderData.vendor_id || null,
      vendor_name: orderData.vendor_name || orderData.vendorName || orderData.outlet_name || null,
      vendorName: orderData.vendorName || orderData.vendor_name || null,
      
      // Items - normalize to backend format
      items: orderData.items.map((item: any) => ({
        id: item.product_id || item.id,
        product_id: item.product_id || item.id,
        name: item.product_name || item.name || `Product ${item.product_id || item.id}`,
        product_name: item.product_name || item.name || `Product ${item.product_id || item.id}`,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.price || item.unit_price),
        price: parseFloat(item.price || item.unit_price),
      })),
      
      // Pricing
      total_price: parseFloat(orderData.total),
      
      // Customer contact
      customer_email: orderData.customer_email || orderData.email || null,
      customer_phone: orderData.customer_phone || orderData.phone || null,
      
      // Delivery
      delivery_address: orderData.delivery_address || orderData.address || null,
      delivery_latitude: orderData.delivery_latitude || orderData.latitude || null,
      delivery_longitude: orderData.delivery_longitude || orderData.longitude || null,
      delivery_notes: orderData.delivery_notes || orderData.order_notes || orderData.notes || null,
    };

    console.log('🚀 Next.js API: Sending to backend:', {
      url: `${API_URL}/orders/draft`,
      user_id: backendOrderData.user_id,
      is_guest: backendOrderData.is_guest,
      has_outlet: !!backendOrderData.outlet_id,
      has_vendor_name: !!backendOrderData.vendor_name,
      items_count: backendOrderData.items.length,
      total_price: backendOrderData.total_price,
    });

    // ✅ Extract auth token
    const authToken = req.headers.authorization;

    // ✅ Call backend
    const response = await fetch(`${API_URL}/orders/draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authToken && { 'Authorization': authToken }),
      },
      body: JSON.stringify(backendOrderData),
    });

    console.log('📥 Backend response status:', response.status);

    // ✅ Check response type
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Backend returned non-JSON:', {
        status: response.status,
        contentType,
        body: text.substring(0, 500),
      });
      
      return res.status(500).json({
        success: false,
        error: 'Backend service error',
        details: 'Invalid response format from backend',
      });
    }

    const responseData = await response.json();

    // ✅ Handle backend errors
    if (!response.ok) {
      console.error('❌ Backend error:', {
        status: response.status,
        error: responseData.error,
        details: responseData.details,
      });
      
      return res.status(response.status).json({
        success: false,
        error: responseData.error || 'Failed to create order',
        details: responseData.details || responseData.message,
      });
    }

    console.log('✅ Next.js API: Order created:', {
      order_id: responseData.order?.order_id,
      order_number: responseData.order?.order_number,
    });

    // ✅ Return success
    return res.status(201).json({
      success: true,
      order_id: responseData.order?.order_id || responseData.order?.id,
      order_number: responseData.order?.order_number,
      message: responseData.message || 'Order created successfully',
      order: responseData.order,
    });

  } catch (error: any) {
    console.error('❌ Next.js API: Unexpected error:', error);
    
    // Network errors
    if (error.cause?.code === 'ECONNREFUSED' || 
        error.message?.includes('fetch failed') ||
        error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'Backend service unavailable',
        details: 'Could not connect to backend server. Please try again later.',
      });
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return res.status(504).json({
        success: false,
        error: 'Request timeout',
        details: 'Backend server took too long to respond',
      });
    }

    // JSON parsing errors
    if (error instanceof SyntaxError || error.message?.includes('JSON')) {
      return res.status(500).json({
        success: false,
        error: 'Invalid response from backend',
        details: 'Backend returned malformed data',
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        type: error.name,
      }),
    });
  }
}
