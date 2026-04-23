// ============================================================
// FILE: src/pages/api/payments/callback.ts
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import pesapalService from '@/lib/services/pesapalService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tracking_id } = req.body;

  if (!tracking_id) {
    return res.status(400).json({ error: 'tracking_id is required' });
  }

  try {
    const transaction = await pesapalService.getTransactionStatus(tracking_id);

    const statusMap: Record<string, string> = {
      '1': 'paid',
      '2': 'failed',
      '3': 'refunded',
      '0': 'failed',
    };

    const payment_status =
      statusMap[transaction.payment_status_code] ?? 'pending';

    return res.status(200).json({
      success: true,
      payment_status,
      confirmation_code: transaction.confirmation_code ?? tracking_id,
    });
  } catch (err: any) {
    console.error('Pesapal verify error:', err?.message);
    return res.status(502).json({
      error: 'Pesapal verification failed',
      details: err?.message,
    });
  }
}