import React, { useState, useMemo } from "react";
import {
  useCollectAdminPaymentMutation,
  useGetAdminDirectDebitFamiliesQuery,
} from "../../redux/features/families/familiesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Select from "react-select";
import DirectDebitPayModal from "../shared/DirectDebitPayModal";

// Academic months
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

export default function AdminDirectDebit() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdminFamilyId2, setSelectedAdminFamilyId2] = useState(null);
  const [adminManualShowModal, setAdminManualShowModal] = useState(false);
  const handleAdminManualShow = (id) => {
    setSelectedAdminFamilyId2(id);
    setAdminManualShowModal(true);
  };
  const handleAdminManualClose = () => setAdminManualShowModal(false);

  const { data, isLoading, refetch } = useGetAdminDirectDebitFamiliesQuery();
  const [collectPayment, { isLoading: isCollecting }] =
    useCollectAdminPaymentMutation();

  // Filter active families
  const activeFamilies = useMemo(() => {
    return (
      data?.families?.filter(
        (f) =>
          f.directDebit?.status === "active" &&
          f.directDebit?.mandateStatus === "active"
      ) || []
    );
  }, [data]);

  // Filter families by search term
  const filteredFamilies = useMemo(() => {
    if (!data?.families) return [];
    if (!searchTerm.trim()) return data.families;

    const term = searchTerm.toLowerCase();
    return data.families.filter((family) => {
      if (family.name.toLowerCase().includes(term)) return true;
      if (family.email.toLowerCase().includes(term)) return true;
      return family.childrenDocs?.some((student) =>
        student.name.toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm]);

  // Months to display
  const monthsToDisplay = useMemo(() => {
    if (selectedMonths.length > 0) {
      return academicMonths.filter((m) => selectedMonths.includes(m.num));
    }
    return academicMonths;
  }, [selectedMonths]);

  // Year options
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

  // Month options for multi-select
  const monthOptions = academicMonths.map((m) => ({
    value: m.num,
    label: m.name,
  }));

  // Use the same getPaymentStatus function from your FeeSettings component
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

      // Handle ADMISSION payments
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

      // Handle monthly payments
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

  if (isLoading) return <LoadingSpinnerDash />;

  return (
    <div className="pt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="fs-2 fw-bold text-center mb-4">
            Direct Debit Management
          </h2>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 col-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="card-title text-primary fs-4 fw-bold">
                    {data?.stats?.total || 0}
                  </h5>
                  <p className="card-text text-muted mb-0">Total DD Families</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div className="card border-0 shadow-sm h-100 border-start border-4 border-success">
                <div className="card-body text-center">
                  <h5 className="card-title text-success fs-4 fw-bold">
                    {data?.stats?.active || 0}
                  </h5>
                  <p className="card-text text-muted mb-0">Active</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div className="card border-0 shadow-sm h-100 border-start border-4 border-warning">
                <div className="card-body text-center">
                  <h5 className="card-title text-warning fs-4 fw-bold">
                    {data?.stats?.pending || 0}
                  </h5>
                  <p className="card-text text-muted mb-0">Pending</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div className="card border-0 shadow-sm h-100 border-start border-4 border-purple">
                <div className="card-body text-center">
                  <h5 className="card-title text-purple fs-4 fw-bold">
                    {activeFamilies.length}
                  </h5>
                  <p className="card-text text-muted mb-0">Ready to Collect</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="row mb-3 g-2">
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

          {/* Direct Debit Families Table */}
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h4 className="card-title mb-0 fw-bold">
                Direct Debit Families - Monthly Payment Status
              </h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table mb-0" style={{ minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th
                        style={{ backgroundColor: "var(--border2)" }}
                        className="text-white fw-bolder border h6 text-center align-middle"
                      >
                        #
                      </th>
                      <th
                        style={{ backgroundColor: "var(--border2)" }}
                        className="text-white fw-bolder border h6 text-center align-middle"
                      >
                        Family
                      </th>
                      <th
                        style={{ backgroundColor: "var(--border2)" }}
                        className="text-white fw-bolder border h6 text-center align-middle"
                      >
                        Student
                      </th>
                      {monthsToDisplay.map((month) => (
                        <th
                          key={month.num}
                          style={{ backgroundColor: "var(--border2)" }}
                          className="text-white fw-bolder border h6 text-center align-middle"
                        >
                          {month.name}
                        </th>
                      ))}
                      <th
                        style={{ backgroundColor: "var(--border2)" }}
                        className="text-white fw-bolder border h6 text-center align-middle"
                      >
                        DD Status
                      </th>
                      <th
                        style={{ backgroundColor: "var(--border2)" }}
                        className="text-white fw-bolder border h6 text-center align-middle"
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
                              {student?.activity === "active"
                                ? student?.name
                                : ""}
                            </td>
                            {monthsToDisplay.map((month) => {
                              const status = getPaymentStatus(
                                student,
                                month.num,
                                family.feePayments
                              );
                              return status ? (
                                <PaymentStatusCell
                                  key={month.num}
                                  status={status}
                                />
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
                                  className="border text-center align-middle"
                                >
                                  <span
                                    className={`badge ${
                                      family.directDebit?.status === "active"
                                        ? "bg-success"
                                        : family.directDebit?.status ===
                                          "pending"
                                        ? "bg-warning"
                                        : "bg-danger"
                                    } text-white px-2 py-1`}
                                  >
                                    {family.directDebit?.status?.toUpperCase()}
                                  </span>
                                </td>
                                <td
                                  rowSpan={family.childrenDocs?.length}
                                  className="border text-center align-middle"
                                >
                                  {family.directDebit?.status === "active" && (
                                    <button
                                      onClick={() =>
                                        handleAdminManualShow(family._id)
                                      }
                                      className="btn btn-primary btn-sm fw-semibold"
                                    >
                                      Collect Payments
                                    </button>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={monthsToDisplay.length + 6}
                          className="text-center py-4"
                        >
                          <h5>No Direct Debit families found</h5>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedAdminFamilyId2 && (
        <DirectDebitPayModal
          key={`admin-pay-${selectedAdminFamilyId2}`}
          familyId={selectedAdminFamilyId2}
          adminShowModal={adminManualShowModal}
          handleAdminClose={handleAdminManualClose}
          refetch={refetch}
        />
      )}
    </div>
  );
}
