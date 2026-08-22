import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import "./css/index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { getTheme } from "./app/MaterialTheme";
import { SellerContextProvider } from "./app/context/ContextProvider";
import { SitePreferencesProvider, useSitePreferences } from "./app/context/SitePreferencesProvider";
import "./css/preferences.css";

function PreferenceThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSitePreferences();
  return <ThemeProvider theme={getTheme(theme)}><CssBaseline />{children}</ThemeProvider>;
}

// Global integration => REDUX
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SellerContextProvider>
        <SitePreferencesProvider>
          <PreferenceThemeProvider>
            <Router>
              <App />
            </Router>
          </PreferenceThemeProvider>
        </SitePreferencesProvider>
      </SellerContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
