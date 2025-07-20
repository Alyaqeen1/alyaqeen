import AdminRoute from "../routes/AdminRoute";
import PrivateRoute from "../routes/PrivateRoute";
import ActiveTeachers from "./admin/ActiveTeachers";
import AddTeacher from "./admin/AddTeacher";
import Classes from "./admin/Classes";
import Departments from "./admin/Departments";
import FeeSettings from "./admin/FeeSettings";
import InactiveTeachers from "./admin/InactiveTeachers";
import MeritStudents from "./admin/MeritStudents";
import PendingPayments from "./admin/PendingPayments";
import PendingTeacher from "./admin/PendingTeacher";
import PrayerTimeUpdate from "./admin/PrayerTimeUpdate";
import ReportsSummaryAdmin from "./admin/ReportsSummaryAdmin";
import StaffAttendance from "./admin/StaffAttendance";
import StudentAttendanceAdmin from "./admin/StudentAttendanceAdmin";
import Subjects from "./admin/Subjects";
import TeacherDetails from "./admin/TeacherDetails";
import UpdateTeacher from "./admin/UpdateTeacher";
import AddStudent from "./admissions/AddStudent";
import Admissions from "./admissions/Admissions";
import UpdateStudent from "./admissions/UpdateStudent";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home/Home";
import ReportsSummaryParent from "./parent/ReportsSummaryParent";
import Payments from "./payments/Payments";
import PaymentSummary from "./payments/PaymentSummary";
import LessonsCovered from "./teacher/LessonsCovered";
import Merits from "./teacher/Merits";
import ReportsSummary from "./teacher/ReportsSummary";
import StudentAttendance from "./teacher/StudentAttendance";
import TimeTable from "./teacher/TimeTable";
import ViewProfile from "./teacher/ViewProfile";

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
      {
        path: "add-teacher",
        element: (
          <PrivateRoute>
            <AddTeacher></AddTeacher>
          </PrivateRoute>
        ),
      },
      {
        path: "pending-teachers",
        element: (
          <PrivateRoute>
            <PendingTeacher></PendingTeacher>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/update/:id",
        element: (
          <PrivateRoute>
            <UpdateTeacher></UpdateTeacher>
          </PrivateRoute>
        ),
      },
      {
        path: "departments",
        element: (
          <PrivateRoute>
            <Departments></Departments>
          </PrivateRoute>
        ),
      },
      {
        path: "subjects",
        element: (
          <PrivateRoute>
            <Subjects></Subjects>
          </PrivateRoute>
        ),
      },
      {
        path: "classes",
        element: (
          <PrivateRoute>
            <Classes></Classes>
          </PrivateRoute>
        ),
      },
      {
        path: "active-teachers",
        element: (
          <PrivateRoute>
            <ActiveTeachers></ActiveTeachers>
          </PrivateRoute>
        ),
      },
      {
        path: "inactive-teachers",
        element: (
          <PrivateRoute>
            <InactiveTeachers></InactiveTeachers>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/details/:id",
        element: (
          <PrivateRoute>
            <TeacherDetails></TeacherDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "prayer/time-update",
        element: (
          <PrivateRoute>
            <PrayerTimeUpdate></PrayerTimeUpdate>
          </PrivateRoute>
        ),
      },
      {
        path: "student-attendance-admin",
        element: (
          <PrivateRoute>
            <StudentAttendanceAdmin></StudentAttendanceAdmin>
          </PrivateRoute>
        ),
      },
      {
        path: "staff-attendance",
        element: (
          <PrivateRoute>
            <StaffAttendance></StaffAttendance>
          </PrivateRoute>
        ),
      },
      {
        path: "view-profile",
        element: (
          <PrivateRoute>
            <ViewProfile></ViewProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/merits",
        element: (
          <PrivateRoute>
            <Merits></Merits>
          </PrivateRoute>
        ),
      },
      {
        path: "merit-students",
        element: (
          <PrivateRoute>
            <MeritStudents></MeritStudents>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/lessons-covered",
        element: (
          <PrivateRoute>
            <LessonsCovered></LessonsCovered>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/reports-summary",
        element: (
          <PrivateRoute>
            <ReportsSummary></ReportsSummary>
          </PrivateRoute>
        ),
      },
      {
        path: "reports-summary",
        element: (
          <PrivateRoute>
            <ReportsSummaryAdmin></ReportsSummaryAdmin>
          </PrivateRoute>
        ),
      },
      {
        path: "parent/reports-summary",
        element: (
          <PrivateRoute>
            <ReportsSummaryParent></ReportsSummaryParent>
          </PrivateRoute>
        ),
      },
    ],
  },
];
export default dashboardRoutes;
