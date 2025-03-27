import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home/Home";

const dashboardRoutes = [
  {
    path: "/dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        path: "",
        element: <Home></Home>,
      },
    ],
  },
];
export default dashboardRoutes;
