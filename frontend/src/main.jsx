import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css"; // For map styling if you use Leaflet

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
