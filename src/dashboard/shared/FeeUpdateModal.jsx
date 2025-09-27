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

  const [formData, setFormData] = useState({
    paymentAmount: "",
  });

  // Get current total paid amount
  const getCurrentPaidAmount = () => {
    if (!fee) return 0;

    // For both admission and monthly fees, use the root payments array amount
    if (fee.payments && fee.payments.length > 0) {
      return fee.payments[0].amount || 0;
    }

    return 0;
  };

  // Initialize form data when fee loads - show CURRENT paid amount
  useEffect(() => {
    if (fee) {
      const currentPaidAmount = getCurrentPaidAmount();
      setFormData((prev) => ({
        ...prev,
        paymentAmount:
          currentPaidAmount > 0 ? currentPaidAmount.toFixed(2) : "",
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

    if (!formData.paymentAmount || parseFloat(formData.paymentAmount) < 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (!fee?.students?.length) {
      toast.error("No students found in this fee record");
      return;
    }

    try {
      const newPaymentAmount = parseFloat(formData.paymentAmount);
      const currentPaidAmount = getCurrentPaidAmount();

      // If amount didn't change, no need to update
      if (newPaymentAmount === currentPaidAmount) {
        toast.info("No changes made to the payment amount");
        handleClose();
        return;
      }

      // Get payment period from first student
      const firstStudent = fee.students[0];
      const firstMonth = firstStudent.monthsPaid?.[0] || {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      };

      // Calculate new amount per student
      const totalStudents = fee.students.length;
      const amountPerStudent = newPaymentAmount / totalStudents;

      const payments = fee.students.map((student) => ({
        studentId: student.studentId,
        month: firstMonth.month,
        year: firstMonth.year,
        amount: amountPerStudent,
      }));

      const payload = { payments };

      await updatePayment({ id: feeId, ...payload }).unwrap();

      toast.success(
        `Payment updated from £${currentPaidAmount.toFixed(
          2
        )} to £${newPaymentAmount.toFixed(2)}`
      );
      refetch();
      refetchFee();
      handleClose();

      setFormData({ paymentAmount: "" });
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update payment");
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
    if (!fee?.students?.[0]?.monthsPaid?.[0]) {
      if (
        fee?.paymentType === "admission" ||
        fee?.paymentType === "admissionOnHold"
      ) {
        return "Admission + First Month";
      }
      return "Unknown Period";
    }

    const firstPayment = fee.students[0].monthsPaid[0];
    return `${getMonthName(firstPayment.month)} ${firstPayment.year}`;
  };

  // Calculate current status details
  // const getCurrentPaidAmount = () => {
  //   if (!fee) return 0;

  //   if (fee.payments && fee.payments.length > 0) {
  //     return fee.payments[0].amount || 0;
  //   }

  //   return 0;
  // };

  const currentPaidAmount = getCurrentPaidAmount();
  const expectedTotal = fee?.expectedTotal || 0;
  const remaining = Math.max(0, expectedTotal - currentPaidAmount);

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
              <h5 className="modal-title">
                Edit{" "}
                {fee?.paymentType?.includes("admission")
                  ? "Admission"
                  : "Monthly"}{" "}
                Payment
              </h5>
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
                        <strong>Expected Total:</strong> £
                        {expectedTotal.toFixed(2)}
                      </div>
                      <div className="col-6">
                        <strong>Currently Paid:</strong> £
                        {currentPaidAmount.toFixed(2)}
                      </div>
                      <div className="col-6">
                        <strong>Remaining:</strong> £{remaining.toFixed(2)}
                      </div>
                      <div className="col-6">
                        <strong>Students:</strong> {fee.students?.length || 0}
                      </div>
                      <div className="col-12 mt-2">
                        <strong>Status:</strong>
                        <span
                          className={`badge ms-2 ${
                            remaining <= 0
                              ? "bg-success"
                              : currentPaidAmount > 0
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                        >
                          {remaining <= 0
                            ? "PAID"
                            : currentPaidAmount > 0
                            ? "PARTIAL"
                            : "UNPAID"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Student Summary */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Students ({fee.students?.length})
                    </label>
                    <div
                      className="border rounded p-2 bg-light"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {fee.students?.map((student) => {
                        if (
                          fee.paymentType === "admission" ||
                          fee.paymentType === "admissionOnHold"
                        ) {
                          return (
                            <div key={student.studentId} className="small mb-1">
                              <strong>{student.name}</strong> - Paid: £
                              {(student.subtotal || 0).toFixed(2)}
                            </div>
                          );
                        } else {
                          const monthPaid = student.monthsPaid?.[0];
                          return (
                            <div key={student.studentId} className="small mb-1">
                              <strong>{student.name}</strong> - Paid: £
                              {(monthPaid?.paid || 0).toFixed(2)}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  {/* Payment Edit Section */}
                  <div className="mb-3">
                    <label htmlFor="paymentAmount" className="form-label">
                      Update Payment Amount (£)
                    </label>
                    <input
                      type="number"
                      id="paymentAmount"
                      name="paymentAmount"
                      className="form-control"
                      value={formData.paymentAmount}
                      onChange={handleInputChange}
                      min="0"
                      max={expectedTotal}
                      step="0.01"
                      placeholder="Enter corrected payment amount"
                      required
                    />
                    <small className="text-muted">
                      Current: £{currentPaidAmount.toFixed(2)} | Maximum: £
                      {expectedTotal.toFixed(2)} (expected total)
                      {fee.students?.length > 1 &&
                        ` - £${(expectedTotal / fee.students.length).toFixed(
                          2
                        )} per student`}
                    </small>
                  </div>

                  <div className="alert alert-info">
                    <small>
                      <strong>Note:</strong> This will update the payment
                      amount. The system will automatically recalculate the
                      status and remaining balance.
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
                      disabled={
                        isUpdating ||
                        !formData.paymentAmount ||
                        parseFloat(formData.paymentAmount) < 0 ||
                        parseFloat(formData.paymentAmount) === currentPaidAmount
                      }
                    >
                      {isUpdating ? "Updating..." : "Update Payment"}
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
