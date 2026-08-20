import { useEffect, useRef, useState } from "react";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import BuyerPaymentService from "../../services/BuyerPaymentService";

const buyerPaymentService = new BuyerPaymentService();

export function BuyerPaymentSuccessPage() {
  const { authUser, onDeleteAll, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Confirming your payment…");
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (!authUser) return;
    if (hasConfirmed.current) return;
    const query = new URLSearchParams(location.search);
    const isMockPayment = query.get("mock") === "true";
    const navigationState = location.state as
      | { mockPaymentConfirmed?: boolean }
      | undefined;

    if (isMockPayment) {
      if (!navigationState?.mockPaymentConfirmed) {
        setError(
          "The test payment result is unavailable. Check My Orders before trying again.",
        );
        return;
      }

      hasConfirmed.current = true;
      onDeleteAll();
      setOrderBuilder(new Date());
      setStatus("Test payment confirmed. Opening your orders…");
      const timer = window.setTimeout(() => history.replace("/orders"), 850);

      return () => window.clearTimeout(timer);
    }

    const paymentKey = query.get("paymentKey");
    const orderId = query.get("orderId");
    const amount = Number(query.get("amount"));

    if (!paymentKey || !orderId || !Number.isFinite(amount)) {
      setError("Payment confirmation details are missing.");
      return;
    }

    hasConfirmed.current = true;

    let active = true;
    buyerPaymentService
      .confirmPayment({ paymentKey, orderId, amount })
      .then(() => {
        if (!active) return;
        onDeleteAll();
        setOrderBuilder(new Date());
        setStatus("Payment confirmed. Opening your orders…");
        window.setTimeout(() => history.replace("/orders"), 850);
      })
      .catch(() => {
        if (active) setError("Payment could not be confirmed. Please contact MNShop support.");
      });

    return () => {
      active = false;
    };
  }, [
    authUser,
    history,
    location.search,
    location.state,
    onDeleteAll,
    setOrderBuilder,
  ]);

  if (!authUser) return <Redirect to="/login?next=%2Fpayment%2Fsuccess" />;

  return <main className="mnshop-payment-result"><section><h1>{error ? "Payment needs attention" : "Payment processing"}</h1><p role={error ? "alert" : "status"}>{error || status}</p>{error && <Link to="/help">Contact support</Link>}</section></main>;
}
