import React, { useState } from "react";
import { Link } from "react-router";
import AdmissionFeeModal from "../shared/AdmissionFeeModal";
import { useGetApprovedFullFamilyQuery } from "../../redux/features/families/familiesApi";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function ParentDashboard({ family, refetch }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { user, loading } = useAuth();

  const { data: approvedFamily, isLoading: isLoading } =
    useGetApprovedFullFamilyQuery(user?.email, {
      skip: loading || !user?.email, // Prevent fetching until user is fully loaded
    });

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
  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

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
                Department
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Session
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Class
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Time
              </th>

              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Status
              </th>
              {/* <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Actions
              </th> */}
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
                    {student?.academic?.department}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.academic?.session}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {!student?.academic?.class
                      ? "Not Provided Yet"
                      : student?.academic?.class}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.academic?.time}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.status}
                  </td>
                  {/* <td
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
                  </td> */}
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
          childrenDocs={approvedFamily?.childrenDocs}
          admissionFee={admissionFee} // Pass the calculated admission fee
          refetch={refetch}
        ></AdmissionFeeModal>
      </div>
      <h3 className={`fs-1 fw-bold text-center pt-5`}>Action Required</h3>
      {approvedFamily?.childrenDocs?.length > 0 ? (
        <div className="row justify-content-center mt-3">
          <button
            onClick={() => handleShow(approvedFamily?._id)}
            className="col-lg-2 text-white py-1 px-2 rounded-2"
            style={{ backgroundColor: "var(--border2)" }}
          >
            Pay Now
          </button>
          <p className="col-lg-1 d-flex align-items-center justify-content-center">
            or
          </p>
          <button
            // onClick={() => handleShow(student?._id)}
            className="col-lg-2 text-white py-1 px-2 rounded-2"
            style={{ backgroundColor: "var(--border2)" }}
          >
            Pay in the office from the start day
          </button>
          <p className="col-lg-1 d-flex align-items-center justify-content-center">
            or
          </p>
          <button
            // onClick={() => handleShow(student?._id)}
            className="col-lg-2 text-white py-1 px-2 rounded-2"
            style={{ backgroundColor: "var(--border2)" }}
          >
            Pay With Bank <br />
            (within 7 days)
          </button>
          <p className="col-lg-1 d-flex align-items-center justify-content-center">
            or
          </p>
          <button
            // onClick={() => handleShow(student?._id)}
            className="col-lg-2 text-white py-1 px-2 rounded-2"
            style={{ backgroundColor: "var(--border2)" }}
          >
            Pay With Cash / Card Machine (within 7 days)
          </button>
        </div>
      ) : (
        <h3 className="text-danger">No Child is Approved</h3>
      )}
    </div>
  );
}
