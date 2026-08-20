import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { ReactNode, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useSellerGlobals } from "../../context/ContextProvider";

type SellerDashboardLayoutProps = { children: ReactNode };

const navigation = [
  { label: "Overview", path: "/seller/", icon: DashboardOutlinedIcon, exact: true },
  { label: "Products", path: "/seller/products", icon: Inventory2OutlinedIcon },
  { label: "Orders", path: "/seller/orders", icon: ShoppingBagOutlinedIcon },
  { label: "Messages", path: "/seller/messages", icon: MessageOutlinedIcon },
  { label: "Analytics", path: "/seller/analytics", icon: AnalyticsOutlinedIcon },
  { label: "Settings", path: "/seller/settings", icon: SettingsOutlinedIcon },
];

export function SellerDashboardLayout({ children }: SellerDashboardLayoutProps) {
  const location = useLocation();
  const history = useHistory();
  const { seller, logout } = useSellerGlobals();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logout(); }
    finally { history.replace("/seller/login"); setLoggingOut(false); }
  };

  return (
    <section className="mnshop-seller-dashboard">
      <div className="mnshop-seller-dashboard__grid">
        <aside className="mnshop-seller-dashboard__sidebar">
          <Link to="/seller/" className="mnshop-seller-dashboard__brand">
            <span aria-hidden="true">MN</span>
            <div>
              <p>MNShop Seller</p>
              <strong>Studio</strong>
            </div>
          </Link>
          <p className="mnshop-seller-dashboard__approval">{seller?.sellerNick || "Approved"} · Seller Studio</p>

          <nav aria-label="Seller dashboard navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  className={isActive ? "is-active" : ""}
                  key={item.path}
                  to={item.path}
                >
                  <span><Icon aria-hidden="true" fontSize="small" />{item.label}</span>
                  <ArrowForwardIosRoundedIcon aria-hidden="true" fontSize="inherit" />
                </Link>
              );
            })}
          </nav>
          <a className="mnshop-seller-dashboard__buyer-link" href="/">
            Continue as buyer
          </a>
          <button className="mnshop-seller-dashboard__logout" type="button" onClick={handleLogout} disabled={loggingOut}>
            <LogoutRoundedIcon aria-hidden="true" fontSize="small" />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </aside>

        <div className="mnshop-seller-dashboard__content">
          <header className="mnshop-seller-dashboard__topbar">
            <div>
              <p>Seller Studio</p>
              <h1>Seller Dashboard</h1>
              <span>Products, orders, messages, and analytics in one place.</span>
            </div>
          </header>
          {children}
          <footer className="mnshop-seller-dashboard__footer">
            <strong>MNShop</strong><span>Seller Studio</span>
          </footer>
        </div>
      </div>
    </section>
  );
}
