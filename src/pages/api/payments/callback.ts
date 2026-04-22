// ============================================================
// FILE: src/pages/api/payments/callback.ts
// Pesapal IPN / Verification Callback
// FIX: After Pesapal redirect there is no auth token in the
//      request, so we use a server-side API secret key instead.
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import pesapalService from '@/lib/services/pesapalService';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://aquagas-backend.onrender.com/api/v1';

// ✅ Use a server-side secret for internal service-to-service calls.
// Add INTERNAL_API_SECRET to your .env.local and to your backend
// so the backend can trust calls from this Next.js server.
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || '';

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

    // ─── Step 1: Verify the transaction directly with Pesapal ───
    let transaction: Awaited<ReturnType<typeof pesapalService.getTransactionStatus>>;
    try {
      transaction = await pesapalService.getTransactionStatus(tracking_id);
    } catch (pesapalErr: any) {
      console.error('❌ Pesapal verification failed:', pesapalErr?.message);
      return res.status(502).json({
        success: false,
        error: 'Payment verification with Pesapal failed',
        details: pesapalErr?.message,
      });
    }

    /**
     * Pesapal payment_status_code:
     *  1 = COMPLETED
     *  2 = FAILED
     *  3 = REVERSED
     *  0 = INVALID
     */
    const statusMap: Record<string, string> = {
      '1': 'paid',
      '2': 'failed',
      '3': 'refunded',
      '0': 'failed',
    };

    const mappedStatus =
      statusMap[transaction.payment_status_code] ?? 'pending';

    // ─── Step 2: Build auth headers for backend call ──────────
    // After a Pesapal redirect the browser has no Bearer token,
    // so we fall back to an internal service secret.  The backend
    // should accept either a valid user JWT *or* the secret header.
    const forwardedAuth = req.headers.authorization as string | undefined;

    const backendHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (forwardedAuth) {
      // User was somehow authenticated (unlikely after redirect but handle it)
      backendHeaders['Authorization'] = forwardedAuth;
    } else if (INTERNAL_API_SECRET) {
      // ✅ Service-to-service call — no user token available
      backendHeaders['x-internal-secret'] = INTERNAL_API_SECRET;
    }
    // If neither is available the backend must allow unauthenticated
    // payment-status updates (acceptable since we verified with Pesapal).

    // ─── Step 3: Notify backend of the verified payment status ─
    const backendResponse = await fetch(
      `${API_URL}/orders/${order_id}/payment-status`,
      {
        method: 'PUT',
        headers: backendHeaders,
        body: JSON.stringify({
          payment_status: mappedStatus,
          transaction_id: transaction.confirmation_code || tracking_id,
          payment_reference: tracking_id,
        }),
      }
    );

    let data: any = null;
    const rawBody = await backendResponse.text();
    try {
      data = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      data = { raw: rawBody };
    }

    if (!backendResponse.ok) {
      console.error('❌ Backend update failed:', {
        status: backendResponse.status,
        body: data,
      });

      // ✅ Still return the verified Pesapal status to the frontend
      // so the UI can show the correct message even if the DB write
      // failed (e.g. the backend can reconcile later via webhooks).
      return res.status(backendResponse.status).json({
        success: false,
        payment_status: mappedStatus,
        error: data?.error || 'Failed to update order status in database',
        details: data?.message || data?.raw,
      });
    }

    console.log('✅ Payment verified & order updated:', mappedStatus);

    return res.status(200).json({
      success: true,
      payment_status: mappedStatus,
      order: data?.order ?? null,
    });
  } catch (error: any) {
    console.error('❌ Payment callback error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed',
    });
  }
}