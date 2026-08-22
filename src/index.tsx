import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import "./css/index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { getTheme } from "./app/MaterialTheme copy";
import { ContextProvider } from "./app/context/ContextProvider";
import { SitePreferencesProvider, useSitePreferences } from "./app/context/SitePreferencesProvider";

function PreferenceThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSitePreferences();
  return <ThemeProvider theme={getTheme(theme)}><CssBaseline />{children}</ThemeProvider>;
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("MNShop root element was not found");
}

const root = createRoot(container);

// Global integration => REDUX
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <SitePreferencesProvider>
          <PreferenceThemeProvider>
            <Router>
              <App />
            </Router>
          </PreferenceThemeProvider>
        </SitePreferencesProvider>
      </ContextProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
