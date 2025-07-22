import React, { useState } from "react";
import {
  useGetLessonsCoveredMonthlySummaryQuery,
  useGetLessonsCoveredYearlySummaryQuery,
  usePublishMultipleLessonsMutation,
} from "../../redux/features/lessons_covered/lessons_coveredApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ReportsSummaryAdmin() {
  const [month, setMonth] = useState("");
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [showOverallSummary, setShowOverallSummary] = useState(false);
  const [publishMultipleLessons] = usePublishMultipleLessonsMutation();
  // Fetch lessons data
  const {
    data: lessonsCovered = [],
    isLoading: isLoadingMonthly,
    isError: isMonthlyError,
    error: monthlyError,
  } = useGetLessonsCoveredMonthlySummaryQuery(
    {
      month,
      year: year.toString(),
    },
    {
      skip: showOverallSummary, // Skip if showing overall summary
    }
  );

  // Fetch overall summary data
  const {
    data: overallSummary = [],
    isLoading: isLoadingYearly,
    isError: isYearlyError,
  } = useGetLessonsCoveredYearlySummaryQuery(
    {
      year: year.toString(),
    },
    {
      skip: !showOverallSummary, // Skip if not showing overall summary
    }
  );

  const isLoading = showOverallSummary ? isLoadingYearly : isLoadingMonthly;
  const isError = showOverallSummary ? isYearlyError : isMonthlyError;
  const isNoDataError = monthlyError?.data?.message?.includes("No data found");

  const handleOverallSummaryClick = () => {
    setShowOverallSummary(!showOverallSummary);
    setMonth(""); // Reset month when showing overall summary
  };

  if (isLoading) return <LoadingSpinnerDash />;

  const displayData = showOverallSummary ? overallSummary : lessonsCovered;
  const isEmpty = displayData.length === 0;

  const handlePublish = async (ids) => {
    if (!ids || ids.length === 0) {
      toast.error("No document IDs to publish.");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, publish it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await publishMultipleLessons({
            ids,
            monthly_publish: !showOverallSummary, // true if monthly view
            yearly_publish: showOverallSummary, // true if yearly view
          }).unwrap();
          if (res?.modifiedCount > 0) {
            Swal.fire({
              title: "Published!",
              text: "Your file has been Published.",
              icon: "success",
            });
          }
        } catch (error) {
          toast.error(
            error?.data?.message || "Failed to publish lessons. Try again."
          );
        }
      }
    });
  };

  return (
    <div className="container-fluid p-3">
      <h3 className="mb-4">Reports Summary</h3>
      {/* Filters */}
      <div className="row align-items-end mb-4 g-3">
        <div className="col-md-8 d-flex flex-wrap gap-3">
          {!showOverallSummary && (
            <div className="flex-grow-1" style={{ minWidth: "200px" }}>
              <label className="form-label">Month</label>
              <select
                className="form-select bg-light"
                style={{ borderColor: "var(--border2)" }}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Select month</option>
                {[
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
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <label className="form-label">Year</label>
            <select
              className="form-select bg-light"
              style={{ borderColor: "var(--border2)" }}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              <option value="">Select year</option>
              {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                (yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="col-md-4 text-md-end">
          <button
            className="btn text-white"
            style={{ backgroundColor: "var(--border2)" }}
            onClick={handleOverallSummaryClick}
          >
            {showOverallSummary ? "Show Monthly View" : "Overall Summary"}
          </button>
        </div>
      </div>

      {/* Results Table */}
      {isError && !isNoDataError ? (
        <div className="alert alert-danger">Error loading data</div>
      ) : isEmpty ? (
        <div className="alert alert-info text-center">
          {showOverallSummary
            ? `No yearly data found for ${year}`
            : month || year !== currentYear
            ? "No lessons data found for selected filters"
            : "Please select filters to view data"}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                {[
                  "#",
                  "Student",
                  showOverallSummary ? "Year" : "Month",
                  "Qaidah Pages",
                  "Duas/Surahs",
                  "Islamic Studies",
                  "Action",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="text-white text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((item, idx) => (
                <tr key={item._id || idx}>
                  <td className="text-center align-middle">{idx + 1}</td>
                  <td className="text-center align-middle">
                    {item.student_name}
                  </td>
                  <td className="text-center align-middle">
                    {showOverallSummary ? item.year : item.month}
                  </td>
                  <td className="text-center align-middle">
                    {showOverallSummary
                      ? item.qaidahYearlyProgress
                      : item.qaidahProgress}
                  </td>
                  <td className="text-center align-middle">
                    {showOverallSummary
                      ? item.duasSurahsYearlyProgress
                      : item.duasSurahsProgress}
                  </td>
                  <td className="text-center align-middle">
                    {showOverallSummary
                      ? item.islamicStudiesYearlyProgress
                      : item.islamicStudiesProgress}
                  </td>
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-warning text-white"
                      onClick={() => handlePublish(item?.processedDocumentIds)}
                      //   style={{ backgroundColor: "var(--border2)" }}
                    >
                      Publish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
