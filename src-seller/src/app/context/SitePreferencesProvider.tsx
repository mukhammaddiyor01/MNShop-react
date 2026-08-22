import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { languageNames, SiteLanguage, translateText, translateTree } from "../lib/translations";

export type SiteTheme = "dark" | "light";
type Preferences = { theme: SiteTheme; language: SiteLanguage; toggleTheme: () => void; setLanguage: (language: SiteLanguage) => void; t: (value: string) => string };
const PreferencesContext = createContext<Preferences | null>(null);

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>("dark");
  const [language, setLanguageState] = useState<SiteLanguage>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("mnshop-theme") as SiteTheme | null;
    const savedLanguage = localStorage.getItem("mnshop-language") as SiteLanguage | null;
    setTheme(savedTheme === "light" ? "light" : "dark");
    setLanguageState(savedLanguage && savedLanguage in languageNames ? savedLanguage : "en");
    document.documentElement.dataset.theme = savedTheme === "light" ? "light" : "dark";
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mnshop-theme", theme);
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language;
    localStorage.setItem("mnshop-language", language);
    translateTree(document.body, language);
    const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => translateTree(node, language))));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language, ready]);

  return <PreferencesContext.Provider value={{ theme, language, toggleTheme: () => setTheme((value) => value === "dark" ? "light" : "dark"), setLanguage: setLanguageState, t: (value) => translateText(value, language) }}>{children}</PreferencesContext.Provider>;
}

export function useSitePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("useSitePreferences must be used inside SitePreferencesProvider");
  return context;
}
