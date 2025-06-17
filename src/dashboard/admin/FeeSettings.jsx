import React, { useEffect, useState } from "react";
import {
  useGetEnrolledFullFamilyWithFeesQuery,
  useGetFullFamilyQuery,
} from "../../redux/features/families/familiesApi";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import FamilyUpdateModal from "../shared/FamilyUpdateModal";
import AdminPayModal from "../shared/AdminPayModal";
import { useGetFeesByStatusQuery } from "../../redux/features/fees/feesApi";

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

export default function FeeSettings() {
  const [showModal, setShowModal] = useState(false);
  const [adminShowModal, setAdminShowModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedAdminFamilyId, setSelectedAdminFamilyId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Generate year options (current year ± 2 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return {
      value: year,
      label: year.toString(),
    };
  });
  // Keep all your original queries
  const { data: fees } = useGetFeesByStatusQuery("paid");
  const { data: familiesByStatus } = useGetEnrolledFullFamilyWithFeesQuery();
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

  const handleClose = () => setShowModal(false);
  const handleAdminClose = () => setAdminShowModal(false);

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
        axiosPublic.delete(`/families/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Family has been deleted.",
              icon: "success",
            });
            refetch();
          }
        });
      }
    });
  };

  // Modify getPaymentStatus to use selected year
  const getPaymentStatus = (student, month, feePayments) => {
    const monthStr = month.toString().padStart(2, "0");

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

    // Automatically treat joining month as "paid" due to admission fee
    if (selectedYear === joiningYear && month === joiningMonth) {
      return "paid";
    }

    // Check regular monthly payments
    for (const payment of feePayments || []) {
      if (
        payment.paymentType === "monthly" ||
        payment.paymentType === "monthlyOnHold"
      ) {
        const studentPayment = payment.students?.find(
          (s) => s.studentId === student._id
        );
        if (studentPayment?.monthsPaid) {
          const monthPaid = studentPayment.monthsPaid.find(
            (m) => m.month === monthStr && m.year === selectedYear
          );
          if (monthPaid) {
            return payment.status; // paid or pending
          }
        }
      }
    }

    return "unpaid";
  };

  if (isLoading || loading) {
    return <LoadingSpinnerDash />;
  }

  return (
    <div className=" mb-3">
      {/* Year Selection Dropdown */}
      <div className="d-flex justify-content-end mb-3">
        <div className="input-group" style={{ width: "150px" }}>
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

      <table className="table mb-0 table-responsive" style={{ minWidth: 700 }}>
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
              Discount
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
          {familiesByStatus?.length > 0 ? (
            familiesByStatus.flatMap((family, familyIdx) =>
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
                      <td key={month} className="text-center align-middle p-1">
                        —
                      </td>
                    );
                  })}

                  {studentIdx === 0 && (
                    <>
                      <td
                        rowSpan={family.childrenDocs?.length}
                        className="border h6 text-center align-middle"
                      >
                        {family.discount ? family.discount : 0}%
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
                          <button
                            className="text-white py-1 px-3 rounded-2"
                            style={{ backgroundColor: "var(--border2)" }}
                            onClick={() => handleAdminShow(family._id)}
                          >
                            Pay
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan={16} className="text-center py-4">
                <h5>No enrolled families found</h5>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Keep all your original modals */}
      <AdminPayModal
        key={selectedAdminFamilyId || "admin-modal"}
        familyId={selectedAdminFamilyId}
        adminShowModal={adminShowModal}
        handleAdminClose={handleAdminClose}
        refetch={refetch}
      />

      <FamilyUpdateModal
        key={selectedFamilyId || "family-update-modal"}
        familyId={selectedFamilyId}
        showModal={showModal}
        handleClose={handleClose}
        refetch={refetch}
      />
    </div>
  );
}
