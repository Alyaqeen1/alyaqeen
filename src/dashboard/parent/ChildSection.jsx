import React from "react";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import AttendanceChart from "./AttendanceChart";
import MeritChart from "./MeritChart";
import FeeChart from "./FeeChart";

export default function ChildSection({ studentId }) {
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

      <div className="child-content">
        {/* Attendance Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>📅 Attendance Summary</h3>
          </div>
          <div className="card-content">
            <AttendanceChart studentId={studentId}></AttendanceChart>
          </div>
        </div>
        <div className="info-card merit-card-double">
          <div className="card-header">
            <h3>💰 Fee Summary</h3>
          </div>
          <div className="card-content">
            <FeeChart studentId={studentId}></FeeChart>
          </div>
        </div>

        {/* Merit Card - Double Width */}
        <div className="info-card merit-card-triple">
          <div className="card-header">
            <h3>⭐ Merit & Performance</h3>
          </div>
          <div className="card-content">
            <MeritChart studentId={studentId}></MeritChart>
          </div>
        </div>

        {/* Row 1: 3 cards */}
        <div className="info-card">
          <div className="card-header">
            <h3>📚 Academic Information</h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label>Department</label>
                <p>{student.academic?.department || "Not Provided"}</p>
              </div>
              <div className="info-item">
                <label>Session</label>
                <p>{student.academic?.session || "Not Provided"}</p>
              </div>
              <div className="info-item">
                <label>Class</label>
                <p>{student.academic?.class || "Not Provided Yet"}</p>
              </div>
              <div className="info-item">
                <label>School Year</label>
                <p>{student.school_year || "Not Provided"}</p>
              </div>
              <div className="info-item">
                <label>Time</label>
                <p>{student.academic?.time || "Not Provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>💰 Financial Information</h3>
          </div>
          <div className="card-content">
            <div className="fee-display">
              <div className="monthly-fee">
                <span className="fee-label">Monthly Fee</span>
                <span className="fee-amount">
                  £{student.monthly_fee || "Not Assigned"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>👤 Personal Information</h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label>Date of Birth</label>
                <p>
                  {student.dob
                    ? new Date(student.dob).toLocaleDateString()
                    : "Not Provided"}
                </p>
              </div>
              <div className="info-item">
                <label>Gender</label>
                <p>{student.gender || "Not Provided"}</p>
              </div>
              <div className="info-item">
                <label>Language</label>
                <p>{student.language || "Not Provided"}</p>
              </div>
              <div className="info-item">
                <label>Starting Date</label>
                <p>
                  {student.startingDate
                    ? new Date(student.startingDate).toLocaleDateString()
                    : "Not Provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Family Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>👨‍👩‍👧‍👦 Family Information</h3>
          </div>
          <div className="card-content">
            <div className="family-grid">
              <div className="parent-info">
                <h4>Father</h4>
                <p className="parent-name">
                  {student.father?.name || "Not Provided"}
                </p>
                <p className="parent-contact">
                  {student.father?.number || "No contact"}
                </p>
                <p className="parent-occupation">
                  {student.father?.occupation || "Occupation not provided"}
                </p>
              </div>
              <div className="parent-info">
                <h4>Mother</h4>
                <p className="parent-name">
                  {student.mother?.name || "Not Provided"}
                </p>
                <p className="parent-contact">
                  {student.mother?.number || "No contact"}
                </p>
                <p className="parent-occupation">
                  {student.mother?.occupation || "Occupation not provided"}
                </p>
              </div>
            </div>
            <div className="address-info">
              <label>Address</label>
              <p>{student.address || "Not Provided"}</p>
              <p className="post-code">{student.post_code || ""}</p>
            </div>
          </div>
        </div>

        {/* Medical Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>🏥 Medical Information</h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label>Medical Condition</label>
                <p>{student.medical?.condition || "None reported"}</p>
              </div>
              <div className="info-item">
                <label>Allergies</label>
                <p>{student.medical?.allergies || "None reported"}</p>
              </div>
              <div className="info-item full-width">
                <label>Emergency Contact</label>
                <p>{student.emergency_number || "Not Provided"}</p>
              </div>
              <div className="info-item">
                <label>Doctor</label>
                <p>{student.medical?.doctorName || "Not provided"}</p>
              </div>
              <div className="info-item">
                <label>Surgery Contact</label>
                <p>{student.medical?.surgeryNumber || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Additional Info Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>📞 Contact & Additional Info</h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <p className="email-value">{student.email || "Not provided"}</p>
              </div>
              <div className="info-item">
                <label>Family Name</label>
                <p>{student.family_name || "Not provided"}</p>
              </div>
              <div className="info-item">
                <label>Student Since</label>
                <p>
                  {student.startingDate
                    ? new Date(student.startingDate).toLocaleDateString()
                    : "Not Provided"}
                </p>
              </div>
              <div className="info-item">
                <label>Account Created</label>
                <p>
                  {student.createdAt
                    ? new Date(student.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="info-item">
                <label>Last Updated</label>
                <p>
                  {student.updatedAt
                    ? new Date(
                        student.updatedAt.$date || student.updatedAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="info-item">
                <label>Surgery Address</label>
                <p>{student.medical?.surgeryAddress || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
