import React from "react";
import Payments from "../payments/Payments";

export default function MonthlyFeeModal({
  familyId,
  showModal,
  handleClose,
  paymentDetails,
  unpaidRows,
  enrolledFamily,
  refetch,
}) {
  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };
  const grandTotal = unpaidRows.reduce((acc, row) => acc + row.totalAmount, 0);
  console.log(paymentDetails);

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
              <h5 className="modal-title">Pay Monthly Fees</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body p-4">
              <h5>Per Child Fee Details</h5>
              <div className="table-responsive">
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
                        Month
                      </th>
                      <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                        Discount
                      </th>
                      <th style={{ padding: "6px", border: "1px solid #ccc" }}>
                        Total Amount ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidRows?.map((row, idx) => (
                      <tr key={idx}>
                        <td
                          style={{ padding: "6px", border: "1px solid #ccc" }}
                        >
                          {row?.studentNames}
                        </td>
                        <td
                          style={{ padding: "6px", border: "1px solid #ccc" }}
                        >
                          {row?.month}
                        </td>
                        <td
                          style={{ padding: "6px", border: "1px solid #ccc" }}
                        >
                          {enrolledFamily?.discount ?? 0}%
                        </td>
                        <td
                          style={{ padding: "6px", border: "1px solid #ccc" }}
                        >
                          {row?.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Optional grand total if needed later */}

              <div
                style={{
                  textAlign: "right",
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                Grand Total: ${grandTotal.toFixed(2)}
              </div>

              <div className="row mt-3">
                <div className="mb-3 col-12">
                  <label className="form-label">Monthly Total Due Fee:</label>
                  <input
                    className="form-control bg-light"
                    type="text"
                    value={grandTotal.toFixed(2)}
                    disabled
                  />
                </div>
              </div>

              {/* Future Payment Integration */}

              <Payments
                familyId={familyId}
                amount={Math.round(grandTotal)}
                paymentDetails={paymentDetails}
                handleClose={handleClose}
                paymentType="monthly"
                refetch={refetch}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
