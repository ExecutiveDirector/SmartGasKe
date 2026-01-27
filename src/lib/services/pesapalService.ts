// ============================================================
// FILE: src/lib/services/pesapalService.ts
// Pesapal Payment Service (FINAL, PRODUCTION SAFE)
// ============================================================

import axios from 'axios';

const PESAPAL_BASE_URL =
  process.env.NEXT_PUBLIC_PESAPAL_BASE_URL || 'https://pay.pesapal.com/v3';

const PESAPAL_CONSUMER_KEY =
  process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_KEY || '';

const PESAPAL_CONSUMER_SECRET =
  process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_SECRET || '';

const PESAPAL_CALLBACK_URL =
  process.env.NEXT_PUBLIC_PESAPAL_CALLBACK_URL ||
  `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`;

/* ----------------------------- TYPES ----------------------------- */

interface PesapalAuthResponse {
  token: string;
  expiryDate: string;
  status: string;
  message?: string;
}

interface PesapalOrderRequest {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id?: string;
  billing_address: {
    email_address: string;
    phone_number: string;
    country_code: string;
    first_name: string;
    last_name: string;
  };
}

export interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
}

interface PesapalTransactionStatus {
  payment_status_code: string;
  merchant_reference: string;
  confirmation_code: string;
  amount: number;
  currency: string;
}

/* --------------------------- SERVICE --------------------------- */

class PesapalService {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  /* 🔐 AUTH */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await axios.post<PesapalAuthResponse>(
      `${PESAPAL_BASE_URL}/api/Auth/RequestToken`,
      {
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (!response.data.token) {
      throw new Error(response.data.message || 'Pesapal auth failed');
    }

    this.accessToken = response.data.token;
    this.tokenExpiry = new Date(response.data.expiryDate);

    return this.accessToken;
  }

  /* 💳 CREATE ORDER */
  async createOrder(data: {
    orderId: string;
    amount: number;
    description: string;
    customerEmail: string;
    customerPhone: string;
    customerName: string;
  }): Promise<PesapalOrderResponse> {
    const token = await this.getAccessToken();

    const [firstName, ...rest] = data.customerName.split(' ');
    const lastName = rest.join(' ') || firstName;

    const payload: PesapalOrderRequest = {
      id: data.orderId,
      currency: 'KES',
      amount: Number(data.amount.toFixed(2)),
      description: data.description,
      callback_url: PESAPAL_CALLBACK_URL,
      billing_address: {
        email_address: data.customerEmail,
        phone_number: data.customerPhone.replace(/[\s+]/g, ''),
        country_code: 'KE',
        first_name: firstName,
        last_name: lastName,
      },
    };

    const response = await axios.post<PesapalOrderResponse>(
      `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.data.redirect_url) {
      throw new Error('Failed to create Pesapal order');
    }

    return response.data;
  }

  /* 📊 TRANSACTION STATUS */
  async getTransactionStatus(
    orderTrackingId: string
  ): Promise<PesapalTransactionStatus> {
    const token = await this.getAccessToken();

    const response = await axios.get<PesapalTransactionStatus>(
      `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus`,
      {
        params: { orderTrackingId },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    return response.data;
  }

  /* ✅ CALLBACK VERIFICATION (FIXED) */
  async verifyCallback(
    orderTrackingId: string,
    merchantReference: string
  ): Promise<boolean> {
    if (!orderTrackingId || !merchantReference) return false;

    try {
      const status = await this.getTransactionStatus(orderTrackingId);

      if (status.merchant_reference !== merchantReference) {
        console.error('❌ Merchant reference mismatch');
        return false;
      }

      // Pesapal codes:
      // 0 INVALID | 1 COMPLETED | 2 FAILED | 3 REVERSED
      return status.payment_status_code === '1';
    } catch (error) {
      console.error('❌ verifyCallback error:', error);
      return false;
    }
  }
}

const pesapalService = new PesapalService();
export default pesapalService;
