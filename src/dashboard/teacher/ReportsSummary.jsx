import React, { useState } from "react";
import {
  useGetTeacherLessonsCoveredMonthlySummaryQuery,
  useGetTeacherLessonsCoveredYearlySummaryQuery,
  usePublishMultipleLessonsMutation,
} from "../../redux/features/lessons_covered/lessons_coveredApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import useAuth from "../../hooks/useAuth";
import { useGetTeacherByEmailQuery } from "../../redux/features/teachers/teachersApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function ReportsSummary() {
  const [month, setMonth] = useState("");
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [showOverallSummary, setShowOverallSummary] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const { user } = useAuth();
  const [publishMultipleLessons] = usePublishMultipleLessonsMutation();

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
      skip: !teacher?._id || showOverallSummary,
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
      skip: !teacher?._id || !showOverallSummary,
    }
  );

  const isLoading =
    isLoadingTeacher ||
    (showOverallSummary ? isLoadingYearly : isLoadingMonthly);
  const isError = showOverallSummary ? isYearlyError : isMonthlyError;
  const isNoDataError = monthlyError?.data?.message?.includes("No data found");

  const handleOverallSummaryClick = () => {
    setShowOverallSummary(!showOverallSummary);
    setMonth("");
    setExpandedStudent(null);
  };

  const toggleStudentDetails = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
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
            monthly_publish: !showOverallSummary,
            yearly_publish: showOverallSummary,
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

  const renderStudentReport = (student, isYearly, isExpanded) => {
    const progressData = isYearly ? student.progress : student;

    return (
      <div className="card mb-3" key={student.student_id}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">{student.student_name}</h5>
            <small className="text-muted">{student.class_name}</small>
          </div>
          <div>
            <span className="badge bg-secondary me-2">
              {isYearly
                ? `Year: ${student.year}`
                : `${student.month} ${student.year}`}
            </span>
            <span className="badge bg-info me-2">
              {student.type === "gift_muslim" ? "Gift for Muslim" : "Normal"}
            </span>
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => toggleStudentDetails(student.student_id)}
            >
              {isExpanded ? "Hide Details" : "Show Details"}
            </button>
            <button
              className="btn btn-sm btn-warning text-white"
              onClick={() => handlePublish(student.processedDocumentIds)}
            >
              Publish
            </button>
          </div>
        </div>

        {/* summary + expanded views here */}
      </div>
    );
  };

  // Progress fields filtering
  const getFilteredDetailItems = (progress) => {
    if (!progress) return [];
    return [
      progress.page_progress && {
        label: "Pages",
        value: progress.page_progress,
      },
      progress.line_progress && {
        label: "Lines",
        value: progress.line_progress,
      },
      progress.para_progress && {
        label: "Paras",
        value: progress.para_progress,
      },
      progress.target_progress && {
        label: "Targets",
        value: progress.target_progress,
      },
      progress.dua_number_progress && {
        label: "Duas",
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
      progress.selected && { label: "Type", value: progress.selected },
    ].filter(Boolean);
  };

  const renderProgressDetails = (progress) => {
    const detailItems = getFilteredDetailItems(progress);
    return (
      <div className="progress-details">
        {detailItems.map((item, idx) => (
          <div key={idx} className="detail-item">
            <span className="detail-label">{item.label}:</span>
            <span className="detail-value">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Config for progress sections
  const progressConfig = {
    qaidah_quran_progress: { title: "Qaidah/Quran", color: "primary" },
    islamic_studies_progress: { title: "Islamic Studies", color: "success" },
    dua_surah_progress: { title: "Dua/Surah", color: "info" },
    gift_for_muslim_progress: { title: "Gift for Muslim", color: "warning" },
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

      {/* Results */}
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
        <div className="reports-container">
          {displayData.map((item, idx) => {
            const progressData = showOverallSummary ? item.progress : item;
            const isExpanded = expandedStudent === item.student_id;

            return (
              <div key={item.student_id || idx} className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">{item.student_name}</h5>
                    <small className="text-muted">{item.class_name}</small>
                  </div>
                  <div>
                    <span className="badge bg-secondary me-2">
                      {showOverallSummary
                        ? `Year: ${item.year}`
                        : `${item.month} ${item.year}`}
                    </span>
                    <span className="badge bg-info me-2">
                      {item.type === "gift_muslim"
                        ? "Gift for Muslim"
                        : "Normal"}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => toggleStudentDetails(item.student_id)}
                    >
                      {isExpanded ? "Hide Details" : "Show Details"}
                    </button>
                    <button
                      className="btn btn-sm btn-warning text-white"
                      onClick={() => handlePublish(item.processedDocumentIds)}
                    >
                      Publish
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  {/* Summary View */}
                  <div className="row text-center">
                    {Object.entries(progressConfig).map(([key, cfg]) => {
                      const progress = progressData[key];
                      if (!progress) return null;

                      // Determine column size based on student type
                      const colSize =
                        item.type === "gift_muslim" ? "col-md-6" : "col-md-4";

                      return (
                        <div key={key} className={`${colSize} mb-2`}>
                          <div className="card bg-light h-100">
                            <div className="card-body py-2">
                              <h6 className="card-title">{cfg.title}</h6>
                              {getFilteredDetailItems(progress).map(
                                (item, idx) => (
                                  <p key={idx} className="card-text mb-0">
                                    {item.label}: <strong>{item.value}</strong>
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Expanded View */}
                  {isExpanded && (
                    <div className="mt-3">
                      <h6>Detailed Progress</h6>
                      <div className="row">
                        {Object.entries(progressConfig).map(([key, cfg]) => {
                          const progress = progressData[key];
                          if (!progress) return null;

                          // Determine column size based on student type
                          const colSize =
                            item.type === "gift_muslim"
                              ? "col-md-6"
                              : "col-md-4";

                          return (
                            <div key={key} className={`${colSize} mb-2`}>
                              <div className={`card border-${cfg.color}`}>
                                <div
                                  className={`card-header bg-${cfg.color} text-white`}
                                >
                                  <h6 className="mb-0">{cfg.title} Progress</h6>
                                </div>
                                <div className="card-body">
                                  {renderProgressDetails(progress)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style jsx>{`
        .progress-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.25rem 0;
          border-bottom: 1px solid #eee;
        }
        .detail-label {
          font-weight: 500;
          color: #6c757d;
        }
        .detail-value {
          font-weight: 600;
        }
        .card-body {
          min-height: 150px;
        }
      `}</style>
    </div>
  );
}
