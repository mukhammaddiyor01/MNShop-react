import { Redirect, useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { BuyerAddressManager } from "./BuyerAddressManager";

export function BuyerAddressesPage() {
  const { authUser } = useGlobals();
  const history = useHistory();

  if (!authUser) return <Redirect to="/login?next=%2Fuser-page%2Faddresses" />;
  if (authUser.role !== "BUYER") return <Redirect to="/" />;

  return (
    <main className="mnshop-address-page">
      <BuyerAddressManager
        onClose={() => history.push("/user-page")}
        userId={authUser.id}
        userName={authUser.fullName}
        userPhone={authUser.phone}
      />
    </main>
  );
}
