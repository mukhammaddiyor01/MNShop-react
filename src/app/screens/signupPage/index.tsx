import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import {
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import BuyerAuthService from "../../services/BuyerAuthService";
import { GoogleAuthButton } from "../../components/auth/GoogleAuthButton";

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

export function SignupPage() {
  const { authUser, setAuthUser } = useGlobals();
  const history = useHistory();
  const location = useLocation();
  const nextPath = getSafeNextPath(location.search);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const userNick = String(form.get("userNick") || "").trim();
    const userEmail = String(form.get("userEmail") || "").trim();
    const userPhone = String(form.get("userPhone") || "").trim();
    const userPassword = String(form.get("userPassword") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (!userNick || !userEmail || !userPhone || !userPassword) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (userPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const buyer = await buyerAuthService.signUp({
        userNick,
        userEmail,
        userPhone,
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
            "We could not create your buyer account. Please try again.",
        );
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "Sign up failed.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    const form = formRef.current;
    const formData = form ? new FormData(form) : null;
    const userNick = String(formData?.get("userNick") || "").trim();
    const userPhone = String(formData?.get("userPhone") || "").trim();
    const termsAccepted = formData?.get("termsAccepted") === "on";

    if (!userNick || !userPhone) {
      setErrorMessage("Enter a username and phone number before using Google.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const buyer = await buyerAuthService.signInWithGoogle({
        credential,
        userNick,
        userPhone,
      });
      setAuthUser(buyer);
      history.replace(nextPath);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | { message?: string }
          | undefined;
        setErrorMessage(
          responseData?.message || "Google sign-up could not be completed.",
        );
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "Google sign-up failed.",
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
      <form onSubmit={handleSubmit} ref={formRef}>
        <span className="eyebrow">JOIN MNSHOP</span>
        <h1>Create your buyer account</h1>
        <input
          autoComplete="username"
          name="userNick"
          placeholder="Username"
          required
        />
        <input
          autoComplete="email"
          name="userEmail"
          placeholder="Email"
          required
          type="email"
        />
        <input
          autoComplete="tel"
          name="userPhone"
          placeholder="Phone number"
          required
          type="tel"
        />
        <input
          autoComplete="new-password"
          minLength={6}
          name="userPassword"
          placeholder="Password"
          required
          type={showPassword ? "text" : "password"}
        />
        <input
          autoComplete="new-password"
          minLength={6}
          name="confirmPassword"
          placeholder="Confirm password"
          required
          type={showPassword ? "text" : "password"}
        />
        <button
          aria-label={showPassword ? "Hide passwords" : "Show passwords"}
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          {showPassword ? "Hide passwords" : "Show passwords"}
        </button>
        <label>
          <input name="termsAccepted" required type="checkbox" />
          I agree to the MNShop Terms of Service and Privacy Policy.
        </label>
        {errorMessage && <p role="alert">{errorMessage}</p>}
        <button className="primary-button" disabled={loading} type="submit">
          {loading ? "Creating account..." : "Create Buyer Account"}
        </button>
        <GoogleAuthButton
          disabled={loading}
          onCredential={handleGoogleCredential}
          onError={setErrorMessage}
        />
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
