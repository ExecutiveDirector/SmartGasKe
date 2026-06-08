export const TAX_RATE      = 0.06;   // 6% VAT — pick one and use it everywhere
export const FREE_DELIVERY_THRESHOLD = 5000;
export const DELIVERY_FEE  = 100;

export interface CartPricing {
  subtotal:    number;
  tax:         number;
  deliveryFee: number;
  total:       number;
}

export function calculateCartPricing(subtotal: number): CartPricing {
  const tax         = Math.round(subtotal * TAX_RATE);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total       = subtotal + tax + deliveryFee;
  return { subtotal, tax, deliveryFee, total };
}
