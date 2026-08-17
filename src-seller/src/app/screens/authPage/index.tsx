import axios from "axios";
import { FormEvent, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import SellerAuthService from "../../services/SellerAuthService";

type SellerAuthPageProps = {
  mode: "login" | "signup";
};

const sellerAuthService = new SellerAuthService();

function getStoredSeller() {
  try {
    return JSON.parse(localStorage.getItem("sellerData") || "null") as {
      userType?: string;
    } | null;
  } catch {
    return null;
  }
}

export function SellerAuthPage({ mode }: SellerAuthPageProps) {
  const history = useHistory();
  const isSignup = mode === "signup";
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signedInSeller = getStoredSeller();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const sellerNick = String(form.get("sellerNick") || "").trim();
    const sellerPassword = String(form.get("sellerPassword") || "");

    if (!sellerNick || !sellerPassword) {
      setErrorMessage("Enter your seller username and password.");
      return;
    }

    if (isSignup) {
      const sellerEmail = String(form.get("sellerEmail") || "").trim();
      const sellerPhone = String(form.get("sellerPhone") || "").trim();
      const confirmPassword = String(form.get("confirmPassword") || "");

      if (!sellerEmail || !sellerPhone) {
        setErrorMessage("Enter your business email and phone number.");
        return;
      }

      if (sellerPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    setErrorMessage("");

    try {
      if (isSignup) {
        await sellerAuthService.signUp({
          sellerNick,
          sellerEmail: String(form.get("sellerEmail") || "").trim(),
          sellerPhone: String(form.get("sellerPhone") || "").trim(),
          sellerPassword,
        });
        history.replace("/seller/login");
        return;
      }

      await sellerAuthService.signIn({ sellerNick, sellerPassword });
      history.replace("/seller/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as { message?: string } | undefined;
        setErrorMessage(
          responseData?.message ||
            (isSignup
              ? "We could not create your seller account."
              : "We could not sign you in. Please check your details."),
        );
      } else {
        setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (signedInSeller?.userType === "SELLER") {
    return <Redirect to="/seller/" />;
  }

  return (
    <main className="mnshop-seller-auth">
      <section className="mnshop-seller-auth__panel">
        <Link aria-label="MNShop buyer storefront" className="mnshop-seller-auth__logo" to="/seller/login">
          MN<span>Shop</span>
        </Link>
        <p className="mnshop-seller-auth__eyebrow">Seller Studio</p>
        <h1>{isSignup ? "Start selling with MNShop." : "Sign in to Seller Studio."}</h1>
        <p className="mnshop-seller-auth__intro">
          {isSignup
            ? "Create your studio account to manage your collection, orders, and customers."
            : "Manage your Korean collection, orders, and buyer conversations in one place."}
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Seller username
            <input autoComplete="username" name="sellerNick" required />
          </label>
          {isSignup && (
            <>
              <label>
                Business email
                <input autoComplete="email" name="sellerEmail" required type="email" />
              </label>
              <label>
                Phone number
                <input autoComplete="tel" name="sellerPhone" required type="tel" />
              </label>
            </>
          )}
          <label>
            Password
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={6}
              name="sellerPassword"
              required
              type={showPassword ? "text" : "password"}
            />
          </label>
          {isSignup && (
            <label>
              Confirm password
              <input
                autoComplete="new-password"
                minLength={6}
                name="confirmPassword"
                required
                type={showPassword ? "text" : "password"}
              />
            </label>
          )}
          <button
            className="mnshop-seller-auth__password-toggle"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? "Hide password" : "Show password"}
          </button>
          {errorMessage && <p className="mnshop-seller-auth__error" role="alert">{errorMessage}</p>}
          <button className="mnshop-seller-auth__submit" disabled={loading} type="submit">
            {loading
              ? isSignup ? "Creating account..." : "Signing in..."
              : isSignup ? "Create seller account" : "Sign in to Seller Studio"}
          </button>
        </form>

        <p className="mnshop-seller-auth__switch">
          {isSignup ? "Already have a studio?" : "New to MNShop Seller Studio?"}{" "}
          <Link to={isSignup ? "/seller/login" : "/seller/signup"}>
            {isSignup ? "Sign in" : "Create account"}
          </Link>
        </p>
        <a className="mnshop-seller-auth__buyer-link" href={process.env.REACT_APP_BUYER_STOREFRONT_URL || "http://localhost:1214"}>
          Continue as a buyer
        </a>
      </section>
    </main>
  );
}
