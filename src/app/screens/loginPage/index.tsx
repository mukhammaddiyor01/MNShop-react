import axios from "axios";
import { FormEvent, useState } from "react";
import {
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import BuyerAuthService from "../../services/BuyerAuthService";
import { GoogleAuthButton } from "../../components/auth/GoogleAuthButton";
import { AuthWelcomeAnimation } from "../../components/auth/AuthWelcomeAnimation";
import { sellerPortalUrl } from "../../../lib/config";

const buyerAuthService = new BuyerAuthService();

function getSafeNextPath(search: string) {
  const requestedPath = new URLSearchParams(search).get("next");

  if (
    !requestedPath ||
    !requestedPath.startsWith("/") ||
    requestedPath.startsWith("//")
  ) {
    return "/";
  }

  return requestedPath;
}

export function LoginPage() {
  const { authUser, setAuthUser } = useGlobals();
  const history = useHistory();
  const location = useLocation();
  const nextPath = getSafeNextPath(location.search);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const userNick = String(form.get("userNick") || "").trim();
    const userPassword = String(form.get("userPassword") || "");

    if (!userNick || !userPassword) {
      setErrorMessage("Please enter your username and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const buyer = await buyerAuthService.signIn({
        userNick,
        userPassword,
      });
      setAuthUser(buyer);
      history.replace(nextPath);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | { message?: string }
          | undefined;
        setErrorMessage(
          responseData?.message ||
            "We could not sign you in. Please check your details.",
        );
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "Sign in failed.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const buyer = await buyerAuthService.signInWithGoogle({ credential });
      setAuthUser(buyer);
      history.replace(nextPath);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | { message?: string }
          | undefined;
        setErrorMessage(
          responseData?.message || "Google sign-in could not be completed.",
        );
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "Google sign-in failed.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (authUser?.role === "BUYER") {
    return <Redirect to={nextPath} />;
  }

  return (
    <main className="auth-page">
      <form onSubmit={handleSubmit}>
        <AuthWelcomeAnimation />
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to MNShop</h1>
        <input
          autoComplete="username"
          name="userNick"
          placeholder="Username"
          required
        />
        <input
          autoComplete="current-password"
          minLength={6}
          name="userPassword"
          placeholder="Password"
          required
          type={showPassword ? "text" : "password"}
        />
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          {showPassword ? "Hide password" : "Show password"}
        </button>
        {errorMessage && <p role="alert">{errorMessage}</p>}
        <button className="primary-button" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <GoogleAuthButton
          disabled={loading}
          onCredential={handleGoogleCredential}
          onError={setErrorMessage}
        />
        <p>
          New here? <Link to="/signup">Create account</Link>
        </p>
        <a className="mnshop-auth-seller-link" href={`${sellerPortalUrl}/seller/login`}>
          Selling with MNShop? Open Seller Studio
        </a>
      </form>
    </main>
  );
}
