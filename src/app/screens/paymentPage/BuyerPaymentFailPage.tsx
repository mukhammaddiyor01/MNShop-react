import { Link, useLocation } from "react-router-dom";

export function BuyerPaymentFailPage() {
  const query = new URLSearchParams(useLocation().search);
  const message = query.get("message") || "The payment was cancelled or could not be completed.";

  return <main className="mnshop-payment-result"><section><h1>Payment was not completed</h1><p role="alert">{message}</p><Link to="/checkout">Return to checkout</Link></section></main>;
}
