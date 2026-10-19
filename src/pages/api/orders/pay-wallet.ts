// Pays a draft order from the signed-in customer's AquaGas wallet.
import type { NextApiRequest, NextApiResponse } from 'next';
import { forward, cleanId, onlyMethods } from '@/lib/server/backend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!onlyMethods(req, res, ['POST'])) return;
  const id = cleanId(req.body?.order_id);
  if (!id) return res.status(400).json({ error: 'Invalid order id' });
  return forward(req, res, { method: 'POST', path: `/orders/${id}/pay-wallet`, body: {} });
}
