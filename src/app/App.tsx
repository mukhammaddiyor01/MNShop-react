import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { HomePage } from "./screens/homePage";
import { HelpPage } from "./screens/helpPage/index";
import { OrdersPage } from "./screens/ordersPage/index";
import { ProductsPage } from "./screens/productsPage/index";
import { AboutPage } from "./screens/aboutPage/index";
import { UserPage } from "./screens/userPage/index";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { OtherNavbar } from "./components/headers/OtherNavbar";
import { CartDrawer } from "./components/headers/Basket";
import { MobileBottomNav } from "./components/headers/MobileBottomNav";
import { BackToTop } from "./components/shared/BackToTop";
import { Footer } from "./components/footer";
import "../css/navbar.css";
import "../css/footer.css";
import "../css/app.css";

function App() {
  const location = useLocation();
  console.log(location);
  return (
    <>
      {location.pathname === "/" ? <HomeNavbar /> : <OtherNavbar />}

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/products">
          <ProductsPage />
        </Route>
        <Route path="/member-page">
          <UserPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
      <BackToTop />
    </>
  );
}

export default App;
