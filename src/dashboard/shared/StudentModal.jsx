import React from "react";
import {
  useGetStudentQuery,
  useUpdateStudentStatusMutation,
} from "../../redux/features/students/studentsApi";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";
import { FaCheck, FaCross, FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import sessionMap from "../../utils/sessionMap";
import Swal from "sweetalert2";

// Helper function to get department information with vertical layout
const getDepartmentInfo = (academic, departments = []) => {
  if (!academic) return "Not assigned";

  // Handle new multi-department structure with enrollments array
  if (academic.enrollments && Array.isArray(academic.enrollments)) {
    if (academic.enrollments.length === 0) return "Not assigned";

    // Return array of department info for vertical display
    const departmentList = academic.enrollments.map((enrollment, index) => {
      // Find the actual department name
      const dept = departments.find((d) => d._id === enrollment.dept_id);
      const deptName = dept ? dept.dept_name : "Unknown Department";

      const sessionInfo = enrollment.session
        ? `${enrollment.session} (${enrollment.session_time})`
        : "";
      return {
        name: deptName,
        session: sessionInfo,
        index: index + 1,
      };
    });

    return departmentList;
  }

  // Handle old single department structure
  if (academic.dept_id) {
    const dept = departments.find((d) => d._id === academic.dept_id);
    const deptName = dept ? dept.dept_name : "Unknown Department";

    const sessionInfo = academic.session
      ? `${academic.session} (${academic.time})`
      : "";
    return [
      {
        name: deptName,
        session: sessionInfo,
        index: 1,
      },
    ];
  }

  return [];
};

// Helper function to get class information with vertical layout
const getClassInfo = (academic, classes = []) => {
  if (!academic) return "Not assigned";

  // Handle new multi-department structure with enrollments array
  if (academic.enrollments && Array.isArray(academic.enrollments)) {
    if (academic.enrollments.length === 0) return "Not assigned";

    // Return array of class info for vertical display
    const classList = academic.enrollments.map((enrollment, index) => {
      const cls = classes.find((c) => c._id === enrollment.class_id);
      const className = cls ? cls.class_name : "Unknown Class";

      return {
        name: className,
        index: index + 1,
      };
    });

    return classList;
  }

  // Handle old single department structure
  if (academic.class_id) {
    const cls = classes.find((c) => c._id === academic.class_id);
    const className = cls ? cls.class_name : "Unknown Class";

    return [
      {
        name: className,
        index: 1,
      },
    ];
  }

  return [];
};

export default function StudentModal({ studentId, handleClose, showModal }) {
  const [updateStudentStatus] = useUpdateStudentStatusMutation();

  // Use your existing queries
  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();

  const {
    data: student,
    isLoading,
    isError,
    refetch,
  } = useGetStudentQuery(studentId, {
    skip: !studentId, // avoid fetching if no ID
  });

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
    activity,
    mother,
    father,
    academic,
    medical,
    startingDate,
    signature,
    monthly_fee,
  } = student || {};
  const { doctorName, surgeryAddress, surgeryNumber, allergies, condition } =
    medical || {};
  const {
    name: fatherName,
    occupation: fatherOcc,
    number: fatherNumber,
  } = father || {};

  const { name: motherName, occupation, number: motherNumber } = mother || {};

  const { session, department, time, class: student_class } = academic || {};

  // Get department information using our helper function with actual department names
  const departmentInfo = getDepartmentInfo(academic, departments || []);

  // Get class information using our helper function with actual class names
  const classInfo = getClassInfo(academic, classes || []);

  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  const handleStatus = async (newStatus) => {
    // Updated approval check for multi-department structure
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
      {/* Dark Background (Backdrop) */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        style={{
          display: showModal ? "block" : "none",
          zIndex: 1050,
        }}
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-xl font-bold mb-2">{name && name}</h2>
                <button
                  type="button"
                  className={`btn ${
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
              <div className="d-flex justify-content-center gap-2">
                <div className="flex-grow-1">
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>DOB:</strong> {dob}
                  </p>
                  <p>
                    <strong>Home Address:</strong> {address}
                  </p>
                  <p>
                    <strong>Post Code:</strong> {post_code}
                  </p>
                  <p>
                    <strong>Family Name:</strong> {family_name}
                  </p>
                  <p>
                    <strong>Gender:</strong> {gender}
                  </p>
                  <p>
                    <strong>School Year:</strong> {school_year}
                  </p>
                  <p>
                    <strong>Language:</strong> {language}
                  </p>

                  {/* Updated Department Information with vertical layout */}
                  <div>
                    <strong>Departments:</strong>
                    {Array.isArray(departmentInfo) &&
                    departmentInfo.length > 0 ? (
                      <div className="mt-1">
                        {departmentInfo.map((dept, idx) => (
                          <div key={idx} className="ms-3 text-sm">
                            • {dept.name} - {dept.session}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="ms-2">Not assigned</span>
                    )}
                  </div>

                  {/* Updated Class Information with vertical layout */}
                  <div className="mt-2">
                    <strong>Classes:</strong>
                    {Array.isArray(classInfo) && classInfo.length > 0 ? (
                      <div className="mt-1">
                        {classInfo.map((cls, idx) => (
                          <div key={idx} className="ms-3 text-sm">
                            • {cls.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="ms-2">Not assigned</span>
                    )}
                  </div>

                  <p>
                    <strong>Emergency Number:</strong> {emergency_number}
                  </p>

                  <p>
                    <strong>Monthly Fee:</strong>{" "}
                    {monthly_fee ? `£${monthly_fee}` : "Not Assigned"}
                  </p>
                </div>
                <div className="border-start border-2 ps-2 flex-grow-1">
                  <p>
                    <strong>Father's Name:</strong> {fatherName}
                  </p>
                  <p>
                    <strong>Father's Occupation:</strong> {fatherOcc}
                  </p>
                  <p>
                    <strong>Father's Number:</strong> {fatherNumber}
                  </p>
                  <p>
                    <strong>Mother's Name:</strong> {motherName}
                  </p>
                  <p>
                    <strong>Mother's Occupation:</strong> {occupation}
                  </p>
                  <p>
                    <strong>Mother's Number:</strong> {motherNumber}
                  </p>
                  <p>
                    <strong>Doctor's Name:</strong> {doctorName}
                  </p>
                  <p>
                    <strong>Surgery Address:</strong> {surgeryAddress}
                  </p>
                  <p>
                    <strong>Surgeon's Number:</strong> {surgeryNumber}
                  </p>
                  <p>
                    <strong>Allergies:</strong> {allergies}
                  </p>
                  <p>
                    <strong>Medical :</strong> {condition}
                  </p>

                  <p>
                    <strong>Starting Date:</strong> {startingDate}
                  </p>
                  <p>
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
                </div>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-3">
                {!["enrolled", "hold"].includes(status) && (
                  <button
                    onClick={() => handleStatus("approved")}
                    className="text-success fs-5 py-1 px-2 rounded-2"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    <FaCheck></FaCheck>
                  </button>
                )}
                {!["enrolled", "hold"].includes(status) && (
                  <button
                    onClick={() => handleStatus("rejected")}
                    className="text-danger py-1 px-2 rounded-2"
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
    </div>
  );
}
