import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { formatKrw } from "../../../lib/currency";
import { useGlobals } from "../../hooks/useGlobals";
import BuyerHistoryService, { BuyerPaymentHistory } from "../../services/BuyerHistoryService";

const paymentMethods = [
  { title: "Toss Payments", detail: "Card payments are available during checkout.", status: "Ready" },
  { title: "Payme", detail: "A saved payment method will appear here later.", status: "Coming soon" },
  { title: "Click", detail: "A saved payment method will appear here later.", status: "Coming soon" },
];

const historyService = new BuyerHistoryService();

export function BuyerPaymentsPage() {
  const { authUser } = useGlobals();
  const history = useHistory();
  const [payments, setPayments] = useState<BuyerPaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return;
    historyService.getPayments().then(setPayments).finally(() => setLoading(false));
  }, [authUser]);

  if (!authUser) return <Redirect to="/login?next=%2Fuser-page%2Fpayments" />;
  if (authUser.role !== "BUYER") return <Redirect to="/" />;

  return <main className="mnshop-account-page"><section className="mnshop-account-page__panel"><header><button onClick={() => history.push("/user-page")} type="button"><ArrowBackIcon aria-hidden="true" />Back to profile</button><span>Payment settings</span><h1>Payments</h1><p>Real Toss payment history for your buyer account.</p></header><div className="mnshop-account-page__list">{loading && <p>Loading payments…</p>}{!loading && payments.map((payment) => <article key={payment._id}><CreditCardOutlinedIcon aria-hidden="true" /><div><h2>{payment.method.replace(/_/g, " ")}</h2><p>{payment.providerOrderId} · {formatKrw(payment.amount)}</p></div><span className={payment.paymentStatus === "PAID" ? "is-ready" : ""}>{payment.paymentStatus}</span></article>)}{!loading && payments.length === 0 && paymentMethods.map((method) => <article key={method.title}><CreditCardOutlinedIcon aria-hidden="true" /><div><h2>{method.title}</h2><p>{method.detail}</p></div><span className={method.status === "Ready" ? "is-ready" : ""}>{method.status}</span></article>)}</div></section></main>;
}
