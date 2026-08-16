import React from "react";
import "../css/app.css";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Link, Route, Switch } from "react-router-dom";
import { HomePage } from "./screens/homePage";
import { HelpPage } from "./screens/helpPage/index";
import { OrdersPage } from "./screens/ordersPage/index";
import { ProductsPage } from "./screens/productsPage/index";
import { AboutPage } from "./screens/aboutPage/index";

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">ProductsPage</Link>
          </li>
          <li>
            <Link to="/help">HelpPage</Link>
          </li>
          <li>
            <Link to="/about">AboutPage</Link>
          </li>
        </ul>
      </nav>

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
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

function Home() {
  return <Container>Home</Container>;
}

export default App;
