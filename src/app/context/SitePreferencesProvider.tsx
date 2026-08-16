import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type SiteTheme = "dark" | "light";

type SitePreferencesContextValue = {
  theme: SiteTheme;
  toggleTheme: () => void;
};

const SitePreferencesContext =
  createContext<SitePreferencesContextValue | null>(null);

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "mnshop-theme",
    ) as SiteTheme | null;
    const nextTheme: SiteTheme = savedTheme === "light" ? "light" : "dark";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mnshop-theme", theme);
  }, [ready, theme]);

  return (
    <SitePreferencesContext.Provider
      value={{
        theme,
        toggleTheme: () =>
          setTheme((value) => (value === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </SitePreferencesContext.Provider>
  );
}

export function useSitePreferences() {
  const context = useContext(SitePreferencesContext);

  if (!context) {
    throw new Error(
      "useSitePreferences must be used inside SitePreferencesProvider",
    );
  }

  return context;
}
