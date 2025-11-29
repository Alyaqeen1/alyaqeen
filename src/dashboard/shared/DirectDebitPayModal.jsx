import React, { useState, useMemo, useEffect } from "react";
import {
  useGetEnrolledFullFamilyByIdQuery,
  useGetFamilyQuery,
} from "../../redux/features/families/familiesApi";
import {
  useCreateFeeDataMutation,
  useGetFeesQuery,
} from "../../redux/features/fees/feesApi";
import { useCollectAdminPaymentMutation } from "../../redux/features/families/familiesApi";
import { useUpdateStudentStatusMutation } from "../../redux/features/students/studentsApi";
import toast from "react-hot-toast";

// Helper: always keep two decimals
const toTwo = (v) => {
  const num = Number(v);
  if (isNaN(num)) return 0.0;
  return Number(num.toFixed(2));
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

export default function DirectDebitPayModal({
  familyId,
  handleAdminClose,
  adminShowModal,
  refetch: familiesRefetch,
}) {
  const { data: enrolledFamily } = useGetEnrolledFullFamilyByIdQuery(familyId);
  const { data: family } = useGetFamilyQuery(familyId);
  const [createFeeData] = useCreateFeeDataMutation();
  const [collectPayment] = useCollectAdminPaymentMutation();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const { data: fees = [] } = useGetFeesQuery();

  // Form state
  const [feeYear, setFeeYear] = useState(new Date().getFullYear());
  const [feeMonth, setFeeMonth] = useState("");
  const [feeType, setFeeType] = useState("monthly");
  const [payNow, setPayNow] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // ✅ Get current month as string (e.g., "09" for September)
  const currentMonth = useMemo(() => {
    return (new Date().getMonth() + 1).toString().padStart(2, "0");
  }, []);

  // Auto-fill month and calculate expected total based on fee type
  useEffect(() => {
    if (feeType === "monthly") {
      setFeeMonth(currentMonth);

      if (
        enrolledFamily?.childrenDocs?.length > 0 &&
        selectedStudents.length > 0
      ) {
        const totalWithoutDiscount = enrolledFamily.childrenDocs
          .filter((s) => selectedStudents.includes(s._id))
          .reduce((sum, s) => {
            const fee =
              s.monthly_fee ?? s.monthlyFee ?? s.monthlyFeeAmount ?? 0;
            return sum + Number(fee);
          }, 0);

        // apply family discount if exists
        const discountPercent = enrolledFamily?.discount || 0;
        const discountAmount = (totalWithoutDiscount * discountPercent) / 100;
        const finalTotal = totalWithoutDiscount - discountAmount;

        setPayNow(finalTotal);
      } else {
        setPayNow("");
      }
    } else {
      // Admission type - calculate admission fee + first month
      setFeeMonth("");
      if (selectedStudents.length > 0) {
        const admissionFeePerStudent = 20;
        const totalAdmissionFee =
          admissionFeePerStudent * selectedStudents.length;

        const totalMonthlyFee =
          enrolledFamily?.childrenDocs
            ?.filter((s) => selectedStudents.includes(s._id))
            .reduce((sum, s) => {
              const baseFee =
                s.monthly_fee ?? s.monthlyFee ?? s.monthlyFeeAmount ?? 0;
              const discountPercent = enrolledFamily?.discount || 0;
              const discountedFee = baseFee - (baseFee * discountPercent) / 100;
              return sum + Number(discountedFee);
            }, 0) || 0;

        setPayNow(totalAdmissionFee + totalMonthlyFee);
      } else {
        setPayNow("");
      }
    }
  }, [feeType, currentMonth, selectedStudents, enrolledFamily]);

  // derived list of enrolled student ids for select-all and comparisons
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

  // Calculate expected total amount based on fee type
  const expectedTotal = useMemo(() => {
    if (!selectedStudentObjects.length) return 0;

    if (feeType === "admission") {
      const admissionFeePerStudent = 20;
      const totalAdmissionFee =
        admissionFeePerStudent * selectedStudentObjects.length;

      const totalMonthlyFee = selectedStudentObjects.reduce((sum, student) => {
        const baseFee =
          student.monthly_fee ??
          student.monthlyFee ??
          student.monthlyFeeAmount ??
          0;
        const discountPercent = enrolledFamily?.discount || 0;
        const discountAmount = (baseFee * discountPercent) / 100;
        const discountedFee = baseFee - discountAmount;
        return sum + Number(discountedFee);
      }, 0);

      return toTwo(totalAdmissionFee + totalMonthlyFee);
    } else {
      // Monthly fee type
      const totalWithoutDiscount = selectedStudentObjects.reduce(
        (sum, student) => {
          const fee =
            student.monthly_fee ??
            student.monthlyFee ??
            student.monthlyFeeAmount ??
            0;
          return sum + Number(fee);
        },
        0
      );

      const discountPercent = enrolledFamily?.discount || 0;
      const discountAmount = (totalWithoutDiscount * discountPercent) / 100;
      return toTwo(totalWithoutDiscount - discountAmount);
    }
  }, [selectedStudentObjects, enrolledFamily, feeType]);

  // Determine payment status based on amount
  const paymentStatus = useMemo(() => {
    const paidAmount = toTwo(Number(payNow));
    if (paidAmount <= 0) return "unpaid";
    if (paidAmount >= expectedTotal) return "paid";
    return "partial";
  }, [payNow, expectedTotal]);

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
    return !!(mp && (mp.paid ?? 0) > 0);
  };

  // Helper to check if admission already paid for student
  // ✅ FIXED: Check if admission was actually paid
  // ✅ FIXED: Helper to check if admission already paid for student
  const hasStudentPaidAdmission = (feeDoc, studentId) => {
    if (!feeDoc?.students) return false;

    const studentFee = feeDoc.students.find(
      (st) => String(st.studentId) === String(studentId)
    );
    if (!studentFee) return false;

    // Check if this is an admission fee document and has payments
    if (feeDoc.paymentType === "admission" && studentFee.payments) {
      const totalPaid = studentFee.payments.reduce(
        (sum, payment) => sum + (payment.amount || 0),
        0
      );

      // Consider admission paid if at least the admission fee amount is covered
      const admissionFeeAmount = studentFee.admissionFee || 20;
      return totalPaid >= admissionFeeAmount;
    }

    return false;
  };

  // ✅ FIXED: Check if payment already exists for selected students
  const paymentExists = useMemo(() => {
    if (!familyId || selectedStudents.length === 0) return false;

    if (feeType === "admission") {
      // Check if any selected student already has a paid admission fee
      const studentsWithExistingAdmission = selectedStudentObjects.filter(
        (student) =>
          fees.some(
            (fee) =>
              String(fee.familyId) === String(familyId) &&
              fee.paymentType === "admission" &&
              hasStudentPaidAdmission(fee, student._id)
          )
      );

      if (studentsWithExistingAdmission.length > 0) {
        return true;
      }

      return false;
    } else if (feeType === "monthly" && feeMonth) {
      return selectedStudentObjects.some((student) =>
        fees.some(
          (fee) =>
            String(fee.familyId) === String(familyId) &&
            (fee.paymentType === "monthly" ||
              fee.paymentType === "direct_debit") &&
            hasStudentPaidMonth(fee, student._id, feeMonth, feeYear)
        )
      );
    }

    return false;
  }, [
    fees,
    familyId,
    feeMonth,
    feeYear,
    feeType,
    selectedStudentObjects,
    selectedStudents,
  ]);

  // ✅ NEW: Additional validation to prevent duplicate admission payments
  const canProceedWithAdmission = useMemo(() => {
    if (feeType !== "admission") return true;

    // Check if we would be creating duplicate admission records
    const existingAdmissionFees = fees.filter(
      (fee) =>
        String(fee.familyId) === String(familyId) &&
        fee.paymentType === "admission"
    );

    if (existingAdmissionFees.length === 0) return true;

    // For each existing admission fee, check if any selected student is already included
    for (const existingFee of existingAdmissionFees) {
      const hasOverlap = selectedStudentObjects.some((student) =>
        existingFee.students?.some(
          (s) => String(s.studentId) === String(student._id)
        )
      );

      if (hasOverlap) {
        return false;
      }
    }

    return true;
  }, [fees, familyId, feeType, selectedStudentObjects]);

  const isBeforeJoiningMonth = useMemo(() => {
    if (
      feeType !== "monthly" ||
      !feeMonth ||
      !feeYear ||
      selectedStudentObjects.length === 0
    )
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
  }, [feeMonth, feeYear, selectedStudentObjects, feeType]);

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
    if (!payNow || isNaN(payNow) || toTwo(Number(payNow)) <= 0) {
      toast.error("Please enter a valid amount");
      setIsProcessing(false);
      return;
    }
    // BACS maximum limit protection
    if (payNow > 10000) {
      toast.error("Cannot exceed £10,000 per transaction (BACS limit)");
      setIsProcessing(false);
      return;
    }

    // ✅ ADD THIS VALIDATION: Check if amount is less than total admission fee
    if (feeType === "admission") {
      const admissionFeePerStudent = 20;
      const totalAdmissionFee =
        admissionFeePerStudent * selectedStudents.length;
      const enteredAmount = toTwo(Number(payNow));

      if (enteredAmount < totalAdmissionFee) {
        toast.error(
          `Amount cannot be less than total admission fee (£${totalAdmissionFee}) for ${selectedStudents.length} student(s)`
        );
        setIsProcessing(false);
        return;
      }
    }
    // ✅ NEW VALIDATION: Check if amount is less than total admission fee
    if (feeType === "admission" && !canProceedWithAdmission) {
      const duplicateStudents = selectedStudentObjects.filter((student) =>
        fees.some(
          (fee) =>
            String(fee.familyId) === String(familyId) &&
            fee.paymentType === "admission" &&
            fee.students?.some(
              (s) => String(s.studentId) === String(student._id)
            )
        )
      );

      const studentNames = duplicateStudents.map((s) => s.name).join(", ");
      toast.error(`Admission already processed for: ${studentNames}`);
      setIsProcessing(false);
      return;
    }

    if (paymentExists) {
      if (feeType === "admission") {
        const alreadyPaidStudents = selectedStudentObjects.filter((student) =>
          fees.some(
            (fee) =>
              String(fee.familyId) === String(familyId) &&
              fee.paymentType === "admission" &&
              hasStudentPaidAdmission(fee, student._id)
          )
        );

        const studentNames = alreadyPaidStudents.map((s) => s.name).join(", ");
        toast.error(`Admission fee already paid for: ${studentNames}`);
      } else {
        const alreadyPaidStudents = selectedStudentObjects.filter((student) =>
          fees.some(
            (fee) =>
              String(fee.familyId) === String(familyId) &&
              (String(fee.paymentType) === "monthly" ||
                String(fee.paymentType) === "monthlyOnHold" ||
                String(fee.status) !== "failed" ||
                String(fee.paymentType) === "direct_debit") &&
              hasStudentPaidMonth(fee, student._id, feeMonth, feeYear)
          )
        );

        const studentNames = alreadyPaidStudents.map((s) => s.name).join(", ");
        toast.error(
          `Payment already recorded for ${studentNames} for ${
            months[parseInt(feeMonth) - 1]
          } ${feeYear}`
        );
      }
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
      const parsedPayNow = toTwo(Number(payNow));

      // Process Stripe Direct Debit payment first
      // In handleSubmit function, update the collectPayment call:
      // In handleSubmit function, update the collectPayment call:
      const stripeResult = await collectPayment({
        familyId: familyId,
        amount: parsedPayNow,
        description: `${
          feeType === "admission" ? "Admission and first month" : "Monthly"
        } payment via Direct Debit`,
        month: feeMonth,
        year: feeYear,
        feeType: feeType,
      }).unwrap();

      // Then when creating feeData:
      const paymentData = {
        amount: toTwo(parsedPayNow),
        method: "direct_debit",
        date: date,
        stripePaymentIntentId: stripeResult.paymentIntentId,
      };

      // Apply family discount
      const discountPercent = family?.discount
        ? toTwo(Number(family.discount))
        : 0;

      let feeData;

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

          const startingDate = new Date(student.startingDate);
          const joiningMonth = (startingDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const joiningYear = startingDate.getFullYear();

          return {
            studentId: student._id,
            name: student.name,
            admissionFee: admissionFeePerStudent,
            monthlyFee: toTwo(baseFee),
            discountedFee: toTwo(discountedFee),
            joiningMonth: joiningMonth,
            joiningYear: joiningYear,
          };
        });

        // Expected total = sum of admission + discounted monthly for all students
        const expectedTotalRaw = studentsFees.reduce(
          (sum, s) => sum + s.admissionFee + s.discountedFee,
          0
        );
        const expectedTotal = toTwo(expectedTotalRaw);

        // ✅ FIXED: Smart allocation of the paid amount
        let allocations = [];

        if (totalPayNow >= expectedTotal) {
          // Full payment - everyone gets full admission + monthly
          allocations = studentsFees.map((student) => ({
            ...student,
            paidAdmission: student.admissionFee,
            paidMonthly: student.discountedFee,
          }));
        } else {
          // Partial payment - need to allocate smartly

          // First priority: Admission fees (fixed £20 per student)
          const totalAdmissionAllocated = Math.min(
            totalPayNow,
            totalAdmissionNeeded
          );
          const remainingAfterAdmission = toTwo(
            totalPayNow - totalAdmissionAllocated
          );

          // Allocate admission fees equally (each student gets their £20 if possible)
          const admissionPerStudent =
            totalAdmissionAllocated >= totalAdmissionNeeded
              ? admissionFeePerStudent
              : toTwo(totalAdmissionAllocated / selectedStudentObjects.length);

          // Allocate remaining amount to monthly fees proportionally
          const totalMonthlyNeeded = studentsFees.reduce(
            (sum, s) => sum + s.discountedFee,
            0
          );

          allocations = studentsFees.map((student) => {
            const monthlyShare =
              totalMonthlyNeeded > 0
                ? toTwo(
                    (student.discountedFee / totalMonthlyNeeded) *
                      remainingAfterAdmission
                  )
                : 0;

            return {
              ...student,
              paidAdmission: admissionPerStudent,
              paidMonthly: monthlyShare,
            };
          });

          // Adjust for rounding errors
          let allocatedMonthlySum = toTwo(
            allocations.reduce((sum, a) => sum + a.paidMonthly, 0)
          );
          let monthlyRemainder = toTwo(
            remainingAfterAdmission - allocatedMonthlySum
          );

          if (monthlyRemainder > 0) {
            // Distribute remainder to students with highest monthly fees first
            allocations.sort((a, b) => b.discountedFee - a.discountedFee);
            for (
              let i = 0;
              i < allocations.length && monthlyRemainder > 0;
              i++
            ) {
              const maxCanAdd = toTwo(
                allocations[i].discountedFee - allocations[i].paidMonthly
              );
              const toAdd = Math.min(monthlyRemainder, maxCanAdd, 0.01);
              allocations[i].paidMonthly = toTwo(
                allocations[i].paidMonthly + toAdd
              );
              monthlyRemainder = toTwo(monthlyRemainder - toAdd);
            }
          }
        }

        // ✅ FIXED: Create proper admission data structure with allocated amounts
        const studentsPayload = allocations.map((student) => ({
          studentId: student.studentId,
          name: student.name,
          admissionFee: student.admissionFee,
          monthlyFee: student.monthlyFee,
          discountedFee: student.discountedFee,
          joiningMonth: student.joiningMonth,
          joiningYear: student.joiningYear,
          payments: [
            {
              amount: student.paidAdmission,
              date: date,
              method: "direct_debit",
            },
            ...(student.paidMonthly > 0
              ? [
                  {
                    amount: student.paidMonthly,
                    date: date,
                    method: "direct_debit",
                  },
                ]
              : []),
          ],
          subtotal: toTwo(student.paidAdmission + student.paidMonthly),
        }));

        feeData = {
          familyId,
          name: family?.name,
          email: family?.email,
          students: studentsPayload,
          expectedTotal: toTwo(expectedTotal),
          remaining: toTwo(Math.max(0, expectedTotal - totalPayNow)),
          status: "pending", // ✅ Change from "paid" to "pending"
          paymentType: "admission",
          payments: [paymentData],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Show allocation summary
        const allocationSummary = allocations
          .map(
            (s) =>
              `${s.name}: £${s.paidAdmission} (admission) + £${s.paidMonthly} (monthly)`
          )
          .join("; ");

        // Update student statuses to enrolled only if full admission is paid
        if (totalPayNow >= totalAdmissionNeeded) {
          await Promise.all(
            selectedStudentObjects.map((student) =>
              updateStudentStatus({
                id: student._id,
                status: "enrolled",
              }).unwrap()
            )
          );
        }
      } else {
        // Monthly payment logic
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

        // Allocate payment proportionally among students
        let allocations = [];

        if (parsedPayNow >= expectedTotal) {
          allocations = studentsFees.map((s) => ({ ...s, paid: toTwo(s.fee) }));
        } else {
          allocations = studentsFees.map((s) => ({
            ...s,
            rawPaid: toTwo(
              expectedTotal > 0 ? (s.fee / expectedTotal) * parsedPayNow : 0
            ),
          }));

          allocations.forEach(
            (a) => (a.paid = Math.floor(a.rawPaid * 100) / 100)
          );

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
              monthlyFee: toTwo(a.originalFee),
              discountedFee: toTwo(a.fee),
              paid: toTwo(a.paid || 0),
            },
          ],
          subtotal: toTwo(a.paid || 0),
        }));
        feeData = {
          familyId,
          name: family?.name,
          email: family?.email,
          students: studentsPayload,
          expectedTotal: toTwo(expectedTotal),
          remaining: toTwo(Math.max(0, expectedTotal - parsedPayNow)),
          status: "pending", // ✅ Change from paymentStatus to "pending"
          paymentType: "monthly",
          payments: [paymentData],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      const data = await createFeeData(feeData).unwrap();
      if (data?.insertedId) {
        toast.success(
          `Direct Debit payment of £${toTwo(
            parsedPayNow
          )} initiated successfully. Status: Pending`
        );
      }

      familiesRefetch();
      handleAdminClose();
    } catch (error) {
      toast.error(
        error?.data?.error ||
          error?.data?.message ||
          "Direct Debit payment failed"
      );
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
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
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title">Collect Direct Debit Payment</h5>
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
                  <div className="col-sm-8 pt-2">
                    <strong>{family?.name || "-"}</strong>
                    <br />
                    <small className="text-muted">
                      {enrolledFamily?.directDebit?.bankName} ****
                      {enrolledFamily?.directDebit?.last4}
                    </small>
                  </div>
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
                                }
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
                                {student.name} - £{student.monthly_fee || 0}
                                {student.status === "approved" && " (Approved)"}
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
                      <option value="monthly">Monthly</option>
                      <option value="admission">
                        Admission and First Month
                      </option>
                    </select>
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

                {/* Fee Month (only for monthly payments) */}
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

                {/* Expected Total */}
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label fw-semibold">
                    Expected Total
                  </label>
                  <div className="col-sm-8 pt-2">
                    <strong>£{expectedTotal.toFixed(2)}</strong>
                    {enrolledFamily?.discount > 0 && (
                      <div>
                        <small className="text-muted">
                          Includes {enrolledFamily.discount}% discount
                        </small>
                      </div>
                    )}
                    {feeType === "admission" && (
                      <div>
                        <small className="text-muted">
                          (Admission fee: £{20 * selectedStudents.length} +
                          First month fee)
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount to Collect */}
                <div className="mb-3 row">
                  <label
                    htmlFor="payNow"
                    className="col-sm-4 col-form-label fw-semibold"
                  >
                    Amount to Collect
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
                    <small className="text-muted">
                      Status:{" "}
                      <span
                        className={
                          paymentStatus === "paid"
                            ? "text-success"
                            : paymentStatus === "partial"
                            ? "text-warning"
                            : "text-danger"
                        }
                      >
                        {paymentStatus.toUpperCase()}
                      </span>
                      {paymentStatus === "partial" &&
                        ` (£${(expectedTotal - toTwo(Number(payNow))).toFixed(
                          2
                        )} remaining)`}
                    </small>
                  </div>
                </div>

                {/* Date */}
                <div className="mb-3 row">
                  <label
                    htmlFor="paymentDate"
                    className="col-sm-4 col-form-label fw-semibold"
                  >
                    Payment Date
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

                {/* Payment Method (Fixed) */}
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label fw-semibold">
                    Payment Method
                  </label>
                  <div className="col-sm-8 pt-2 text-success">
                    <strong>Direct Debit</strong>
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
                  className="btn btn-success"
                  disabled={
                    !payNow ||
                    (feeType === "monthly" && !feeMonth) ||
                    isProcessing
                  }
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    `Collect £${toTwo(Number(payNow)).toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
