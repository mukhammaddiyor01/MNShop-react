import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { HomePage } from "./screens/homePage";
import { HelpPage } from "./screens/helpPage/index";
import { OrdersPage } from "./screens/ordersPage/index";
import { ProductsPage } from "./screens/productsPage/index";
import { AboutPage } from "./screens/aboutPage/index";
import { UserPage } from "./screens/userPage/index";
import { BuyerAddressesPage } from "./screens/userPage/BuyerAddressesPage";
import { BuyerNotificationsPage } from "./screens/userPage/BuyerNotificationsPage";
import { BuyerPaymentsPage } from "./screens/userPage/BuyerPaymentsPage";
import { BuyerLikesPage } from "./screens/likesPage/BuyerLikesPage";
import { BuyerPaymentFailPage } from "./screens/paymentPage/BuyerPaymentFailPage";
import { BuyerPaymentSuccessPage } from "./screens/paymentPage/BuyerPaymentSuccessPage";
import { BuyerMessagePage } from "./screens/messagePage/BuyerMessagePage";
import { CheckoutPage } from "./screens/checkoutPage";
import { LoginPage } from "./screens/loginPage";
import { SignupPage } from "./screens/signupPage";
import { HomeNavbar } from "./components/headers/HomeNavbar";
import { OtherNavbar } from "./components/headers/OtherNavbar";
import { CartDrawer } from "./components/headers/Basket";
import { MobileBottomNav } from "./components/headers/MobileBottomNav";
import { BackToTop } from "./components/shared/BackToTop";
import { Footer } from "./components/footer";
import "../css/navbar.scss";
import "../css/footer.scss";
import "../css/app.scss";
import "../css/auth.scss";

function App() {
  const location = useLocation();
  console.log(location);
  return (
    <>
      {location.pathname === "/" ? <HomeNavbar /> : <OtherNavbar />}

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/signup">
          <SignupPage />
        </Route>
        <Route path="/chat">
          <BuyerMessagePage />
        </Route>
        <Route exact path="/notifications">
          <BuyerNotificationsPage />
        </Route>
        <Route exact path="/payment/success">
          <BuyerPaymentSuccessPage />
        </Route>
        <Route exact path="/payment/fail">
          <BuyerPaymentFailPage />
        </Route>
        <Route exact path="/likes">
          <BuyerLikesPage />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route exact path="/checkout">
          <CheckoutPage />
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
        <Route exact path="/user-page/addresses">
          <BuyerAddressesPage />
        </Route>
        <Route exact path="/user-page/payments">
          <BuyerPaymentsPage />
        </Route>
        <Route path="/user-page">
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
