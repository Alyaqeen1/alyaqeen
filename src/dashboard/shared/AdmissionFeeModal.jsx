import React from "react";
import Payments from "../payments/Payments";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdmissionFeeModal({
  familyId,
  showModal,
  paymentDetails,
  handleClose,
  approvedFamily,
  refetch,
}) {
  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  // Initial values
  let admissionFeeTotal = 0;
  let monthlyFeeTotal = 0;
  let grandTotal = 0;
  const approvedStudents = approvedFamily?.childrenDocs?.filter(
    (student) => student.status === "approved"
  );

  // if (!approvedStudents || approvedStudents.length === 0) {
  //   return Swal.fire("No approved students to process", "", "info");
  // }

  // In AdmissionFeeModal.jsx - update the feeDetails calculation
  const feeDetails = approvedStudents.map((student, index) => {
    const startDate = new Date(student.startingDate);
    const joinDate = startDate.getDate();
    const joiningMonth = startDate.getMonth() + 1;
    const joiningYear = startDate.getFullYear();

    const baseAdmissionFee = 20;
    const isThirdOrLaterStudent = index >= 2;
    const studentAdmissionFee = isThirdOrLaterStudent
      ? baseAdmissionFee * 0.9
      : baseAdmissionFee;

    const monthlyFee = student.monthly_fee || 0;
    let adjustedMonthlyFee = monthlyFee;

    if (approvedFamily.feeChoice === "proRated" && joinDate > 10) {
      if (joinDate <= 20) {
        adjustedMonthlyFee = (2 / 3) * monthlyFee;
      } else {
        adjustedMonthlyFee = (1 / 3) * monthlyFee;
      }
    }

    const subtotal = studentAdmissionFee + adjustedMonthlyFee;

    return {
      studentId: student._id, // ✅ Add studentId
      name: student.name,
      admissionFee: studentAdmissionFee,
      monthlyFee: adjustedMonthlyFee,
      discountedFee: adjustedMonthlyFee, // ✅ Add discountedFee
      subtotal,
      joiningMonth, // ✅ Add joiningMonth
      joiningYear, // ✅ Add joiningYear
    };
  });
  admissionFeeTotal = feeDetails.reduce(
    (sum, child) => sum + child.admissionFee,
    0
  );
  monthlyFeeTotal = feeDetails.reduce(
    (sum, child) => sum + child.monthlyFee,
    0
  );
  grandTotal = admissionFeeTotal + monthlyFeeTotal;

  return (
    <div>
      {showModal && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        aria-hidden={!showModal}
        style={{ display: showModal ? "block" : "none", zIndex: 1050 }}
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Pay Fees</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body p-4">
              <h5>Per Child Fee Details</h5>
              <table className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th>Child Name</th>
                    <th>Admission Fee (£)</th>
                    <th>Monthly Fee (£)</th>
                    <th>Subtotal (£)</th>
                  </tr>
                </thead>
                <tbody>
                  {feeDetails.map((child, idx) => (
                    <tr key={idx}>
                      <td>{child.name}</td>
                      <td>{child.admissionFee.toFixed(2)}</td>
                      <td>{child.monthlyFee.toFixed(2)}</td>
                      <td>{child.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-end mt-2">
                <strong>Grand Total: £{grandTotal.toFixed(2)}</strong>
              </div>

              <div className="row mt-3">
                <div className="mb-3 col-6">
                  <label className="form-label">Admission Fees:</label>
                  <input
                    className="form-control bg-light"
                    type="text"
                    value={admissionFeeTotal.toFixed(2)}
                    disabled
                  />
                </div>
                <div className="mb-3 col-6">
                  <label className="form-label">Monthly Fee:</label>
                  <input
                    className="form-control bg-light"
                    type="text"
                    value={monthlyFeeTotal.toFixed(2)}
                    disabled
                  />
                </div>
                <div className="mb-3 col-12">
                  <label className="form-label">Total Fee:</label>
                  <input
                    className="form-control bg-light"
                    type="text"
                    value={grandTotal.toFixed(2)}
                    disabled
                  />
                </div>
              </div>

              <Payments
                familyId={familyId}
                amount={Math.round(grandTotal)}
                paymentDetails={paymentDetails}
                handleClose={handleClose}
                paymentType="admission"
                refetch={refetch}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
