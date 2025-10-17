import { useState } from "react";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { FaPen } from "react-icons/fa6";
import { Link } from "react-router";

export default function StudentsInfo({ studentId }) {
  const [activeTab, setActiveTab] = useState(0);

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
    warning: { background: "linear-gradient(135deg, #ffd89b, #19547b)" },
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

          <Link
            to={`/dashboard/parent/update/${studentId}`}
            className="btn text-white fw-semibold px-3 py-2 rounded-3 border-0 d-flex align-items-center gap-2"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3) !important",
            }}
          >
            <FaPen /> Edit
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="row g-4">
          {/* Personal Information Card */}
          <div className="col-lg-6">
            <div
              className="rounded-4 border-0 shadow-sm h-100 text-white p-4"
              style={cardGradients.primary}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ fontSize: "1.5rem" }}>👤</div>
                <h3 className="mb-0 fw-bold">Personal Information</h3>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      DATE OF BIRTH
                    </span>
                    <span className="fw-semibold">
                      {student?.dob || "Not Provided"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      GENDER
                    </span>
                    <span className="fw-semibold">
                      {student.gender || "Not Provided"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      LANGUAGE
                    </span>
                    <span className="fw-semibold">
                      {student.language || "Not Provided"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      STARTING DATE
                    </span>
                    <span className="fw-semibold">
                      {student.startingDate
                        ? new Date(student.startingDate).toLocaleDateString()
                        : "Not Provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Family Information Card */}
          <div className="col-lg-6">
            <div
              className="rounded-4 border-0 shadow-sm h-100 text-white p-4"
              style={cardGradients.secondary}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ fontSize: "1.5rem" }}>👨‍👩‍👧‍👦</div>
                <h3 className="mb-0 fw-bold">Family Information</h3>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      FATHER
                    </span>
                    <span className="fw-semibold mb-1">
                      {student.father?.name || "Not Provided"}
                    </span>
                    <span className="opacity-90" style={{ fontSize: "0.8rem" }}>
                      {student.father?.number || "No contact"}
                    </span>
                    <span className="opacity-90" style={{ fontSize: "0.8rem" }}>
                      {student.father?.occupation || "Occupation not provided"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      MOTHER
                    </span>
                    <span className="fw-semibold mb-1">
                      {student.mother?.name || "Not Provided"}
                    </span>
                    <span className="opacity-90" style={{ fontSize: "0.8rem" }}>
                      {student.mother?.number || "No contact"}
                    </span>
                    <span className="opacity-90" style={{ fontSize: "0.8rem" }}>
                      {student.mother?.occupation || "Occupation not provided"}
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex flex-column mt-2">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      ADDRESS
                    </span>
                    <span className="fw-semibold">
                      {student.address || "Not Provided"}
                    </span>
                    {student.post_code && (
                      <span
                        className="opacity-90"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {student.post_code}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Additional Info Card */}
          <div className="col-lg-6">
            <div
              className="rounded-4 border-0 shadow-sm h-100 text-white p-4"
              style={cardGradients.info}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ fontSize: "1.5rem" }}>📞</div>
                <h3 className="mb-0 fw-bold">Contact & Additional Info</h3>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      EMAIL
                    </span>
                    <span className="fw-semibold">
                      {student.email || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      FAXED NAME
                    </span>
                    <span className="fw-semibold">
                      {student.family_name || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      STUDENT SINCE
                    </span>
                    <span className="fw-semibold">
                      {student.startingDate
                        ? new Date(student.startingDate).toLocaleDateString()
                        : "Not Provided"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      ACCOUNT CREATED
                    </span>
                    <span className="fw-semibold">
                      {student.createdAt
                        ? new Date(student.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      LAST UPDATED
                    </span>
                    <span className="fw-semibold">
                      {student.updatedAt
                        ? new Date(
                            student.updatedAt.$date || student.updatedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <span
                      className="opacity-90 mb-1"
                      style={{ fontSize: "0.85rem" }}
                    >
                      EMERGENCY CONTACT
                    </span>
                    <span className="fw-semibold">
                      {student.emergency_number || "Not Provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information Card */}
          <div className="col-lg-3">
            <div
              className="rounded-4 border-0 shadow-sm h-100 text-white p-4"
              style={cardGradients.success}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ fontSize: "1.5rem" }}>💰</div>
                <h3 className="mb-0 fw-bold">Financial Information</h3>
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center text-center h-100">
                <span
                  className="opacity-90 mb-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  Monthly Fee
                </span>
                <span className="fw-bold" style={{ fontSize: "2rem" }}>
                  £{student.monthly_fee || "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Information Card */}
          <div className="col-lg-3">
            <div
              className="rounded-4 border-0 shadow-sm h-100 text-white p-4"
              style={cardGradients.warning}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ fontSize: "1.5rem" }}>🏥</div>
                <h3 className="mb-0 fw-bold">Medical Information</h3>
              </div>
              <div className="d-flex flex-column gap-2">
                <div>
                  <span className="opacity-90" style={{ fontSize: "0.8rem" }}>
                    Medical Condition
                  </span>
                  <div className="fw-semibold">
                    {student.medical?.condition || "None reported"}
                  </div>
                </div>
                <div>
                  <span className="opacity-90" style={{ fontSize: "0.8rem" }}>
                    Allergies
                  </span>
                  <div className="fw-semibold">
                    {student.medical?.allergies || "None reported"}
                  </div>
                </div>
                <div>
                  <span className="opacity-90" style={{ fontSize: "0.8rem" }}>
                    Surgery Address
                  </span>
                  <div className="fw-semibold">
                    {student.medical?.surgeryAddress || "Not provided"}
                  </div>
                </div>
                <div>
                  <span className="opacity-90" style={{ fontSize: "0.8rem" }}>
                    Doctor
                  </span>
                  <div className="fw-semibold">
                    {student.medical?.doctorName || "Not provided"}
                  </div>
                </div>
                <div>
                  <span className="opacity-90" style={{ fontSize: "0.8rem" }}>
                    Surgery Contact
                  </span>
                  <div className="fw-semibold">
                    {student.medical?.surgeryNumber || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
