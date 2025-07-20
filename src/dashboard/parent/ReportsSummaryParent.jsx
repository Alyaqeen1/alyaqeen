import React, { useState } from "react";
import { useGetEnrolledFullFamilyQuery } from "../../redux/features/families/familiesApi";
import useAuth from "../../hooks/useAuth";
import {
  useGetStudentLessonsCoveredMonthlySummaryQuery,
  useGetStudentLessonsCoveredYearlySummaryQuery,
} from "../../redux/features/lessons_covered/lessons_coveredApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

const currentYear = new Date().getFullYear();
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

export default function ReportsSummaryParent() {
  const { user, loading } = useAuth();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(currentYear);
  const [showOverallSummary, setShowOverallSummary] = useState(false);

  const { data: enrolledFamily = [], isFetching: loadingFamily } =
    useGetEnrolledFullFamilyQuery(user?.email, {
      skip: loading || !user?.email,
    });

  const studentIds = enrolledFamily?.childrenDocs?.map(
    (student) => student._id
  );

  const { data: monthlySummary = [], isFetching: loadingMonthly } =
    useGetStudentLessonsCoveredMonthlySummaryQuery(
      { student_ids: studentIds, month, year },
      { skip: !studentIds?.length || showOverallSummary }
    );

  const { data: yearlySummary = [], isFetching: loadingYearly } =
    useGetStudentLessonsCoveredYearlySummaryQuery(
      { student_ids: studentIds, year },
      { skip: !studentIds?.length || !showOverallSummary }
    );

  if (loading || loadingFamily || loadingMonthly || loadingYearly) {
    return <LoadingSpinnerDash />;
  }

  if (!enrolledFamily?.childrenDocs?.length) {
    return (
      <div className="container py-5">
        <div className="alert alert-info text-center">
          No enrolled students found in your family account.
        </div>
      </div>
    );
  }

  const displayData = showOverallSummary ? yearlySummary : monthlySummary;

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h4 card-title mb-4">📊 Progress Summary Report</h2>

          <div className="d-flex justify-content-center mb-4">
            <div className="btn-group" role="group">
              <button
                style={{
                  backgroundColor: !showOverallSummary
                    ? "var(--border2)"
                    : "white",
                  color: !showOverallSummary ? "white" : "var(--border2)",
                  border: `1px solid var(--border2)`,
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => setShowOverallSummary(false)}
              >
                Monthly Summary
              </button>

              <button
                style={{
                  backgroundColor: showOverallSummary
                    ? "var(--border2)"
                    : "white",
                  color: showOverallSummary ? "white" : "var(--border2)",
                  border: `1px solid var(--border2)`,
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => setShowOverallSummary(true)}
              >
                Yearly Summary
              </button>
            </div>
          </div>

          <div className="row mb-4">
            {!showOverallSummary && (
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Month</label>
                <select
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Select month</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={showOverallSummary ? "col-md-12" : "col-md-6"}>
              <label className="form-label fw-semibold">Year</label>
              <select
                className="form-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
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
        </div>
      </div>

      {enrolledFamily?.childrenDocs?.map((student) => {
        const studentData = displayData?.filter(
          (item) => item.student_id === student._id
        );

        return (
          <div key={student._id} className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h3 className="h5 mb-0">{student.name}</h3>
            </div>
            <div className="card-body">
              <h4 className="h6 mb-3" style={{ color: "var(--border2)" }}>
                {showOverallSummary
                  ? "📆 Yearly Summary"
                  : "📅 Monthly Summary"}{" "}
                ({year})
              </h4>

              {studentData?.length > 0 ? (
                studentData.map((item, index) => (
                  <div key={index} className="mb-4">
                    {!showOverallSummary && (
                      <h5 className="fw-semibold mb-3">
                        {item?.month}, {year}
                      </h5>
                    )}

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <div className="p-3 bg-light rounded">
                          <h6 className="fw-semibold">
                            Quran Qaidah Pages Done
                          </h6>
                          <p className="mb-0 fs-5">
                            {item?.qaidahProgress ||
                              item?.qaidahYearlyProgress ||
                              0}
                          </p>
                        </div>
                      </div>

                      <div className="col-md-4 mb-3">
                        <div className="p-3 bg-light rounded">
                          <h6 className="fw-semibold">Duas / Surahs Done</h6>
                          <p className="mb-0 fs-5">
                            {item?.duasSurahsProgress ||
                              item?.duasSurahsYearlyProgress ||
                              0}
                          </p>
                        </div>
                      </div>

                      <div className="col-md-4 mb-3">
                        <div className="p-3 bg-light rounded">
                          <h6 className="fw-semibold">
                            Islamic Studies Pages Done
                          </h6>
                          <p className="mb-0 fs-5">
                            {item?.islamicStudiesProgress ||
                              item?.islamicStudiesYearlyProgress ||
                              0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="alert alert-info mb-0">
                  This {showOverallSummary ? "year" : "month"} data is not
                  available
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
