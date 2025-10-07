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

// Helper: always keep two decimals
// Enhanced Helper: always keep two decimals with better error handling
const toTwo = (v) => {
  const num = Number(v);
  if (isNaN(num)) return 0.0;
  return Number(num.toFixed(2));
};

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
  const [feeMethod, setFeeMethod] = useState("cash payment at office");
  const [feeType, setFeeType] = useState("monthly");
  const [payNow, setPayNow] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // ✅ Get current month as string (e.g., "09" for September)
  const currentMonth = useMemo(() => {
    return (new Date().getMonth() + 1).toString().padStart(2, "0");
  }, []);
  useEffect(() => {
    if (feeType === "monthly") {
      setFeeMonth(currentMonth);
      setPayNow(50);
    } else {
      setFeeMonth("");
      setPayNow("");
    }
  }, [feeType, currentMonth]);
  // derived list of enrolled student ids for select-all and comparisons
  // derived list of enrolled AND approved student ids for select-all and comparisons
  const enrolledStudentIds = useMemo(() => {
    return (
      enrolledFamily?.childrenDocs
        ?.filter((s) => s.status === "enrolled" || s.status === "approved")
        .map((s) => s._id) || []
    );
  }, [enrolledFamily]);

  useEffect(() => {
    if (enrolledStudentIds.length) {
      setSelectedStudents(enrolledStudentIds);
    }
  }, [enrolledStudentIds]);

  // Handle student selection
  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Select/deselect all students (only enrolled ones)
  const toggleAllStudents = () => {
    if (selectedStudents.length === enrolledStudentIds.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(enrolledStudentIds.slice());
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

  // Helper to check if a fee doc contains paid month for a student
  const hasStudentPaidMonth = (feeDoc, studentId, month, year) => {
    if (!feeDoc?.students) return false;
    const s = feeDoc.students.find(
      (st) => String(st.studentId) === String(studentId)
    );
    if (!s) return false;
    const mp = (s.monthsPaid || []).find(
      (m) =>
        String(m.month).padStart(2, "0") === String(month).padStart(2, "0") &&
        String(m.year) === String(year)
    );
    if (!mp) return false;
    const required = mp.discountedFee ?? mp.monthlyFee ?? 0;
    return (mp.paid ?? 0) >= toTwo(required) - 1e-6;
  };

  // Helper to check if a fee doc contains admission fully paid for a student
  const hasStudentPaidAdmission = (feeDoc, studentId) => {
    if (!feeDoc?.students) return false;
    const s = feeDoc.students.find(
      (st) => String(st.studentId) === String(studentId)
    );
    if (!s) return false;

    // prefer explicit admission fields if available
    const admissionFee = s.admissionFee ?? 0;
    const discounted = s.discountedFee ?? s.monthlyFee ?? 0;

    // If `paidAdmission` exists (we sometimes set it during creation), use that
    if (s.paidAdmission !== undefined) {
      return (s.paidAdmission ?? 0) >= admissionFee - 1e-6;
    }

    // fallback: if subtotal covers admission + discounted monthly portion
    return (s.subtotal ?? 0) >= toTwo(admissionFee + discounted) - 1e-6;
  };

  // Check if payment already exists for selected students/month/year/type
  const paymentExists = useMemo(() => {
    if (!feeType || !familyId || selectedStudents.length === 0) return false;

    if (feeType === "admission") {
      return selectedStudentObjects.some((student) =>
        fees.some(
          (fee) =>
            String(fee.familyId) === String(familyId) &&
            String(fee.paymentType) === "admission" &&
            (hasStudentPaidAdmission(fee, student._id) ||
              (fee.status === "paid" &&
                fee.students?.some(
                  (s) => String(s.studentId) === String(student._id)
                )))
        )
      );
    }

    if (feeType === "monthly" && feeMonth) {
      return selectedStudentObjects.some((student) =>
        fees.some(
          (fee) =>
            String(fee.familyId) === String(familyId) &&
            String(fee.paymentType) === "monthly" &&
            // consider month paid even if fee.status is partial/paid, inspect monthsPaid for the student
            hasStudentPaidMonth(fee, student._id, feeMonth, feeYear)
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
      const joiningMonth = joiningDate.getMonth() + 1; // getMonth is 0-indexed
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
    if (!payNow || isNaN(payNow) || toTwo(Number(payNow)) <= 0) {
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

    // NEW CHECK: Are there any students not enrolled (status "approved")?
    // const notEnrolledStudents = selectedStudentObjects?.filter(
    //   (student) => student.status === "approved"
    // );

    // if (notEnrolledStudents && notEnrolledStudents.length > 0) {
    //   const names = notEnrolledStudents.map((s) => s.name).join(", ");
    //   toast.error(
    //     `Payment blocked. The following student(s) are not enrolled yet: ${names}`
    //   );
    //   setIsProcessing(false);
    //   return;
    // }

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
        const totalAdmissionNeeded = toTwo(
          admissionFeePerStudent * selectedStudentObjects.length
        );
        const totalPayNow = toTwo(Number(payNow));

        // Apply family discount
        const discountPercent = family?.discount
          ? toTwo(Number(family.discount))
          : 0;

        // Prepare students with discounted monthly fee
        const studentsFees = selectedStudentObjects.map((student) => {
          const baseFee = toTwo(
            student.monthly_fee ??
              student.monthlyFee ??
              student.monthlyFeeAmount ??
              0
          );

          const discountedFee = discountPercent
            ? toTwo(baseFee - (baseFee * discountPercent) / 100)
            : toTwo(baseFee);

          // ✅ FIXED: Use student's actual starting date
          const startingDate = new Date(student.startingDate);
          const joiningMonth = startingDate.getMonth() + 1;
          const joiningYear = startingDate.getFullYear();

          return {
            studentId: student._id,
            name: student.name,
            admissionFee: admissionFeePerStudent,
            monthlyFee: toTwo(baseFee),
            discountedFee: toTwo(discountedFee),
            joiningMonth: joiningMonth, // ✅ Use actual joining month
            joiningYear: joiningYear, // ✅ Use actual joining year
          };
        });

        // Expected total = sum of admission + discounted monthly for all students
        const expectedTotalRaw = studentsFees.reduce(
          (sum, s) => sum + s.admissionFee + s.discountedFee,
          0
        );
        const expectedTotal = toTwo(expectedTotalRaw);

        // Calculate leftover for monthly portion
        const leftover = toTwo(Math.max(0, totalPayNow - totalAdmissionNeeded));

        // Allocation logic for monthly portion (distribute leftover proportionally)
        let allocations = [];
        if (leftover >= 0) {
          // compute raw shares for monthly portion
          const totalDiscounted = studentsFees.reduce(
            (s, x) => s + x.discountedFee,
            0
          );

          allocations = studentsFees.map((s) => {
            const rawShare = toTwo(
              totalDiscounted > 0
                ? (s.discountedFee / totalDiscounted) * leftover
                : 0
            );
            return { ...s, rawShare };
          });

          // assign cents fairly
          allocations.forEach(
            (a) => (a.paidMonthly = Math.floor(a.rawShare * 100) / 100)
          );
          let allocatedSum = toTwo(
            allocations.reduce((s, a) => s + (a.paidMonthly || 0), 0)
          );
          let remainderCents = Math.round((leftover - allocatedSum) * 100);

          if (remainderCents > 0) {
            allocations.sort(
              (a, b) =>
                b.rawShare -
                Math.floor(b.rawShare * 100) / 100 -
                (a.rawShare - Math.floor(a.rawShare * 100) / 100)
            );
            for (let i = 0; i < allocations.length && remainderCents > 0; i++) {
              allocations[i].paidMonthly = toTwo(
                (allocations[i].paidMonthly || 0) + 0.01
              );
              remainderCents--;
            }
          }

          // finalize subtotal and paidAdmission
          allocations = allocations.map((a) => ({
            ...a,
            paidAdmission: toTwo(a.admissionFee),
            paidMonthly: toTwo(a.paidMonthly || 0),
            subtotal: toTwo((a.admissionFee || 0) + (a.paidMonthly || 0)),
          }));
        }

        const admissionData = {
          familyId,
          name: family?.name,
          email: family?.email,
          students: allocations.map((student) => ({
            studentId: student.studentId,
            name: student.name,
            admissionFee: student.admissionFee,
            monthlyFee: toTwo(student.monthlyFee),
            discountedFee: toTwo(student.discountedFee),
            joiningMonth: student.joiningMonth.toString().padStart(2, "0"),
            joiningYear: student.joiningYear,
            payments: [
              {
                amount: student.admissionFee,
                date: date,
                method: feeMethod,
              },
              ...(student.paidMonthly > 0
                ? [
                    {
                      amount: toTwo(student.paidMonthly),
                      date: date,
                      method: feeMethod,
                    },
                  ]
                : []),
            ],
            subtotal: toTwo(student.subtotal),
          })),
          expectedTotal: toTwo(expectedTotal),
          remaining: 0,
          paymentType: feeType,
          status: "paid",
          payments: [
            {
              amount: toTwo(totalPayNow),
              method: feeMethod,
              date: date,
            },
          ],
          timestamp: new Date().toISOString(),
        };

        const data = await createFeeData(admissionData).unwrap();
        toast.success(
          `Admission payment of $${toTwo(
            totalPayNow
          )} recorded successfully for ${
            selectedStudentObjects.length
          } student(s)`
        );

        // Update student statuses if needed
        await Promise.all(
          selectedStudentObjects.map((student) =>
            updateStudentStatus({
              id: student._id,
              status: "enrolled",
            }).unwrap()
          )
        );
      } else {
        // Monthly payment data (smart per-student allocation)
        const parsedPayNow = toTwo(Number(payNow));

        // build list of students with their actual monthly fee
        const discountPercent = family?.discount
          ? toTwo(Number(family.discount))
          : 0;

        const studentsFees = selectedStudentObjects.map((student) => {
          const baseFee = toTwo(
            student.monthly_fee ??
              student.monthlyFee ??
              student.monthlyFeeAmount ??
              0
          );

          const discountedFee = discountPercent
            ? toTwo(baseFee - (baseFee * discountPercent) / 100)
            : toTwo(baseFee);

          return {
            studentId: student._id,
            name: student.name,
            fee: toTwo(discountedFee),
            originalFee: toTwo(baseFee),
          };
        });

        const expectedTotalRaw = studentsFees.reduce((s, st) => s + st.fee, 0);
        const expectedTotal = toTwo(expectedTotalRaw);

        // allocations array will hold { studentId, name, fee, paid }
        let allocations = [];

        if (parsedPayNow >= expectedTotal) {
          // Full payment for everyone
          allocations = studentsFees.map((s) => ({ ...s, paid: toTwo(s.fee) }));
        } else {
          // Partial payment: distribute proportionally based on each student's fee
          allocations = studentsFees.map((s) => ({
            ...s,
            rawPaid: toTwo(
              expectedTotal > 0 ? (s.fee / expectedTotal) * parsedPayNow : 0
            ),
          }));

          // round down to cents
          allocations.forEach(
            (a) => (a.paid = Math.floor(a.rawPaid * 100) / 100)
          );

          // remainder cents
          let allocatedSum = toTwo(
            allocations.reduce((sum, a) => sum + a.paid, 0)
          );
          let remainderCents = Math.round((parsedPayNow - allocatedSum) * 100);

          if (remainderCents > 0) {
            allocations.sort(
              (a, b) =>
                b.rawPaid -
                Math.floor(b.rawPaid * 100) / 100 -
                (a.rawPaid - Math.floor(a.rawPaid * 100) / 100)
            );
            for (let i = 0; i < allocations.length && remainderCents > 0; i++) {
              allocations[i].paid = toTwo((allocations[i].paid || 0) + 0.01);
              remainderCents--;
            }
          }

          // restore original order
          allocations.sort(
            (a, b) =>
              studentsFees.findIndex((s) => s.studentId === a.studentId) -
              studentsFees.findIndex((s) => s.studentId === b.studentId)
          );
        }

        // Build students payload for DB
        const studentsPayload = allocations.map((a) => ({
          studentId: a.studentId,
          name: a.name,
          monthsPaid: [
            {
              month: feeMonth.padStart(2, "0"),
              year: feeYear,
              monthlyFee: toTwo(a.originalFee),
              discountedFee: toTwo(a.fee),
              paid: toTwo(a.paid || 0),
            },
          ],
          subtotal: toTwo(a.paid || 0),
        }));

        const monthlyData = {
          familyId,
          name: family?.name,
          email: family?.email,
          students: studentsPayload,
          expectedTotal: toTwo(expectedTotal),
          remaining: toTwo(Math.max(0, expectedTotal - parsedPayNow)),
          status: parsedPayNow >= expectedTotal ? "paid" : "partial",
          paymentType: feeType,
          payments: [
            {
              amount: toTwo(parsedPayNow),
              method: feeMethod,
              date,
            },
          ],
        };

        const data = await createFeeData(monthlyData).unwrap();
        if (data?.insertedId) {
          toast.success(
            `Monthly payment of $${toTwo(
              parsedPayNow
            )} recorded successfully for ${
              selectedStudentObjects?.length
            } student(s)`
          );
        }
      }

      refetchFee();
      familiesRefetch();
      handleAdminClose();
    } catch (error) {
      toast.error(error?.data?.message || "Payment recording failed");
      console.error(error);
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
                              enrolledStudentIds.length
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
                                disabled={
                                  student.status !== "enrolled" &&
                                  student.status !== "approved"
                                } // Allow both enrolled and approved
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`student-${student._id}`}
                                style={{
                                  color:
                                    student.status !== "enrolled" &&
                                    student.status !== "approved"
                                      ? "#6c757d"
                                      : "inherit",
                                  cursor:
                                    student.status !== "enrolled" &&
                                    student.status !== "approved"
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                {student.name}
                                {student.status === "approved" &&
                                  " (Approved - Not enrolled yet)"}
                                {student.status !== "enrolled" &&
                                  student.status !== "approved" &&
                                  " (Not enrolled)"}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <small className="text-muted">
                      Selected: {selectedStudents.length} of{" "}
                      {enrolledStudentIds.length} students
                    </small>
                  </div>
                </div>

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
                      <option value="cash payment at office">
                        Cash Payment at Office
                      </option>
                      <option value="card machine at office">
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
