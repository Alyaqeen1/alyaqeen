import React from "react";
import {
  useGetStudentQuery,
  useUpdateStudentStatusMutation,
} from "../../redux/features/students/studentsApi";
import { FaCheck, FaCross, FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
export default function StudentModal({ studentId, handleClose, showModal }) {
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
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

    student_age,
    family_name,
    activity,
    mother,
    father,
    academic,
    medical,
    startingDate,
    signature,
    parent_email,
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

  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };
  const handleStatus = async (newStatus) => {
    if (newStatus === "approved" && !student_class) {
      Swal.fire({
        icon: "warning",
        title: "Assign a class first!",
        text: "You must assign a class before approving the student.",
      });
      return;
    }

    try {
      // const { data } = await axiosPublic.patch(`/students/${studentId}`, {
      //   status: newStatus,
      // });
      await updateStudentStatus({ id: studentId, status: newStatus });

      // if (data.modifiedCount) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Student ${newStatus} successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    } catch (err) {
      // }
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
        onMouseDown={handleBackdropClick} // Detect click outside
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-xl font-bold mb-2">{name && name}</h2>
                <button
                  type="button"
                  className={`btn  ${
                    status === "under review" && "btn-primary"
                  } ${status === "approved" && "btn-success"} ${
                    status === "rejected" && "btn-danger"
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
                    <strong>Student Age:</strong> {student_age}
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

                  <p>
                    <strong>department:</strong> {department}
                  </p>
                  <p>
                    <strong>Session:</strong> {session}
                  </p>
                  <p>
                    <strong>Session Time:</strong> {time}
                  </p>
                  <p>
                    <strong>Parent Email:</strong> {parent_email}
                  </p>
                  <p>
                    <strong>Emergency Number:</strong> {emergency_number}
                  </p>
                  <p>
                    <strong>
                      Class:{" "}
                      {student_class === null ? "Not Provided" : student_class}
                    </strong>
                  </p>
                  <p>
                    <strong>Monthly Fee:</strong>{" "}
                    {monthly_fee ? monthly_fee : "Not Assigned"}
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
                      <a href={signature}>Parent's Signature</a>
                    </strong>
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <button
                  onClick={() => handleStatus("approved")}
                  className="text-success fs-5 py-1 px-2 rounded-2"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  <FaCheck></FaCheck>
                </button>
                <button
                  onClick={() => handleStatus("rejected")}
                  className="text-danger py-1 px-2 rounded-2"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  <ImCross />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
