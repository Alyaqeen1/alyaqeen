import React from "react";
import {
  useGetStudentQuery,
  useUpdateStudentStatusMutation,
} from "../../redux/features/students/studentsApi";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";
import { FaCheck } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const getDepartmentInfo = (academic, departments = []) => {
  if (!academic) return "Not assigned";

  if (academic.enrollments && Array.isArray(academic.enrollments)) {
    if (academic.enrollments.length === 0) return "Not assigned";

    return academic.enrollments.map((enrollment, index) => {
      const dept = departments.find((d) => d._id === enrollment.dept_id);
      const deptName = dept ? dept.dept_name : "Unknown Department";
      const sessionInfo = enrollment.session
        ? `${enrollment.session} (${enrollment.session_time})`
        : "";
      return { name: deptName, session: sessionInfo, index: index + 1 };
    });
  }

  if (academic.dept_id) {
    const dept = departments.find((d) => d._id === academic.dept_id);
    const deptName = dept ? dept.dept_name : "Unknown Department";
    const sessionInfo = academic.session
      ? `${academic.session} (${academic.time})`
      : "";
    return [{ name: deptName, session: sessionInfo, index: 1 }];
  }

  return [];
};

const formatDate = (dateString) => {
  if (!dateString || dateString === "N/A") return dateString || "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getClassInfo = (academic, classes = []) => {
  if (!academic) return "Not assigned";

  if (academic.enrollments && Array.isArray(academic.enrollments)) {
    if (academic.enrollments.length === 0) return "Not assigned";

    return academic.enrollments.map((enrollment, index) => {
      const cls = classes.find((c) => c._id === enrollment.class_id);
      const className = cls ? cls.class_name : "Unknown Class";
      return { name: className, index: index + 1 };
    });
  }

  if (academic.class_id) {
    const cls = classes.find((c) => c._id === academic.class_id);
    const className = cls ? cls.class_name : "Unknown Class";
    return [{ name: className, index: 1 }];
  }

  return [];
};

export default function StudentModal({ studentId, handleClose, showModal }) {
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();

  const {
    data: student,
    isLoading,
    isError,
    refetch,
  } = useGetStudentQuery(studentId, { skip: !studentId });

  const axiosPublic = useAxiosPublic();

  const {
    name,
    email,
    dob,
    gender,
    school_year,
    language,
    status,
    emergency_number,
    address,
    post_code,
    family_name,
    mother,
    father,
    academic,
    medical,
    startingDate,
    signature,
    monthly_fee,
    applicationPdfUrl,
  } = student || {};

  const { doctorName, surgeryAddress, surgeryNumber, allergies, condition } =
    medical || {};
  const {
    name: fatherName,
    occupation: fatherOcc,
    number: fatherNumber,
  } = father || {};
  const { name: motherName, occupation, number: motherNumber } = mother || {};

  const departmentInfo = getDepartmentInfo(academic, departments || []);
  const classInfo = getClassInfo(academic, classes || []);

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  const handleStatus = async (newStatus) => {
    const hasClassAssigned =
      academic?.enrollments?.some((enrollment) => enrollment.class_id) ||
      academic?.class_id;

    if (newStatus === "approved" && !hasClassAssigned) {
      Swal.fire({
        icon: "warning",
        title: "Assign classes first!",
        text: "You must assign classes to all departments before approving the student.",
      });
      return;
    }

    try {
      const data = await updateStudentStatus({
        id: studentId,
        status: newStatus,
      }).unwrap();

      if (data.modifiedCount) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Student ${newStatus} successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (!showModal) return null;
  if (isLoading) return <LoadingSpinnerDash></LoadingSpinnerDash>;
  if (isError || !student) return <div>Failed to load student data</div>;

  return (
    <div>
      {showModal && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal student-modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        style={{
          display: showModal ? "block" : "none",
          zIndex: 1050,
        }}
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {/* ============ HEADER (own region) ============ */}
            <div
              className="modal-header-custom d-flex justify-content-between align-items-center"
              style={{
                borderBottom: "1px solid #dee2e6",
                background: "#fff",
                padding: "1rem 1rem",
                flexShrink: 0,
              }}
            >
              <h2 className="text-xl font-bold mb-0 pe-2">{name}</h2>
              <button
                type="button"
                className={`btn btn-sm flex-shrink-0 ${
                  status === "under review"
                    ? "btn-primary"
                    : status === "approved" ||
                        status === "enrolled" ||
                        status === "hold"
                      ? "btn-success"
                      : status === "rejected"
                        ? "btn-danger"
                        : ""
                }`}
              >
                {status}
              </button>
            </div>

            {/* ============ BODY (scrollable) ============ */}
            <div
              className="modal-body-custom"
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
                padding: "1rem",
                flex: "1 1 auto",
                minHeight: 0,
              }}
            >
              <div
                className="row g-3"
                style={{ marginLeft: 0, marginRight: 0, width: "100%" }}
              >
                {/* LEFT COLUMN */}
                <div className="col-12 col-md-6" style={{ minWidth: 0 }}>
                  <p className="mb-2">
                    <strong>Email:</strong> {email}
                  </p>
                  <p className="mb-2">
                    <strong>DOB:</strong> {formatDate(dob)}
                  </p>
                  <p className="mb-2">
                    <strong>Home Address:</strong> {address}
                  </p>
                  <p className="mb-2">
                    <strong>Post Code:</strong> {post_code}
                  </p>
                  <p className="mb-2">
                    <strong>Family Name:</strong> {family_name}
                  </p>
                  <p className="mb-2">
                    <strong>Gender:</strong> {gender}
                  </p>
                  <p className="mb-2">
                    <strong>School Year:</strong> {school_year}
                  </p>
                  <p className="mb-2">
                    <strong>Language:</strong> {language}
                  </p>

                  <div className="mb-2">
                    <strong>Departments:</strong>
                    {Array.isArray(departmentInfo) &&
                    departmentInfo.length > 0 ? (
                      <div className="mt-1">
                        {departmentInfo.map((dept, idx) => (
                          <div key={idx} className="ms-3 small">
                            • {dept.name} - {dept.session}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="ms-2">Not assigned</span>
                    )}
                  </div>

                  <div className="mb-2">
                    <strong>Classes:</strong>
                    {Array.isArray(classInfo) && classInfo.length > 0 ? (
                      <div className="mt-1">
                        {classInfo.map((cls, idx) => (
                          <div key={idx} className="ms-3 small">
                            • {cls.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="ms-2">Not assigned</span>
                    )}
                  </div>

                  <p className="mb-2">
                    <strong>Emergency Number:</strong> {emergency_number}
                  </p>
                  <p className="mb-2">
                    <strong>Monthly Fee:</strong>{" "}
                    {monthly_fee ? `£${monthly_fee}` : "Not Assigned"}
                  </p>
                </div>

                {/* RIGHT COLUMN */}
                <div
                  className="col-12 col-md-6 mt-3 mt-md-0"
                  style={{ minWidth: 0 }}
                >
                  <p className="mb-2">
                    <strong>Father's Name:</strong> {fatherName}
                  </p>
                  <p className="mb-2">
                    <strong>Father's Occupation:</strong> {fatherOcc}
                  </p>
                  <p className="mb-2">
                    <strong>Father's Number:</strong> {fatherNumber}
                  </p>
                  <p className="mb-2">
                    <strong>Mother's Name:</strong> {motherName}
                  </p>
                  <p className="mb-2">
                    <strong>Mother's Occupation:</strong> {occupation}
                  </p>
                  <p className="mb-2">
                    <strong>Mother's Number:</strong> {motherNumber}
                  </p>
                  <p className="mb-2">
                    <strong>Doctor's Name:</strong> {doctorName}
                  </p>
                  <p className="mb-2">
                    <strong>Surgery Address:</strong> {surgeryAddress}
                  </p>
                  <p className="mb-2">
                    <strong>Surgeon's Number:</strong> {surgeryNumber}
                  </p>
                  <p className="mb-2">
                    <strong>Allergies:</strong> {allergies}
                  </p>
                  <p className="mb-2">
                    <strong>Medical:</strong> {condition}
                  </p>
                  <p className="mb-2">
                    <strong>Starting Date:</strong> {formatDate(startingDate)}
                  </p>
                  <p className="mb-2">
                    <strong>
                      <a
                        href={signature}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Parent's Signature
                      </a>
                    </strong>
                  </p>
                  <p className="mb-2">
                    <strong>
                      <a
                        href={applicationPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Application Form PDF
                      </a>
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* ============ FOOTER (own region) ============ */}
            <div
              className="modal-footer-custom d-flex justify-content-center gap-2"
              style={{
                borderTop: "1px solid #dee2e6",
                background: "#fff",
                padding: "0.75rem 1rem",
                flexShrink: 0,
              }}
            >
              {!["enrolled", "hold"].includes(status) && (
                <button
                  onClick={() => handleStatus("approved")}
                  className="text-success fs-5 py-1 px-3 rounded-2 border"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  <FaCheck />
                </button>
              )}
              {!["enrolled", "hold"].includes(status) && (
                <button
                  onClick={() => handleStatus("rejected")}
                  className="text-danger py-1 px-3 rounded-2 border"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  <ImCross />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
