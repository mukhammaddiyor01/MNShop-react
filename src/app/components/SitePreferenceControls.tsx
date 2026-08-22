import CheckIcon from "@mui/icons-material/Check";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { languageNames, SiteLanguage } from "../lib/translations";
import { useSitePreferences } from "../context/SitePreferencesProvider";

export function SitePreferenceControls() {
  const { theme, language, setLanguage, toggleTheme, t } = useSitePreferences();
  const [open, setOpen] = useState(false);

  return (
    <div className="site-preference-controls">
      <button type="button" className="site-control-button" onClick={toggleTheme} aria-label={theme === "dark" ? t("Light mode") : t("Dark mode")} title={theme === "dark" ? t("Light mode") : t("Dark mode")}>
        {theme === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
      </button>
      <div className="site-language-control">
        <button type="button" className="site-language-button" onClick={() => setOpen((value) => !value)} aria-label={t("Language")} aria-expanded={open}>
          <LanguageIcon fontSize="small" /><span>{language.toUpperCase()}</span><ExpandMoreIcon fontSize="small" />
        </button>
        {open && <div className="site-language-menu">
          {(Object.keys(languageNames) as SiteLanguage[]).map((item) => (
            <button type="button" data-no-translate className={`site-language-option${language === item ? " is-active" : ""}`} key={item} onClick={() => { setLanguage(item); setOpen(false); }}>
              <span>{languageNames[item]}</span>{language === item && <CheckIcon fontSize="small" />}
            </button>
          ))}
        </div>}
      </div>
    </div>
  );
}
