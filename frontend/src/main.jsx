import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import App from "./App.jsx";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found!");

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
