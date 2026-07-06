
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// GLOBAL STYLES
import './assets/styles/auth.css';
import "./assets/styles/global.css";
import "./assets/styles/components.css";
import "./assets/styles/dashboard.css";
import "./assets/styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
