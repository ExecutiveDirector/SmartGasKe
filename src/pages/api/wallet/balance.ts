// Returns the signed-in customer's wallet (balance etc.).
import type { NextApiRequest, NextApiResponse } from 'next';
import { forward, onlyMethods } from '@/lib/server/backend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!onlyMethods(req, res, ['GET'])) return;
  return forward(req, res, { method: 'GET', path: '/users/wallet' });
}
