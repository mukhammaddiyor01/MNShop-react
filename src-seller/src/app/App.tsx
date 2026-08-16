import React from "react";
import "../css/app.css";
import { Route, Switch } from "react-router-dom";
import { OverviewPage } from "./screens/overviewPage/index";
import { MessagesPage } from "./screens/messagesPage/index";
import { OrdersPage } from "./screens/ordersPage/index";
import { AnalyticsPage } from "./screens/analyticsPage/index";
import { ProductsPage } from "./screens/productsPage/index";
import { SettingsPage } from "./screens/settingsPage/index";

function App() {
  return (
    <>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/seller/settings">
          <SettingsPage />
        </Route>
        <Route path="/seller/analytics">
          <AnalyticsPage />
        </Route>
        <Route path="/seller/orders">
          <OrdersPage />
        </Route>
        <Route path="/seller/messages">
          <MessagesPage />
        </Route>
        <Route path="/seller/products">
          <ProductsPage />
        </Route>
        <Route path="/seller/">
          <OverviewPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
