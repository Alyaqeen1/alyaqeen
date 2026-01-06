import React, { useState, useEffect, useMemo } from "react";
import { useGetUnpaidFamilyQuery } from "../../redux/features/families/familiesApi";
import { FaPen } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { useDeleteFeeMutation } from "../../redux/features/fees/feesApi";

import AdminFeeUpdateModal from "../shared/AdminFeeUpdateModal";

export default function UnpaidList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteFee] = useDeleteFeeMutation();
  const [selectedAdminFamilyId, setSelectedAdminFamilyId] = useState(null);
  const [selectedFeeData, setSelectedFeeData] = useState({
    familyId: null,
    feeId: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [adminShowModal, setAdminShowModal] = useState(false);

  const handleAdminShow = (familyId, feeId) => {
    setSelectedFeeData({ familyId, feeId });
    setAdminShowModal(true);
  };

  const handleAdminClose = () => setAdminShowModal(false);
  // Get current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Parse query params from URL
  const searchParams = new URLSearchParams(location.search);
  const initialMonth = searchParams.get("month") || currentMonth.toString();
  const initialYear = searchParams.get("year") || currentYear.toString();

  // State for filters
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  // Local loading state
  const [localLoading, setLocalLoading] = useState(false);

  // Sync URL with selected filters
  useEffect(() => {
    setLocalLoading(true); // start local loading when filters change
    navigate(`?month=${month}&year=${year}`);
  }, [month, year, navigate]);

  // Month names
  const monthNames = [
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

  // Generate year options
  const yearOptions = [];
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    yearOptions.push(i);
  }

  // Query
  const {
    data: families = [],
    isLoading,
    error,
    isFetching, // important: RTK Query provides this when refetching
    refetch,
  } = useGetUnpaidFamilyQuery({ month: parseInt(month), year: parseInt(year) });
  // Filter families based on search query
  const filteredFamilies = useMemo(() => {
    if (!searchQuery.trim()) return families;

    const query = searchQuery.toLowerCase().trim();

    return families
      .map((family) => {
        // Filter unpaid students within this family
        const filteredStudents = family.unpaidStudents.filter(
          (student) =>
            student.studentName.toLowerCase().includes(query) ||
            family.familyName.toLowerCase().includes(query)
        );

        if (filteredStudents.length === 0) return null;

        // Return family with filtered students and recalculated totals
        return {
          ...family,
          unpaidStudents: filteredStudents,
          totalUnpaidAmount: filteredStudents.reduce(
            (sum, student) => sum + student.remainingAmount,
            0
          ),
        };
      })
      .filter((family) => family !== null); // Remove families with no matching students
  }, [families, searchQuery]);
  // Turn off local loading once fetching is done
  useEffect(() => {
    if (!isFetching) {
      setLocalLoading(false);
    }
  }, [isFetching]);

  if (isLoading || localLoading) {
    return <LoadingSpinnerDash />;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-danger">
        Error loading data: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center`}>
        Partially/Unpaid List of {monthNames[parseInt(month) - 1]} {year}
      </h3>
      {/* Filters and Search - Full width row */}
      <div className="row align-items-end mb-4 g-3">
        {/* 🔍 Search Bar */}
        <div className="col-12 col-lg-6">
          <label className="form-label mb-1 fw-semibold">Search</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by family or student name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </button>
          </div>
        </div>

        {/* 📅 Month */}
        <div className="col-6 col-lg-3">
          <label className="form-label mb-1 fw-semibold">Month</label>
          <select
            className="form-control form-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
          >
            {monthNames.map((name, index) => (
              <option key={index + 1} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* 📆 Year */}
        <div className="col-6 col-lg-3">
          <label className="form-label mb-1 fw-semibold">Year</label>
          <select
            className="form-control form-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
          >
            {yearOptions.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
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
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                Monthly Fee
              </th>
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                Paid Amount
              </th>
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                Remaining
              </th>
              <th
                style={{ backgroundColor: "var(--border2)" }}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
              >
                Status
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
            {filteredFamilies.length > 0 ? (
              filteredFamilies.map((family, familyIdx) => (
                <React.Fragment key={family.familyId}>
                  {family.unpaidStudents.map((student, studentIdx) => (
                    <tr key={studentIdx}>
                      {studentIdx === 0 && (
                        <>
                          <td
                            rowSpan={family.unpaidStudents.length}
                            className="border h6 text-center align-middle"
                          >
                            {familyIdx + 1}
                          </td>
                          <td
                            rowSpan={family.unpaidStudents.length}
                            className="border h6 text-center align-middle"
                          >
                            <div>
                              <strong>{family.familyName}</strong>
                            </div>
                          </td>
                        </>
                      )}

                      <td className="border h6 text-center align-middle">
                        <Link
                          className="text-dark student-link text-decoration-none"
                          to={`/dashboard/admin/view-student/${student.studentId}`}
                        >
                          {student.studentName}
                        </Link>
                      </td>

                      <td className="border h6 text-center align-middle">
                        £{student.monthlyFee.toFixed(2)}
                      </td>

                      <td className="border h6 text-center align-middle">
                        £{student.paidAmount.toFixed(2)}
                        {student.paymentDate && (
                          <>
                            <br />
                            <small className="text-muted">
                              {new Date(
                                student.paymentDate
                              ).toLocaleDateString()}
                            </small>
                          </>
                        )}
                      </td>

                      <td className="border h6 text-center align-middle">
                        <strong>£{student.remainingAmount.toFixed(2)}</strong>
                      </td>

                      <td className="border h6 text-center align-middle">
                        <span
                          className={`badge ${
                            student.status === "unpaid"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {student.status === "unpaid" ? "Unpaid" : "Partial"}
                        </span>
                      </td>

                      {studentIdx === 0 && (
                        <td
                          rowSpan={family.unpaidStudents.length}
                          className="border text-center align-middle"
                        >
                          <div className="d-flex flex-column gap-2 justify-content-center align-items-center h-100">
                            <div className="d-flex gap-2 justify-content-center align-items-center">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  handleAdminShow(
                                    family?.familyId,
                                    student.feeId
                                  )
                                }
                                title="Edit Fee"
                                disabled={!student.feeId}
                              >
                                <FaPen />
                              </button>
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <h5>
                    {searchQuery
                      ? `No results found for "${searchQuery}"`
                      : `No unpaid families found for ${
                          monthNames[parseInt(month) - 1]
                        } ${year}`}
                  </h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      {families.length > 0 && (
        <div className="row mt-4">
          <p>
            Total Families with Unpaid Fees:{" "}
            <strong>{filteredFamilies.length}</strong>
          </p>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Summary</h5>
                <p>
                  Total Families with Unpaid Fees:{" "}
                  <strong>{families.length}</strong>
                </p>
                <p>
                  Total Unpaid Amount:{" "}
                  <strong>
                    £
                    {families
                      .reduce(
                        (sum, family) => sum + family.totalUnpaidAmount,
                        0
                      )
                      .toFixed(2)}
                  </strong>
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Status Breakdown</h5>
                <p>
                  Fully Unpaid Students:{" "}
                  <strong>
                    {
                      families
                        .flatMap((f) => f.unpaidStudents)
                        .filter((s) => s.status === "unpaid").length
                    }
                  </strong>
                </p>
                <p>
                  Partially Paid Students:{" "}
                  <strong>
                    {
                      families
                        .flatMap((f) => f.unpaidStudents)
                        .filter((s) => s.status === "partial").length
                    }
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <AdminFeeUpdateModal
        key={`admin-pay-${selectedFeeData.familyId}-${selectedFeeData.feeId}`}
        familyId={selectedFeeData?.familyId}
        feeId={selectedFeeData?.feeId}
        month={String(month).padStart(2, "0")} // ✅ FIXED: Pad to 2 digits
        year={parseInt(year)} // ✅ ADD THIS - convert to number
        adminShowModal={adminShowModal}
        handleAdminClose={handleAdminClose}
        refetch={refetch}
      />
    </div>
  );
}
