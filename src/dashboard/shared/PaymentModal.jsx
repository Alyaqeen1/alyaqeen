import React, { useState } from "react";
import Payments from "../payments/Payments";

export default function PaymentModal({ paymentId, handleClose, showModal }) {
  const [amount, setAmount] = useState("0"); // use string to avoid input reset

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow digits (or empty string)
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

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
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
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
              <div className="mb-3">
                <label className="form-label">Amount to Pay:</label>
                <input
                  style={{ borderColor: "var(--border2)" }}
                  className="form-control bg-light"
                  type="text"
                  name="amount"
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>

              {/* Convert to number if needed in Payments */}
              <Payments
                amount={parseInt(amount || "0", 10)}
                paymentId={paymentId}
                handleClose={handleClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
