import React, { useRef, useState } from "react";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import AttendanceChart from "./AttendanceChart";
import MeritChart from "./MeritChart";
import FeeChart from "./FeeChart";
import sessionMap from "../../utils/sessionMap";

export default function ChildSection({ studentId }) {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  // Add these refs at the top of your component
  const attendanceRef = useRef(null);
  const meritsRef = useRef(null);
  const feesRef = useRef(null);
  const { data: student, isLoading } = useGetStudentsByIdQuery(studentId, {
    skip: !studentId,
  });

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  if (!student) {
    return (
      <div
        className="child-section-container"
        style={{ backgroundColor: "var(--border2)" }}
      >
        <div className="no-student-selected">
          <h3>No Student Selected</h3>
          <p>Please select a student to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="child-section-container"
      style={{ backgroundColor: "var(--border2)" }}
    >
      {/* Header Section */}
      <div className="child-header">
        <div className="student-avatar">
          <span>{student.name?.charAt(0) || "S"}</span>
        </div>
        <div className="student-basic-info">
          <h1>{student.name}</h1>
          <div className="student-badges">
            <span className="status-badge enrolled">{student.status}</span>
            <span className="status-badge active">{student.activity}</span>
            <span className="id-badge">ID: {student.student_id}</span>
          </div>
        </div>
      </div>
      <div className="child-header my-5 d-flex justify-content-center">
        <ul
          className="nav d-flex justify-content-center align-items-center gap-3 flex-wrap"
          role="tablist"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          <li className="nav-item text-center">
            <button
              className="nav-link text-uppercase box-shadow px-4 py-2"
              style={{
                backgroundColor:
                  activeTab === "attendance" ? "var(--border2)" : "white",
                color: activeTab === "attendance" ? "white" : "black",
                borderRadius: "20px",
                border: "2px solid var(--border2)",
                minWidth: "120px",
              }}
              onClick={() => {
                setActiveTab("attendance");
                attendanceRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Attendance
            </button>
          </li>

          <li className="nav-item text-center">
            <button
              className="nav-link text-uppercase box-shadow px-4 py-2"
              style={{
                backgroundColor:
                  activeTab === "merits" ? "var(--border2)" : "white",
                color: activeTab === "merits" ? "white" : "black",
                borderRadius: "20px",
                border: "2px solid var(--border2)",
                minWidth: "120px",
              }}
              onClick={() => {
                setActiveTab("merits");
                meritsRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Merits
            </button>
          </li>

          <li className="nav-item text-center">
            <button
              className="nav-link text-uppercase box-shadow px-4 py-2"
              style={{
                backgroundColor:
                  activeTab === "fees" ? "var(--border2)" : "white",
                color: activeTab === "fees" ? "white" : "black",
                borderRadius: "20px",
                border: "2px solid var(--border2)",
                minWidth: "120px",
              }}
              onClick={() => {
                setActiveTab("fees");
                feesRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Fees
            </button>
          </li>
        </ul>
      </div>

      <div className="child-content">
        {/* Attendance Card */}
        <div className="info-card" ref={attendanceRef}>
          <div className="card-header">
            <h3>📅 Attendance Summary</h3>
          </div>
          <div className="card-content">
            <AttendanceChart studentId={studentId}></AttendanceChart>
          </div>
        </div>
        <div className="info-card merit-card-double" ref={meritsRef}>
          <div className="card-header">
            <h3>⭐ Merit & Performance</h3>
          </div>
          <div className="card-content">
            <MeritChart studentId={studentId}></MeritChart>
          </div>
        </div>

        {/* Merit Card - Double Width */}
        <div className="info-card merit-card-triple" ref={feesRef}>
          <div className="card-header">
            <h3>💰 Fee Summary</h3>
          </div>
          <div className="card-content">
            <FeeChart studentId={studentId}></FeeChart>
          </div>
        </div>
      </div>
    </div>
  );
}
