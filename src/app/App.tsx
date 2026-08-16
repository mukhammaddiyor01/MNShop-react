import React from "react";
import "../css/app.css";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { HomePage } from "./screens/homePage";
import { HelpPage } from "./screens/helpPage/index";
import { OrdersPage } from "./screens/ordersPage/index";
import { ProductsPage } from "./screens/productsPage/index";
import { AboutPage } from "./screens/aboutPage/index";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { OtherNavbar } from "./components/headers/OtherNavbar";
import { Footer } from "./components/footer";
import { OverviewPage } from "../../src-seller/src/app/screens/overviewPage/index";

function App() {
  const location = useLocation();
  console.log(location);
  return (
    <>
      {location.pathname === "/" ? <HomeNavbar /> : <OtherNavbar />}

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/products">
          <ProductsPage />
        </Route>
        <Route path="/">
          <OverviewPage />
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

export default App;
