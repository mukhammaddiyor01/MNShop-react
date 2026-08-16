import { useContext } from "react";
import { GlobalContext } from "../context/ContextProvider";

export function useGlobals() {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobals must be used inside ContextProvider");
  return context;
}
