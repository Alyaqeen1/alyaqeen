import AdminRoute from "../routes/AdminRoute";
import PrivateRoute from "../routes/PrivateRoute";
import FeeSettings from "./admin/FeeSettings";
import PendingPayments from "./admin/PendingPayments";
import AddStudent from "./admissions/AddStudent";
import Admissions from "./admissions/Admissions";
import UpdateStudent from "./admissions/UpdateStudent";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home/Home";
import Payments from "./payments/Payments";
import PaymentSummary from "./payments/PaymentSummary";
import StudentAttendance from "./teacher/StudentAttendance";
import TimeTable from "./teacher/TimeTable";

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
      // {
      //   path: "hold-students",
      //   element: (
      //     <PrivateRoute>
      //       <HoldStudent></HoldStudent>
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: "pending-payments",
        element: (
          <PrivateRoute>
            <PendingPayments></PendingPayments>
          </PrivateRoute>
        ),
      },
      {
        path: "time-table",
        element: (
          <PrivateRoute>
            <TimeTable></TimeTable>
          </PrivateRoute>
        ),
      },
      {
        path: "student-attendance",
        element: (
          <PrivateRoute>
            <StudentAttendance></StudentAttendance>
          </PrivateRoute>
        ),
      },
    ],
  },
];
export default dashboardRoutes;
