import React, { useState, useMemo, useEffect } from "react";
import {
  useGetFeesByFeeIdQuery,
  useUpdateFeeMutation,
} from "../../redux/features/fees/feesApi";
import toast from "react-hot-toast";

export default function AdminFeeUpdateModal({
  feeId,
  month,
  handleAdminClose,
  adminShowModal,
}) {
  const { data: fee, refetch: refetchFee } = useGetFeesByFeeIdQuery(feeId, {
    skip: !feeId,
    refetchOnMountOrArgChange: true,
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [payNow, setPayNow] = useState("");
  const [feeMonth, setFeeMonth] = useState(month || "");
  const [feeMethod, setFeeMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [feeYear, setFeeYear] = useState(new Date().getFullYear());
  const [feeType, setFeeType] = useState("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const [updateFee] = useUpdateFeeMutation();

  // Calculate unpaid students and total due amount
  const { unpaidStudents, totalDueAmount } = useMemo(() => {
    if (!fee?.students || !feeMonth)
      return { unpaidStudents: [], totalDueAmount: 0 };

    let totalDue = 0;
    const unpaid = fee.students
      .map((student) => {
        const monthRecord = student.monthsPaid?.find(
          (m) => m.month === feeMonth && m.year === feeYear
        );
        const monthlyFee = monthRecord?.monthlyFee || 50;
        const discountedFee = monthRecord?.discountedFee || monthlyFee;
        const paidAmount = monthRecord?.paid || 0;
        const dueAmount = Math.max(0, discountedFee - paidAmount);

        totalDue += dueAmount;

        return {
          studentId: student.studentId,
          name: student.name,
          paidAmount,
          dueAmount,
          monthlyFee,
          discountedFee,
        };
      })
      .filter((s) => s.dueAmount > 0);

    return { unpaidStudents: unpaid, totalDueAmount: totalDue };
  }, [fee, feeMonth, feeYear]);

  // Auto-select all unpaid students and set default payment amount
  useEffect(() => {
    if (unpaidStudents.length > 0) {
      setSelectedStudents(unpaidStudents.map((s) => s.studentId));
      // Set to total due amount for all unpaid students
      setPayNow(totalDueAmount > 0 ? totalDueAmount : "");
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
      setPayNow(totalSelectedDue > 0 ? totalSelectedDue : "");
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
    if (
      !selectedStudents.length ||
      !payNow ||
      !feeMethod ||
      !feeMonth ||
      !feeYear
    ) {
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
      // Send ONE payment for ALL selected students
      // The backend will handle distributing this amount across selected students
      const result = await updateFee({
        id: feeId,
        partialAmount: paymentAmount,
        partialMethod: feeMethod,
        partialDate: paymentDate,
        studentIds: selectedStudents, // Send array of selected student IDs
        month: feeMonth,
        year: feeYear,
      }).unwrap();

      toast.success("Payment recorded successfully");

      // Refetch the fee data to get updated values
      await refetchFee();

      handleAdminClose();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err?.data?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );
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

  const selectedUnpaidStudents = unpaidStudents.filter((s) =>
    selectedStudents.includes(s.studentId)
  );
  const totalSelectedDue = selectedUnpaidStudents.reduce(
    (sum, student) => sum + student.dueAmount,
    0
  );

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
              <h5 className="modal-title">Record Payment</h5>
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
                    <div className="col-md-3">
                      <strong>Status:</strong>
                      <span
                        className={`badge ms-2 ${
                          fee?.status === "paid"
                            ? "bg-success"
                            : fee?.status === "partial"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {fee?.status?.toUpperCase() || "UNPAID"}
                      </span>
                    </div>
                  </div>
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
                        All students are fully paid for{" "}
                        {months[parseInt(feeMonth || "1") - 1]} {feeYear}.
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Fee Month
                      </label>
                      <select
                        className="form-select"
                        value={feeMonth}
                        onChange={(e) => setFeeMonth(e.target.value)}
                        required
                      >
                        <option value="">Select Month</option>
                        {months.map((monthName, i) => (
                          <option
                            key={monthName}
                            value={(i + 1).toString().padStart(2, "0")}
                          >
                            {monthName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Fee Year</label>
                      <select
                        className="form-select"
                        value={feeYear}
                        onChange={(e) => setFeeYear(Number(e.target.value))}
                        required
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

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
                        <option value="cash">Cash Payment</option>
                        <option value="card">Card Payment</option>
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

                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Payment Amount £
                        <span className="text-muted fw-normal">
                          {" "}
                          (Total for {selectedStudents.length} selected
                          students)
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
                  </div>
                </div>
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
