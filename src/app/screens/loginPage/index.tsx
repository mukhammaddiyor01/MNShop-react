import { FormEvent } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";

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
  const { setAuthUser } = useGlobals();
  const history = useHistory();
  const location = useLocation();
  const nextPath = getSafeNextPath(location.search);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthUser({
      id: "buyer-mn",
      fullName: "MNShop Buyer",
      email: "buyer@mnshop.uz",
      role: "BUYER",
    });
    history.replace(nextPath);
  };

  return (
    <main className="auth-page">
      <form onSubmit={handleSubmit}>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to MNShop</h1>
        <input required type="email" placeholder="Email" />
        <input required type="password" placeholder="Password" />
        <button className="primary-button" type="submit">
          Sign in
        </button>
        <p>
          New here? <Link to="/signup">Create account</Link>
        </p>
      </form>
    </main>
  );
}
