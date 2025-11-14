import React, { useState, useEffect } from "react";
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

// Helper function to get current month name
const getCurrentMonthName = () => {
  return months[new Date().getMonth()];
};

export default function ReportsSummaryParent() {
  const { user, loading } = useAuth();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(currentYear);
  const [showOverallSummary, setShowOverallSummary] = useState(false);

  // Set default month to current month on component mount
  useEffect(() => {
    setMonth(getCurrentMonthName());
  }, []);

  const { data: enrolledFamily = {}, isFetching: loadingFamily } =
    useGetEnrolledFullFamilyQuery(user?.email, {
      skip: loading || !user?.email,
    });

  const studentIds = enrolledFamily?.childrenDocs?.map((s) => s._id);

  const {
    data: monthlySummary = [],
    isFetching: loadingMonthly,
    error: monthlyError,
  } = useGetStudentLessonsCoveredMonthlySummaryQuery(
    { student_ids: studentIds, month, year },
    {
      skip: !studentIds?.length || showOverallSummary || month === "",
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: yearlySummary = [],
    isFetching: loadingYearly,
    error: yearlyError,
  } = useGetStudentLessonsCoveredYearlySummaryQuery(
    { student_ids: studentIds, year },
    { skip: !studentIds?.length || !showOverallSummary }
  );

  // Gradient styles matching EducationalInfoCard
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const cardGradients = {
    primary: { background: "linear-gradient(135deg, #667eea, #764ba2)" },
    secondary: { background: "linear-gradient(135deg, #f093fb, #f5576c)" },
    info: { background: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    success: { background: "linear-gradient(135deg, #43e97b, #38f9d7)" },
    warning: { background: "linear-gradient(135deg, #ffd89b, #19547b)" },
  };

  // Handle toggle between monthly and yearly summary
  const handleToggleSummary = (isOverall) => {
    setShowOverallSummary(isOverall);
    if (!isOverall) {
      setMonth(month || getCurrentMonthName());
    }
  };

  if (loading || loadingFamily) {
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

  // Get student data with proper filtering (FIXED LOGIC)
  const getStudentData = (student) => {
    return displayData?.filter((d) => {
      // For monthly data: check _id.student_id (from your console log)
      if (!showOverallSummary && d._id?.student_id === student._id) return true;

      // For yearly data: check student_id directly
      if (showOverallSummary && d.student_id === student._id) return true;

      return false;
    });
  };

  // Get all progress fields that have values (similar to admin logic)
  const getProgressInfo = (progress) => {
    if (!progress) return [];

    return [
      progress.page_progress !== undefined &&
        progress.page_progress !== null && {
          label: "Pages Done",
          value: progress.page_progress,
        },
      progress.line_progress !== undefined &&
        progress.line_progress !== null &&
        progress.line_progress !== "N/A" && {
          label: "Lines Progress",
          value: progress.line_progress,
        },
      progress.para_progress !== undefined &&
        progress.para_progress !== null && {
          label: "Paras Done",
          value: progress.para_progress,
        },
      progress.target_display !== undefined &&
        progress.target_display !== null &&
        progress.target_display !== "N/A" && {
          label: "Targets",
          value: progress.target_display,
        },
      progress.dua_number_progress !== undefined &&
        progress.dua_number_progress !== null && {
          label: "Duas Done",
          value: progress.dua_number_progress,
        },
      progress.level_display &&
        progress.level_display !== "N/A" && {
          label: "Level",
          value: progress.level_display,
        },
      progress.book_display &&
        progress.book_display !== "N/A" && {
          label: "Book",
          value: progress.book_display,
        },
      progress.lesson_name_display &&
        progress.lesson_name_display !== "N/A" && {
          label: "Lesson",
          value: progress.lesson_name_display,
        },
    ].filter(Boolean);
  };

  // Show loading only when actually fetching data for the current view
  const isLoadingData = showOverallSummary ? loadingYearly : loadingMonthly;

  return (
    <div className="container-fluid p-3">
      {/* Header Section */}
      <div
        className="rounded-4 border-0 shadow overflow-hidden mb-4"
        style={{ background: "white" }}
      >
        <div style={gradientStyle} className="text-white p-4">
          <div className="d-flex align-items-center flex-wrap gap-4">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle border"
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.3) !important",
              }}
            >
              <span style={{ fontSize: "2rem" }}>📊</span>
            </div>

            <div className="flex-grow-1">
              <h1
                className="mb-1 fw-bold text-white"
                style={{ fontSize: "1.8rem" }}
              >
                Progress Summary Report
              </h1>
              <p className="mb-0 opacity-90">
                Track your children's academic progress and achievements
              </p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="p-4">
          <div className="row align-items-end g-3">
            <div className="col-md-8 d-flex flex-wrap gap-3 align-items-end">
              {/* Toggle Buttons */}
              <div className="d-flex flex-column">
                <label className="form-label fw-semibold mb-2">
                  Report Type
                </label>
                <div className="btn-group" role="group">
                  <button
                    className={`btn px-4 py-2 ${
                      !showOverallSummary
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => handleToggleSummary(false)}
                  >
                    📅 Monthly Summary
                  </button>
                  <button
                    className={`btn px-4 py-2 ${
                      showOverallSummary ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => handleToggleSummary(true)}
                  >
                    📆 Yearly Summary
                  </button>
                </div>
              </div>

              {/* Month Selector */}
              {!showOverallSummary && (
                <div style={{ minWidth: "200px" }}>
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

              {/* Year Selector */}
              <div style={{ minWidth: "150px" }}>
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

            <div className="col-md-4 text-md-end">
              <div className="text-muted small">
                Showing progress for {enrolledFamily?.childrenDocs?.length}{" "}
                student
                {enrolledFamily?.childrenDocs?.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State for Data */}
      {isLoadingData && <LoadingSpinnerDash />}

      {/* Student Reports */}
      {!isLoadingData && (
        <div className="row g-4">
          {enrolledFamily?.childrenDocs?.map((student) => {
            const studentData = getStudentData(student);

            return (
              <div key={student._id} className="col-12">
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                  {/* Student Header */}
                  <div className="card-header bg-light border-0 py-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
                          }}
                        >
                          <span className="text-white">👤</span>
                        </div>
                        <div>
                          <h3 className="h5 mb-1 fw-bold text-dark">
                            {student.name}
                          </h3>
                          <p className="mb-0 text-muted small">
                            {student.academic?.class || "Class not assigned"} •{" "}
                            {student.academic?.department ||
                              "Department not assigned"}
                          </p>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-primary">
                          {showOverallSummary
                            ? `Year ${year}`
                            : `${month} ${year}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    {studentData?.length > 0 ? (
                      studentData.map((item, idx) => {
                        const progress = getProgress(item);

                        return (
                          <div key={idx} className="mb-4">
                            {!showOverallSummary && (
                              <h5 className="fw-semibold mb-3 text-primary">
                                {item.month}, {year}
                              </h5>
                            )}

                            <div className="row g-3">
                              {/* Qaidah Quran Progress */}
                              {progress?.qaidah_quran_progress && (
                                <div className="col-xl-4 col-lg-6">
                                  <div
                                    className="p-4 rounded-4 text-white h-100"
                                    style={cardGradients.primary}
                                  >
                                    <div className="d-flex align-items-start">
                                      <div
                                        style={{
                                          fontSize: "2rem",
                                          opacity: 0.9,
                                        }}
                                      >
                                        📖
                                      </div>
                                      <div className="ms-3 flex-grow-1">
                                        <h6 className="fw-bold mb-3">
                                          Quran Qaidah
                                        </h6>
                                        <div className="row g-2">
                                          {getProgressInfo(
                                            progress.qaidah_quran_progress
                                          ).map((info, i) => (
                                            <div key={i} className="col-12">
                                              <div className="d-flex justify-content-between align-items-center">
                                                <small className="opacity-90">
                                                  {info.label}:
                                                </small>
                                                <small className="fw-bold">
                                                  {info.value}
                                                </small>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Dua/Surah Progress */}
                              {progress?.dua_surah_progress && (
                                <div className="col-xl-4 col-lg-6">
                                  <div
                                    className="p-4 rounded-4 text-white h-100"
                                    style={cardGradients.secondary}
                                  >
                                    <div className="d-flex align-items-start">
                                      <div
                                        style={{
                                          fontSize: "2rem",
                                          opacity: 0.9,
                                        }}
                                      >
                                        ✨
                                      </div>
                                      <div className="ms-3 flex-grow-1">
                                        <h6 className="fw-bold mb-3">
                                          Duas & Surahs
                                        </h6>
                                        <div className="row g-2">
                                          {getProgressInfo(
                                            progress.dua_surah_progress
                                          ).map((info, i) => (
                                            <div key={i} className="col-12">
                                              <div className="d-flex justify-content-between align-items-center">
                                                <small className="opacity-90">
                                                  {info.label}:
                                                </small>
                                                <small className="fw-bold">
                                                  {info.value}
                                                </small>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Islamic Studies Progress */}
                              {progress?.islamic_studies_progress && (
                                <div className="col-xl-4 col-lg-6">
                                  <div
                                    className="p-4 rounded-4 text-white h-100"
                                    style={cardGradients.info}
                                  >
                                    <div className="d-flex align-items-start">
                                      <div
                                        style={{
                                          fontSize: "2rem",
                                          opacity: 0.9,
                                        }}
                                      >
                                        🕌
                                      </div>
                                      <div className="ms-3 flex-grow-1">
                                        <h6 className="fw-bold mb-3">
                                          Islamic Studies
                                        </h6>
                                        <div className="row g-2">
                                          {getProgressInfo(
                                            progress.islamic_studies_progress
                                          ).map((info, i) => (
                                            <div key={i} className="col-12">
                                              <div className="d-flex justify-content-between align-items-center">
                                                <small className="opacity-90">
                                                  {info.label}:
                                                </small>
                                                <small className="fw-bold">
                                                  {info.value}
                                                </small>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Gift for Muslim Progress */}
                              {progress?.gift_for_muslim_progress && (
                                <div className="col-xl-4 col-lg-6">
                                  <div
                                    className="p-4 rounded-4 text-white h-100"
                                    style={cardGradients.warning}
                                  >
                                    <div className="d-flex align-items-start">
                                      <div
                                        style={{
                                          fontSize: "2rem",
                                          opacity: 0.9,
                                        }}
                                      >
                                        🎁
                                      </div>
                                      <div className="ms-3 flex-grow-1">
                                        <h6 className="fw-bold mb-3">
                                          Gift for Muslim
                                        </h6>
                                        <div className="text-center">
                                          <div className="fw-bold fs-4">
                                            {progress.gift_for_muslim_progress}
                                          </div>
                                          <small className="opacity-90">
                                            Progress
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-5">
                        <div style={{ fontSize: "4rem", opacity: 0.3 }}>📊</div>
                        <h4 className="text-muted mt-3 mb-2">
                          No Data Available
                        </h4>
                        <p className="text-muted mb-0">
                          This {showOverallSummary ? "year" : "month"} data is
                          not available for {student.name}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
