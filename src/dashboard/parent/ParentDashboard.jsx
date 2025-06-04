import React, { useState } from "react";
import { Link } from "react-router";
import AdmissionFeeModal from "../shared/AdmissionFeeModal";

export default function ParentDashboard({ family, refetch }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const handleShow = (id) => {
    setSelectedStudentId(id);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);
  // Total number of students approved (for discount logic)
  const approvedStudentsCount =
    family?.childrenDocs?.filter(
      (child) => child.status === "approved" || child.status === "enrolled"
    )?.length || 0;

  // Calculate admission fee per student based on discount logic
  const getAdmissionFee = () => {
    const baseFee = 20;
    const discount = approvedStudentsCount > 2 ? 0.1 : 0;
    return baseFee - baseFee * discount;
  };

  const admissionFee = getAdmissionFee();

  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center pt-5`}>
        Students Linked With this account
      </h3>{" "}
      <div className="table-responsive mb-3">
        <table
          className="table mb-0"
          style={{
            minWidth: 700,
          }}
        >
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
                Student Name
              </th>

              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Date of Birth
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Gender
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                School Year
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Status
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {family?.childrenDocs?.length > 0 ? (
              family?.childrenDocs?.map((student, idx) => (
                <tr key={student?._id}>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {idx + 1}
                  </td>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.name}
                  </td>

                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.dob}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.gender}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.school_year}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.status}
                  </td>
                  <td
                    className={`border d-flex gap-2 justify-content-center h6 text-center align-middle text-nowrap`}
                  >
                    {student?.status === "approved" ? (
                      <button
                        onClick={() => handleShow(student?._id)}
                        className="text-white py-1 px-2 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
                      >
                        Pay Admission Fee
                      </button>
                    ) : student?.status === "enrolled" ? (
                      <button
                        disabled
                        className="text-white py-1 px-2 rounded-2 opacity-50 cursor-not-allowed"
                        style={{
                          backgroundColor: "var(--border2)",
                          cursor: "not-allowed",
                        }}
                      >
                        Admission Fee Paid
                      </button>
                    ) : (
                      <button
                        disabled
                        className="text-white py-1 px-2 rounded-2 opacity-50 cursor-not-allowed"
                        style={{
                          backgroundColor: "var(--border2)",
                          cursor: "not-allowed",
                        }}
                      >
                        Pay Admission Fee
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12}>
                  <h5>No students available.</h5>
                </td>
              </tr>
            )}
            {}
          </tbody>
        </table>
        <AdmissionFeeModal
          uid={selectedStudentId}
          showModal={showModal}
          handleClose={handleClose}
          admissionFee={admissionFee} // Pass the calculated admission fee
          refetch={refetch}
        ></AdmissionFeeModal>
      </div>
    </div>
  );
}
