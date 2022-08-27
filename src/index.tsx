import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import AppearanceProvider from "contexts/AppearanceProvider";
import CssBaseline from "@mui/material/CssBaseline";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AppearanceProvider>
    <Provider store={store}>
      <React.StrictMode>
        <CssBaseline />
        <App />
      </React.StrictMode>
    </Provider>
  </AppearanceProvider>
);

reportWebVitals();
