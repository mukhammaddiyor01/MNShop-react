import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { Redirect, useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";

const paymentMethods = [
  { title: "Toss Payments", detail: "Card payments are available during checkout.", status: "Ready" },
  { title: "Payme", detail: "A saved payment method will appear here later.", status: "Coming soon" },
  { title: "Click", detail: "A saved payment method will appear here later.", status: "Coming soon" },
];

export function BuyerPaymentsPage() {
  const { authUser } = useGlobals();
  const history = useHistory();

  if (!authUser) return <Redirect to="/login?next=%2Fuser-page%2Fpayments" />;
  if (authUser.role !== "BUYER") return <Redirect to="/" />;

  return <main className="mnshop-account-page"><section className="mnshop-account-page__panel"><header><button onClick={() => history.push("/user-page")} type="button"><ArrowBackIcon aria-hidden="true" />Back to profile</button><span>Payment settings</span><h1>Payments</h1><p>Choose your method securely during checkout.</p></header><div className="mnshop-account-page__list">{paymentMethods.map((method) => <article key={method.title}><CreditCardOutlinedIcon aria-hidden="true" /><div><h2>{method.title}</h2><p>{method.detail}</p></div><span className={method.status === "Ready" ? "is-ready" : ""}>{method.status}</span></article>)}</div></section></main>;
}
