// ============================================================
// FILE: src/pages/api/orders/create.ts
// UPDATED: Fixed to accept total_price from checkout
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1';

const normalizeApiBase = (url: string) => url.replace(/\/$/, '');

const buildOrderDraftUrls = (baseUrl: string) => {
  const normalized = normalizeApiBase(baseUrl);
  const urls: string[] = [];
  const pathCandidates = ['/orders/draft', '/orders/create'];

  const appendWithPaths = (base: string) => {
    const cleanedBase = normalizeApiBase(base);
    for (const path of pathCandidates) {
      urls.push(`${cleanedBase}${path}`);
    }
  };

  appendWithPaths(normalized);

  // Support environments configured with /api, /api/v1, or bare host URL.
  if (normalized.endsWith('/api/v1')) {
    appendWithPaths(normalized.replace('/api/v1', '/api'));
  } else if (normalized.endsWith('/api')) {
    appendWithPaths(`${normalized}/v1`);
  } else {
    appendWithPaths(`${normalized}/api/v1`);
    appendWithPaths(`${normalized}/api`);
  }

  // Also try root-level endpoints when API_URL includes an /api* suffix.
  try {
    const origin = new URL(normalized).origin;
    appendWithPaths(origin);
  } catch {
    // Ignore malformed URL and continue with generated candidates.
  }

  return [...new Set(urls)];
};

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
      total_price: orderData.total_price,  // ✅ Changed from total
      user_id: orderData.user_id,
    });

    // ✅ Minimal validation
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item',
      });
    }

    // ✅ FIX: Check for total_price (matches checkout page)
    if (!orderData.total_price || orderData.total_price <= 0) {
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

    // ✅ No transformation needed - checkout already sends correct format
    const candidateUrls = buildOrderDraftUrls(API_URL);

    console.log('🚀 Next.js API: Sending to backend:', {
      candidate_urls: candidateUrls,
      user_id: orderData.user_id,
      is_guest: orderData.is_guest,
      has_outlet: !!orderData.outlet_id,
      has_vendor_name: !!orderData.vendor_name,
      items_count: orderData.items.length,
      total_price: orderData.total_price,
    });

    // ✅ Extract auth token
    const authToken = req.headers.authorization;

    let response: Response | null = null;
    let contentType = '';
    let rawBody = '';
    let responseData: any = null;

    for (const url of candidateUrls) {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(authToken && { Authorization: authToken }),
        },
        body: JSON.stringify(orderData),
      });

      console.log('📥 Backend response status:', { url, status: response.status });

      contentType = response.headers.get('content-type') || '';
      rawBody = await response.text();

      responseData = null;
      if (rawBody) {
        try {
          responseData = JSON.parse(rawBody);
        } catch {
          responseData = null;
        }
      }

      // Retry on 404 because some deployments use /api/orders/* instead of /api/v1/orders/*
      if (response.status !== 404) {
        break;
      }
    }

    if (!response) {
      throw new Error('No backend response received');
    }

    if (!responseData) {
      console.error('❌ Backend returned non-JSON payload:', {
        status: response.status,
        contentType,
        body: rawBody.substring(0, 500),
      });

      return res.status(response.status || 502).json({
        success: false,
        error: response.ok ? 'Invalid backend response' : 'Backend service error',
        details: rawBody || 'Backend returned an unexpected response format',
      });
    }

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
