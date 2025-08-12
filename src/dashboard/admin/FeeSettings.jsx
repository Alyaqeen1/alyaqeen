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

const formatDateToDmy = (dateStr) => {
  if (!dateStr) return "N/A";

  const [part1, part2, part3] = dateStr.split("-");
  const year = part1;
  const day = part3?.length === 2 ? part3 : part2;
  const month = part3?.length === 2 ? part2 : part3;

  return `${day}-${month}-${year}`;
};

// Academic months in order: September (9) to August (8)
const academicMonths = [
  { num: 9, name: "Sep" },
  { num: 10, name: "Oct" },
  { num: 11, name: "Nov" },
  { num: 12, name: "Dec" },
  { num: 1, name: "Jan" },
  { num: 2, name: "Feb" },
  { num: 3, name: "Mar" },
  { num: 4, name: "Apr" },
  { num: 5, name: "May" },
  { num: 6, name: "Jun" },
  { num: 7, name: "Jul" },
  { num: 8, name: "Aug" },
];

export default function FeeSettings() {
  const [showModal, setShowModal] = useState(false);
  const [adminShowModal, setAdminShowModal] = useState(false);
  const [adminManualShowModal, setAdminManualShowModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedAdminFamilyId, setSelectedAdminFamilyId] = useState(null);
  const [selectedAdminFamilyId2, setSelectedAdminFamilyId2] = useState(null);
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { user, loading } = useAuth();
  const [deleteFamilyData] = useDeleteFamilyDataMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");

  // Generate academic year options (current academic year ± 2 years)
  const academicYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const academicYearStart = currentMonth >= 9 ? currentYear : currentYear - 1;

    return Array.from({ length: 5 }, (_, i) => {
      const year = academicYearStart - 2 + i;
      return {
        value: `${year}/${year + 1}`,
        label: `${year}/${year + 1}`,
        startYear: year,
        endYear: year + 1,
      };
    });
  }, []);

  // Now set default selected year to "2024/2025" if available, else first option
  const defaultAcademicYear =
    academicYearOptions.find((option) => option.value === "2024/2025")?.value ||
    academicYearOptions[0]?.value ||
    "";

  const [selectedYear, setSelectedYear] = useState(defaultAcademicYear);

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
    if (semesterFilter === "semester1") {
      return academicMonths.slice(0, 6); // Sep-Feb
    } else if (semesterFilter === "semester2") {
      return academicMonths.slice(6); // Mar-Aug
    }
    return academicMonths; // All months
  }, [semesterFilter]);

  const getPaymentStatus = (student, month, feePayments) => {
    if (!student.startingDate) return "unpaid";

    const joining = new Date(student.startingDate);
    const joiningMonth = joining.getMonth() + 1;
    const joiningYear = joining.getFullYear();

    // Get the selected academic year range
    const selectedAcademicYear = academicYearOptions.find(
      (year) => year.value === selectedYear
    );
    if (!selectedAcademicYear) return "unpaid";

    // Determine the actual year for each month
    // Months 9-12 (Sep-Dec) belong to startYear, months 1-8 (Jan-Aug) belong to endYear
    const actualYear =
      month >= 9
        ? selectedAcademicYear.startYear
        : selectedAcademicYear.endYear;

    // Skip if student joined after this month/year
    if (
      actualYear < joiningYear ||
      (actualYear === joiningYear && month < joiningMonth)
    ) {
      return null; // Student wasn't enrolled yet
    }

    // Convert to comparable formats
    const targetMonth = month.toString();
    const targetMonthPadded = month.toString().padStart(2, "0");
    const targetYear = actualYear.toString();

    // Check all fee payments for this student
    for (const payment of feePayments || []) {
      const studentPayment = payment.students?.find(
        (s) => String(s.studentId) === String(student._id)
      );

      if (!studentPayment) continue;

      // Check admission payments (for joining month only)
      if (
        payment.paymentType === "admission" &&
        actualYear === joiningYear &&
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
    <div className="mb-3">
      {/* Filters */}
      <div className="d-flex justify-content-end mb-3 gap-2">
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
          <label className="input-group-text">Academic Year:</label>
          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {academicYearOptions.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text">Semester:</label>
          <select
            className="form-select"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="all">All Months (Sep-Aug)</option>
            <option value="semester1">Semester 1 (Sep-Feb)</option>
            <option value="semester2">Semester 2 (Mar-Aug)</option>
          </select>
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
                      {student?.activity === "active" ? student?.name : ""}
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

                            const discount = family.discount || 0; // if 10, means 10%

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
                <td
                  colSpan={monthsToDisplay.length + 5} // Adjust based on visible columns
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
