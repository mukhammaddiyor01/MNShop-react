import React from "react";
import "../css/app.css";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { OverviewPage } from "./screens/overviewPage/index";
import { MessagesPage } from "./screens/messagesPage/index";
import { OrdersPage } from "./screens/ordersPage/index";
import { AnalyticsPage } from "./screens/analyticsPage/index";
import { ProductsPage } from "./screens/productsPage/index";
import { SettingsPage } from "./screens/settingsPage/index";
import { OtherNavbar } from "../../../src/app/components/headers/OtherNavbar";

function App() {
  const location = useLocation();
  console.log(location);
  return (
    <>
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
    </>
  );
}

function Home() {
  return <Container>Home</Container>;
}

export default App;
