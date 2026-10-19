// Small helper for Next API routes that forward a request to the AquaGas backend.
import type { NextApiRequest, NextApiResponse } from 'next';

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1'
).replace(/\/$/, '');

/** Order ids are numeric; anything else must never reach a URL path. */
export function cleanId(value: unknown): string | null {
  const s = String(value ?? '').trim();
  return /^\d{1,20}$/.test(s) ? s : null;
}

export async function forward(
  req: NextApiRequest,
  res: NextApiResponse,
  opts: { method: 'GET' | 'POST'; path: string; body?: unknown },
) {
  try {
    const auth = req.headers.authorization;
    const backendRes = await fetch(`${API_URL}${opts.path}`, {
      method: opts.method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth && { Authorization: auth }),
      },
      ...(opts.method === 'POST' && { body: JSON.stringify(opts.body ?? {}) }),
    });
    const text = await backendRes.text();
    let data: unknown;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text || 'Unexpected response' }; }
    return res.status(backendRes.status).json(data);
  } catch (error: any) {
    console.error('Backend proxy error:', opts.path, error?.message);
    return res.status(502).json({ error: 'Could not reach the server. Please try again.' });
  }
}

export function onlyMethods(req: NextApiRequest, res: NextApiResponse, allowed: string[]): boolean {
  if (!allowed.includes(req.method || '')) {
    res.setHeader('Allow', allowed.join(', '));
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  return true;
}
