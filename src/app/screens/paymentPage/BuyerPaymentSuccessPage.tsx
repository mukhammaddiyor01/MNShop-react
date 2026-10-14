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
  const [shouldRedirectToOrders, setShouldRedirectToOrders] = useState(false);
  const hasConfirmed = useRef(false);
  const isMounted = useRef(true);
  const paymentActions = useRef({ onDeleteAll, setOrderBuilder });

  useEffect(() => {
    paymentActions.current = { onDeleteAll, setOrderBuilder };
  }, [onDeleteAll, setOrderBuilder]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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
      paymentActions.current.onDeleteAll();
      paymentActions.current.setOrderBuilder(new Date());
      setStatus("Test payment confirmed. Opening your orders…");
      setShouldRedirectToOrders(true);
      return;
    }

    const paymentKey = query.get("paymentKey");
    const orderId = query.get("orderId");
    const amount = Number(query.get("amount"));

    if (!paymentKey || !orderId || !Number.isFinite(amount)) {
      setError("Payment confirmation details are missing.");
      return;
    }

    hasConfirmed.current = true;

    buyerPaymentService
      .confirmPayment({ paymentKey, orderId, amount })
      .then(() => {
        if (!isMounted.current) return;
        paymentActions.current.onDeleteAll();
        paymentActions.current.setOrderBuilder(new Date());
        setStatus("Payment confirmed. Opening your orders…");
        setShouldRedirectToOrders(true);
      })
      .catch(() => {
        if (isMounted.current) {
          setError("Payment could not be confirmed. Please contact MNShop support.");
        }
      });
  }, [authUser, location.search, location.state]);

  useEffect(() => {
    if (!shouldRedirectToOrders) return;
    const timer = window.setTimeout(() => history.replace("/orders"), 850);
    return () => window.clearTimeout(timer);
  }, [history, shouldRedirectToOrders]);

  if (!authUser) return <Redirect to="/login?next=%2Fpayment%2Fsuccess" />;

  return <main className="mnshop-payment-result"><section><h1>{error ? "Payment needs attention" : "Payment processing"}</h1><p role={error ? "alert" : "status"}>{error || status}</p>{error && <Link to="/help">Contact support</Link>}</section></main>;
}
