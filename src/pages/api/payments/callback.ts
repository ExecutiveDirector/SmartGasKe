import type { NextApiRequest, NextApiResponse } from 'next';
import pesapalService from '@/lib/services/pesapalService';

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  'https://www.aquagas.co.ke';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { OrderTrackingId, OrderMerchantReference } = req.query;

    const trackingId = String(OrderTrackingId || '');
    const merchantRef = String(OrderMerchantReference || '');

    const isValid = await pesapalService.verifyCallback(
      trackingId,
      merchantRef
    );

    if (!isValid) {
      return res.redirect(
        `${FRONTEND_URL}/checkout?error=verification_failed`
      );
    }

    return res.redirect(
      `${FRONTEND_URL}/checkout?status=payment_success`
    );
  } catch (error) {
    console.error('❌ Callback error:', error);
    return res.redirect(
      `${FRONTEND_URL}/checkout?error=callback_error`
    );
  }
}
