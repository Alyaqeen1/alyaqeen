import React, { useState } from "react";
import Payments from "../payments/Payments";
import feeStructure from "../../utils/feeStructure";
import toast from "react-hot-toast";
// import feeStructure from "../feeStructure"; // adjust path if needed

export default function AdmissionFeeModal({
  uid,
  showModal,
  handleClose,
  childrenDocs,
  refetch,
}) {
  const [amount, setAmount] = useState("0"); // use string to avoid input reset

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  // Fee Calculation Function
  const calculateTotalFee = (childrenDocs) => {
    let admissionFeeTotal = 0;
    let firstMonthFeeTotal = 0;
    const feeDetails = [];

    childrenDocs.forEach((child, index) => {
      // Admission Fee Calculation
      let admissionFee = feeStructure?.admissionFee;
      if (index >= feeStructure?.discountOnAdmission?.threshold) {
        admissionFee -=
          (admissionFee * feeStructure?.discountOnAdmission?.percentage) / 100;
      }
      admissionFeeTotal += admissionFee;

      // First Month Fee Calculation
      const department = child?.academic?.department;
      const session = child?.academic?.session.toLowerCase(); // 'weekend' or 'weekday'
      const feeData = feeStructure?.monthlyFees[department];

      let monthlyFee = 0;
      if (feeData) {
        monthlyFee =
          session === "weekend" ? feeData.weekends : feeData.weekdays;
        firstMonthFeeTotal += monthlyFee;
      } else {
        toast.error(`No fee data for department: ${department}`);
      }

      feeDetails.push({
        name: child?.name,
        admissionFee,
        monthlyFee,
        subtotal: admissionFee + monthlyFee,
      });
    });

    const totalFee = admissionFeeTotal + firstMonthFeeTotal;

    return {
      admissionFeeTotal,
      firstMonthFeeTotal,
      totalFee,
      feeDetails,
    };
  };

  const { admissionFeeTotal, firstMonthFeeTotal, totalFee, feeDetails } =
    calculateTotalFee(childrenDocs);

  return (
    <div>
      {/* Backdrop */}
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
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Pay Fees</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4">
              <h5>Per Child Fee Details</h5>
              <table className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th>Child Name</th>
                    <th>Admission Fee ($)</th>
                    <th>Monthly Fee ($)</th>
                    <th>Subtotal ($)</th>
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
              {/* Grand Total Calculation & Display */}
              <div className="text-end mt-2">
                <strong>
                  Grand Total: $
                  {feeDetails
                    .reduce((acc, curr) => acc + curr.subtotal, 0)
                    .toFixed(2)}
                </strong>
              </div>
              {/* <div>
                <p>
                  {childrenDocs.length} child
                  {childrenDocs.length > 1 ? "ren" : ""} Admission Fee: $
                  {admissionFeeTotal}
                </p>
                <p>
                  {childrenDocs.length} child
                  {childrenDocs.length > 1 ? "ren" : ""} First Month Fee: $
                  {firstMonthFeeTotal}
                </p>
              </div> */}
              <div className="row">
                <div className="mb-3 col-6">
                  <label className="form-label">Admission Fees:</label>
                  <input
                    style={{ borderColor: "var(--border2)" }}
                    className="form-control bg-light"
                    type="text"
                    value={admissionFeeTotal}
                    disabled
                  />
                </div>
                <div className="mb-3 col-6">
                  <label className="form-label">Monthly Fee:</label>
                  <input
                    style={{ borderColor: "var(--border2)" }}
                    className="form-control bg-light"
                    type="text"
                    value={firstMonthFeeTotal}
                    disabled
                  />
                </div>
                <div className="mb-3 col-12">
                  <label className="form-label">Total Fee:</label>
                  <input
                    style={{ borderColor: "var(--border2)" }}
                    className="form-control bg-light"
                    type="text"
                    value={totalFee}
                    disabled
                  />
                </div>
              </div>
              {/* Payments Component */}
              <Payments
                uid={uid}
                amount={parseInt(totalFee)}
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
