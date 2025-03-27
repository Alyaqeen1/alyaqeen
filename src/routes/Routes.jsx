// routes/index.js
import { createBrowserRouter } from "react-router";
import siteRoutes from "../site/SiteRoutes";
import dashboardRoutes from "../dashboard/DashboardRoutes";

const routes = [
  ...siteRoutes,
  ...dashboardRoutes,
  // Add more routes as needed
];

const router = createBrowserRouter(routes);

export default router;
