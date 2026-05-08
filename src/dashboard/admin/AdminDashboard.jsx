import React, { useState } from "react";
import { useGetTeacherCountQuery } from "../../redux/features/teachers/teachersApi";
import { useGetAttendancePresentCountQuery } from "../../redux/features/attendances/attendancesApi";
import { useGetStudentCountQuery } from "../../redux/features/students/studentsApi";
import {
  useGetMonthlyAdmissionsQuery,
  useGetMonthlyDeparturesQuery,
  useGetClassDepartureStatsQuery,
} from "../../redux/features/students/studentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import CrmDashboard from "./CrmDashboard";

export default function AdminDashboard() {
  // Current date for default filter values
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // State for monthly tracker filters
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Existing data fetching
  const { data: teachersCount, isLoading: isLoadingTeachersCount } =
    useGetTeacherCountQuery();
  const { data: staffPresence, isLoading: isLoadingStaffPresence } =
    useGetAttendancePresentCountQuery("staff");
  const { data: studentPresence, isLoading: isLoadingStudentPresence } =
    useGetAttendancePresentCountQuery("student");
  const { data: studentsCount, isLoading: isLoadingStudentsCount } =
    useGetStudentCountQuery();

  // New: Monthly tracker data fetching
  const { data: admissionsData, isLoading: isLoadingAdmissions } =
    useGetMonthlyAdmissionsQuery({
      year: selectedYear,
      month: selectedMonth,
    });

  const { data: departuresData, isLoading: isLoadingDepartures } =
    useGetMonthlyDeparturesQuery({
      year: selectedYear,
      month: selectedMonth,
    });

  const { data: classStatsData, isLoading: isLoadingClassStats } =
    useGetClassDepartureStatsQuery({
      year: selectedYear,
      month: selectedMonth,
    });

  // Combine all loading states
  const isLoading =
    isLoadingTeachersCount ||
    isLoadingStaffPresence ||
    isLoadingStudentsCount ||
    isLoadingStudentPresence ||
    isLoadingAdmissions ||
    isLoadingDepartures ||
    isLoadingClassStats;

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  return (
    <div className="">
      <div className="container-fluid px-0">
        <CrmDashboard
          studentsCount={studentsCount}
          teachersCount={teachersCount}
          staffPresence={staffPresence}
          studentPresence={studentPresence}
          // Pass monthly tracker data and filters
          admissionsData={admissionsData}
          departuresData={departuresData}
          classStatsData={classStatsData}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
        />
      </div>
    </div>
  );
}
