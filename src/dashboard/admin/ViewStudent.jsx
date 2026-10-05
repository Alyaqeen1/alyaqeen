import React, { useState } from "react";
import { Link, useParams } from "react-router";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";
import sessionMap from "../../utils/sessionMap";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { useGetFeesSummaryQuery } from "../../redux/features/fees/feesApi";
import { FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import StudentTimetable from "./StudentTimetable";
import AttendanceCalendar from "./AttendanceCalendar";
import {
  useGetMeritsOfStudentQuery,
  useGetAllMeritsOfStudentQuery,
} from "../../redux/features/merits/meritsApi";

const formatDate = (dateString) => {
  if (dateString === "N/A") return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
// Converts a date string/Date into DD/MM/YYYY
const formatDateDMY = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value; // fall back if unparseable
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export default function ViewStudent() {
  const { id } = useParams();
  const { data: student, isLoading } = useGetStudentsByIdQuery(id, {
    skip: !id,
  });

  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();
  const { data: feeSummary, isLoading: isFeeLoading } = useGetFeesSummaryQuery(
    id,
    {
      skip: !id,
    },
  );
  const { data: meritData, isLoading: isMeritLoading } =
    useGetMeritsOfStudentQuery({ studentId: id }, { skip: !id });
  const [activeTab, setActiveTab] = useState("profile");
  const [showAllMeritsModal, setShowAllMeritsModal] = useState(false);

  // Only fetch all records when the modal is opened — saves bandwidth
  const { data: allMeritsData, isLoading: isAllMeritsLoading } =
    useGetAllMeritsOfStudentQuery(id, { skip: !id || !showAllMeritsModal });

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
    applicationPdfUrl,
    reportPdf, // ✅ NEW
    feeRefundReportPdf, // ✅ NEW
    feeRefundReportGeneratedAt, // ✅ NEW
  } = student || {};

  const { summary, paidMonths } = feeSummary || {};

  // Helper function to get academic information for display
  const getAcademicDisplay = (academic) => {
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

  const academicInfo = getAcademicDisplay(academic);

  if (isLoading || isFeeLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  const unpaidFee =
    Number(summary?.consecutiveUnpaidMonths) * Number(monthly_fee);

  return (
    <div className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Student Profile</h3>
        <Link
          to={`/dashboard/online-admissions/update/${id}`}
          className="btn text-white d-flex align-items-center gap-2"
          style={{ backgroundColor: "var(--border2)" }}
        >
          <FaPen /> Edit Profile
        </Link>
      </div>
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
                <strong>Email:</strong> {email || "-"}
              </p>
              <p className="mb-1">
                <strong>School Year:</strong> {school_year || "-"}
              </p>
              <p className="mb-1">
                <strong>Language:</strong> {language || "-"}
              </p>
              <p className="mb-1">
                <strong>Date of Birth:</strong> {formatDateDMY(dob)}
              </p>
              <p>
                <strong>Admission Date:</strong> {formatDateDMY(startingDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Tabs */}
        <div className="col-md-8">
          <ul className="nav nav-tabs mb-3">
            {[
              "profile",
              "timetable",
              "attendance",
              "merit",
              "documents",
              "fee",
            ].map((tab) => (
              <li key={tab} className="nav-item">
                <span
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                  style={{ cursor: "pointer" }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </li>
            ))}
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
                  ["Date of Birth", formatDateDMY(dob)],
                  ["School Year", school_year],
                  ["Admission Date", formatDateDMY(startingDate)],
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

                {/* Academic Details - UPDATED FOR MULTI-DEPARTMENT */}
                <h6 className="fw-bold border-bottom pb-1 mt-3 mb-2">
                  Academic Information
                </h6>
                {academicInfo.length > 0 ? (
                  academicInfo.map((academicItem, index) => (
                    <div key={index} className="mb-3 p-2 border rounded">
                      {academicInfo.length > 1 && (
                        <div className="fw-bold text-primary mb-2">
                          Department {academicItem.index}
                        </div>
                      )}
                      {[
                        ["Department", academicItem.department],
                        ["Class", academicItem.class],
                        ["Session", academicItem.session],
                        [
                          "Time",
                          academicItem.time
                            ? sessionMap[academicItem.time]
                            : "-",
                        ],
                      ].map(([label, value]) => (
                        <div className="row mb-1" key={label}>
                          <div className="col-md-6">
                            <strong>{label}</strong>
                          </div>
                          <div className="col-md-6">{value || "-"}</div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-muted">
                    No academic information available
                  </div>
                )}

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

                {/* Fee Information */}
                <h6 className="fw-bold border-bottom pb-1 mb-2 mt-3">
                  Fee Information
                </h6>
                {[
                  ["Admission Fee", "20"],
                  ["Monthly Fee", monthly_fee],
                  ["Total Paid Monthly", summary?.totalMonthlyPaid],
                  ["Unpaid Monthly", unpaidFee],
                  ["Outstanding Balance", summary?.outstandingAmount],
                ].map(([label, value]) => (
                  <div className="row mb-2" key={label}>
                    <div className="col-md-6">
                      <strong>{label}</strong>
                    </div>
                    <div className="col-md-6">{value}</div>
                  </div>
                ))}
              </>
            )}
            {activeTab === "timetable" && (
              <StudentTimetable student={student} />
            )}
            {activeTab === "merit" && (
              <div>
                <h6 className="fw-bold border-bottom pb-1 mb-3">
                  Merit & Demerit Summary
                </h6>

                {isMeritLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm" />
                    <span className="ms-2">Loading merit data...</span>
                  </div>
                ) : !meritData || meritData.totalRecords === 0 ? (
                  <div className="alert alert-info">
                    <i className="fa-solid fa-info-circle me-2"></i>
                    No merit or demerit records available for this student.
                  </div>
                ) : (
                  <>
                    {/* Summary cards */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <div className="border rounded p-3 text-center bg-light">
                          <div className="text-muted small">Total Points</div>
                          <div
                            className={`fs-4 fw-bold ${
                              meritData.totalMerit > 0
                                ? "text-success"
                                : meritData.totalMerit < 0
                                  ? "text-danger"
                                  : "text-secondary"
                            }`}
                          >
                            {meritData.totalMerit > 0 ? "+" : ""}
                            {meritData.totalMerit}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="border rounded p-3 text-center bg-light">
                          <div className="text-muted small">
                            Recent (30 days)
                          </div>
                          <div
                            className={`fs-4 fw-bold ${
                              meritData.recentMerit > 0
                                ? "text-success"
                                : meritData.recentMerit < 0
                                  ? "text-danger"
                                  : "text-secondary"
                            }`}
                          >
                            {meritData.recentMerit > 0 ? "+" : ""}
                            {meritData.recentMerit}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="border rounded p-3 text-center bg-light">
                          <div className="text-muted small">Total Records</div>
                          <div className="fs-4 fw-bold text-primary">
                            {meritData.totalRecords}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="mb-3">
                      {meritData.totalMerit >= 50 && (
                        <span className="badge bg-success me-2">
                          ⭐ Merit Student (50+)
                        </span>
                      )}
                      {meritData.totalMerit <= -25 && (
                        <span className="badge bg-danger me-2">
                          ⚠️ Demerit Student (-25 or lower)
                        </span>
                      )}
                      {meritData.totalMerit > -25 &&
                        meritData.totalMerit < 50 && (
                          <span className="badge bg-secondary me-2">
                            Neutral (Between -24 and +49)
                          </span>
                        )}
                    </div>

                    {/* Records table */}
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-1 mb-2">
                      <h6 className="fw-bold mb-0">Recent Records</h6>
                      {meritData.totalRecords > 6 && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setShowAllMeritsModal(true)}
                        >
                          View All ({meritData.totalRecords})
                        </button>
                      )}
                    </div>
                    <div className="table-responsive mb-3">
                      <table className="table table-sm mb-0">
                        <thead>
                          <tr>
                            <th
                              className="text-white fw-bolder border text-center"
                              style={{ backgroundColor: "var(--border2)" }}
                            >
                              Date
                            </th>
                            <th
                              className="text-white fw-bolder border text-center"
                              style={{ backgroundColor: "var(--border2)" }}
                            >
                              Behavior
                            </th>
                            <th
                              className="text-white fw-bolder border text-center"
                              style={{ backgroundColor: "var(--border2)" }}
                            >
                              Points
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {meritData.meritRecords?.map((record) => (
                            <tr key={record._id}>
                              <td className="border text-center align-middle">
                                {formatDateDMY(record.date)}
                              </td>
                              <td className="border text-center align-middle">
                                {record.behavior || record.incident || "-"}
                              </td>
                              <td
                                className={`border text-center align-middle fw-bold ${
                                  record.merit_points > 0
                                    ? "text-success"
                                    : record.merit_points < 0
                                      ? "text-danger"
                                      : "text-secondary"
                                }`}
                              >
                                {record.merit_points > 0 ? "+" : ""}
                                {record.merit_points}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Behavior breakdown */}
                    {meritData.topBehaviors?.length > 0 && (
                      <>
                        <h6 className="fw-bold border-bottom pb-1 mb-2 mt-3">
                          Top Behaviors
                        </h6>
                        <div className="row g-2">
                          {meritData.topBehaviors.map(([behavior, stats]) => (
                            <div className="col-md-6" key={behavior}>
                              <div className="border rounded p-2 d-flex justify-content-between">
                                <span className="fw-medium">{behavior}</span>
                                <span
                                  className={`fw-bold ${
                                    stats.totalPoints > 0
                                      ? "text-success"
                                      : stats.totalPoints < 0
                                        ? "text-danger"
                                        : "text-secondary"
                                  }`}
                                >
                                  {stats.totalPoints > 0 ? "+" : ""}
                                  {stats.totalPoints} ({stats.count}x)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Stats footer */}
                    <div className="mt-3 small text-muted">
                      <div>
                        <strong>Most Frequent:</strong>{" "}
                        {meritData.behaviorStats?.mostFrequent || "None"}
                      </div>
                      <div>
                        <strong>Highest Value:</strong>{" "}
                        {meritData.behaviorStats?.highestValue || "None"}
                      </div>
                      <div>
                        <strong>Period:</strong> {meritData.periodInfo}
                      </div>
                    </div>
                  </>
                )}
                {/* Modal — All merit records */}
                {showAllMeritsModal && (
                  <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={() => setShowAllMeritsModal(false)}
                  >
                    <div
                      className="modal-dialog modal-lg modal-dialog-scrollable"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">
                            All Merit Records (
                            {allMeritsData?.totalRecords || 0})
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowAllMeritsModal(false)}
                          />
                        </div>
                        <div className="modal-body">
                          {isAllMeritsLoading ? (
                            <div className="text-center py-3">
                              <div className="spinner-border spinner-border-sm" />
                              <span className="ms-2">
                                Loading all records...
                              </span>
                            </div>
                          ) : !allMeritsData ||
                            allMeritsData.totalRecords === 0 ? (
                            <div className="alert alert-info mb-0">
                              No records available.
                            </div>
                          ) : (
                            <>
                              {/* Summary strip */}
                              <div className="mb-3 d-flex gap-3">
                                <span className="badge bg-secondary">
                                  Total: {allMeritsData.totalRecords} records
                                </span>
                                <span
                                  className={`badge ${
                                    allMeritsData.totalMerit > 0
                                      ? "bg-success"
                                      : allMeritsData.totalMerit < 0
                                        ? "bg-danger"
                                        : "bg-secondary"
                                  }`}
                                >
                                  Net Points:{" "}
                                  {allMeritsData.totalMerit > 0 ? "+" : ""}
                                  {allMeritsData.totalMerit}
                                </span>
                              </div>

                              <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                  <thead>
                                    <tr>
                                      <th
                                        className="text-white fw-bolder border text-center"
                                        style={{
                                          backgroundColor: "var(--border2)",
                                        }}
                                      >
                                        #
                                      </th>
                                      <th
                                        className="text-white fw-bolder border text-center"
                                        style={{
                                          backgroundColor: "var(--border2)",
                                        }}
                                      >
                                        Date
                                      </th>
                                      <th
                                        className="text-white fw-bolder border text-center"
                                        style={{
                                          backgroundColor: "var(--border2)",
                                        }}
                                      >
                                        Behavior
                                      </th>
                                      <th
                                        className="text-white fw-bolder border text-center"
                                        style={{
                                          backgroundColor: "var(--border2)",
                                        }}
                                      >
                                        Points
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {allMeritsData.meritRecords.map(
                                      (record, idx) => (
                                        <tr key={record._id || idx}>
                                          <td className="border text-center align-middle">
                                            {idx + 1}
                                          </td>
                                          <td className="border text-center align-middle text-nowrap">
                                            {formatDateDMY(record.date)}
                                          </td>
                                          <td className="border text-center align-middle">
                                            {record.behavior ||
                                              record.incident ||
                                              "-"}
                                          </td>
                                          <td
                                            className={`border text-center align-middle fw-bold ${
                                              record.merit_points > 0
                                                ? "text-success"
                                                : record.merit_points < 0
                                                  ? "text-danger"
                                                  : "text-secondary"
                                            }`}
                                          >
                                            {record.merit_points > 0 ? "+" : ""}
                                            {record.merit_points}
                                          </td>
                                        </tr>
                                      ),
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="modal-footer">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setShowAllMeritsModal(false)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "attendance" && (
              <AttendanceCalendar studentId={id} />
            )}
            {activeTab === "documents" && (
              <div>
                {/* Application PDF Section */}
                <h6 className="fw-bold border-bottom pb-1 mb-3">
                  Application Documents
                </h6>

                {applicationPdfUrl ? (
                  <div className="card p-3 mb-4">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-1">Application Form PDF</h6>
                        <p className="text-muted mb-2">
                          This PDF contains the complete application form
                          submitted during registration.
                        </p>
                        <div className="d-flex gap-2">
                          <a
                            href={applicationPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                          >
                            <i className="fa-solid fa-eye me-1"></i> View PDF
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 text-end">
                        <div className="bg-light p-3 rounded">
                          <i className="fa-solid fa-file-pdf text-danger fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <i className="fa-solid fa-exclamation-triangle me-2"></i>
                    No application PDF found for this student. The document may
                    not have been generated during registration.
                  </div>
                )}

                {/* Report PDF Section - NEW */}
                <h6 className="fw-bold border-bottom pb-1 mb-3 mt-4">
                  Student Reports
                </h6>

                {student?.reportPdf ? (
                  <div className="card p-3 mb-4">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-1">Progress Report PDF</h6>
                        <p className="text-muted mb-2">
                          Comprehensive student progress report including
                          attendance, merits, academic progress, and fee
                          summary.
                        </p>
                        <div className="d-flex gap-2">
                          <a
                            href={student?.reportPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-sm"
                          >
                            <i className="fa-solid fa-file-lines me-1"></i> View
                            Report
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 text-end">
                        <div className="bg-light p-3 rounded">
                          <i className="fa-solid fa-file-lines text-success fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <i className="fa-solid fa-info-circle me-2"></i>
                    No progress report has been generated for this student yet.
                    Reports are typically generated monthly or on request.
                  </div>
                )}
                {/* ===== Fee Refund / Dispute Report ===== */}
                <h6 className="fw-bold border-bottom pb-1 mb-3 mt-4">
                  Fee Refund / Dispute Documents
                </h6>

                {feeRefundReportPdf ? (
                  <div className="card p-3 mb-4 border-danger">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-1 text-danger">
                          Fee Refund / Dispute Report PDF
                        </h6>
                        <p className="text-muted mb-2">
                          Official report containing the Academy's{" "}
                          <strong>non-refundable fee policy</strong>, attendance
                          & behaviour policies, and the parent/guardian's signed
                          agreement. Issued for refund or dispute enquiries.
                        </p>
                        <p className="text-muted small mb-2">
                          <strong>Generated on:</strong>{" "}
                          {feeRefundReportGeneratedAt
                            ? formatDateDMY(feeRefundReportGeneratedAt)
                            : "-"}
                        </p>
                        <div className="d-flex gap-2">
                          <a
                            href={feeRefundReportPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-danger btn-sm"
                          >
                            <i className="fa-solid fa-file-contract me-1"></i>{" "}
                            View Fee Refund Report
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 text-end">
                        <div className="bg-light p-3 rounded">
                          <i className="fa-solid fa-file-contract text-danger fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <i className="fa-solid fa-info-circle me-2"></i>
                    No fee refund / dispute report has been generated for this
                    student yet. This report is only generated when a refund or
                    fee dispute is raised.
                  </div>
                )}

                {/* Signature Section */}
                {signature && (
                  <div className="card p-3">
                    <h6 className="fw-bold border-bottom pb-1 mb-3">
                      Digital Signature
                    </h6>
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-1">
                          Parent/Guardian Signature
                        </h6>
                        <p className="text-muted mb-2">
                          Digital signature submitted during application.
                        </p>
                        <a
                          href={signature}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          <i className="fa-solid fa-signature me-1"></i> View
                          Signature
                        </a>
                      </div>
                      <div className="col-md-4 text-end">
                        <div className="bg-light p-2 border rounded d-inline-block">
                          <img
                            src={signature}
                            alt="Signature"
                            className="img-fluid"
                            style={{ maxHeight: "80px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "fee" && (
              <>
                <div className="table-responsive mb-3">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--border2)" }}
                        >
                          #
                        </th>
                        <th
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--border2)" }}
                        >
                          Fee Paid On
                        </th>
                        <th
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--border2)" }}
                        >
                          Fee Month
                        </th>
                        <th
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--border2)" }}
                        >
                          Fee Method
                        </th>
                        <th
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--border2)" }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paidMonths?.length > 0 ? (
                        paidMonths?.map((fee, idx) => (
                          <tr key={idx}>
                            <td className="border h6 text-center align-middle text-nowrap">
                              {idx + 1}
                            </td>
                            <td className="border h6 text-center align-middle text-nowrap">
                              {formatDate(fee?.paymentDate)}
                            </td>
                            <td className="fw-medium border text-center align-middle text-nowrap">
                              {fee?.month}
                            </td>
                            <td className="border h6 text-center align-middle text-nowrap">
                              {fee?.paymentMethod}
                            </td>
                            <td className="border h6 text-center align-middle text-nowrap">
                              {fee?.amount}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <h5>No Fee Records available.</h5>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
