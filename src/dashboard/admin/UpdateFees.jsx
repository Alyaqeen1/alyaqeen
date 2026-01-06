import React, { useState, useMemo } from "react";
import {
  FaEye,
  FaPen,
  FaTrashAlt,
  FaUser,
  FaMoneyBill,
  FaCalendar,
  FaFilter,
  FaSortAlphaDown,
  FaSync,
  FaSearch,
} from "react-icons/fa";
import {
  useDeleteFeeMutation,
  useGetFeesByDateQuery,
} from "../../redux/features/fees/feesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import FeeUpdateModal from "../shared/FeeUpdateModal";

export default function UpdateFees() {
  // Initialize state at the top (no conditional hooks)
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("monthly");
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [sortOrder, setSortOrder] = useState("alphabetical");
  const [showModal, setShowModal] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Build query params - useMemo to prevent unnecessary re-renders
  const queryParams = useMemo(
    () => ({
      paymentType: paymentTypeFilter,
      ...(paymentTypeFilter === "monthly" && {
        month: monthFilter,
        year: yearFilter,
      }),
    }),
    [paymentTypeFilter, monthFilter, yearFilter]
  );

  // Call hook unconditionally at the top level
  const {
    data: fees,
    isLoading,
    isFetching,
    refetch,
  } = useGetFeesByDateQuery(queryParams);
  const [deleteFee] = useDeleteFeeMutation();

  // Generate year options
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2];
  }, []);

  // Sort fees
  const sortedFees = useMemo(() => {
    if (!fees) return [];

    let filtered = [...fees];

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (fee) =>
          fee.name?.toLowerCase().includes(query) ||
          fee.email?.toLowerCase().includes(query) ||
          fee.students?.some((student) =>
            student.name?.toLowerCase().includes(query)
          ) ||
          fee.paymentType?.toLowerCase().includes(query)
      );
    }

    if (sortOrder === "alphabetical") {
      filtered.sort((a, b) => a.name?.localeCompare(b.name));
    } else if (sortOrder === "recent") {
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortOrder === "amount") {
      filtered.sort((a, b) => (b.expectedTotal || 0) - (a.expectedTotal || 0));
    }

    return filtered;
  }, [fees, sortOrder, searchQuery]); // Add searchQuery to dependencies
  // Handle filter changes with loading state
  const handlePaymentTypeChange = (value) => {
    setPaymentTypeFilter(value);
  };

  const handleMonthChange = (value) => {
    setMonthFilter(value);
  };

  const handleYearChange = (value) => {
    setYearFilter(value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  // Loading state - return early
  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  // Rest of your functions remain the same
  const handleShow = (id) => {
    setSelectedFeeId(id);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-success";
      case "partial":
        return "text-warning";
      case "unpaid":
        return "text-danger";
      default:
        return "text-secondary";
    }
  };

  const formatCurrency = (amount) => {
    return `£${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  // Helper function to get month name from month number
  const getMonthName = (monthNumber) => {
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
    return months[parseInt(monthNumber) - 1] || monthNumber;
  };

  // Updated function to show full month name
  const getPaymentMonth = (fee) => {
    if (fee.paymentType === "monthly" || fee.paymentType === "monthlyOnHold") {
      const firstStudent = fee.students?.[0];
      const firstMonth = firstStudent?.monthsPaid?.[0];
      if (firstMonth) {
        const monthName = getMonthName(firstMonth.month);
        return `${monthName} ${firstMonth.year}`;
      }
    } else if (
      fee.paymentType === "admission" ||
      fee.paymentType === "admissionOnHold"
    ) {
      const firstStudent = fee.students?.[0];
      if (firstStudent?.joiningMonth && firstStudent?.joiningYear) {
        const monthName = getMonthName(firstStudent.joiningMonth);
        return `${monthName} ${firstStudent.joiningYear}`;
      }
    }
    return "N/A";
  };

  const getPaymentDetails = (fee) => {
    if (fee.paymentType === "monthly" || fee.paymentType === "monthlyOnHold") {
      const totalStudents = fee.students?.length || 0;
      const totalMonths =
        fee.students?.reduce(
          (sum, student) => sum + (student.monthsPaid?.length || 0),
          0
        ) || 0;
      return `${totalStudents} student(s)`;
    } else if (
      fee.paymentType === "admission" ||
      fee.paymentType === "admissionOnHold"
    ) {
      return "Admission + First Month";
    }
    return fee.paymentType || "Unknown";
  };

  const handleDeleteFee = async (feeId) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteFee(feeId).unwrap();
            setTimeout(() => {
              refetch();
            }, 100);
            Swal.fire({
              title: "Deleted!",
              text: "Fee has been deleted successfully.",
              icon: "success",
            });
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error?.data?.message || "Failed to delete fee.",
              icon: "error",
            });
          }
        }
      });
    } catch (error) {
      toast.error(`Failed to delete fee record: ${error?.message}`);
    }
  };

  const handleClose = () => setShowModal(false);

  // Get filter display text
  const getFilterDisplayText = () => {
    if (paymentTypeFilter === "monthly") {
      return `Showing ${paymentTypeFilter} fees for: ${getMonthName(
        monthFilter
      )} ${yearFilter}`;
    } else {
      return `Showing all ${paymentTypeFilter} fees`;
    }
  };

  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center`}>💰 Fee Records</h3>

      {/* Filters Section */}
      <div className="card my-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            {/* Payment Type Filter */}
            <div
              className={`${
                paymentTypeFilter === "monthly"
                  ? "col-md-3 col-lg-2"
                  : "col-md-4 col-lg-3"
              }`}
            >
              <label className="form-label fw-semibold">
                <FaFilter className="me-2" />
                Payment Type
              </label>
              <select
                className="form-select"
                value={paymentTypeFilter}
                onChange={(e) => handlePaymentTypeChange(e.target.value)}
                disabled={isFetching}
              >
                <option value="monthly">Monthly Fees</option>
                <option value="admission">Admission and First Month</option>
              </select>
            </div>

            {/* Month Filter - Only show for monthly */}
            {paymentTypeFilter === "monthly" && (
              <div className="col-md-3 col-lg-2">
                <label className="form-label fw-semibold">
                  <FaCalendar className="me-2" />
                  Filter by Month
                </label>
                <select
                  className="form-select"
                  value={monthFilter}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  disabled={isFetching}
                >
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            )}

            {/* Year Filter - Only show for monthly */}
            {paymentTypeFilter === "monthly" && (
              <div className="col-md-3 col-lg-2">
                <label className="form-label fw-semibold">Filter by Year</label>
                <select
                  className="form-select"
                  value={yearFilter}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  disabled={isFetching}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort By - Always show */}
            <div
              className={`${
                paymentTypeFilter === "monthly"
                  ? "col-md-3 col-lg-2"
                  : "col-md-4 col-lg-3"
              }`}
            >
              <label className="form-label fw-semibold">
                <FaSortAlphaDown className="me-2" />
                Sort By
              </label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                disabled={isFetching}
              >
                <option value="alphabetical">Family Name (A-Z)</option>
                <option value="recent">Most Recent</option>
                <option value="amount">Amount (High to Low)</option>
              </select>
            </div>
            {/* Search Bar - Takes remaining space */}
            <div
              className={`${
                paymentTypeFilter === "monthly"
                  ? "col-md-12 col-lg-4"
                  : "col-md-12 col-lg-6"
              } mt-3 mt-md-0`}
            >
              <label className="form-label fw-semibold">
                <FaSearch className="me-2" /> {/* Add FaSearch import */}
                Search
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by family, student, email or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isFetching}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchQuery("")}
                  disabled={isFetching}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12 text-center">
              <span
                className={`badge fs-6 ${
                  isFetching ? "bg-warning" : "bg-primary"
                }`}
              >
                {isFetching ? (
                  <>
                    <FaSync className="me-2 fa-spin" />
                    Loading data...
                  </>
                ) : (
                  <>
                    {getFilterDisplayText()} • {sortedFees.length} records
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Show loading spinner when fetching */}
      {isFetching ? (
        <div className="text-center py-5">
          <LoadingSpinnerDash />
          <p className="text-muted mt-2">Loading fee records...</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="bg-light">
                <tr>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    #
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Family
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Payment For
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Amount
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Status
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Payment Details
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Type
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFees.length > 0 ? (
                  sortedFees.map((fee, idx) => {
                    const latestPayment =
                      fee.payments?.[fee.payments.length - 1];

                    return (
                      <tr key={fee._id}>
                        <td className="text-center fw-bold">{idx + 1}</td>

                        <td>
                          <div>
                            <div className="fw-semibold">{fee.name}</div>
                            <small className="text-muted">{fee.email}</small>
                            <div className="small text-muted mt-1">
                              <FaUser className="me-1" size={10} />
                              {fee.students?.length || 0} student(s)
                            </div>
                          </div>
                        </td>

                        <td className="text-center">
                          <div>
                            <div className="fw-semibold">
                              {getPaymentMonth(fee)}
                            </div>
                            <small className="text-muted">
                              {getPaymentDetails(fee)}
                            </small>
                          </div>
                        </td>
                        <td className="text-center">
                          <div>
                            <div className="fw-semibold">
                              Expected: {formatCurrency(fee.expectedTotal)}
                            </div>
                            <small className="text-muted">
                              Paid:{" "}
                              {formatCurrency(
                                fee.expectedTotal - (fee.remaining || 0)
                              )}
                            </small>
                            {/* {fee.remaining > 0 && ( */}
                            <small className="text-danger d-block">
                              Remaining: {formatCurrency(fee.remaining)}
                            </small>
                            {/* )} */}
                          </div>
                        </td>

                        <td className="text-center">
                          <span
                            className={`badge ${getStatusColor(
                              fee.status
                            )} bg-light`}
                          >
                            {fee.status?.toUpperCase()}
                          </span>
                        </td>

                        <td className="text-center">
                          {latestPayment ? (
                            <div>
                              <div className="fw-semibold">
                                {formatCurrency(latestPayment.amount)}
                              </div>
                              <small className="text-muted">
                                <FaCalendar className="me-1" size={10} />
                                {formatDate(latestPayment.date)}
                              </small>
                              <div className="small text-capitalize">
                                {latestPayment.method}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted">No payment</span>
                          )}
                        </td>

                        <td className="text-center">
                          <span
                            className={`badge ${
                              fee.paymentType?.includes("admission")
                                ? "bg-info"
                                : "bg-secondary"
                            } text-capitalize`}
                          >
                            {fee.paymentType || "monthly"}
                          </span>
                        </td>

                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-warning"
                              title="Edit Fee"
                              onClick={() => handleShow(fee?._id)}
                            >
                              <FaPen />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              title="Delete Fee"
                              onClick={() => handleDeleteFee(fee?._id)}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <div className="text-muted">
                        <FaMoneyBill size={32} className="mb-2" />
                        <div>
                          No {paymentTypeFilter} fee records found
                          {paymentTypeFilter === "monthly" &&
                            ` for ${getMonthName(monthFilter)} ${yearFilter}`}
                        </div>
                        <small>Try selecting different filters</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {sortedFees.length > 0 && (
            <div className="mt-3 p-3 bg-light rounded">
              <div className="row text-center">
                <div className="col">
                  <strong>Records:</strong> {sortedFees.length}
                </div>
                <div className="col">
                  <strong>Monthly Fees:</strong>{" "}
                  {
                    sortedFees.filter((f) => f.paymentType?.includes("monthly"))
                      .length
                  }
                </div>
                <div className="col">
                  <strong>Admission Fees:</strong>{" "}
                  {
                    sortedFees.filter((f) =>
                      f.paymentType?.includes("admission")
                    ).length
                  }
                </div>
                <div className="col">
                  <strong>Total Amount:</strong>{" "}
                  {formatCurrency(
                    sortedFees.reduce(
                      (sum, fee) => sum + (fee.expectedTotal || 0),
                      0
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {selectedFeeId && (
        <FeeUpdateModal
          key={`update-${selectedFeeId}`}
          feeId={selectedFeeId}
          showModal={showModal}
          handleClose={handleClose}
          refetch={refetch}
        />
      )}
    </div>
  );
}
