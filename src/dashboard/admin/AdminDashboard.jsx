import React from "react";
import { useGetTeacherCountQuery } from "../../redux/features/teachers/teachersApi";
import { useGetAttendancePresentCountQuery } from "../../redux/features/attendances/attendancesApi";
import { useGetStudentCountQuery } from "../../redux/features/students/studentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import CrmDashboard from "./CrmDashboard";

export default function AdminDashboard() {
  const { data: teachersCount, isLoading: isLoadingTeachersCount } =
    useGetTeacherCountQuery();
  const { data: staffPresence, isLoading: isLoadingStaffPresence } =
    useGetAttendancePresentCountQuery("staff");
  const { data: studentPresence, isLoading: isLoadingStudentPresence } =
    useGetAttendancePresentCountQuery("student");
  const { data: studentsCount, isLoading: isLoadingStudentsCount } =
    useGetStudentCountQuery();

  if (
    isLoadingTeachersCount ||
    isLoadingStaffPresence ||
    isLoadingStudentsCount ||
    isLoadingStudentPresence
  )
    return <LoadingSpinnerDash></LoadingSpinnerDash>;

  return (
    <div className="mt-3">
      {/* <div className="container mt-3">
        <h3 className="mb-4">Admin Dashboard</h3>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm h-100">
              <div
                className="text-white p-2 fw-bold rounded-top-2"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Staff Details
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <p>
                    Total:{" "}
                    <span className="text-success fw-bold">
                      {teachersCount?.total}
                    </span>
                  </p>
                  <p>
                    Active:{" "}
                    <span className="text-success fw-bold">
                      {teachersCount?.activity?.active}
                    </span>
                  </p>
                  <p>
                    Inactive:{" "}
                    <span className="text-danger fw-bold">
                      {teachersCount?.activity?.inactive}
                    </span>
                  </p>
                  <p>
                    Male:{" "}
                    <span className="text-primary fw-bold">
                      {teachersCount?.gender?.male}
                    </span>
                  </p>
                  <p>
                    Female:{" "}
                    <span className="text-pink fw-bold">
                      {teachersCount?.gender?.female}
                    </span>
                  </p>
                </div>
                <hr />
                <p className="mt-auto">
                  Today Present Staff:{" "}
                  <strong>{staffPresence?.present_count}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card shadow-sm h-100">
              <div
                className="text-white p-2 fw-bold rounded-top-2"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Student Details
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <div className="row">
                  <div className="col-lg-6">
                    <p>
                      Total:{" "}
                      <span className="text-success fw-bold">
                        {studentsCount?.total}
                      </span>
                    </p>
                    <p>
                      Active:{" "}
                      <span className="text-success fw-bold">
                        {studentsCount?.activity?.active}
                      </span>
                    </p>
                    <p>
                      Inactive:{" "}
                      <span className="text-danger fw-bold">
                        {studentsCount?.activity?.inactive}
                      </span>
                    </p>
                    <p>
                      Male:{" "}
                      <span className="text-primary fw-bold">
                        {studentsCount?.gender?.male}
                      </span>
                    </p>
                    <p>
                      Female:{" "}
                      <span className="text-pink fw-bold">
                        {studentsCount?.gender?.female}
                      </span>
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p>
                      Weekdays Students:{" "}
                      <strong className="text-success">
                        {studentsCount?.session?.weekdays}
                      </strong>
                    </p>
                    <p>
                      Weekend Students:{" "}
                      <strong className="text-success">
                        {studentsCount?.session?.weekend}
                      </strong>
                    </p>
                  </div>
                </div>
                <hr />
                <p className="mt-auto">
                  Today Present Students:{" "}
                  <strong>{studentPresence?.present_count}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="container-fluid px-0">
        <CrmDashboard
          studentsCount={studentsCount}
          teachersCount={teachersCount}
          staffPresence={staffPresence}
          studentPresence={studentPresence}
        />
      </div>
    </div>
  );
}
