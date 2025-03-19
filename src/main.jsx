import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import SiteRoutes from "./site/SiteRoutes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SiteRoutes></SiteRoutes>
      {/* <DashboardRoutes></DashboardRoutes> */}
    </BrowserRouter>
  </StrictMode>
);
