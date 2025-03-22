// routes/index.js
import { createBrowserRouter } from "react-router";
import siteRoutes from "../site/SiteRoutes";

const routes = [
  ...siteRoutes,
  // Add more routes as needed
];

const router = createBrowserRouter(routes);

export default router;
