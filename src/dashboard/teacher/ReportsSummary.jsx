import React, { useState } from "react";
import {
  useGetTeacherLessonsCoveredMonthlySummaryQuery,
  useGetTeacherLessonsCoveredYearlySummaryQuery,
} from "../../redux/features/lessons_covered/lessons_coveredApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import useAuth from "../../hooks/useAuth";
import { useGetTeacherByEmailQuery } from "../../redux/features/teachers/teachersApi";

export default function ReportsSummary() {
  const [month, setMonth] = useState("");
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [showOverallSummary, setShowOverallSummary] = useState(false);
  const { user } = useAuth();

  // Fetch teacher data
  const { data: teacher, isLoading: isLoadingTeacher } =
    useGetTeacherByEmailQuery(user?.email, {
      skip: !user?.email,
    });

  // Fetch lessons data
  const {
    data: lessonsCovered = [],
    isLoading: isLoadingMonthly,
    isError: isMonthlyError,
    error: monthlyError,
  } = useGetTeacherLessonsCoveredMonthlySummaryQuery(
    {
      id: teacher?._id,
      month,
      year: year.toString(),
    },
    {
      skip: !teacher?._id || showOverallSummary, // Skip if showing overall summary
    }
  );

  // Fetch overall summary data
  const {
    data: overallSummary = [],
    isLoading: isLoadingYearly,
    isError: isYearlyError,
  } = useGetTeacherLessonsCoveredYearlySummaryQuery(
    {
      id: teacher?._id,
      year: year.toString(),
    },
    {
      skip: !teacher?._id || !showOverallSummary, // Skip if not showing overall summary
    }
  );

  console.log(overallSummary);

  const isLoading =
    isLoadingTeacher ||
    (showOverallSummary ? isLoadingYearly : isLoadingMonthly);
  const isError = showOverallSummary ? isYearlyError : isMonthlyError;
  const isNoDataError = monthlyError?.data?.message?.includes("No data found");

  const handleOverallSummaryClick = () => {
    setShowOverallSummary(!showOverallSummary);
    setMonth(""); // Reset month when showing overall summary
  };

  if (isLoading) return <LoadingSpinnerDash />;

  const displayData = showOverallSummary ? overallSummary : lessonsCovered;
  const isEmpty = displayData.length === 0;

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
