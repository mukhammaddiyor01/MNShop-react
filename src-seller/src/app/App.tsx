import React from "react";
import "../css/app.scss";
import "../css/auth.scss";
import "../css/mobile.scss";
import { Redirect, Route, Switch } from "react-router-dom";
import { OverviewPage } from "./screens/overviewPage/index";
import { MessagesPage } from "./screens/messagesPage/index";
import { OrdersPage } from "./screens/ordersPage/index";
import { AnalyticsPage } from "./screens/analyticsPage/index";
import { ProductsPage } from "./screens/productsPage/index";
import { SettingsPage } from "./screens/settingsPage/index";
import { SellerAuthPage } from "./screens/authPage";
import { SellerDashboardLayout } from "./components/sellerDashboard/SellerDashboardLayout";
import { useSellerGlobals } from "./context/ContextProvider";

function SellerDashboardRoutes() {
  const { seller, authReady } = useSellerGlobals();

  if (!authReady) return <main className="mnshop-seller-auth-state">Checking your Seller Studio session…</main>;
  if (!seller || seller.userType !== "SELLER") return <Redirect to="/seller/login" />;

  return <SellerDashboardLayout><Switch>
    <Route path="/seller/settings"><SettingsPage /></Route>
    <Route path="/seller/analytics"><AnalyticsPage /></Route>
    <Route path="/seller/orders"><OrdersPage /></Route>
    <Route path="/seller/messages"><MessagesPage /></Route>
    <Route path="/seller/products"><ProductsPage /></Route>
    <Route path="/seller/"><OverviewPage /></Route>
  </Switch></SellerDashboardLayout>;
}

function App() {
  return (
    <>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/seller/login">
          <SellerAuthPage mode="login" />
        </Route>
        <Route exact path="/seller/signup">
          <SellerAuthPage mode="signup" />
        </Route>
        <Route path="/seller/">
          <SellerDashboardRoutes />
        </Route>
      </Switch>
    </>
  );
}

export default App;
