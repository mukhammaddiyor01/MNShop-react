export const DELIVERY_FEE = 5_000;
export const FREE_DELIVERY_FROM = 100_000;

export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= FREE_DELIVERY_FROM) return 0;
  return DELIVERY_FEE;
}
