// Confirms a draft order for cash on delivery (the backend notifies the vendor and dispatches).
import type { NextApiRequest, NextApiResponse } from 'next';
import { forward, cleanId, onlyMethods } from '@/lib/server/backend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!onlyMethods(req, res, ['POST'])) return;
  const id = cleanId(req.body?.order_id);
  if (!id) return res.status(400).json({ error: 'Invalid order id' });
  return forward(req, res, {
    method: 'POST',
    path: `/orders/${id}/confirm`,
    body: { payment_method: req.body?.payment_method, phone_number: req.body?.phone_number },
  });
}
