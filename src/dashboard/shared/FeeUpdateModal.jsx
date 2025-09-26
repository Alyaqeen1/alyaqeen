import React, { useState, useEffect } from "react";
import {
  useGetFeeQuery,
  useUpdateFeeMutation,
  useUpdatePaymentMutation,
} from "../../redux/features/fees/feesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import toast from "react-hot-toast";

export default function FeeUpdateModal({
  feeId,
  handleClose,
  showModal,
  refetch,
}) {
  const {
    data: fee,
    isLoading,
    refetch: refetchFee,
  } = useGetFeeQuery(feeId, {
    skip: !feeId,
  });

  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

  // Simple form state - let backend handle calculations
  const [formData, setFormData] = useState({
    paymentAmount: "",
  });

  // Initialize form data when fee loads
  useEffect(() => {
    if (fee) {
      // Pre-fill with remaining amount as default payment
      setFormData((prev) => ({
        ...prev,
        paymentAmount: fee?.payments?.[0]?.amount,
      }));
    }
  }, [fee]);

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paymentAmount || formData.paymentAmount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (!fee?.students?.[0]?.monthsPaid?.[0]) {
      toast.error("No student payment period found");
      return;
    }

    try {
      const firstStudent = fee.students[0];
      const firstMonth = firstStudent.monthsPaid[0] || {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      };

      const payload = {
        payments: [
          {
            studentId: firstStudent.studentId,
            month: firstMonth.month,
            year: firstMonth.year,
            amount: parseFloat(formData.paymentAmount),
            // method and date are optional
          },
        ],
      };

      await updatePayment({ id: feeId, ...payload }).unwrap();

      toast.success("Payment recorded successfully");
      refetch();
      refetchFee();
      handleClose();

      setFormData({ paymentAmount: "" });
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to record payment");
    }
  };

  // Month names for display
  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = parseInt(monthNumber) - 1;
    return months[monthIndex] || "Unknown Month";
  };

  // Get payment period from first student
  const getPaymentPeriod = () => {
    if (!fee?.students?.[0]?.monthsPaid?.[0]) return "Unknown Period";

    const firstPayment = fee.students[0].monthsPaid[0];
    return `${getMonthName(firstPayment.month)} ${firstPayment.year}`;
  };

  if (isLoading) {
    return (
      showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body text-center py-4">
                  <LoadingSpinnerDash />
                </div>
              </div>
            </div>
          </div>
        </>
      )
    );
  }

  return (
    <>
      {showModal && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Record Additional Payment</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              {fee ? (
                <form onSubmit={handleSubmit}>
                  {/* Fee Information Summary */}
                  <div className="alert alert-light border">
                    <div className="row small">
                      <div className="col-12 mb-2">
                        <strong>Family:</strong> {fee.name}
                      </div>
                      <div className="col-6">
                        <strong>Period:</strong> {getPaymentPeriod()}
                      </div>
                      <div className="col-6">
                        <strong>Type:</strong> {fee.paymentType || "Monthly"}
                      </div>
                      <div className="col-6">
                        <strong>Expected:</strong> £
                        {fee.expectedTotal?.toFixed(2)}
                      </div>
                      <div className="col-6">
                        <strong>Remaining:</strong> £{fee.remaining?.toFixed(2)}
                      </div>
                      <div className="col-12 mt-2">
                        <strong>Status:</strong>
                        <span
                          className={`badge ms-2 ${
                            fee.status === "paid"
                              ? "bg-success"
                              : fee.status === "partial"
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                        >
                          {fee.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Student Summary */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Students</label>
                    <div className="border rounded p-2 bg-light">
                      {fee.students?.map((student, index) => {
                        const monthPaid = student.monthsPaid?.[0];
                        return (
                          <div key={student.studentId} className="small mb-1">
                            <strong>{student.name}</strong> - Paid: £
                            {monthPaid?.paid?.toFixed(2) || "0.00"}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="mb-3">
                    <label htmlFor="paymentAmount" className="form-label">
                      Payment Amount (£)
                    </label>
                    <input
                      type="number"
                      id="paymentAmount"
                      name="paymentAmount"
                      className="form-control"
                      value={formData.paymentAmount}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="Enter payment amount"
                      required
                    />
                    <small className="text-muted">
                      Remaining balance: £{fee.remaining?.toFixed(2)}
                    </small>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Processing..." : "Record Payment"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p>Fee data not found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
