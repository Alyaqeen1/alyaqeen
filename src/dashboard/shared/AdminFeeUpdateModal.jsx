import React, { useState, useMemo, useEffect } from "react";
import {
  useGetFeesByFeeIdQuery,
  useUpdateFeeMutation,
} from "../../redux/features/fees/feesApi";
import toast from "react-hot-toast";

export default function AdminFeeUpdateModal({
  feeId,
  month, // This should be the target month (e.g., "09")
  year, // This should be the target year (e.g., 2025)
  handleAdminClose,
  adminShowModal,
}) {
  const { data: fee, refetch: refetchFee } = useGetFeesByFeeIdQuery(feeId, {
    skip: !feeId,
    refetchOnMountOrArgChange: true,
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [payNow, setPayNow] = useState("");
  const [feeMethod, setFeeMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const [updateFee] = useUpdateFeeMutation();

  // Determine fee type and calculate unpaid amounts accordingly
  const { unpaidStudents, totalDueAmount, isAdmissionFee, targetMonthYear } =
    useMemo(() => {
      if (!fee?.students)
        return {
          unpaidStudents: [],
          totalDueAmount: 0,
          isAdmissionFee: false,
          targetMonthYear: "",
        };

      const isAdmission =
        fee.paymentType === "admission" ||
        fee.paymentType === "admissionOnHold";

      // Use the provided month and year, or default to current
      const targetMonth = month || new Date().getMonth() + 1;
      const targetYear = year || new Date().getFullYear();
      const targetMonthYear = `${targetYear}-${String(targetMonth).padStart(
        2,
        "0"
      )}`;

      let totalDue = 0;
      const unpaid = fee.students
        .map((student) => {
          if (isAdmission) {
            // Admission logic remains
          } else {
            const monthRecord = student.monthsPaid?.find(
              (m) =>
                String(m.month).padStart(2, "0") ===
                  String(targetMonth).padStart(2, "0") && m.year === targetYear
            );
            const monthlyFee = student.monthlyFee || 50;
            const discountedFee =
              student.discountedFee || monthRecord?.discountedFee || monthlyFee;
            const paidAmount = monthRecord?.paid || 0;
            const dueAmount = Math.max(0, discountedFee - paidAmount);

            return {
              studentId: student.studentId,
              name: student.name,
              paidAmount,
              dueAmount,
              monthlyFee,
              discountedFee,
              paymentType: "monthly",
              targetMonth: String(targetMonth).padStart(2, "0"),
              targetYear,
            };
          }
        })
        .filter((s) => s.dueAmount > 0);

      return {
        unpaidStudents: unpaid,
        totalDueAmount: totalDue,
        isAdmissionFee: isAdmission,
        targetMonthYear,
      };
    }, [fee, month, year]);

  // Auto-select all unpaid students and set default payment amount
  useEffect(() => {
    if (unpaidStudents.length > 0) {
      setSelectedStudents(unpaidStudents.map((s) => s.studentId));
      setPayNow(totalDueAmount > 0 ? totalDueAmount.toFixed(2) : "");
    } else {
      setSelectedStudents([]);
      setPayNow("");
    }
  }, [unpaidStudents, totalDueAmount]);

  // Update payNow when selection changes
  useEffect(() => {
    if (selectedStudents.length > 0) {
      const selectedUnpaidStudents = unpaidStudents.filter((s) =>
        selectedStudents.includes(s.studentId)
      );
      const totalSelectedDue = selectedUnpaidStudents.reduce(
        (sum, student) => sum + student.dueAmount,
        0
      );
      setPayNow(totalSelectedDue > 0 ? totalSelectedDue.toFixed(2) : "");
    } else {
      setPayNow("");
    }
  }, [selectedStudents, unpaidStudents]);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAllStudents = () => {
    if (selectedStudents.length === unpaidStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(unpaidStudents.map((s) => s.studentId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudents.length || !payNow || !feeMethod) {
      toast.error("Please fill all required fields");
      return;
    }

    const paymentAmount = Number(payNow);
    if (paymentAmount <= 0) {
      toast.error("Payment amount must be greater than 0");
      return;
    }

    setIsProcessing(true);

    try {
      const updateData = {
        id: feeId,
        partialAmount: paymentAmount,
        partialMethod: feeMethod,
        partialDate: paymentDate,
        studentIds: selectedStudents,
      };

      // Add month/year for both admission and monthly fees (needed for backend)
      if (month && year) {
        updateData.month = month;
        updateData.year = year;
      } else {
        // Fallback to current month/year if not provided
        const currentDate = new Date();
        updateData.month = String(currentDate.getMonth() + 1).padStart(2, "0");
        updateData.year = currentDate.getFullYear();
      }

      const result = await updateFee(updateData).unwrap();
      toast.success("Payment recorded successfully");
      await refetchFee();
      handleAdminClose();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err?.data?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedUnpaidStudents = unpaidStudents.filter((s) =>
    selectedStudents.includes(s.studentId)
  );
  const totalSelectedDue = selectedUnpaidStudents.reduce(
    (sum, student) => sum + student.dueAmount,
    0
  );

  // Helper function to get month name
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
    return months[parseInt(monthNumber) - 1] || monthNumber;
  };

  return (
    <>
      {adminShowModal && <div className="modal-backdrop fade show"></div>}
      <div
        className={`modal fade ${adminShowModal ? "show" : ""}`}
        style={{ display: adminShowModal ? "block" : "none", zIndex: 1050 }}
        onClick={(e) =>
          e.target.classList.contains("modal") && handleAdminClose()
        }
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title">
                Record {isAdmissionFee ? "Admission" : "Monthly"} Payment
                {!isAdmissionFee && targetMonthYear && (
                  <span className="text-muted fs-6 ms-2">
                    ({getMonthName(month)} {year})
                  </span>
                )}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleAdminClose}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Payment Summary */}
                <div className="alert alert-info">
                  <div className="row">
                    <div className="col-md-3">
                      <strong>Fee Type:</strong>{" "}
                      {isAdmissionFee ? "Admission" : "Monthly"}
                    </div>
                    <div className="col-md-3">
                      <strong>Expected Total:</strong> £
                      {fee?.expectedTotal?.toFixed(2) || "0.00"}
                    </div>
                    <div className="col-md-3">
                      <strong>Total Paid:</strong> £
                      {(
                        (fee?.expectedTotal || 0) - (fee?.remaining || 0)
                      )?.toFixed(2) || "0.00"}
                    </div>
                    <div className="col-md-3">
                      <strong>Remaining:</strong> £
                      {(fee?.remaining || 0)?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                  {!isAdmissionFee && targetMonthYear && (
                    <div className="row mt-2">
                      <div className="col-12">
                        <strong>Target Month:</strong> {getMonthName(month)}{" "}
                        {year}
                      </div>
                    </div>
                  )}
                </div>

                {/* Family Info */}
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label fw-semibold">
                    Family Name
                  </label>
                  <div className="col-sm-8 pt-2">{fee?.name || "-"}</div>
                </div>

                {/* Students Selection */}
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label fw-semibold">
                    Students to Pay For
                    {!isAdmissionFee && (
                      <div className="text-muted fw-normal fs-7">
                        For {getMonthName(month)} {year}
                      </div>
                    )}
                  </label>
                  <div className="col-sm-8">
                    {unpaidStudents.length > 0 ? (
                      <div className="border rounded p-2">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="selectAllStudents"
                            checked={
                              selectedStudents.length ===
                                unpaidStudents.length &&
                              unpaidStudents.length > 0
                            }
                            onChange={toggleAllStudents}
                            disabled={unpaidStudents.length === 0}
                          />
                          <label
                            className="form-check-label fw-bold"
                            htmlFor="selectAllStudents"
                          >
                            Select All Unpaid Students ({unpaidStudents.length})
                          </label>
                        </div>
                        <hr className="my-1" />
                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                          {unpaidStudents.map((student) => (
                            <div key={student.studentId} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`student-${student.studentId}`}
                                checked={selectedStudents.includes(
                                  student.studentId
                                )}
                                onChange={() =>
                                  handleStudentSelection(student.studentId)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`student-${student.studentId}`}
                              >
                                {student.name} - Paid: £
                                {student.paidAmount.toFixed(2)} | Due: £
                                {student.dueAmount.toFixed(2)}
                                {!isAdmissionFee && (
                                  <span className="text-muted">
                                    {" "}
                                    (Monthly: £{student.monthlyFee.toFixed(2)})
                                  </span>
                                )}
                              </label>
                            </div>
                          ))}
                        </div>
                        {selectedStudents.length > 0 && (
                          <div className="mt-2 p-2 bg-light rounded">
                            <small>
                              <strong>Selected:</strong>{" "}
                              {selectedStudents.length} student(s) |
                              <strong> Total Due for Selected:</strong> £
                              {totalSelectedDue.toFixed(2)}
                            </small>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="alert alert-success p-2">
                        {isAdmissionFee
                          ? "All students are fully paid for admission."
                          : `All students are fully paid for ${getMonthName(
                              month
                            )} ${year}.`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rest of the form remains the same */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Payment Method
                      </label>
                      <select
                        className="form-select"
                        value={feeMethod}
                        onChange={(e) => setFeeMethod(e.target.value)}
                        required
                      >
                        <option value="">Select Method</option>
                        <option value="bank transfer">Bank Transfer</option>
                        <option value="cash or card machine">
                          Cash Payment at Office
                        </option>
                        <option value="office payment">
                          Card Machine at Office
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Payment Amount £
                    <span className="text-muted fw-normal">
                      {" "}
                      (Total for {selectedStudents.length} selected students)
                    </span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter total payment amount"
                    value={payNow}
                    onChange={(e) => setPayNow(e.target.value)}
                    min="0"
                    max={totalSelectedDue}
                    step="0.01"
                    required
                  />
                  <small className="text-muted">
                    Maximum: £{totalSelectedDue.toFixed(2)} (total due for{" "}
                    {selectedStudents.length} selected students)
                  </small>
                </div>

                {isAdmissionFee && (
                  <div className="alert alert-warning">
                    <small>
                      <strong>Admission Fee Note:</strong> This payment will be
                      applied to the admission fee balance. Admission fee
                      includes £20 admission + first month's fee.
                    </small>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAdminClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={
                    isProcessing ||
                    !selectedStudents.length ||
                    !payNow ||
                    !feeMethod
                  }
                >
                  {isProcessing ? "Processing..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
