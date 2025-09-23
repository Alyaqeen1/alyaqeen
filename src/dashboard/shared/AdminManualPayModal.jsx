import React, { useState, useMemo, useEffect } from "react";
import {
  useGetEnrolledFullFamilyByIdQuery,
  useGetFamilyQuery,
} from "../../redux/features/families/familiesApi";
import {
  useCreateFeeDataMutation,
  useGetFeesQuery,
} from "../../redux/features/fees/feesApi";
import { useUpdateStudentStatusMutation } from "../../redux/features/students/studentsApi";
import toast from "react-hot-toast";

export default function AdminManualPayModal({
  familyId,
  handleAdminClose,
  adminShowModal,
  refetch: familiesRefetch,
  refetchFee,
}) {
  const { data: enrolledFamily } = useGetEnrolledFullFamilyByIdQuery(familyId);
  const { data: family } = useGetFamilyQuery(familyId);
  const [createFeeData] = useCreateFeeDataMutation();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const { data: fees = [] } = useGetFeesQuery();

  // Form state
  const [feeYear, setFeeYear] = useState(new Date().getFullYear());
  const [feeMonth, setFeeMonth] = useState("");
  const [feeMethod, setFeeMethod] = useState("");
  const [feeType, setFeeType] = useState("");
  const [payNow, setPayNow] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (enrolledFamily?.childrenDocs) {
      const enrolledStudentIds = enrolledFamily.childrenDocs
        .filter((student) => student.status === "enrolled")
        .map((student) => student._id);
      setSelectedStudents(enrolledStudentIds);
    }
  }, [enrolledFamily]);

  // REAL-TIME FEE CALCULATION
  const feeCalculation = useMemo(() => {
    if (selectedStudents.length === 0 || !feeType) {
      return {
        expectedTotal: 0,
        remaining: 0,
        admissionTotal: 0,
        monthlyTotal: 0,
      };
    }

    const discountPercent = family?.discount ? Number(family.discount) : 0;
    const ADMISSION_FEE_PER_STUDENT = 20;

    // Get selected student objects for calculation
    const selectedStudentObjects =
      enrolledFamily?.childrenDocs?.filter((student) =>
        selectedStudents.includes(student._id)
      ) || [];

    if (feeType === "admission") {
      const admissionTotal =
        ADMISSION_FEE_PER_STUDENT * selectedStudentObjects.length;

      const monthlyTotal = selectedStudentObjects.reduce((total, student) => {
        const baseFee =
          student.monthly_fee ??
          student.monthlyFee ??
          student.monthlyFeeAmount ??
          0;
        const discountedFee = discountPercent
          ? parseFloat((baseFee * (1 - discountPercent / 100)).toFixed(2))
          : baseFee;
        return total + discountedFee;
      }, 0);

      const expectedTotal = admissionTotal + monthlyTotal;
      const paidAmount = Number(payNow) || 0;
      const remaining = Math.max(0, expectedTotal - paidAmount);

      return {
        expectedTotal: parseFloat(expectedTotal.toFixed(2)),
        remaining: parseFloat(remaining.toFixed(2)),
        admissionTotal: parseFloat(admissionTotal.toFixed(2)),
        monthlyTotal: parseFloat(monthlyTotal.toFixed(2)),
      };
    } else if (feeType === "monthly") {
      const monthlyTotal = selectedStudentObjects.reduce((total, student) => {
        const baseFee =
          student.monthly_fee ??
          student.monthlyFee ??
          student.monthlyFeeAmount ??
          0;
        const discountedFee = discountPercent
          ? parseFloat((baseFee * (1 - discountPercent / 100)).toFixed(2))
          : baseFee;
        return total + discountedFee;
      }, 0);

      const paidAmount = Number(payNow) || 0;
      const remaining = Math.max(0, monthlyTotal - paidAmount);

      return {
        expectedTotal: parseFloat(monthlyTotal.toFixed(2)),
        remaining: parseFloat(remaining.toFixed(2)),
        admissionTotal: 0,
        monthlyTotal: parseFloat(monthlyTotal.toFixed(2)),
      };
    }

    return {
      expectedTotal: 0,
      remaining: 0,
      admissionTotal: 0,
      monthlyTotal: 0,
    };
  }, [selectedStudents, feeType, payNow, family, enrolledFamily]);

  // Handle student selection
  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Select/deselect all students
  const toggleAllStudents = () => {
    if (selectedStudents.length === enrolledFamily?.childrenDocs?.length) {
      setSelectedStudents([]);
    } else {
      const allStudentIds = enrolledFamily.childrenDocs.map(
        (student) => student._id
      );
      setSelectedStudents(allStudentIds);
    }
  };

  // Get selected student objects
  const selectedStudentObjects = useMemo(() => {
    return (
      enrolledFamily?.childrenDocs?.filter((student) =>
        selectedStudents.includes(student._id)
      ) || []
    );
  }, [enrolledFamily, selectedStudents]);

  // Check if payment already exists
  const paymentExists = useMemo(() => {
    if (!feeType || !familyId || selectedStudents.length === 0) return false;

    if (feeType === "admission") {
      return selectedStudentObjects.every((student) =>
        fees.some(
          (fee) =>
            fee.familyId === familyId &&
            fee.paymentType === "admission" &&
            fee.status === "paid" &&
            fee.students?.some((s) => s.studentId === student._id)
        )
      );
    }
    if (feeType === "monthly" && feeMonth) {
      return selectedStudentObjects.some((student) =>
        fees.some(
          (fee) =>
            fee.familyId === familyId &&
            fee.paymentType === "monthly" &&
            fee.status === "paid" &&
            fee.students?.some(
              (s) =>
                s.studentId === student._id &&
                s.monthsPaid?.some(
                  (mp) =>
                    String(mp.month).padStart(2, "0") ===
                      String(feeMonth).padStart(2, "0") &&
                    String(mp.year) === String(feeYear)
                )
            )
        )
      );
    }

    return false;
  }, [fees, familyId, feeMonth, feeYear, feeType, selectedStudentObjects]);

  const isBeforeJoiningMonth = useMemo(() => {
    if (!feeMonth || !feeYear || selectedStudentObjects.length === 0)
      return false;

    const selectedMonth = parseInt(feeMonth);
    const selectedYear = parseInt(feeYear);

    return selectedStudentObjects.some((student) => {
      if (!student.startingDate) return false;

      const joiningDate = new Date(student.startingDate);
      const joiningMonth = joiningDate.getMonth() + 1;
      const joiningYear = joiningDate.getFullYear();

      return (
        selectedYear < joiningYear ||
        (selectedYear === joiningYear && selectedMonth < joiningMonth)
      );
    });
  }, [feeMonth, feeYear, selectedStudentObjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validation
    if (selectedStudents?.length === 0) {
      toast.error("Please select at least one student");
      setIsProcessing(false);
      return;
    }
    if (!feeType) {
      toast.error("Please select a Payment Type");
      setIsProcessing(false);
      return;
    }
    if (feeType === "monthly" && !feeMonth) {
      toast.error("Please select a Fee Month");
      setIsProcessing(false);
      return;
    }
    if (!feeMethod) {
      toast.error("Please select a Payment Method");
      setIsProcessing(false);
      return;
    }
    if (!payNow || isNaN(payNow) || Number(payNow) <= 0) {
      toast.error("Please enter a valid Pay Now amount");
      setIsProcessing(false);
      return;
    }
    if (paymentExists) {
      toast.error(
        `Payment already recorded for selected ${
          feeType === "admission" ? "admission" : `month ${feeMonth}`
        }`
      );
      setIsProcessing(false);
      return;
    }

    const notEnrolledStudents = selectedStudentObjects?.filter(
      (student) => student.status === "approved"
    );
    if (notEnrolledStudents && notEnrolledStudents.length > 0) {
      const names = notEnrolledStudents.map((s) => s.name).join(", ");
      toast.error(
        `Payment blocked. The following student(s) are not enrolled yet: ${names}`
      );
      setIsProcessing(false);
      return;
    }
    if (feeType === "monthly" && isBeforeJoiningMonth) {
      toast.error(
        "Cannot record payment for months before student's joining month"
      );
      setIsProcessing(false);
      return;
    }

    try {
      if (feeType === "admission") {
        const admissionFeePerStudent = 20;
        const totalAdmissionNeeded =
          admissionFeePerStudent * selectedStudentObjects.length;
        const totalPayNow = Number(payNow);

        // Validate minimum admission amount
        if (totalPayNow < totalAdmissionNeeded) {
          toast.error(
            `Insufficient amount. Admission requires at least $${totalAdmissionNeeded} for ${selectedStudentObjects.length} student(s).`
          );
          setIsProcessing(false);
          return;
        }

        // Apply family discount
        const discountPercent = family?.discount ? Number(family.discount) : 0;

        const studentsFees = selectedStudentObjects.map((student) => {
          const baseFee =
            student.monthly_fee ??
            student.monthlyFee ??
            student.monthlyFeeAmount ??
            0;
          const discountedFee = discountPercent
            ? parseFloat(
                (baseFee - (baseFee * discountPercent) / 100).toFixed(2)
              )
            : baseFee;

          return {
            studentId: student._id,
            name: student.name,
            admissionFee: admissionFeePerStudent,
            monthlyFee: baseFee,
            discountedFee,
          };
        });

        const expectedTotal = studentsFees.reduce(
          (sum, s) => sum + s.admissionFee + s.discountedFee,
          0
        );

        const leftover = Math.max(0, totalPayNow - totalAdmissionNeeded);

        // Allocation logic for monthly portion
        let allocations = [];
        if (leftover >= 0) {
          allocations = studentsFees.map((s) => {
            const paidMonthly =
              expectedTotal - totalAdmissionNeeded > 0
                ? parseFloat(
                    (
                      (s.discountedFee /
                        studentsFees.reduce(
                          (sum, x) => sum + x.discountedFee,
                          0
                        )) *
                      leftover
                    ).toFixed(2)
                  )
                : 0;

            const startDate = new Date(
              s.studentId
                ? selectedStudentObjects.find((st) => st._id === s.studentId)
                    ?.startingDate
                : new Date()
            );
            const joiningMonth = (startDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const joiningYear = startDate.getFullYear();

            return {
              studentId: s.studentId,
              name: s.name,
              admissionFee: admissionFeePerStudent,
              monthlyFee: s.monthlyFee,
              discountedFee: s.discountedFee,
              paidAdmission: admissionFeePerStudent,
              paidMonthly,
              joiningMonth,
              joiningYear,
              subtotal: parseFloat(
                (admissionFeePerStudent + paidMonthly).toFixed(2)
              ),
            };
          });
        }

        const admissionData = {
          familyId,
          name: family?.name,
          email: family?.email,
          amount: totalPayNow,
          expectedTotal: parseFloat(expectedTotal.toFixed(2)),
          remaining: parseFloat(
            Math.max(0, expectedTotal - totalPayNow).toFixed(2)
          ),
          status: totalPayNow >= expectedTotal ? "paid" : "partial",
          date,
          method: feeMethod,
          paymentType: feeType,
          students: allocations,
        };

        const data = await createFeeData(admissionData).unwrap();

        // Update student statuses
        await Promise.all(
          selectedStudentObjects.map((student) =>
            updateStudentStatus({
              id: student._id,
              status: "enrolled",
            }).unwrap()
          )
        );

        toast.success(
          `Admission payment of $${payNow} recorded successfully for ${selectedStudentObjects.length} student(s)`
        );
      } else {
        // Monthly payment logic
        const parsedPayNow = Number(payNow);
        const discountPercent = family?.discount ? Number(family.discount) : 0;

        const studentsFees = selectedStudentObjects.map((student) => {
          const baseFee =
            student.monthly_fee ??
            student.monthlyFee ??
            student.monthlyFeeAmount ??
            0;
          const discountedFee = discountPercent
            ? parseFloat(
                (baseFee - (baseFee * discountPercent) / 100).toFixed(2)
              )
            : baseFee;

          return {
            studentId: student._id,
            name: student.name,
            fee: discountedFee,
            originalFee: baseFee,
          };
        });

        const expectedTotal = studentsFees.reduce((s, st) => s + st.fee, 0);

        let allocations = [];
        if (parsedPayNow >= expectedTotal) {
          allocations = studentsFees.map((s) => ({ ...s, paid: s.fee }));
        } else {
          allocations = studentsFees.map((s) => ({
            ...s,
            rawPaid:
              expectedTotal > 0 ? (s.fee / expectedTotal) * parsedPayNow : 0,
          }));

          allocations.forEach((a) => {
            a.paid = Math.floor(a.rawPaid * 100) / 100;
          });

          let allocatedSum = allocations.reduce((sum, a) => sum + a.paid, 0);
          let remainderCents = Math.round((parsedPayNow - allocatedSum) * 100);

          if (remainderCents > 0) {
            allocations.sort(
              (a, b) =>
                b.rawPaid -
                Math.floor(b.rawPaid * 100) / 100 -
                (a.rawPaid - Math.floor(a.rawPaid * 100) / 100)
            );

            for (let i = 0; i < allocations.length && remainderCents > 0; i++) {
              allocations[i].paid = Number(
                (allocations[i].paid + 0.01).toFixed(2)
              );
              remainderCents--;
            }
          }

          allocations.sort(
            (a, b) =>
              studentsFees.findIndex((s) => s.studentId === a.studentId) -
              studentsFees.findIndex((s) => s.studentId === b.studentId)
          );
        }

        const studentsPayload = allocations.map((a) => ({
          studentId: a.studentId,
          name: a.name,
          monthsPaid: [
            {
              month: feeMonth.padStart(2, "0"),
              year: feeYear,
              monthlyFee: a.originalFee,
              discountedFee: a.fee,
              paid: parseFloat((a.paid || 0).toFixed(2)),
            },
          ],
          subtotal: parseFloat((a.paid || 0).toFixed(2)),
        }));

        const monthlyData = {
          familyId,
          name: family?.name,
          email: family?.email,
          amount: parsedPayNow,
          expectedTotal: parseFloat(expectedTotal.toFixed(2)),
          remaining: parseFloat(
            Math.max(0, expectedTotal - parsedPayNow).toFixed(2)
          ),
          status: parsedPayNow >= expectedTotal ? "paid" : "partial",
          date,
          method: feeMethod,
          paymentType: feeType,
          students: studentsPayload,
        };

        const data = await createFeeData(monthlyData).unwrap();
        if (data?.insertedId) {
          toast.success(
            `Monthly payment of $${payNow} recorded successfully for ${selectedStudentObjects?.length} student(s)`
          );
        }
      }

      // Wait for refetch to complete
      await Promise.all([refetchFee(), familiesRefetch()]);

      // Small delay to ensure data is loaded
      await new Promise((resolve) => setTimeout(resolve, 500));

      handleAdminClose();
    } catch (error) {
      toast.error(error?.data?.message || "Payment recording failed");
      console.log(error);
    } finally {
      setIsProcessing(false);
      setFeeMethod("");
      setFeeMonth("");
      setFeeType("");
      setPayNow("");
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
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title">Pay Group Fee</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleAdminClose}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Family Name */}
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label fw-semibold">
                    Family Name
                  </label>
                  <div className="col-sm-8 pt-2">{family?.name || "-"}</div>
                </div>

                {/* Students Selection */}
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label fw-semibold">
                    Select Students
                  </label>
                  <div className="col-sm-8">
                    {enrolledFamily?.childrenDocs?.length > 0 && (
                      <div className="border rounded p-2">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="selectAllStudents"
                            checked={
                              selectedStudents.length ===
                              enrolledFamily.childrenDocs.length
                            }
                            onChange={toggleAllStudents}
                          />
                          <label
                            className="form-check-label fw-bold"
                            htmlFor="selectAllStudents"
                          >
                            Select All Students
                          </label>
                        </div>
                        <hr className="my-1" />
                        <div
                          className="student-checkboxes"
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          {enrolledFamily.childrenDocs.map((student) => (
                            <div key={student._id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`student-${student._id}`}
                                checked={selectedStudents.includes(student._id)}
                                onChange={() =>
                                  handleStudentSelection(student._id)
                                }
                                disabled={student.status !== "enrolled"}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`student-${student._id}`}
                                style={{
                                  color:
                                    student.status !== "enrolled"
                                      ? "#6c757d"
                                      : "inherit",
                                  cursor:
                                    student.status !== "enrolled"
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                {student.name}
                                {student.status !== "enrolled" &&
                                  " (Not enrolled)"}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <small className="text-muted">
                      Selected: {selectedStudents.length} of{" "}
                      {enrolledFamily?.childrenDocs?.length} students
                    </small>
                  </div>
                </div>

                {/* FEE CALCULATION DISPLAY - ADDED THIS SECTION */}
                {(feeType === "admission" || feeType === "monthly") &&
                  selectedStudents.length > 0 && (
                    <div className="mb-3 p-3 border rounded bg-light">
                      <h6 className="fw-bold">Fee Calculation</h6>
                      {feeType === "admission" && (
                        <>
                          <div className="d-flex justify-content-between">
                            <span>
                              Admission Fee ({selectedStudents.length} students
                              × $20):
                            </span>
                            <span>${feeCalculation.admissionTotal}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>
                              First Month Fee ({selectedStudents.length}{" "}
                              students):
                            </span>
                            <span>${feeCalculation.monthlyTotal}</span>
                          </div>
                          <hr />
                        </>
                      )}
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Expected Total:</span>
                        <span>${feeCalculation.expectedTotal}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Amount Paid:</span>
                        <span>${payNow || "0"}</span>
                      </div>
                      <div className="d-flex justify-content-between fw-bold text-danger">
                        <span>Remaining Amount:</span>
                        <span>${feeCalculation.remaining}</span>
                      </div>
                      {family?.discount && (
                        <small className="text-muted">
                          Family discount applied: {family.discount}%
                        </small>
                      )}
                    </div>
                  )}

                {/* Fee Year */}
                <div className="mb-3 row">
                  <label
                    htmlFor="feeYear"
                    className="col-sm-4 col-form-label fw-semibold"
                  >
                    Fee Year
                  </label>
                  <div className="col-sm-8">
                    <select
                      id="feeYear"
                      className="form-select"
                      value={feeYear}
                      onChange={(e) => setFeeYear(Number(e.target.value))}
                      required
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Type */}
                <div className="mb-3 row">
                  <label
                    htmlFor="feeType"
                    className="col-sm-4 col-form-label fw-semibold"
                  >
                    Payment Type
                  </label>
                  <div className="col-sm-8">
                    <select
                      id="feeType"
                      className="form-select"
                      value={feeType}
                      onChange={(e) => setFeeType(e.target.value)}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="admission">
                        Admission and First Month
                      </option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                {/* Fee Month (only required if monthly) */}
                {feeType === "monthly" && (
                  <div className="mb-3 row">
                    <label
                      htmlFor="feeMonth"
                      className="col-sm-4 col-form-label fw-semibold"
                    >
                      Fee Month
                    </label>
                    <div className="col-sm-8">
                      <select
                        id="feeMonth"
                        className="form-select"
                        value={feeMonth}
                        onChange={(e) => setFeeMonth(e.target.value)}
                        required={feeType === "monthly"}
                      >
                        <option value="">Select Month</option>
                        {months.map((month, i) => (
                          <option
                            key={month}
                            value={(i + 1).toString().padStart(2, "0")}
                          >
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div className="mb-3 row">
                  <label
                    htmlFor="feeMethod"
                    className="col-sm-4 col-form-label fw-semibold"
                  >
                    Payment Method
                  </label>
                  <div className="col-sm-8">
                    <select
                      id="feeMethod"
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

                {/* Pay Now */}
                <div className="mb-3 row">
                  <label
                    htmlFor="payNow"
                    className="col-sm-4 col-form-label fw-semibold"
                  >
                    Pay Now
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="number"
                      id="payNow"
                      className="form-control"
                      placeholder="Enter amount"
                      value={payNow}
                      onChange={(e) => setPayNow(e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="mb-3 row">
                  <label
                    htmlFor="paymentDate"
                    className="col-sm-4 col-form-label fw-semibold"
                  >
                    Date
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      id="paymentDate"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAdminClose}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white py-1 px-2 rounded-2"
                  disabled={
                    !payNow ||
                    !feeMethod ||
                    !feeType ||
                    (feeType === "monthly" && !feeMonth) ||
                    isProcessing
                  }
                  style={{
                    backgroundColor:
                      !payNow ||
                      !feeMethod ||
                      !feeType ||
                      (feeType === "monthly" && !feeMonth) ||
                      isProcessing
                        ? "var(--border2)"
                        : "#28a745",
                    cursor:
                      !payNow ||
                      !feeMethod ||
                      !feeType ||
                      (feeType === "monthly" && !feeMonth) ||
                      isProcessing
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isProcessing ? "Processing..." : "Pay Group Fee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
