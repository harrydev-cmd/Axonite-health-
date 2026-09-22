import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Add a test style to body
document.body.style.margin = "0";
document.body.style.padding = "0";

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);