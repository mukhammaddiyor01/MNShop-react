import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import SellerAuthService, { Seller } from "../services/SellerAuthService";

type SellerGlobals = {
  seller: Seller | null;
  authReady: boolean;
  setSeller: (seller: Seller | null) => void;
  logout: () => Promise<void>;
};

const sellerAuthService = new SellerAuthService();
const SellerContext = createContext<SellerGlobals | null>(null);

export function SellerContextProvider({ children }: { children: ReactNode }) {
  const [seller, setSellerState] = useState<Seller | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const setSeller = (nextSeller: Seller | null) => {
    setSellerState(nextSeller);
    if (nextSeller) localStorage.setItem("sellerData", JSON.stringify(nextSeller));
    else localStorage.removeItem("sellerData");
  };

  useEffect(() => {
    let active = true;
    sellerAuthService.getCurrentSeller()
      .then((currentSeller) => { if (active) setSeller(currentSeller); })
      .catch(() => { if (active) setSeller(null); })
      .finally(() => { if (active) setAuthReady(true); });
    return () => { active = false; };
  }, []);

  const logout = async () => {
    await sellerAuthService.logout();
    setSeller(null);
  };

  return <SellerContext.Provider value={{ seller, authReady, setSeller, logout }}>{children}</SellerContext.Provider>;
}

export function useSellerGlobals() {
  const context = useContext(SellerContext);
  if (!context) throw new Error("useSellerGlobals must be used within SellerContextProvider.");
  return context;
}
