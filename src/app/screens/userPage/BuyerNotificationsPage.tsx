import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { Redirect, useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";

const notifications = [
  { icon: LocalShippingOutlinedIcon, title: "Order updates", text: "Track preparation and delivery updates here.", time: "Today" },
  { icon: SellOutlinedIcon, title: "New MNShop drop", text: "Fresh Korea-selected pieces are ready to explore.", time: "Yesterday" },
  { icon: NotificationsNoneIcon, title: "Saved products", text: "We will notify you when liked products change price or stock.", time: "This week" },
];

export function BuyerNotificationsPage() {
  const { authUser } = useGlobals();
  const history = useHistory();

  if (!authUser) return <Redirect to="/login?next=%2Fnotifications" />;
  if (authUser.role !== "BUYER") return <Redirect to="/" />;

  return <main className="mnshop-account-page"><section className="mnshop-account-page__panel"><header><button onClick={() => history.goBack()} type="button"><ArrowBackIcon aria-hidden="true" />Back</button><span>MNShop updates</span><h1>Notifications</h1><p>Hardcoded preview notifications for your buyer account.</p></header><div className="mnshop-account-page__list">{notifications.map((item) => { const Icon = item.icon; return <article key={item.title}><Icon aria-hidden="true" /><div><h2>{item.title}</h2><p>{item.text}</p></div><time>{item.time}</time></article>; })}</div></section></main>;
}
