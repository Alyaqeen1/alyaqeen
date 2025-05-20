import Admissions from "./admissions/Admissions";
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
      {
        path: "online-admissions",
        element: <Admissions></Admissions>,
      },
    ],
  },
];
export default dashboardRoutes;
