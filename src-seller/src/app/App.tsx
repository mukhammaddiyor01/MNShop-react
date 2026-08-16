import React from "react";
import "../css/app.css";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Link, Route, Switch } from "react-router-dom";
import { OverviewPage } from "./screens/overviewPage/index";
import { MessagesPage } from "./screens/messagesPage/index";
import { OrdersPage } from "./screens/ordersPage/index";
import { AnalyticsPage } from "./screens/analyticsPage/index";
import { ProductsPage } from "./screens/productsPage/index";
import { SettingsPage } from "./screens/settingsPage/index";

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="seller/">OverviewPage</Link>
          </li>
          <li>
            <Link to="seller/products">ProductsPage</Link>
          </li>
          <li>
            <Link to="seller/messages">MessagesPage</Link>
          </li>
          <li>
            <Link to="seller/orders">OrdersPage</Link>
          </li>
          <li>
            <Link to="seller/analytics">AnalyticsPage</Link>
          </li>
          <li>
            <Link to="seller/settings">SettingsPage</Link>
          </li>
        </ul>
      </nav>

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="seller/settings">
          <SettingsPage />
        </Route>
        <Route path="seller/analytics">
          <AnalyticsPage />
        </Route>
        <Route path="seller/orders">
          <OrdersPage />
        </Route>
        <Route path="seller/messages">
          <MessagesPage />
        </Route>
        <Route path="seller/products">
          <ProductsPage />
        </Route>
        <Route path="seller/">
          <OverviewPage />
        </Route>
      </Switch>
    </div>
  );
}

function Home() {
  return <Container>Home</Container>;
}

export default App;
