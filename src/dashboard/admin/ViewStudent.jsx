import React, { useState } from "react";
import { useParams } from "react-router";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import sessionMap from "../../utils/sessionMap";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function ViewStudent() {
  const { id } = useParams();
  const { data: student, isLoading } = useGetStudentsByIdQuery(id, {
    skip: !id,
  });

  const [activeTab, setActiveTab] = useState("profile");

  if (isLoading) return <LoadingSpinnerDash></LoadingSpinnerDash>;
  if (!student) return <div>No student found</div>;

  const {
    name,
    email,
    dob,
    gender,
    school_year,
    language,
    startingDate,
    mother,
    father,
    emergency_number,
    address,
    post_code,
    academic,
    medical,
    monthly_fee,
    student_id,
    signature,
  } = student;

  return (
    <div className="container my-4">
      <h3 className="mb-4">Student Profile</h3>
      <div className="row">
        {/* Left Card */}
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "var(--border2)",
                  color: "#fff",
                  fontSize: "36px",
                  fontWeight: "bold",
                }}
              >
                {name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h5 className="card-title">{name}</h5>
              <p className="mb-1">
                <strong>School Year:</strong> {school_year || "-"}
              </p>
              <p className="mb-1">
                <strong>Language:</strong> {language || "-"}
              </p>
              <p className="mb-1">
                <strong>Date of Birth:</strong> {dob || "-"}
              </p>
              <p>
                <strong>Admission Date:</strong> {startingDate || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Tabs */}
        <div className="col-md-8">
          <ul className="nav nav-tabs mb-3">
            {["profile", "timetable", "attendance", "documents", "fee"].map(
              (tab) => (
                <li key={tab} className="nav-item">
                  <span
                    className={`nav-link ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                    style={{ cursor: "pointer" }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </li>
              )
            )}
          </ul>

          <div className="card p-3">
            {activeTab === "profile" && (
              <>
                {/* Basic Information */}
                <h6 className="fw-bold border-bottom pb-1 mb-3">
                  Basic Information
                </h6>
                {[
                  ["Name", name],
                  ["Gender", gender],
                  ["Language", language],
                  ["Date of Birth", dob],
                  ["School Year", school_year],
                  ["Admission Date", startingDate],
                  ["Address", address],
                  ["Post Code", post_code],
                  ["Student ID", student_id],
                  ["Signature", signature],
                ].map(([label, value]) => (
                  <div className="row mb-2" key={label}>
                    <div className="col-md-6">
                      <strong>{label}</strong>
                    </div>
                    <div className="col-md-6">
                      {label === "Signature" && value ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Signature
                        </a>
                      ) : (
                        value || "-"
                      )}
                    </div>
                  </div>
                ))}

                {/* Parental Details */}
                <h6 className="fw-bold border-bottom pb-1 mt-3 mb-2">
                  Parental Details
                </h6>
                {[
                  ["Mother's Name", mother?.name],
                  ["Mother's Job", mother?.occupation],
                  ["Mother's Phone", mother?.number],
                  ["Father's Name", father?.name],
                  ["Father's Job", father?.occupation],
                  ["Father's Phone", father?.number],
                  ["Emergency Contact", emergency_number],
                ].map(([label, value]) => (
                  <div className="row mb-2" key={label}>
                    <div className="col-md-6">
                      <strong>{label}</strong>
                    </div>
                    <div className="col-md-6">{value || "-"}</div>
                  </div>
                ))}

                {/* Academic Details */}
                <h6 className="fw-bold border-bottom pb-1 mt-3 mb-2">
                  Academic Information
                </h6>
                {[
                  ["Department", academic?.department],
                  ["Class", academic?.class],
                  ["Session", academic?.session],
                  ["Time", academic?.time ? sessionMap[academic.time] : "-"], // use map here
                ].map(([label, value]) => (
                  <div className="row mb-2" key={label}>
                    <div className="col-md-6">
                      <strong>{label}</strong>
                    </div>
                    <div className="col-md-6">{value || "-"}</div>
                  </div>
                ))}

                {/* Medical Information */}
                <h6 className="fw-bold border-bottom pb-1 mt-3 mb-2">
                  Medical Information
                </h6>
                {[
                  ["Doctor Name", medical?.doctorName],
                  ["Doctor Address", medical?.surgeryAddress],
                  ["Doctor Phone", medical?.surgeryNumber],
                  ["Medical Condition", medical?.condition],
                  ["Food Allergy", medical?.allergies || "No"],
                ].map(([label, value]) => (
                  <div className="row mb-2" key={label}>
                    <div className="col-md-6">
                      <strong>{label}</strong>
                    </div>
                    <div className="col-md-6">{value || "-"}</div>
                  </div>
                ))}

                {/* fee */}
                <h6 className="fw-bold border-bottom pb-1 mb-2 mt-3">
                  Fee Information
                </h6>
                {[
                  ["Admission Fee", "20"],
                  ["Monthly Fee", monthly_fee],
                  ["Total Paid Monthly", ""],
                  ["Unpaid Monthly", ""],
                  ["Outstanding Balance", ""],
                ].map(([label, value]) => (
                  <div className="row mb-2" key={label}>
                    <div className="col-md-6">
                      <strong>{label}</strong>
                    </div>
                    <div className="col-md-6">{value || "-"}</div>
                  </div>
                ))}
              </>
            )}

            {activeTab === "timetable" && (
              <div>Time Table content goes here...</div>
            )}
            {activeTab === "attendance" && (
              <div>Attendance content goes here...</div>
            )}
            {activeTab === "documents" && (
              <div>Documents content goes here...</div>
            )}
            {activeTab === "fee" && <>fee</>}
          </div>
        </div>
      </div>
    </div>
  );
}
