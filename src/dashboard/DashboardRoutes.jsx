import AdminRoute from "../routes/AdminRoute";
import PrivateRoute from "../routes/PrivateRoute";
import FeeSettings from "./admin/FeeSettings";
import AddStudent from "./admissions/AddStudent";
import Admissions from "./admissions/Admissions";
import UpdateStudent from "./admissions/UpdateStudent";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home/Home";
import Payments from "./payments/Payments";
import PaymentSummary from "./payments/PaymentSummary";

const dashboardRoutes = [
  {
    path: "/dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        path: "",
        element: (
          <PrivateRoute>
            <Home></Home>
          </PrivateRoute>
        ),
      },
      {
        path: "online-admissions",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <Admissions></Admissions>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "online-admissions/update/:id",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <UpdateStudent></UpdateStudent>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "add-student",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AddStudent></AddStudent>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      // {
      //   path: "payments",
      //   element: (
      //     <PrivateRoute>
      //       <Payments></Payments>
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: "payment-summary",
        element: (
          <PrivateRoute>
            <PaymentSummary></PaymentSummary>
          </PrivateRoute>
        ),
      },
      {
        path: "fee-settings",
        element: (
          <PrivateRoute>
            <FeeSettings></FeeSettings>
          </PrivateRoute>
        ),
      },
    ],
  },
];
export default dashboardRoutes;
