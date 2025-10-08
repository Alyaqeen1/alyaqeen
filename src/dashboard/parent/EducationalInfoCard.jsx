import { useState } from "react";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { Link } from "react-router";
import sessionMap from "../../utils/sessionMap";

export default function EducationalInfoCard({ studentId }) {
  const { data: student, isLoading } = useGetStudentsByIdQuery(studentId, {
    skip: !studentId,
  });

  // Gradient styles
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const cardGradients = {
    primary: { background: "linear-gradient(135deg, #667eea, #764ba2)" },
    secondary: { background: "linear-gradient(135deg, #f093fb, #f5576c)" },
    info: { background: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    success: { background: "linear-gradient(135deg, #43e97b, #38f9d7)" },
  };

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
            <h1 className="mb-1 fw-bold" style={{ fontSize: "1.8rem" }}>
              {student?.name}
            </h1>
            <p className="mb-0 opacity-90">
              Educational Profile & Enrollment Details
            </p>
          </div>

          <div className="d-flex flex-column gap-2">
            <span
              className="px-3 py-1 rounded-pill text-uppercase fw-bold"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontSize: "0.8rem",
                letterSpacing: "0.5px",
              }}
            >
              {student.academic?.department}
            </span>
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
        {/* Academic Grid */}
        <div className="row g-3 mb-4">
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
                  Department
                </div>
                <div className="fw-bold fs-5 my-1">
                  {student.academic?.department || "Not Assigned"}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  Primary Department
                </div>
              </div>
            </div>
          </div>

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
                  Class
                </div>
                <div className="fw-bold fs-5 my-1">
                  {student.academic?.class || "Not Assigned"}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  Current Class
                </div>
              </div>
            </div>
          </div>

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
                  Session Time
                </div>
                <div className="fw-bold fs-5 my-1">
                  {sessionMap[student.academic?.time] ||
                    student.academic?.time ||
                    "Not Set"}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  {student.academic?.session || "No session"}
                </div>
              </div>
            </div>
          </div>

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
