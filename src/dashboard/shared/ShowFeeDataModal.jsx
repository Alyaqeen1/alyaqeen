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
import { useGetFeeQuery } from "../../redux/features/fees/feesApi";
export default function ShowFeeDataModal({ feeId, handleClose, showModal }) {
  const { data: fee } = useGetFeeQuery(feeId, {
    skip: !feeId, // avoid fetching if no ID
  });
  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  console.log(fee, feeId);
  if (!showModal) return null;

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
            <div className="modal-header">
              <h5 className="modal-title">Payment Details- {fee?.name}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <table
                className="table table-bordered table-responsive"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#444", color: "#fff" }}>
                    <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                      Student Name
                    </th>
                    <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                      Month Paid
                    </th>
                    <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                      Monthly Fee
                    </th>
                    <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                      Discounted Fee
                    </th>
                    <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fee?.students?.map((student, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                        {student?.name}
                      </td>
                      <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                        {student?.monthsPaid?.map((data, idx) => (
                          <span key={idx}>
                            {data?.month} - {data?.year}
                            <br />
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                        {/* {enrolledFamily?.discount ?? 0}% */}
                        {student?.monthsPaid?.map((data, idx) => (
                          <span key={idx}>
                            {data?.monthlyFee}
                            <br />
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                        {student?.monthsPaid?.map((data, idx) => (
                          <span key={idx}>
                            {data?.discountedFee}
                            <br />
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                        {student?.subtotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
