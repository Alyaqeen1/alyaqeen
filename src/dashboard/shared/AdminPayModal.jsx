import React, { useState } from "react";
import { useGetStudentsQuery } from "../../redux/features/students/studentsApi";
import { useGetFamilyQuery } from "../../redux/features/families/familiesApi";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import feeStructure from "../../utils/feeStructure";

export default function AdminPayModal({
  familyId,
  handleAdminClose,
  adminShowModal,
  refetch: familiesRefetch,
}) {
  const [fee, setFee] = useState(0);
  const {
    data: family,
    isLoading,
    refetch,
  } = useGetFamilyQuery(familyId, {
    skip: !familyId, // Prevent fetching until user is fully loaded
    refetchOnMountOrArgChange: true,
  });
  const { data: students, isLoading: studentLoading } = useGetStudentsQuery();
  const filteredStudents = students?.filter((student) =>
    family?.children?.includes(student.uid || student._id)
  ); // exclude already-added
  const axiosPublic = useAxiosPublic();
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
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  });

  const [selectedMonth, setSelectedMonth] = useState("June");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fee = form.fee.value;
    const fee_month = selectedMonth;
    const fee_year = selectedYear;
    const payment_date = paymentDate;

    const paymentData = {
      familyId,
      name: family.name,
      email: family.email,
      payment_type: "monthly",
      amount: fee,
      fee_month,
      fee_year,
      payment_date,
    };

    try {
      const { data } = await axiosPublic.post(
        "/fees/monthly-fees",
        paymentData
      );
      if (data.insertedId) {
        toast.success(`${fee_month} payment successful`);
        refetch();
        familiesRefetch();
        handleAdminClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };
  return (
    <div>
      {adminShowModal && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${adminShowModal ? "show" : ""}`}
        tabIndex="-1"
        aria-hidden={!adminShowModal}
        style={{
          display: adminShowModal ? "block" : "none",
          zIndex: 1050,
        }}
        onClick={(e) => {
          if (e.target.classList.contains("modal")) handleAdminClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Pay Fees</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleAdminClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            {/* // Inside AdminPayModal.jsx (replace your return JSX with this one) */}
            <div className="modal-body p-4">
              <table className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Joining Month</th>
                    <th>Unpaid Months</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents?.map((child) => {
                    const joiningDate = new Date(child?.startingDate);
                    const selectedDate = new Date(
                      `${selectedMonth} 1, ${selectedYear}`
                    );
                    const hasJoined =
                      joiningDate.getFullYear() < selectedDate.getFullYear() ||
                      (joiningDate.getFullYear() ===
                        selectedDate.getFullYear() &&
                        joiningDate.getMonth() <= selectedDate.getMonth());

                    const feeAmount =
                      hasJoined &&
                      feeStructure.monthlyFees?.[child?.academic?.department]?.[
                        child?.academic?.session
                      ]
                        ? feeStructure.monthlyFees[child.academic.department][
                            child.academic.session
                          ]
                        : 0;

                    return (
                      <tr key={child._id}>
                        <td>{child?.name}</td>
                        <td>{child?.startingDate}</td>
                        <td>
                          {hasJoined ? `${selectedMonth}` : "Not Joined Yet"}
                        </td>
                        <td>{hasJoined ? `$${feeAmount}` : "$0"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="text-end mt-2">
                <strong>
                  Grand Total: $
                  {filteredStudents?.reduce((sum, child) => {
                    const joiningDate = new Date(child?.startingDate);
                    const selectedDate = new Date(
                      `${selectedMonth} 1, ${selectedYear}`
                    );
                    const hasJoined =
                      joiningDate.getFullYear() < selectedDate.getFullYear() ||
                      (joiningDate.getFullYear() ===
                        selectedDate.getFullYear() &&
                        joiningDate.getMonth() <= selectedDate.getMonth());

                    const feeAmount =
                      hasJoined &&
                      feeStructure.monthlyFees?.[child?.academic?.department]?.[
                        child?.academic?.session
                      ]
                        ? feeStructure.monthlyFees[child.academic.department][
                            child.academic.session
                          ]
                        : 0;

                    return sum + feeAmount;
                  }, 0)}
                </strong>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Year, Month, Date Pickers */}
                  {/* ... (same as before) */}

                  <div className="mb-3 col-12">
                    <label className="form-label">
                      <strong>Pay Now:</strong>
                    </label>
                    <input
                      style={{ borderColor: "var(--border2)" }}
                      name="fee"
                      className="form-control"
                      type="number"
                      readOnly
                      value={filteredStudents?.reduce((sum, child) => {
                        const joiningDate = new Date(child?.startingDate);
                        const selectedDate = new Date(
                          `${selectedMonth} 1, ${selectedYear}`
                        );
                        const hasJoined =
                          joiningDate.getFullYear() <
                            selectedDate.getFullYear() ||
                          (joiningDate.getFullYear() ===
                            selectedDate.getFullYear() &&
                            joiningDate.getMonth() <= selectedDate.getMonth());

                        const feeAmount =
                          hasJoined &&
                          feeStructure.monthlyFees?.[
                            child?.academic?.department
                          ]?.[child?.academic?.session]
                            ? feeStructure.monthlyFees[
                                child.academic.department
                              ][child.academic.session]
                            : 0;

                        return sum + feeAmount;
                      }, 0)}
                    />
                  </div>

                  <div className="">
                    <button
                      type="submit"
                      style={{ backgroundColor: "var(--border2)" }}
                      className="btn text-white"
                    >
                      Pay Full Fee
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
