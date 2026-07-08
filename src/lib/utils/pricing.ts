// ============================================================
// FILE: src/lib/utils/pricing.ts
//
//  This file used to hardcode its own copy of TAX_RATE,
// DELIVERY_FEE and FREE_DELIVERY_THRESHOLD. That copy had already
// drifted from the backend's real values (utils/pricing.js on the
// server): DELIVERY_FEE was 100 here vs 150 on the backend, and
// FREE_DELIVERY_THRESHOLD was 5000 here vs 7000 on the backend.
// The backend always re-derives tax/delivery/total server-side
// (see calculateOrderPricing) and ignores whatever the client
// sends, so this mismatch never let anyone underpay — it just
// meant the cart/checkout preview showed a different total than
// what the customer was actually charged.
//
// It also had no concept of vendor_type at all, so pickup orders
// from a "general" (non-gas) vendor were always shown as free,
// when the backend actually charges PICKUP_FEE_GENERAL for those.
//
//  fetch the live constants from GET /api/v1/config/pricing
// (single source of truth = utils/pricing.js on the backend) and
// mirror calculateOrderPricing()'s logic exactly, including
// vendorType/isPickup handling.
// ============================================================

import api from '../api';

export interface PricingConfig {
  tax_rate: number;
  delivery_fee: number;
  free_delivery_threshold: number;
  pickup_fee_general: number;
}

// Last-resort fallback ONLY if /config/pricing can't be reached (e.g. first
// paint before the request resolves, or the user is offline). This must be
// treated as a rough estimate — never trust it as the final charged amount.
// Keep in sync with backend defaults, but the network fetch is authoritative.
export const FALLBACK_PRICING_CONFIG: PricingConfig = {
  tax_rate: 0.06,
  delivery_fee: 150,
  free_delivery_threshold: 7000,
  pickup_fee_general: 70,
};

let cachedConfig: PricingConfig | null = null;
let inFlight: Promise<PricingConfig> | null = null;

/**
 * Fetches (and caches for the session) the live pricing constants from the
 * backend. Call this once near the top of cart/checkout pages and pass the
 * result into calculateCartPricing — don't hardcode these values locally.
 */
export async function fetchPricingConfig(): Promise<PricingConfig> {
  if (cachedConfig) return cachedConfig;
  if (inFlight) return inFlight;

  const pending: Promise<PricingConfig> = api
    .get<PricingConfig>('/config/pricing')
    .then((res: { data: PricingConfig }) => {
      cachedConfig = res.data;
      return res.data;
    })
    .catch((err: unknown) => {
      console.error('Failed to fetch live pricing config, using fallback:', err);
      return FALLBACK_PRICING_CONFIG;
    })
    .finally(() => {
      inFlight = null;
    });

  inFlight = pending;
  return pending;
}

export interface CartPricingOptions {
  isPickup?: boolean;
  /** vendor.vendor_type of the vendor this order is being placed with */
  vendorType?: 'gas' | 'general';
}

export interface CartPricing {
  subtotal:    number;
  tax:         number;
  deliveryFee: number;
  total:       number;
  /** true if this is a "from"/preview estimate rather than the final charge */
  isEstimate:  boolean;
}

/**
 * Mirrors the backend's calculateOrderPricing() (utils/pricing.js) exactly:
 * - Gas vendor pickup: free
 * - General vendor pickup: flat pickup_fee_general
 * - Home delivery: free above free_delivery_threshold, else delivery_fee
 *
 * The backend recomputes this independently at order-creation time and is
 * always authoritative — this is only for showing an accurate preview.
 */
export function calculateCartPricing(
  subtotal: number,
  config: PricingConfig = FALLBACK_PRICING_CONFIG,
  options: CartPricingOptions = {}
): CartPricing {
  const { isPickup = false, vendorType = 'gas' } = options;

  const tax = Math.round(subtotal * config.tax_rate);

  let deliveryFee = 0;
  if (isPickup) {
    deliveryFee = vendorType === 'general' ? config.pickup_fee_general : 0;
  } else {
    deliveryFee = subtotal >= config.free_delivery_threshold ? 0 : config.delivery_fee;
  }

  const total = subtotal + tax + deliveryFee;

  return {
    subtotal,
    tax,
    deliveryFee,
    total,
    isEstimate: config === FALLBACK_PRICING_CONFIG,
  };
}