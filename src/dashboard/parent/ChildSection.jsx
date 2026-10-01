import React, { useRef, useState } from "react";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import { useGetMeritsOfStudentQuery } from "../../redux/features/merits/meritsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import AttendanceChart from "./AttendanceChart";
import MeritChart from "./MeritChart";
import FeeChart from "./FeeChart";

export default function ChildSection({ studentId }) {
  const [activeTab, setActiveTab] = useState("attendance");
  const [showMeritsModal, setShowMeritsModal] = useState(false);

  const attendanceRef = useRef(null);
  const meritsRef = useRef(null);
  const feesRef = useRef(null);

  const { data: student, isLoading } = useGetStudentsByIdQuery(studentId, {
    skip: !studentId,
  });

  // Fetch full merit data only when the modal opens
  const { data: allMerits, isLoading: isAllMeritsLoading } =
    useGetMeritsOfStudentQuery(
      { studentId },
      { skip: !studentId || !showMeritsModal },
    );

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

  if (isLoading) return <LoadingSpinnerDash />;

  if (!student) {
    return (
      <div
        className="d-flex align-items-center justify-content-center rounded-4 border-0 shadow"
        style={{ minHeight: "400px", background: "white", padding: "40px" }}
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

  const formatDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      className="rounded-4 border-0 shadow overflow-hidden"
      style={{ background: "white" }}
    >
      {/* Header */}
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
                  }}
                >
                  {student.status}
                </span>
                <span
                  className="px-3 py-1 rounded-pill text-uppercase fw-bold text-white"
                  style={{ background: "#ff6b6b", fontSize: "0.8rem" }}
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
              className="btn fw-semibold px-4 py-2 rounded-pill border-0 shadow-sm"
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

      {/* Content Cards */}
      <div className="p-4">
        <div className="row g-4">
          {/* Attendance Card — unchanged */}
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

          {/* Merits Card — with View All button */}
          <div className="col-12 col-xl-8" ref={meritsRef}>
            <div
              className="rounded-4 border-0 shadow-sm text-white p-4 h-100"
              style={cardGradients.secondary}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ fontSize: "1.5rem" }}>⭐</div>
                  <h3 className="mb-0 fw-bold">Merit & Performance</h3>
                </div>
                <button
                  className="btn btn-sm btn-light fw-semibold"
                  onClick={() => setShowMeritsModal(true)}
                >
                  View All
                </button>
              </div>
              <div
                className="bg-white rounded-4 p-3"
                style={{ minHeight: "400px" }}
              >
                <MeritChart studentId={studentId} />
              </div>
            </div>
          </div>

          {/* Fees Card — unchanged */}
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

      {/* ========== MERITS MODAL ONLY ========== */}
      {showMeritsModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowMeritsModal(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4">
              <div
                className="modal-header text-white"
                style={cardGradients.secondary}
              >
                <h5 className="modal-title fw-bold">⭐ All Merit Records</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowMeritsModal(false)}
                />
              </div>

              <div className="modal-body">
                {isAllMeritsLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm" />
                    <span className="ms-2">Loading merit records...</span>
                  </div>
                ) : !allMerits?.meritRecords?.length ? (
                  <div className="alert alert-info mb-0">
                    No merit or demerit records for this student.
                  </div>
                ) : (
                  <>
                    {/* Summary strip */}
                    <div className="row g-2 mb-3">
                      <div className="col-md-4">
                        <div className="border rounded p-2 text-center">
                          <div className="small text-muted">Total Points</div>
                          <div
                            className={`fw-bold ${
                              allMerits.totalMerit > 0
                                ? "text-success"
                                : allMerits.totalMerit < 0
                                  ? "text-danger"
                                  : "text-secondary"
                            }`}
                          >
                            {allMerits.totalMerit > 0 ? "+" : ""}
                            {allMerits.totalMerit}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="border rounded p-2 text-center">
                          <div className="small text-muted">Total Records</div>
                          <div className="fw-bold text-primary">
                            {allMerits.totalRecords}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="border rounded p-2 text-center">
                          <div className="small text-muted">
                            Recent (30 days)
                          </div>
                          <div
                            className={`fw-bold ${
                              allMerits.recentMerit > 0
                                ? "text-success"
                                : allMerits.recentMerit < 0
                                  ? "text-danger"
                                  : "text-secondary"
                            }`}
                          >
                            {allMerits.recentMerit > 0 ? "+" : ""}
                            {allMerits.recentMerit}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full records table */}
                    <div className="table-responsive">
                      <table className="table table-sm mb-0">
                        <thead>
                          <tr>
                            <th
                              className="text-white text-center"
                              style={{ backgroundColor: "var(--border2)" }}
                            >
                              #
                            </th>
                            <th
                              className="text-white text-center"
                              style={{ backgroundColor: "var(--border2)" }}
                            >
                              Date
                            </th>
                            <th
                              className="text-white text-center"
                              style={{ backgroundColor: "var(--border2)" }}
                            >
                              Behavior
                            </th>
                            <th
                              className="text-white text-center"
                              style={{ backgroundColor: "var(--border2)" }}
                            >
                              Points
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {allMerits.meritRecords.map((r, i) => (
                            <tr key={r._id || i}>
                              <td className="text-center border">{i + 1}</td>
                              <td className="text-center border text-nowrap">
                                {formatDate(r.date)}
                              </td>
                              <td className="text-center border">
                                {r.behavior || r.incident || "-"}
                              </td>
                              <td
                                className={`text-center border fw-bold ${
                                  r.merit_points > 0
                                    ? "text-success"
                                    : r.merit_points < 0
                                      ? "text-danger"
                                      : "text-secondary"
                                }`}
                              >
                                {r.merit_points > 0 ? "+" : ""}
                                {r.merit_points}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowMeritsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
