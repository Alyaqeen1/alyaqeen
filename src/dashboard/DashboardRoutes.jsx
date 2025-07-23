import AdminRoute from "../routes/AdminRoute";
import ParentRoute from "../routes/ParentRoute";
import PrivateRoute from "../routes/PrivateRoute";
import TeacherRoute from "../routes/TeacherRoute";
import ActiveTeachers from "./admin/ActiveTeachers";
import AddTeacher from "./admin/AddTeacher";
import Classes from "./admin/Classes";
import Departments from "./admin/Departments";
import FeeSettings from "./admin/FeeSettings";
import HolidayUpdate from "./admin/HolidayUpdate";
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
      // {
      //   path: "payment-summary",
      //   element: (
      //     <PrivateRoute>
      //       <PaymentSummary></PaymentSummary>
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: "fee-settings",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <FeeSettings></FeeSettings>
            </AdminRoute>
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
            <AdminRoute>
              <PendingPayments></PendingPayments>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "time-table",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <TimeTable></TimeTable>
            </TeacherRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "student-attendance",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <StudentAttendance></StudentAttendance>
            </TeacherRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "add-teacher",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AddTeacher></AddTeacher>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "pending-teachers",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <PendingTeacher></PendingTeacher>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/update/:id",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <UpdateTeacher></UpdateTeacher>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "departments",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <Departments></Departments>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "subjects",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <Subjects></Subjects>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "classes",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <Classes></Classes>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "active-teachers",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ActiveTeachers></ActiveTeachers>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "inactive-teachers",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <InactiveTeachers></InactiveTeachers>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/details/:id",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <TeacherDetails></TeacherDetails>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "prayer/time-update",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <PrayerTimeUpdate></PrayerTimeUpdate>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "student-attendance-admin",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <StudentAttendanceAdmin></StudentAttendanceAdmin>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "staff-attendance",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <StaffAttendance></StaffAttendance>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "view-profile",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <ViewProfile></ViewProfile>
            </TeacherRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/merits",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <Merits></Merits>
            </TeacherRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "merit-students",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <MeritStudents></MeritStudents>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/lessons-covered",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <LessonsCovered></LessonsCovered>
            </TeacherRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/reports-summary",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <ReportsSummary></ReportsSummary>
            </TeacherRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "reports-summary",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ReportsSummaryAdmin></ReportsSummaryAdmin>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "parent/reports-summary",
        element: (
          <PrivateRoute>
            <ParentRoute>
              <ReportsSummaryParent></ReportsSummaryParent>
            </ParentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "holiday/time-update",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <HolidayUpdate></HolidayUpdate>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
];
export default dashboardRoutes;
