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

const PaymentMethodCell = ({ method }) => {
  const methodConfig = {
    "bank transfer": {
      bg: "bg-primary",
      text: "Bank Transfer",
      color: "white",
    },
    "cash payment at office": {
      bg: "bg-success",
      text: "Cash",
      color: "white",
    },
    "card machine at office": {
      bg: "bg-info",
      text: "Card Machine",
      color: "white",
    },
    instant: { bg: "bg-secondary", text: "Instant", color: "white" },
    direct_debit: { bg: "bg-dark", text: "Direct Debit", color: "white" },
  };

  const config = methodConfig[method?.toLowerCase()] || {
    bg: "bg-secondary",
    text: method || "N/A",
    color: "white",
  };

  return (
    <td className="text-center align-middle p-1">
      <div
        className={`rounded p-1 ${config.bg} ${config.color === "dark" ? "text-dark" : "text-white"}`}
      >
        {config.text}
      </div>
    </td>
  );
};

// Helper function to get row color based on payment method
const getRowColor = (method) => {
  const colorConfig = {
    "bank transfer": "#e3f2fd", // Light blue
    "cash payment at office": "#e8f5e9", // Light green
    "card machine at office": "#e0f7fa", // Light cyan
    instant: "#f3e5f5", // Light purple
    direct_debit: "#fff3e0", // Light orange
  };

  return colorConfig[method?.toLowerCase()] || "#ffffff"; // White default
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

// Payment method options for filter
const paymentMethodOptions = [
  { value: "all", label: "All Methods" },
  { value: "bank transfer", label: "Bank Transfer" },
  { value: "cash payment at office", label: "Cash Payment" },
  { value: "card machine at office", label: "Card Machine" },
  { value: "instant", label: "Instant" },
  { value: "direct_debit", label: "Direct Debit" },
  { value: "no_payment", label: "No Payment Yet" },
];

export default function FeeSettings() {
  const [showModal, setShowModal] = useState(false);
  const [adminShowModal, setAdminShowModal] = useState(false);
  const [adminManualShowModal, setAdminManualShowModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedAdminFamilyId, setSelectedAdminFamilyId] = useState(null);
  const [selectedAdminFamilyId2, setSelectedAdminFamilyId2] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");

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

  console.log("family by status", familiesByStatus);
  console.log("family", families);

  const filteredFamily = families?.filter(
    (family) => family?.childrenDocs?.length > 0,
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
    return formatDateToDmy(latest);
  };

  const getLastPaymentMethod = (feePayments = []) => {
    if (!feePayments?.length) return null;

    // Sort payments by lastPaymentDate (most recent first)
    const sortedPayments = [...feePayments]
      .filter((p) => p.lastPaymentDate && p.payments?.[0]?.method)
      .sort(
        (a, b) => new Date(b.lastPaymentDate) - new Date(a.lastPaymentDate),
      );

    if (sortedPayments.length === 0) return null;

    const latestPayment = sortedPayments[0];
    const paymentMethod = latestPayment.payments?.[0]?.method;

    return paymentMethod || null;
  };

  const filteredFamilies = useMemo(() => {
    if (!familiesByStatus) return [];

    let filtered = familiesByStatus;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const isNumber = !isNaN(parseFloat(term)) && isFinite(term);

      filtered = filtered.filter((family) => {
        if (family.name?.toLowerCase().includes(term)) return true;

        const totalMonthlyFee =
          family.childrenDocs
            ?.filter((s) => s.activity === "active")
            .reduce(
              (total, student) => total + (student.monthly_fee || 0),
              0,
            ) || 0;

        const discount = family.discount || 0;
        const discountedTotal =
          totalMonthlyFee - (totalMonthlyFee * discount) / 100;

        if (isNumber) {
          const discountedStr = discountedTotal.toFixed(2);
          if (
            discountedStr.startsWith(term) ||
            discountedStr.replace(".", "").startsWith(term)
          )
            return true;
        }

        return family.childrenDocs?.some((student) => {
          if (student.name?.toLowerCase().includes(term)) return true;
          if (student.father?.name?.toLowerCase().includes(term)) return true;
          if (student.father?.occupation?.toLowerCase().includes(term))
            return true;
          if (student.mother?.name?.toLowerCase().includes(term)) return true;
          if (student.mother?.occupation?.toLowerCase().includes(term))
            return true;
          return false;
        });
      });
    }

    // Apply payment method filter
    if (selectedPaymentMethod !== "all") {
      filtered = filtered.filter((family) => {
        const lastMethod = getLastPaymentMethod(family.feePayments);

        if (selectedPaymentMethod === "no_payment") {
          return !lastMethod;
        }

        return (
          lastMethod?.toLowerCase() === selectedPaymentMethod.toLowerCase()
        );
      });
    }

    return filtered;
  }, [familiesByStatus, searchTerm, selectedPaymentMethod]);

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
    const family = familiesByStatus?.find((f) => f._id === id);

    if (family && family.childrenDocs?.length > 0) {
      const activeStudentCount = family.childrenDocs.filter(
        (student) => student.activity === "active",
      ).length;

      if (activeStudentCount > 0) {
        Swal.fire({
          title: "Cannot Delete Family",
          html: `
          <div class="text-left">
            <p>This family has <strong>${activeStudentCount} active student(s)</strong>.</p>
            <p>Please make all students inactive before deleting this family.</p>
            <hr>
            <p class="text-muted small">Active students:</p>
            <ul class="text-left">
              ${family.childrenDocs
                .filter((s) => s.activity === "active")
                .map((s) => `<li>${s.name} (${s.status || "enrolled"})</li>`)
                .join("")}
            </ul>
          </div>
        `,
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          showCancelButton: true,
          cancelButtonText: "Go to Family",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            const familyElement = document.getElementById(`family-${id}`);
            if (familyElement) {
              familyElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              familyElement.style.backgroundColor = "#fff3cd";
              setTimeout(() => {
                familyElement.style.backgroundColor = "";
              }, 3000);
            }
          }
        });
        return;
      }
    }

    Swal.fire({
      title: "Are you sure?",
      text: "This family will be moved to trash. You can restore it later!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        deleteFamilyData(id)
          .unwrap()
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              text: "Family has been moved to trash.",
              icon: "success",
            });
            refetch();
            refetchFee();
          })
          .catch((error) => {
            console.error("Delete error:", error);

            if (
              error?.data?.error === "Cannot delete family with active students"
            ) {
              Swal.fire({
                title: "Cannot Delete Family",
                html: `
                <div class="text-left">
                  <p><strong>${error.data.message || "Please make all students inactive before deleting this family"}</strong></p>
                  ${
                    error.data.activeStudents?.length > 0
                      ? `
                    <hr>
                    <p class="text-muted small">Active students:</p>
                    <ul class="text-left">
                      ${error.data.activeStudents.map((s) => `<li>${s.name} (${s.status})</li>`).join("")}
                    </ul>
                  `
                      : ""
                  }
                </div>
              `,
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
                showCancelButton: true,
                cancelButtonText: "View Family",
                cancelButtonColor: "#d33",
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                  const familyElement = document.getElementById(`family-${id}`);
                  if (familyElement) {
                    familyElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }
              });
            } else {
              Swal.fire({
                title: "Error!",
                text:
                  error?.data?.message ||
                  "Something went wrong while deleting the family.",
                icon: "error",
              });
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
      return null;
    }

    const targetMonth = month.toString().padStart(2, "0");
    const targetYear = selectedYear.toString();

    for (const payment of feePayments || []) {
      const studentPayment = payment.students?.find(
        (s) => String(s.studentId) === String(student._id),
      );

      if (!studentPayment) continue;

      if (payment.paymentType === "admission") {
        const admissionJoiningMonth = studentPayment.joiningMonth
          ?.toString()
          .padStart(2, "0");
        const admissionJoiningYear = studentPayment.joiningYear?.toString();

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

      if (
        (payment.paymentType === "monthly" ||
          payment.paymentType === "monthlyOnHold") &&
        studentPayment.monthsPaid
      ) {
        const monthPaidEntry = studentPayment.monthsPaid.find(
          (m) =>
            String(m.month).padStart(2, "0") === targetMonth &&
            String(m.year) === targetYear,
        );

        if (monthPaidEntry) {
          if (payment.status === "pending") {
            return "pending";
          }

          if (
            payment.status === "paid" ||
            payment.status === "rejected" ||
            payment.status === "partial"
          ) {
            const fullFee =
              monthPaidEntry.discountedFee ?? monthPaidEntry.monthlyFee;
            const paid = monthPaidEntry.paid ?? 0;

            if (paid > 0 && paid < fullFee) {
              return "partial";
            }

            if (paid >= fullFee) {
              return "paid";
            }

            return "unpaid";
          }

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
        <div className="col-lg-3">
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
        <div className="col-lg-3">
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

        {/* Payment Method Filter */}
        <div className="col-lg-3">
          <div className="input-group">
            <label className="input-group-text">Payment Method:</label>
            <select
              className="form-select"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              {paymentMethodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Months Multi-Select */}
        <div className="col-lg-3">
          <Select
            isMulti
            options={monthOptions}
            value={monthOptions.filter((option) =>
              selectedMonths.includes(option.value),
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
                Payment Method
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
              (() => {
                let displayCounter = 0;
                return filteredFamilies.flatMap((family) => {
                  const hasAnyStudent = family.childrenDocs?.length > 0;
                  if (!hasAnyStudent) return [];

                  displayCounter++;

                  // Get the last payment method for row coloring
                  const lastPaymentMethod = getLastPaymentMethod(
                    family.feePayments,
                  );
                  const rowBgColor = getRowColor(lastPaymentMethod);

                  return family.childrenDocs?.map((student, studentIdx) => (
                    <tr
                      key={`${family._id}-${student._id}`}
                      style={{
                        backgroundColor:
                          studentIdx === 0 ? rowBgColor : "inherit",
                      }}
                    >
                      {studentIdx === 0 && (
                        <>
                          <td
                            rowSpan={family.childrenDocs?.length}
                            className="border h6 text-center align-middle"
                            style={{ backgroundColor: rowBgColor }}
                          >
                            {displayCounter}
                          </td>
                          <td
                            rowSpan={family.childrenDocs?.length}
                            className="border h6 text-center align-middle"
                            style={{ backgroundColor: rowBgColor }}
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
                          family.feePayments,
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
                            style={{ backgroundColor: rowBgColor }}
                          >
                            {getLastPaymentDate(family.feePayments)}
                          </td>
                          <td
                            className="border h6 text-center align-middle"
                            rowSpan={family.childrenDocs?.length}
                            style={{ backgroundColor: rowBgColor }}
                          >
                            <PaymentMethodCell
                              method={getLastPaymentMethod(family.feePayments)}
                            />
                          </td>
                          <td
                            rowSpan={family.childrenDocs?.length}
                            className="border h6 text-center align-middle"
                            style={{ backgroundColor: rowBgColor }}
                          >
                            £
                            {(() => {
                              const activeTotal =
                                family.childrenDocs
                                  ?.filter((s) => s.activity === "active")
                                  .reduce(
                                    (total, student) =>
                                      total + (student.monthly_fee || 0),
                                    0,
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
                            style={{ backgroundColor: rowBgColor }}
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
                                    style={{
                                      backgroundColor: "var(--border2)",
                                    }}
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
                  ));
                });
              })()
            ) : (
              <tr>
                <td
                  colSpan={monthsToDisplay.length + 6}
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
