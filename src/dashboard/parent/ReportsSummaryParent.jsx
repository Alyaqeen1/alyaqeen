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

  const { data: enrolledFamily = {}, isFetching: loadingFamily } =
    useGetEnrolledFullFamilyQuery(user?.email, {
      skip: loading || !user?.email,
    });

  const studentIds = enrolledFamily?.childrenDocs?.map((s) => s._id);

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
          No student is found enrolled in your family account.
        </div>
      </div>
    );
  }

  const displayData = showOverallSummary ? yearlySummary : monthlySummary;

  // Helper to get correct progress object
  const getProgress = (item) => (showOverallSummary ? item.progress : item);

  return (
    <div className="container py-4">
      {/* Toggle Buttons */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h4 card-title mb-4">📊 Progress Summary Report</h2>
          <div className="d-flex justify-content-center mb-4">
            <div className="btn-group" role="group">
              <button
                className={`px-3 py-2 border ${
                  !showOverallSummary
                    ? "bg-primary text-white"
                    : "bg-white text-primary"
                }`}
                onClick={() => setShowOverallSummary(false)}
              >
                Monthly Summary
              </button>
              <button
                className={`px-3 py-2 border ${
                  showOverallSummary
                    ? "bg-primary text-white"
                    : "bg-white text-primary"
                }`}
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
                  (y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Student Reports */}
      {enrolledFamily?.childrenDocs?.map((student) => {
        const studentData = displayData?.filter(
          (d) => d.student_id === student._id
        );

        return (
          <div key={student._id} className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h3 className="h5 mb-0">{student.name}</h3>
            </div>
            <div className="card-body">
              <h4 className="h6 mb-3" style={{ color: "var(--border2)" }}>
                {showOverallSummary
                  ? "📆 Yearly Reading Progress Summary"
                  : "📅 Monthly Reading Progress Summary"}{" "}
                ({year})
              </h4>

              {studentData?.length > 0 ? (
                studentData.map((item, idx) => {
                  const progress = getProgress(item);

                  return (
                    <div key={idx} className="mb-4">
                      {!showOverallSummary && (
                        <h5 className="fw-semibold mb-3">
                          {item.month}, {year}
                        </h5>
                      )}
                      <div className="row">
                        {progress?.qaidah_quran_progress && (
                          <div className="col-md-4 mb-3">
                            <div className="p-3 bg-light rounded">
                              <h6 className="fw-semibold">📖 Quran Qaidah</h6>
                              <p className="mb-1">
                                Pages Done:{" "}
                                {progress.qaidah_quran_progress.page_progress}
                              </p>
                              <p className="mb-1">
                                Lines Done:{" "}
                                {progress.qaidah_quran_progress.line_progress}
                              </p>
                              <p className="mb-0">
                                Lesson:{" "}
                                {
                                  progress.qaidah_quran_progress
                                    .lesson_name_display
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {progress?.dua_surah_progress && (
                          <div className="col-md-4 mb-3">
                            <div className="p-3 bg-light rounded">
                              <h6 className="fw-semibold">✨ Duas / Surahs</h6>
                              <p className="mb-1">
                                Pages Done:{" "}
                                {progress.dua_surah_progress.page_progress}
                              </p>
                              <p className="mb-1">
                                Target:{" "}
                                {progress.dua_surah_progress.target_progress}
                              </p>
                              <p className="mb-0">
                                Lesson:{" "}
                                {
                                  progress.dua_surah_progress
                                    .lesson_name_display
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {progress?.islamic_studies_progress && (
                          <div className="col-md-4 mb-3">
                            <div className="p-3 bg-light rounded">
                              <h6 className="fw-semibold">
                                🕌 Islamic Studies
                              </h6>
                              <p className="mb-1">
                                Pages Done:{" "}
                                {
                                  progress.islamic_studies_progress
                                    .page_progress
                                }
                              </p>
                              <p className="mb-0">
                                Lesson:{" "}
                                {
                                  progress.islamic_studies_progress
                                    .lesson_name_display
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {progress?.gift_for_muslim_progress && (
                          <div className="col-md-4 mb-3">
                            <div className="p-3 bg-light rounded">
                              <h6 className="fw-semibold">
                                🎁 Gift for Muslim
                              </h6>
                              <p className="mb-0">
                                Progress: {progress.gift_for_muslim_progress}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="alert alert-info mb-0">
                  This {showOverallSummary ? "year" : "month"} data is not
                  available.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
