import { Redirect } from "react-router-dom";
import "../../../css/userPage.scss";
import { useGlobals } from "../../hooks/useGlobals";
import { BuyerProfileSettings } from "./BuyerProfileSettings";

export function UserPage() {
  const { authUser } = useGlobals();

  if (!authUser) {
    return <Redirect to="/login?next=%2Fuser-page" />;
  }

  if (authUser.role !== "BUYER") {
    return <Redirect to="/" />;
  }

  return (
    <main className="mnshop-buyer-profile-page">
      <BuyerProfileSettings />
    </main>
  );
}
