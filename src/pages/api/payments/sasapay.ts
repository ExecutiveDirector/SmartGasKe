// M-Pesa via SasaPay: POST starts the STK push, GET ?order_id= reports payment status.
import type { NextApiRequest, NextApiResponse } from 'next';
import { forward, cleanId, onlyMethods } from '@/lib/server/backend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!onlyMethods(req, res, ['GET', 'POST'])) return;
  if (req.method === 'POST') {
    const id = cleanId(req.body?.order_id);
    if (!id) return res.status(400).json({ error: 'Invalid order id' });
    return forward(req, res, {
      method: 'POST',
      path: '/payments/sasapay/initiate',
      body: { order_id: id, phone_number: req.body?.phone_number },
    });
  }
  const id = cleanId(req.query.order_id);
  if (!id) return res.status(400).json({ error: 'Invalid order id' });
  return forward(req, res, { method: 'GET', path: `/payments/sasapay/status/${id}` });
}
