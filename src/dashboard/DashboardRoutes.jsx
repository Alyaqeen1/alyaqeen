import AdminRoute from "../routes/AdminRoute";
import ParentRoute from "../routes/ParentRoute";
import PrivateRoute from "../routes/PrivateRoute";
import TeacherRoute from "../routes/TeacherRoute";
import ActiveStudents from "./admin/ActiveStudents";
import ActiveTeachers from "./admin/ActiveTeachers";
import AddTeacher from "./admin/AddTeacher";
import AdminDirectDebit from "./admin/AdminDirectDebit";
import BestTeacherStudent from "./admin/BestTeacherStudent";
import Classes from "./admin/Classes";
import Departments from "./admin/Departments";
import FeeSettings from "./admin/FeeSettings";
import HolidayUpdate from "./admin/HolidayUpdate";
import InactiveStudents from "./admin/InactiveStudents";
import InactiveTeachers from "./admin/InactiveTeachers";
import MeritStudents from "./admin/MeritStudents";
import ParentAnnouncement from "./admin/ParentAnnouncement";
import PendingPayments from "./admin/PendingPayments";
import PendingTeacher from "./admin/PendingTeacher";
import PrayerTimeUpdate from "./admin/PrayerTimeUpdate";
import PublicAnnouncement from "./admin/PublicAnnouncement";
import ReportsSummaryAdmin from "./admin/ReportsSummaryAdmin";
import StaffAttendance from "./admin/StaffAttendance";
import StudentAttendanceAdmin from "./admin/StudentAttendanceAdmin";
import Subjects from "./admin/Subjects";
import TeacherAnnouncement from "./admin/TeacherAnnouncement";
import TeacherDetails from "./admin/TeacherDetails";
import UnpaidList from "./admin/UnpaidList";
import UpdateFees from "./admin/UpdateFees";
import UpdateTeacher from "./admin/UpdateTeacher";
import ViewStudent from "./admin/ViewStudent";
import WebsiteSettings from "./admin/WebsiteSettings";
import AddStudent from "./admissions/AddStudent";
import Admissions from "./admissions/Admissions";
import UpdateStudent from "./admissions/UpdateStudent";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home/Home";
import EducationalInfo from "./parent/EducationalInfo";
import PayByDirectDebit from "./parent/PayByDirectDebit";
import PaymentCancel from "./parent/PaymentCancel";
import PaymentSuccess from "./parent/PaymentSuccess";
import PayMonthlyFees from "./parent/PayMonthlyFees";
import ReportsSummaryParent from "./parent/ReportsSummaryParent";
import StudentDetails from "./parent/StudentDetails";
import UpdateChild from "./parent/UpdateChild";
import Payments from "./payments/Payments";
import PaymentSummary from "./payments/PaymentSummary";
import LessonCoveredTable from "./teacher/LessonCoveredTable";
import LessonsCovered from "./teacher/LessonsCovered";
import Merits from "./teacher/Merits";
import ReportsSummary from "./teacher/ReportsSummary";
import StudentAttendance from "./teacher/StudentAttendance";
import TeacherSelfUpdate from "./teacher/TeacherSelfUpdate";
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
        path: "announcement/public",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <PublicAnnouncement></PublicAnnouncement>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "announcement/teacher",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <TeacherAnnouncement></TeacherAnnouncement>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "announcement/parent",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ParentAnnouncement></ParentAnnouncement>
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
      {
        path: "active-students",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ActiveStudents></ActiveStudents>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "inactive-students",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <InactiveStudents></InactiveStudents>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/update",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <TeacherSelfUpdate></TeacherSelfUpdate>
            </TeacherRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "teacher/view-reports",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <LessonCoveredTable></LessonCoveredTable>
            </TeacherRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "admin/view-student/:id",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ViewStudent></ViewStudent>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "admin/best-teacher-student",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <BestTeacherStudent></BestTeacherStudent>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "admin/website-settings",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <WebsiteSettings></WebsiteSettings>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "unpaid-list",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <UnpaidList></UnpaidList>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "direct-debit",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminDirectDebit></AdminDirectDebit>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "all-fees",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <UpdateFees></UpdateFees>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "parent/student-details",
        element: (
          <PrivateRoute>
            <ParentRoute>
              <StudentDetails></StudentDetails>
            </ParentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "parent/educational-info",
        element: (
          <PrivateRoute>
            <ParentRoute>
              <EducationalInfo></EducationalInfo>
            </ParentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "parent/pay-monthly-fees",
        element: (
          <PrivateRoute>
            <ParentRoute>
              <PayMonthlyFees></PayMonthlyFees>
            </ParentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "parent/pay-by-direct-debit",
        element: (
          <PrivateRoute>
            <ParentRoute>
              <PayByDirectDebit></PayByDirectDebit>
            </ParentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "parent/update/:id",
        element: (
          <PrivateRoute>
            <ParentRoute>
              <UpdateChild></UpdateChild>
            </ParentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "parent/payment-success",
        element: (
          <PrivateRoute>
            <ParentRoute>
              <PaymentSuccess></PaymentSuccess>
            </ParentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "parent/payment-cancel",
        element: (
          <PrivateRoute>
            <ParentRoute>
              <PaymentCancel></PaymentCancel>
            </ParentRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
];
export default dashboardRoutes;
