// ============================================================
// FILE: src/lib/services/pesapalService.ts
// Pesapal Payment Service Integration
// ============================================================

import axios from 'axios';

const PESAPAL_BASE_URL = process.env.NEXT_PUBLIC_PESAPAL_BASE_URL || 'https://pay.pesapal.com/v3';
const PESAPAL_CONSUMER_KEY = process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_SECRET;
const PESAPAL_CALLBACK_URL = process.env.NEXT_PUBLIC_PESAPAL_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`;

interface PesapalAuthResponse {
  token: string;
  expiryDate: string;
  error: any;
  status: string;
  message: string;
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
    middle_name?: string;
    last_name: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    zip_code?: string;
  };
}

interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: any;
  status: string;
  message?: string;
}

interface PesapalTransactionStatus {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code: string;
  currency: string;
  error: any;
  status: string;
}

class PesapalService {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  /**
   * Get authentication token
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
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

      if (response.data.status === '200' && response.data.token) {
        this.accessToken = response.data.token;
        this.tokenExpiry = new Date(response.data.expiryDate);
        return this.accessToken;
      }

      throw new Error(response.data.message || 'Failed to get access token');
    } catch (error: any) {
      console.error('Pesapal auth error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Pesapal');
    }
  }

  /**
   * Register IPN (Instant Payment Notification) URL
   * This should be called once during setup
   */
  async registerIPN(ipnUrl: string): Promise<string> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`,
        {
          url: ipnUrl,
          ipn_notification_type: 'GET',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.data.ipn_id) {
        return response.data.ipn_id;
      }

      throw new Error('Failed to register IPN');
    } catch (error: any) {
      console.error('IPN registration error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a payment order
   */
  async createOrder(orderData: {
    orderId: string;
    amount: number;
    description: string;
    customerEmail: string;
    customerPhone: string;
    customerName: string;
  }): Promise<PesapalOrderResponse> {
    try {
      const token = await this.getAccessToken();

      // Split customer name
      const nameParts = orderData.customerName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Format phone number (remove + and spaces)
      const phone = orderData.customerPhone.replace(/[\s+]/g, '');

      const requestData: PesapalOrderRequest = {
        id: orderData.orderId,
        currency: 'KES',
        amount: orderData.amount,
        description: orderData.description,
        callback_url: PESAPAL_CALLBACK_URL,
        billing_address: {
          email_address: orderData.customerEmail,
          phone_number: phone,
          country_code: 'KE',
          first_name: firstName,
          last_name: lastName,
        },
      };

      const response = await axios.post<PesapalOrderResponse>(
        `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.data.order_tracking_id && response.data.redirect_url) {
        return response.data;
      }

      throw new Error(response.data.message || 'Failed to create payment order');
    } catch (error: any) {
      console.error('Pesapal order creation error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to create payment order'
      );
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(orderTrackingId: string): Promise<PesapalTransactionStatus> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get<PesapalTransactionStatus>(
        `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus`,
        {
          params: {
            orderTrackingId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Transaction status error:', error.response?.data || error.message);
      throw new Error('Failed to get transaction status');
    }
  }

  /**
   * Verify payment by merchant reference
   */
  async verifyPayment(merchantReference: string): Promise<boolean> {
    try {
      const status = await this.getTransactionStatus(merchantReference);
      
      // Payment status codes:
      // 0 = INVALID
      // 1 = COMPLETED
      // 2 = FAILED
      // 3 = REVERSED
      return status.payment_status_code === '1';
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }
}

export const pesapalService = new PesapalService();
export default pesapalService;
