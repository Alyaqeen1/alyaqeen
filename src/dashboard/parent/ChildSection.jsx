import React, { useRef, useState } from "react";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import AttendanceChart from "./AttendanceChart";
import MeritChart from "./MeritChart";
import FeeChart from "./FeeChart";

export default function ChildSection({ studentId }) {
  const [activeTab, setActiveTab] = useState("attendance");

  const attendanceRef = useRef(null);
  const meritsRef = useRef(null);
  const feesRef = useRef(null);

  const { data: student, isLoading } = useGetStudentsByIdQuery(studentId, {
    skip: !studentId,
  });

  // Gradient styles
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const tabGradients = {
    active: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
    },
    inactive: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      color: "#6c757d",
      border: "1px solid #dee2e6",
    },
  };

  const cardGradients = {
    primary: { background: "linear-gradient(135deg, #667eea, #764ba2)" },
    secondary: { background: "linear-gradient(135deg, #f093fb, #f5576c)" },
    info: { background: "linear-gradient(135deg, #4facfe, #00f2fe)" },
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
          <div style={{ fontSize: "4rem", opacity: 0.5 }}>👤</div>
          <h3 className="mt-3 mb-2">No Student Selected</h3>
          <p className="mb-0">Please select a student to view details</p>
        </div>
      </div>
    );
  }

  const handleTabClick = (tab, ref) => {
    setActiveTab(tab);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="rounded-4 border-0 shadow overflow-hidden"
      style={{ background: "white" }}
    >
      {/* Header with Gradient */}
      <div style={gradientStyle} className="text-white p-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
          <div className="d-flex align-items-center flex-wrap gap-4">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle border"
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.3) !important",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {student.name?.charAt(0) || "S"}
            </div>

            <div className="flex-grow-1">
              <h1
                className="mb-1 fw-bold text-white"
                style={{ fontSize: "1.8rem" }}
              >
                {student.name}
              </h1>
              <div className="d-flex flex-wrap gap-2 mt-2">
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
                  {student.status}
                </span>
                <span
                  className="px-3 py-1 rounded-pill text-uppercase fw-bold text-white"
                  style={{
                    background: "#ff6b6b",
                    fontSize: "0.8rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  {student.activity}
                </span>
                <span
                  className="px-3 py-1 rounded-pill fw-bold"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#667eea",
                    fontSize: "0.8rem",
                  }}
                >
                  ID: {student.student_id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="d-flex justify-content-center my-5">
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {[
            { id: "attendance", label: "📅 Attendance", ref: attendanceRef },
            { id: "merits", label: "⭐ Merits", ref: meritsRef },
            { id: "fees", label: "💰 Fees", ref: feesRef },
          ].map((tab) => (
            <button
              key={tab.id}
              className="btn fw-semibold px-4 py-2 rounded-pill border-0 shadow-sm transition-all"
              style={{
                ...(activeTab === tab.id
                  ? tabGradients.active
                  : tabGradients.inactive),
                minWidth: "140px",
                transition: "all 0.3s ease",
                transform: activeTab === tab.id ? "scale(1.05)" : "scale(1)",
                boxShadow:
                  activeTab === tab.id
                    ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => handleTabClick(tab.id, tab.ref)}
            >
              <div className="d-flex flex-column align-items-center">
                <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      marginTop: "4px",
                    }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Cards - Responsive Grid */}
      <div className="p-4">
        <div className="row g-4">
          {/* Attendance Card */}
          <div className="col-12 col-xl-4" ref={attendanceRef}>
            <div
              className="rounded-4 border-0 shadow-sm text-white p-4 h-100"
              style={cardGradients.primary}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ fontSize: "1.5rem" }}>📅</div>
                <h3 className="mb-0 fw-bold">Attendance Summary</h3>
              </div>
              <div
                className="bg-white rounded-4 p-3"
                style={{ minHeight: "400px" }}
              >
                <AttendanceChart studentId={studentId} />
              </div>
            </div>
          </div>

          {/* Merits Card */}
          <div className="col-12 col-xl-8" ref={meritsRef}>
            <div
              className="rounded-4 border-0 shadow-sm text-white p-4 h-100"
              style={cardGradients.secondary}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ fontSize: "1.5rem" }}>⭐</div>
                <h3 className="mb-0 fw-bold">Merit & Performance</h3>
              </div>
              <div
                className="bg-white rounded-4 p-3"
                style={{ minHeight: "400px" }}
              >
                <MeritChart studentId={studentId} />
              </div>
            </div>
          </div>

          {/* Fees Card - Full Width */}
          <div className="col-12" ref={feesRef}>
            <div
              className="rounded-4 border-0 shadow-sm text-white p-4"
              style={cardGradients.info}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ fontSize: "1.5rem" }}>💰</div>
                <h3 className="mb-0 fw-bold">Fee Summary</h3>
              </div>
              <div className="bg-white rounded-4 p-3">
                <FeeChart studentId={studentId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
