// src/pages/api/payments/initiate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://aquagas-backend.onrender.com/api/v1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;

    const backendRes = await fetch(`${API_URL}/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(req.body), // forward order_id, customer_email, customer_phone
    });

    const data = await backendRes.json();

    return res.status(backendRes.status).json(data);
  } catch (error: any) {
    console.error('❌ Payment initiation proxy error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initiate payment',
      message: error.message,
    });
  }
}
