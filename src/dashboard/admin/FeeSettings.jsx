import React, { useEffect, useMemo, useState } from "react";
import {
  useDeleteFamilyDataMutation,
  useGetEnrolledFullFamilyWithFeesQuery,
  useGetFullFamilyQuery,
} from "../../redux/features/families/familiesApi";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import FamilyUpdateModal from "../shared/FamilyUpdateModal";
import AdminPayModal from "../shared/AdminPayModal";
import { useGetFeesByStatusQuery } from "../../redux/features/fees/feesApi";
import AdminManualPayModal from "../shared/AdminManualPayModal";

const PaymentStatusCell = ({ status }) => {
  const statusConfig = {
    paid: { bg: "bg-success", text: "Paid" },
    pending: { bg: "bg-warning text-dark", text: "Pending" },
    unpaid: { bg: "bg-danger", text: "Unpaid" },
  };

  const config = statusConfig[status] || statusConfig.unpaid;

  return (
    <td className="text-center align-middle p-1">
      <div className={`rounded p-1 ${config.bg} text-white`}>{config.text}</div>
    </td>
  );
};
// In your React component where you display dates:
const formatDateToDmy = (dateStr) => {
  if (!dateStr) return "N/A";

  // Handle both YYYY-MM-DD and YYYY-DD-MM formats
  const [part1, part2, part3] = dateStr.split("-");

  // Determine which part is day/month/year (assuming year is always first)
  const year = part1;
  const day = part3?.length === 2 ? part3 : part2; // Fallback to part2 if needed
  const month = part3?.length === 2 ? part2 : part3; // Fallback to part3 if needed

  return `${day}-${month}-${year}`;
};

export default function FeeSettings() {
  const [showModal, setShowModal] = useState(false);
  const [adminShowModal, setAdminShowModal] = useState(false);
  const [adminManualShowModal, setAdminManualShowModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedAdminFamilyId, setSelectedAdminFamilyId] = useState(null);
  const [selectedAdminFamilyId2, setSelectedAdminFamilyId2] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { user, loading } = useAuth();
  const [deleteFamilyData] = useDeleteFamilyDataMutation();
  const [searchTerm, setSearchTerm] = useState("");

  // Generate year options (current year ± 2 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return {
      value: year,
      label: year.toString(),
    };
  });
  // Keep all your original queries
  const {
    data: familiesByStatus,
    isLoading: isLoadingFee,
    refetch: refetchFee,
  } = useGetEnrolledFullFamilyWithFeesQuery();
  const {
    data: families,
    isLoading,
    refetch,
  } = useGetFullFamilyQuery(user?.email, {
    skip: loading || !user?.email,
  });

  // Keep your filtered family logic
  const filteredFamily = families?.filter(
    (family) => family?.childrenDocs?.length > 0
  );

  // Keep all your original handlers exactly as they were
  const handleShow = (id) => {
    setSelectedFamilyId(id);
    setShowModal(true);
  };

  const handleAdminShow = (id) => {
    setSelectedAdminFamilyId(id);
    setAdminShowModal(true);
  };
  const handleAdminManualShow = (id) => {
    setSelectedAdminFamilyId2(id);
    setAdminManualShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleAdminClose = () => setAdminShowModal(false);
  const handleAdminManualClose = () => setAdminManualShowModal(false);
  const filteredFamilies = useMemo(() => {
    if (!familiesByStatus) return [];
    if (!searchTerm.trim()) return familiesByStatus;

    const term = searchTerm.toLowerCase();
    return familiesByStatus.filter((family) => {
      // Search family name
      if (family.name.toLowerCase().includes(term)) return true;

      // Search student names
      return family.childrenDocs?.some((student) =>
        student.name.toLowerCase().includes(term)
      );
    });
  }, [familiesByStatus, searchTerm]);
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // axiosPublic.delete(`/families/${id}`)
        deleteFamilyData(id)
          .unwrap()
          .then((res) => {
            if (res?.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Family has been deleted.",
                icon: "success",
              });
              refetch();
              refetchFee();
            }
          });
      }
    });
  };

  // Modify getPaymentStatus to use selected year
  // const getPaymentStatus = (student, month, feePayments) => {
  //   const monthStr = month.toString().padStart(2, "0");

  //   if (!student.startingDate) return "unpaid";

  //   const joining = new Date(student.startingDate);
  //   const joiningMonth = joining.getMonth() + 1;
  //   const joiningYear = joining.getFullYear();

  //   // Skip if student joined after this month/year
  //   if (
  //     selectedYear < joiningYear ||
  //     (selectedYear === joiningYear && month < joiningMonth)
  //   ) {
  //     return null;
  //   }

  //   // Check all payment types that could cover admission
  //   const admissionPayments = feePayments?.filter(
  //     (payment) =>
  //       payment.paymentType === "admission" ||
  //       payment.paymentType === "admissionOnHold"
  //   );

  //   // If this is the joining month, check admission payments
  //   if (selectedYear === joiningYear && month === joiningMonth) {
  //     for (const payment of admissionPayments || []) {
  //       const studentPayment = payment.students?.find(
  //         (s) => s.studentId === student._id
  //       );
  //       if (studentPayment) {
  //         return payment.status; // Return the actual status (paid/pending)
  //       }
  //     }
  //     return "unpaid"; // No admission payment found
  //   }

  //   // Check regular monthly payments
  //   for (const payment of feePayments || []) {
  //     if (
  //       payment.paymentType === "monthly" ||
  //       payment.paymentType === "monthlyOnHold"
  //     ) {
  //       const studentPayment = payment.students?.find(
  //         (s) => s.studentId === student._id
  //       );
  //       if (studentPayment?.monthsPaid) {
  //         const monthPaid = studentPayment.monthsPaid.find(
  //           (m) => m.month === monthStr && m.year === selectedYear
  //         );
  //         if (monthPaid) {
  //           return payment.status; // paid or pending
  //         }
  //       }
  //     }
  //   }

  //   return "unpaid";
  // };

  const getPaymentStatus = (student, month, feePayments) => {
    if (!student.startingDate) return "unpaid";

    const joining = new Date(student.startingDate);
    const joiningMonth = joining.getMonth() + 1;
    const joiningYear = joining.getFullYear();

    // Skip if student joined after this month/year
    if (
      selectedYear < joiningYear ||
      (selectedYear === joiningYear && month < joiningMonth)
    ) {
      return null;
    }

    // Convert to comparable formats
    const targetMonth = month.toString();
    const targetMonthPadded = month.toString().padStart(2, "0");
    const targetYear = selectedYear.toString();

    // Check all fee payments for this student
    for (const payment of feePayments || []) {
      const studentPayment = payment.students?.find(
        (s) => String(s.studentId) === String(student._id)
      );

      if (!studentPayment) continue;

      // Check admission payments (for joining month only)
      if (
        payment.paymentType === "admission" &&
        selectedYear === joiningYear &&
        month === joiningMonth
      ) {
        return payment.status;
      }

      // Check monthly payments
      if (payment.paymentType === "monthly" && studentPayment.monthsPaid) {
        const isPaid = studentPayment.monthsPaid.some(
          (m) =>
            (String(m.month) === targetMonth ||
              String(m.month) === targetMonthPadded) &&
            String(m.year) === targetYear
        );

        if (isPaid) return payment.status;
      }
    }

    return "unpaid";
  };

  if (isLoading || loading || isLoadingFee) {
    return <LoadingSpinnerDash />;
  }

  return (
    <div className=" mb-3">
      {/* Year Selection Dropdown */}
      <div className="d-flex justify-content-end mb-3 gap-5">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search families or students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setSearchTerm("")}
          >
            Clear
          </button>
        </div>
        <div className="input-group">
          <label className="input-group-text">Year:</label>
          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {yearOptions.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive mb-3">
        <table
          className="table mb-0"
          style={{
            minWidth: 700,
          }}
        >
          <thead>
            <tr>
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                #
              </th>
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                Family
              </th>
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                Student
              </th>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                <th
                  key={month}
                  style={{ backgroundColor: "var(--border2)" }}
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                >
                  {new Date(2025, month - 1).toLocaleString("default", {
                    month: "short",
                  })}
                </th>
              ))}
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                Fee
              </th>
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFamilies?.length > 0 ? (
              filteredFamilies.flatMap((family, familyIdx) =>
                family.childrenDocs?.map((student, studentIdx) => (
                  <tr key={`${family._id}-${student._id}`}>
                    {studentIdx === 0 && (
                      <>
                        <td
                          rowSpan={family.childrenDocs?.length}
                          className="border h6 text-center align-middle"
                        >
                          {familyIdx + 1}
                        </td>
                        <td
                          rowSpan={family.childrenDocs?.length}
                          className="border h6 text-center align-middle"
                        >
                          {family.name}
                        </td>
                      </>
                    )}
                    <td className="border h6 text-center align-middle">
                      {student.name}
                      <br />({formatDateToDmy(student?.startingDate)})
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                      const status = getPaymentStatus(
                        student,
                        month,
                        family.feePayments
                      );
                      return status ? (
                        <PaymentStatusCell key={month} status={status} />
                      ) : (
                        <td
                          key={month}
                          className="text-center align-middle p-1 bg-secondary-subtle"
                        >
                          N/A
                        </td>
                      );
                    })}

                    {studentIdx === 0 && (
                      <>
                        <td
                          rowSpan={family.childrenDocs?.length}
                          className="border h6 text-center align-middle"
                        >
                          €
                          {family.childrenDocs
                            ? family.childrenDocs.reduce(
                                (total, student) =>
                                  total + (student.monthly_fee || 0),
                                0
                              )
                            : 0}
                        </td>

                        <td
                          rowSpan={family.childrenDocs?.length}
                          className="border text-center align-middle"
                        >
                          <div className="d-flex flex-column gap-2 justify-content-center align-items-center h-100">
                            <div className="d-flex gap-2 justify-content-center align-items-center">
                              <button
                                className="text-white py-1 px-2 rounded-2"
                                style={{ backgroundColor: "var(--border2)" }}
                                onClick={() => handleShow(family._id)}
                              >
                                <FaPen />
                              </button>
                              <button
                                className="text-white py-1 px-2 rounded-2"
                                style={{ backgroundColor: "var(--border2)" }}
                                onClick={() => handleDelete(family._id)}
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                            <div className="d-flex flex-column gap-2 justify-content-center align-items-center h-100">
                              <div className="d-flex gap-1 justify-content-center align-items-center">
                                <button
                                  className="text-white py-1 px-2 rounded-2"
                                  style={{ backgroundColor: "var(--border2)" }}
                                  onClick={() => handleAdminShow(family._id)}
                                >
                                  Pay
                                </button>
                                <button
                                  className="text-white py-1 px-2 rounded-2"
                                  style={{ backgroundColor: "var(--border2)" }}
                                  onClick={() =>
                                    handleAdminManualShow(family._id)
                                  }
                                >
                                  Manual
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={17} className="text-center py-4">
                  <h5>No enrolled families found</h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Keep all your original modals */}
      {selectedAdminFamilyId && (
        <AdminPayModal
          key={`admin-pay-${selectedAdminFamilyId}`}
          familyId={selectedAdminFamilyId}
          adminShowModal={adminShowModal}
          handleAdminClose={handleAdminClose}
          refetch={refetch}
          refetchFee={refetchFee}
        />
      )}
      {selectedAdminFamilyId2 && (
        <AdminManualPayModal
          key={`admin-pay-${selectedAdminFamilyId2}`}
          familyId={selectedAdminFamilyId2}
          adminShowModal={adminManualShowModal}
          handleAdminClose={handleAdminManualClose}
          refetch={refetch}
          refetchFee={refetchFee}
        />
      )}

      <FamilyUpdateModal
        // key={selectedFamilyId || "family-update-modal"}
        familyId={selectedFamilyId}
        showModal={showModal}
        handleClose={handleClose}
        refetch={refetch}
        refetchFee={refetchFee}
      />
    </div>
  );
}
