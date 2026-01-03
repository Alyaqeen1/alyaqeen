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
import Select from "react-select";
import { Link } from "react-router";
import AdminFeeUpdateModal from "../shared/AdminFeeUpdateModal";

const PaymentStatusCell = ({ status }) => {
  const statusConfig = {
    paid: { bg: "bg-success", text: "Paid" },
    pending: { bg: "bg-warning text-dark", text: "Pending" },
    partial: { bg: "bg-info", text: "Partial" },
    unpaid: { bg: "bg-danger", text: "Unpaid" },
  };

  const config = statusConfig[status] || statusConfig.unpaid;

  return (
    <td className="text-center align-middle p-1">
      <div className={`rounded p-1 ${config.bg} text-white`}>{config.text}</div>
    </td>
  );
};

const formatDateToDmy = (input) => {
  if (!input) return "N/A";

  const date = input instanceof Date ? input : new Date(input);

  if (isNaN(date.getTime())) return "Invalid date";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// Academic months in order: September (9) to August (8)
const academicMonths = [
  { num: 1, name: "Jan" },
  { num: 2, name: "Feb" },
  { num: 3, name: "Mar" },
  { num: 4, name: "Apr" },
  { num: 5, name: "May" },
  { num: 6, name: "Jun" },
  { num: 7, name: "Jul" },
  { num: 8, name: "Aug" },
  { num: 9, name: "Sep" },
  { num: 10, name: "Oct" },
  { num: 11, name: "Nov" },
  { num: 12, name: "Dec" },
];

export default function FeeSettings() {
  const [showModal, setShowModal] = useState(false);
  const [adminShowModal, setAdminShowModal] = useState(false);
  const [adminManualShowModal, setAdminManualShowModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedAdminFamilyId, setSelectedAdminFamilyId] = useState(null);
  const [selectedAdminFamilyId2, setSelectedAdminFamilyId2] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);

  const { user, loading } = useAuth();
  const [deleteFamilyData] = useDeleteFamilyDataMutation();
  const [searchTerm, setSearchTerm] = useState("");

  // Generate year options (current year ± 2 years)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => {
      const year = currentYear - 2 + i;
      return {
        value: year,
        label: year.toString(),
      };
    });
  }, []);

  // Set default selected year to current year
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const filteredFamily = families?.filter(
    (family) => family?.childrenDocs?.length > 0
  );
  const getLastPaymentDate = (feePayments = []) => {
    if (!feePayments.length) return "N/A";

    const dates = feePayments
      .map((f) => f.lastPaymentDate)
      .filter(Boolean)
      .map((d) => new Date(d))
      .filter((d) => !isNaN(d.getTime()));

    if (!dates.length) return "N/A";

    const latest = new Date(Math.max(...dates));
    return formatDateToDmy(latest); // ✅ now works
  };

  const filteredFamilies = useMemo(() => {
    if (!familiesByStatus) return [];
    if (!searchTerm.trim()) return familiesByStatus;

    const term = searchTerm.toLowerCase();
    return familiesByStatus.filter((family) => {
      if (family.name.toLowerCase().includes(term)) return true;
      return family.childrenDocs?.some((student) =>
        student.name.toLowerCase().includes(term)
      );
    });
  }, [familiesByStatus, searchTerm]);

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

  useEffect(() => {
    refetch();
  }, []);

  const monthsToDisplay = useMemo(() => {
    if (selectedMonths.length > 0) {
      return academicMonths.filter((m) => selectedMonths.includes(m.num));
    }
    return academicMonths;
  }, [selectedMonths]);

  const getPaymentStatus = (student, month, feePayments) => {
    if (!student.startingDate) return "unpaid";

    const joining = new Date(student.startingDate);
    const joiningMonth = joining.getMonth() + 1;
    const joiningYear = joining.getFullYear();

    if (
      selectedYear < joiningYear ||
      (selectedYear === joiningYear && month < joiningMonth)
    ) {
      return null; // before joining date
    }

    const targetMonth = month.toString().padStart(2, "0");
    const targetYear = selectedYear.toString();

    for (const payment of feePayments || []) {
      const studentPayment = payment.students?.find(
        (s) => String(s.studentId) === String(student._id)
      );

      if (!studentPayment) continue;

      // ✅ FIXED: Handle ADMISSION payments - check joining month/year
      if (payment.paymentType === "admission") {
        const admissionJoiningMonth = studentPayment.joiningMonth
          ?.toString()
          .padStart(2, "0");
        const admissionJoiningYear = studentPayment.joiningYear?.toString();

        // Check if this admission payment is for the target month/year
        if (
          admissionJoiningMonth === targetMonth &&
          admissionJoiningYear === targetYear
        ) {
          if (payment.status === "paid") {
            return "paid";
          }
          return "paid";
        }
      }

      // ✅ FIXED: Handle BOTH monthly AND monthlyOnHold payments
      if (
        (payment.paymentType === "monthly" ||
          payment.paymentType === "monthlyOnHold") &&
        studentPayment.monthsPaid
      ) {
        const monthPaidEntry = studentPayment.monthsPaid.find(
          (m) =>
            String(m.month).padStart(2, "0") === targetMonth &&
            String(m.year) === targetYear
        );

        if (monthPaidEntry) {
          // ✅ FIRST: Check payment status for pending payments
          if (payment.status === "pending") {
            return "pending";
          }

          // ✅ SECOND: For paid/rejected payments, check the actual payment amounts
          if (
            payment.status === "paid" ||
            payment.status === "rejected" ||
            payment.status === "partial"
          ) {
            const fullFee =
              monthPaidEntry.discountedFee ?? monthPaidEntry.monthlyFee;
            const paid = monthPaidEntry.paid ?? 0;

            // ✅ Check if this is a partial payment (paid < fullFee)
            if (paid > 0 && paid < fullFee) {
              return "partial";
            }

            // ✅ Check if this is a full payment
            if (paid >= fullFee) {
              return "paid";
            }

            // ✅ No payment made
            return "unpaid";
          }

          // ✅ Default for other statuses
          return payment.status === "paid" ? "paid" : "unpaid";
        }
      }
    }

    return "unpaid";
  };
  const monthOptions = academicMonths.map((m) => ({
    value: m.num,
    label: m.name,
  }));

  if (isLoading || loading || isLoadingFee) {
    return <LoadingSpinnerDash />;
  }

  return (
    <div className="mb-3">
      {/* Filters */}
      <div className="row mb-3 g-2">
        {/* Search Field */}
        <div className="col-lg-4">
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
        </div>

        {/* Academic Year Selector */}
        <div className="col-lg-4">
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

        {/* Custom Months Multi-Select */}
        <div className="col-lg-4">
          <Select
            isMulti
            options={monthOptions}
            value={monthOptions.filter((option) =>
              selectedMonths.includes(option.value)
            )}
            onChange={(selectedOptions) => {
              setSelectedMonths(selectedOptions.map((opt) => opt.value));
            }}
            closeMenuOnSelect={false}
            placeholder="Select months..."
          />
        </div>
      </div>

      <div className="table-responsive mb-3">
        <table className="table mb-0" style={{ minWidth: 700 }}>
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
              {monthsToDisplay.map((month) => (
                <th
                  key={month.num}
                  style={{ backgroundColor: "var(--border2)" }}
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                >
                  {month.name}
                </th>
              ))}
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                Last Payment Date
              </th>
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
                      <Link
                        className="text-dark student-link"
                        to={`/dashboard/admin/view-student/${student?._id}`}
                      >
                        {student?.activity === "active" ? student?.name : ""}
                      </Link>
                      <br />
                      {student?.activity === "active"
                        ? `(${formatDateToDmy(student?.startingDate)})`
                        : ""}
                    </td>
                    {monthsToDisplay.map((month) => {
                      const status = getPaymentStatus(
                        student,
                        month.num,
                        family.feePayments
                      );
                      return status ? (
                        <PaymentStatusCell key={month.num} status={status} />
                      ) : (
                        <td
                          key={month.num}
                          className="text-center align-middle p-1 bg-secondary-subtle"
                        >
                          N/A
                        </td>
                      );
                    })}
                    {studentIdx === 0 && (
                      <>
                        <td
                          className="border h6 text-center align-middle"
                          rowSpan={family.childrenDocs?.length}
                        >
                          {getLastPaymentDate(family.feePayments)}
                        </td>

                        <td
                          rowSpan={family.childrenDocs?.length}
                          className="border h6 text-center align-middle"
                        >
                          £
                          {(() => {
                            const activeTotal =
                              family.childrenDocs
                                ?.filter((s) => s.activity === "active")
                                .reduce(
                                  (total, student) =>
                                    total + (student.monthly_fee || 0),
                                  0
                                ) || 0;

                            const discount = family.discount || 0;
                            const discountedTotal =
                              activeTotal - (activeTotal * discount) / 100;

                            return discountedTotal;
                          })()}
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
                <td
                  colSpan={monthsToDisplay.length + 5}
                  className="text-center py-4"
                >
                  <h5>No enrolled families found</h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
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
      {selectedFamilyId && (
        <FamilyUpdateModal
          key={`update-${selectedFamilyId}`}
          familyId={selectedFamilyId}
          showModal={showModal}
          handleClose={handleClose}
          refetch={refetch}
          refetchFee={refetchFee}
        />
      )}
    </div>
  );
}
