import React, { useState, useMemo } from "react";
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

  // Student names string
  const studentNames = enrolledFamily?.childrenDocs
    ?.map((s) => s.name)
    .join(", ");

  // Check if payment already exists in fees collection for this family and selected month/year/type
  const paymentExists = useMemo(() => {
    if (!feeType || !familyId) return false;

    if (feeType === "admission") {
      // Only mark as existing if *all targeted students* already have admission paid
      return enrolledFamily?.childrenDocs?.every((student) =>
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
      return enrolledFamily?.childrenDocs?.every((student) =>
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
                    mp.month === feeMonth.padStart(2, "0") &&
                    mp.year === feeYear
                )
            )
        )
      );
    }

    return false;
  }, [fees, familyId, feeMonth, feeYear, feeType, enrolledFamily]);

  // 1. Check admission payment status separately
  const admissionPaid = useMemo(() => {
    return fees.some(
      (fee) =>
        fee.familyId === familyId &&
        fee.paymentType === "admission" &&
        fee.status === "paid"
    );
  }, [fees, familyId]);

  const isBeforeJoiningMonth = useMemo(() => {
    if (!feeMonth || !feeYear || !enrolledFamily?.childrenDocs) return false;

    const selectedMonth = parseInt(feeMonth);
    const selectedYear = parseInt(feeYear);

    return enrolledFamily.childrenDocs.some((student) => {
      if (!student.startingDate) return false;

      const joiningDate = new Date(student.startingDate);
      const joiningMonth = joiningDate.getMonth() + 1; // getMonth is 0-indexed
      const joiningYear = joiningDate.getFullYear();

      return (
        selectedYear < joiningYear ||
        (selectedYear === joiningYear && selectedMonth < joiningMonth)
      );
    });
  }, [feeMonth, feeYear, enrolledFamily]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    // Validation
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
    // // New: Prevent monthly fee if admission fee not paid
    // if (feeType === "monthly" && !admissionPaid) {
    //   toast.error(
    //     "Admission fee not paid yet. Please record admission payment first."
    //   );
    //   setIsProcessing(false);
    //   return;
    // }

    // NEW CHECK: Are there any students not enrolled (status "approved")?
    const notEnrolledStudents = enrolledFamily?.childrenDocs?.filter(
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
    // New validation: Check if selected month is before joining month
    if (feeType === "monthly" && isBeforeJoiningMonth) {
      toast.error(
        "Cannot record payment for months before student's joining month"
      );
      setIsProcessing(false);
      return;
    }
    try {
      if (feeType === "admission") {
        // Admission payment data
        const admissionFeeAmount = 20; // fixed or from config
        const monthlyFeeAmount = Number(payNow) - admissionFeeAmount;

        const admissionData = {
          familyId,
          name: family?.name,
          email: family?.email,
          amount: Number(payNow),
          status: "paid",
          date,
          method: feeMethod,
          paymentType: feeType,
          students: enrolledFamily?.childrenDocs?.map((student) => {
            const startDate = new Date(student.startingDate);
            const joiningMonth = (startDate.getMonth() + 1)
              .toString()
              .padStart(2, "0"); // getMonth is zero-based
            const joiningYear = startDate.getFullYear();

            return {
              studentId: student._id,
              name: student.name,
              admissionFee: admissionFeeAmount,
              monthlyFee: monthlyFeeAmount > 0 ? monthlyFeeAmount : 0,
              joiningMonth,
              joiningYear,
            };
          }),
        };

        const data = await createFeeData(admissionData).unwrap();
        // Update student statuses
        const updatePromises = enrolledFamily?.childrenDocs?.map((student) =>
          updateStudentStatus({
            id: student._id,
            status: "enrolled",
          }).unwrap()
        );

        await Promise.all(updatePromises);
        if (data?.insertedId) {
          toast.success(
            `Admission payment of $${payNow} recorded successfully`
          );
        }
      } else {
        // Monthly payment data
        const monthlyData = {
          familyId,
          name: family?.name,
          email: family?.email,
          amount: Number(payNow),
          status: "paid",
          date,
          method: feeMethod,
          paymentType: feeType,
          students: enrolledFamily?.childrenDocs?.map((student) => ({
            studentId: student._id,
            name: student.name,
            monthsPaid: [
              {
                month: feeMonth.padStart(2, "0"),
                year: feeYear,
                monthlyFee: Number(payNow),
                discountedFee: Number(payNow),
              },
            ],
            subtotal: Number(payNow),
          })),
        };

        const data = await createFeeData(monthlyData).unwrap();
        if (data?.insertedId) {
          toast.success(`Monthly payment of $${payNow} recorded successfully`);
        }
      }
      refetchFee();
      familiesRefetch();
      handleAdminClose();
    } catch (error) {
      toast.error(error?.data?.message || "Payment recording failed");
      console.log(error);
    } finally {
      setIsProcessing(false);
      setFeeMethod("");
      setFeeMonth("");
      setFeeType("");
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

                {/* Students in Family */}
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label fw-semibold">
                    Students in Family
                  </label>
                  <div
                    className="col-sm-8 pt-2"
                    style={{ color: "green", cursor: "pointer" }}
                  >
                    {studentNames || "-"}
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
                      <option value="cash or card machine">
                        Cash or Card Machine
                      </option>
                      <option value="office payment">Office Payment</option>
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
