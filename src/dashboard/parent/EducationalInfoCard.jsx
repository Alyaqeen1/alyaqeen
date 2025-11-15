import { useState } from "react";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { Link } from "react-router";
import sessionMap from "../../utils/sessionMap";

export default function EducationalInfoCard({ studentId }) {
  const { data: student, isLoading } = useGetStudentsByIdQuery(studentId, {
    skip: !studentId,
  });
  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();

  // Gradient styles
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const cardGradients = {
    primary: { background: "linear-gradient(135deg, #667eea, #764ba2)" },
    secondary: { background: "linear-gradient(135deg, #f093fb, #f5576c)" },
    info: { background: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    success: { background: "linear-gradient(135deg, #43e97b, #38f9d7)" },
    warning: { background: "linear-gradient(135deg, #ffd89b, #19547b)" },
  };

  // Helper function to get academic information
  const getAcademicInfo = (academic) => {
    if (!academic) return [];

    // Handle new multi-department structure
    if (academic.enrollments && Array.isArray(academic.enrollments)) {
      return academic.enrollments.map((enrollment, index) => {
        const dept = departments?.find((d) => d._id === enrollment.dept_id);
        const cls = classes?.find((c) => c._id === enrollment.class_id);

        return {
          department: dept?.dept_name || "Unknown Department",
          class: cls?.class_name || "Unknown Class",
          session: enrollment.session,
          time: enrollment.session_time,
          index: index + 1,
        };
      });
    }

    // Handle old single department structure
    if (academic.dept_id) {
      const dept = departments?.find((d) => d._id === academic.dept_id);
      const cls = classes?.find((c) => c._id === academic.class_id);

      return [
        {
          department:
            dept?.dept_name || academic.department || "Unknown Department",
          class: cls?.class_name || academic.class || "Unknown Class",
          session: academic.session,
          time: academic.time,
          index: 1,
        },
      ];
    }

    return [];
  };

  const academicInfo = getAcademicInfo(student?.academic);

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  if (!student) {
    return (
      <div
        className="d-flex align-items-center justify-content-center rounded-4 border-0 shadow"
        style={{
          minHeight: "400px",
          background: "white",
          padding: "40px",
        }}
      >
        <div className="text-center text-muted">
          <div style={{ fontSize: "4rem", opacity: 0.5 }}>🎓</div>
          <h3 className="mt-3 mb-2">No Student Selected</h3>
          <p className="mb-0">
            Please select a student to view academic details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-4 border-0 shadow overflow-hidden"
      style={{ background: "white" }}
    >
      {/* Header with Gradient */}
      <div style={gradientStyle} className="text-white p-4">
        <div className="d-flex align-items-center flex-wrap gap-4">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle border"
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3) !important",
            }}
          >
            <span style={{ fontSize: "2rem" }}>🎓</span>
          </div>

          <div className="flex-grow-1">
            <h1
              className="mb-1 fw-bold text-white"
              style={{ fontSize: "1.8rem" }}
            >
              {student?.name}
            </h1>
            <p className="mb-0 opacity-90">
              Educational Profile & Enrollment Details
            </p>
          </div>

          <div className="d-flex flex-column gap-2">
            <div className="d-flex flex-wrap gap-1">
              {academicInfo.slice(0, 2).map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-pill text-uppercase fw-bold"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.department}
                </span>
              ))}
              {academicInfo.length > 2 && (
                <span
                  className="px-3 py-1 rounded-pill text-uppercase fw-bold"
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  +{academicInfo.length - 2} more
                </span>
              )}
            </div>
            <span
              className="px-3 py-1 rounded-pill text-uppercase fw-bold text-white"
              style={{
                background: "#ff6b6b",
                fontSize: "0.8rem",
                letterSpacing: "0.5px",
              }}
            >
              {student?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Academic Grid - UPDATED FOR MULTI-DEPARTMENT */}
        <div className="row g-3 mb-4">
          {/* Department Card */}
          <div className="col-md-6 col-xl-3">
            <div
              className="d-flex align-items-center p-4 rounded-4 text-white h-100"
              style={cardGradients.primary}
            >
              <div style={{ fontSize: "2.5rem", opacity: 0.9 }}>🏫</div>
              <div className="ms-3">
                <div
                  className="text-uppercase opacity-90"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}
                >
                  {academicInfo.length > 1 ? "Departments" : "Department"}
                </div>
                <div className="fw-bold fs-5 my-1">
                  {academicInfo.length > 0
                    ? academicInfo.length === 1
                      ? academicInfo[0].department
                      : `${academicInfo.length} Departments`
                    : "Not Assigned"}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  {academicInfo.length === 1
                    ? "Primary Department"
                    : "Multiple Departments"}
                </div>
              </div>
            </div>
          </div>

          {/* Class Card */}
          <div className="col-md-6 col-xl-3">
            <div
              className="d-flex align-items-center p-4 rounded-4 text-white h-100"
              style={cardGradients.secondary}
            >
              <div style={{ fontSize: "2.5rem", opacity: 0.9 }}>📚</div>
              <div className="ms-3">
                <div
                  className="text-uppercase opacity-90"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}
                >
                  {academicInfo.length > 1 ? "Classes" : "Class"}
                </div>
                <div className="fw-bold fs-5 my-1">
                  {academicInfo.length > 0
                    ? academicInfo.length === 1
                      ? academicInfo[0].class
                      : `${academicInfo.length} Classes`
                    : "Not Assigned"}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  {academicInfo.length === 1
                    ? "Current Class"
                    : "Multiple Classes"}
                </div>
              </div>
            </div>
          </div>

          {/* Session Time Card */}
          <div className="col-md-6 col-xl-3">
            <div
              className="d-flex align-items-center p-4 rounded-4 text-white h-100"
              style={cardGradients.info}
            >
              <div style={{ fontSize: "2.5rem", opacity: 0.9 }}>⏰</div>
              <div className="ms-3">
                <div
                  className="text-uppercase opacity-90"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}
                >
                  Session Times
                </div>
                <div className="fw-bold fs-5 my-1">
                  {academicInfo.length > 0
                    ? academicInfo.length === 1
                      ? sessionMap[academicInfo[0].time] ||
                        academicInfo[0].time ||
                        "Not Set"
                      : `${academicInfo.length} Sessions`
                    : "Not Set"}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  {academicInfo.length === 1
                    ? academicInfo[0].session || "No session"
                    : "Multiple Sessions"}
                </div>
              </div>
            </div>
          </div>

          {/* School Year Card */}
          <div className="col-md-6 col-xl-3">
            <div
              className="d-flex align-items-center p-4 rounded-4 text-white h-100"
              style={cardGradients.success}
            >
              <div style={{ fontSize: "2.5rem", opacity: 0.9 }}>📅</div>
              <div className="ms-3">
                <div
                  className="text-uppercase opacity-90"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}
                >
                  School Year
                </div>
                <div className="fw-bold fs-5 my-1">
                  {student.school_year || "Not Set"}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  Academic Year
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Details Section - NEW */}
        {academicInfo.length > 1 && (
          <div className="rounded-4 p-4 mb-4" style={{ background: "#f8f9fa" }}>
            <h6 className="fw-bold mb-3 text-dark">
              📋 Enrollment Details{" "}
              {academicInfo.length > 1 &&
                `(${academicInfo.length} Departments)`}
            </h6>
            <div className="row g-3">
              {academicInfo.map((item, index) => (
                <div key={index} className="col-12 col-md-6 ">
                  <div className="p-3 rounded-3 border bg-white">
                    {academicInfo.length > 1 && (
                      <div className="fw-bold text-primary mb-2 small">
                        Department {item.index}
                      </div>
                    )}
                    <div className="mb-2">
                      <span className="text-muted small">Department:</span>
                      <div className="fw-semibold">{item.department}</div>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted small">Class:</span>
                      <div className="fw-semibold">{item.class}</div>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted small">Session:</span>
                      <div className="fw-semibold text-capitalize">
                        {item.session}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted small">Time:</span>
                      <div className="fw-semibold">
                        {sessionMap[item.time] || item.time || "Not Set"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="rounded-4 p-4 mb-4" style={{ background: "#f8f9fa" }}>
          <div className="row g-4 mb-3">
            <div className="col-sm-6 col-lg-4">
              <div className="d-flex flex-column">
                <span
                  className="text-muted fw-semibold mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  🆔 Student ID
                </span>
                <span className="fw-semibold text-dark">
                  {student?.student_id}
                </span>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="d-flex flex-column">
                <span
                  className="text-muted fw-semibold mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  📝 Enrollment Status
                </span>
                <span
                  className="px-2 py-1 rounded-pill text-white fw-bold d-inline-block"
                  style={{
                    background: "#28a745",
                    fontSize: "0.8rem",
                    width: "fit-content",
                  }}
                >
                  {student?.status}
                </span>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="d-flex flex-column">
                <span
                  className="text-muted fw-semibold mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  🎯 Activity Status
                </span>
                <span
                  className="px-2 py-1 rounded-pill text-white fw-bold d-inline-block"
                  style={{
                    background: "#17a2b8",
                    fontSize: "0.8rem",
                    width: "fit-content",
                  }}
                >
                  {student?.activity}
                </span>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-sm-6 col-lg-4">
              <div className="d-flex flex-column">
                <span
                  className="text-muted fw-semibold mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  🗓️ Starting Date
                </span>
                <span className="fw-semibold text-dark">
                  {student.startingDate
                    ? new Date(student?.startingDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Not Provided"}
                </span>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="d-flex flex-column">
                <span
                  className="text-muted fw-semibold mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  🌐 Language
                </span>
                <span className="fw-semibold text-dark">
                  {student?.language || "Not Provided"}
                </span>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="d-flex flex-column">
                <span
                  className="text-muted fw-semibold mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  💷 Monthly Fee
                </span>
                <span
                  className="fw-semibold"
                  style={{ color: "#28a745", fontSize: "1.1rem" }}
                >
                  £{student?.monthly_fee || "0"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap gap-3">
          <Link
            to={"/dashboard/parent/student-details"}
            className="btn text-white fw-semibold px-4 py-2 rounded-3 border-0"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
}
