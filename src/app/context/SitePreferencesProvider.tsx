import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SiteLanguage, translateText, translateTree, languageNames } from "../lib/translations";

export type SiteTheme = "dark" | "light";

type SitePreferencesContextValue = {
  theme: SiteTheme;
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
  t: (value: string) => string;
  toggleTheme: () => void;
};

const SitePreferencesContext =
  createContext<SitePreferencesContextValue | null>(null);

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>("dark");
  const [language, setLanguageState] = useState<SiteLanguage>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "mnshop-buyer-theme",
    ) as SiteTheme | null;
    const nextTheme: SiteTheme = savedTheme === "light" ? "light" : "dark";
    const savedLanguage = localStorage.getItem("mnshop-language") as SiteLanguage | null;
    const nextLanguage: SiteLanguage = savedLanguage && savedLanguage in languageNames ? savedLanguage : "en";

    setTheme(nextTheme);
    setLanguageState(nextLanguage);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.lang = nextLanguage;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mnshop-buyer-theme", theme);
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language;
    localStorage.setItem("mnshop-language", language);
    translateTree(document.body, language);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => translateTree(node, language)));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language, ready]);

  return (
    <SitePreferencesContext.Provider
      value={{
        theme,
        language,
        setLanguage: setLanguageState,
        t: (value) => translateText(value, language),
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
