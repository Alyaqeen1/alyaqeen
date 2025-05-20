import React from "react";
import { useGetStudentQuery } from "../../redux/features/students/studentsApi";
import { FaCheck, FaCross, FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
export default function StudentModal({ studentId, handleClose, showModal }) {
  const {
    data: student,
    isLoading,
    isError,
  } = useGetStudentQuery(studentId, {
    skip: !studentId, // avoid fetching if no ID
  });
  console.log(student);

  const {
    name,
    email,
    dob,
    gender,
    schoolYear,
    language,
    parent,
    mother,
    father,
    academic,
    medical,
    startingDate,
    signature,
  } = student || {};
  const { doctorName, surgeryAddress, surgeryNumber, allergies, condition } =
    medical || {};
  const {
    name: fatherName,
    occupation: fatherOcc,
    number: fatherNumber,
  } = father || {};

  const { name: motherName, occupation, number: motherNumber } = mother || {};
  const {
    name: parentName,
    email: parentEmail,
    number,
    emergencyNumber,
  } = parent || {};

  const {
    previousInstitute,
    department,
    time,
    class: studentClass,
  } = academic || {};

  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };
  if (!showModal) return null;
  if (isLoading) return <div>Loading...</div>;
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
              <h2 className="text-xl font-bold mb-2">{name && name}</h2>
              <div className="d-flex justify-content-center gap-2">
                <div className="flex-grow-1">
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>DOB:</strong> {dob}
                  </p>
                  <p>
                    <strong>Gender:</strong> {gender}
                  </p>
                  <p>
                    <strong>School Year:</strong> {schoolYear}
                  </p>
                  <p>
                    <strong>Language:</strong> {language}
                  </p>
                  <p>
                    <strong>Previous Institute:</strong> {previousInstitute}
                  </p>
                  <p>
                    <strong>department:</strong> {department}
                  </p>
                  <p>
                    <strong>Session Time:</strong> {time}
                  </p>
                  <p>
                    <strong>Parent Name:</strong> {parentName}
                  </p>
                  <p>
                    <strong>Parent Email:</strong> {parentEmail}
                  </p>
                  <p>
                    <strong>Student Number:</strong> {number}
                  </p>
                  <p>
                    <strong>Emergency Number:</strong> {emergencyNumber}
                  </p>
                  <p>
                    <strong>
                      Class:{" "}
                      {studentClass === null ? "Not Provided" : studentClass}
                    </strong>
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
                  className="text-success fs-5 py-1 px-2 rounded-2"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  <FaCheck></FaCheck>
                </button>
                <button
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
