import React, { useEffect, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const [publishMultipleLessons] = usePublishMultipleLessonsMutation();

  // Get current month name for initial load
  const getCurrentMonthName = () => {
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
    return months[new Date().getMonth()];
  };

  // Set initial month only once on component mount
  useEffect(() => {
    setMonth(getCurrentMonthName());
  }, []);

  // Fetch teacher data
  const { data: teacher, isLoading: isLoadingTeacher } =
    useGetTeacherByEmailQuery(user?.email, {
      skip: !user?.email,
    });

  // Fetch lessons data
  const {
    data: lessonsCovered = [],
    isLoading: isLoadingMonthly,
    isFetching: isFetchingMonthly,
    isError: isMonthlyError,
    error: monthlyError,
    refetch: refetchMonthly,
  } = useGetTeacherLessonsCoveredMonthlySummaryQuery(
    {
      id: teacher?._id,
      month,
      year: year.toString(),
    },
    {
      skip: !teacher?._id || showOverallSummary || !month,
      refetchOnMountOrArgChange: true,
    }
  );

  // Fetch overall summary data
  const {
    data: overallSummary = [],
    isLoading: isLoadingYearly,
    isFetching: isFetchingYearly,
    isError: isYearlyError,
    refetch: refetchYearly,
  } = useGetTeacherLessonsCoveredYearlySummaryQuery(
    {
      id: teacher?._id,
      year: year.toString(),
    },
    {
      skip: !teacher?._id || !showOverallSummary,
      refetchOnMountOrArgChange: true,
    }
  );

  // Enhanced loading detection
  const isFetching = showOverallSummary ? isFetchingYearly : isFetchingMonthly;
  const isLoadingInitial = showOverallSummary
    ? isLoadingYearly
    : isLoadingMonthly;
  const isLoading = isLoadingTeacher || isLoadingInitial || isFetching;

  const isError = showOverallSummary ? isYearlyError : isMonthlyError;
  const isNoDataError = monthlyError?.data?.message?.includes("No data found");

  // Refetch data when filters change
  useEffect(() => {
    if (!showOverallSummary && month && teacher?._id) {
      refetchMonthly();
    }
  }, [month, year, showOverallSummary, refetchMonthly, teacher?._id]);

  useEffect(() => {
    if (showOverallSummary && teacher?._id) {
      refetchYearly();
    }
  }, [year, showOverallSummary, refetchYearly, teacher?._id]);

  const handleOverallSummaryClick = () => {
    setShowOverallSummary(!showOverallSummary);
    if (!showOverallSummary) {
      setMonth(""); // Clear month when switching to overall summary
    } else {
      setMonth(getCurrentMonthName()); // Set current month when switching back
    }
    setSearchTerm(""); // Clear search when switching views
  };

  // Handle month change
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
  };

  // Handle year change
  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    setYear(newYear);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handlePublish = async (ids) => {
    if (!ids || ids.length === 0) {
      toast.error("No document IDs to publish.");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Publish selected report(s)?",
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
            Swal.fire("Published!", "Reports have been published.", "success");
            // Refetch data after publishing
            if (showOverallSummary) {
              refetchYearly();
            } else {
              refetchMonthly();
            }
          }
        } catch (error) {
          toast.error(error?.data?.message || "Failed to publish lessons.");
        }
      }
    });
  };

  // Filter data based on search term
  const filterDataBySearch = (data) => {
    if (!searchTerm.trim()) return data;

    const searchLower = searchTerm.toLowerCase().trim();
    return data.filter(
      (item) =>
        item.student_name?.toLowerCase().includes(searchLower) ||
        item.class_name?.toLowerCase().includes(searchLower)
    );
  };

  const displayData = filterDataBySearch(
    showOverallSummary ? overallSummary : lessonsCovered
  );
  const isEmpty = displayData.length === 0;
  const originalDataCount = showOverallSummary
    ? overallSummary.length
    : lessonsCovered.length;
  const filteredCount = displayData.length;

  // Get all progress fields that have values
  const getProgressInfo = (progress) => {
    if (!progress) return [];

    return [
      progress.selected && { label: "Type", value: progress.selected },
      progress.page_progress !== undefined &&
        progress.page_progress !== null && {
          label: "Pages Done",
          value: progress.page_progress,
        },
      progress.line_progress !== undefined &&
        progress.line_progress !== null && {
          label: "Lines",
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

  // Get all available progress sections
  const getProgressSections = (progressData, type) => {
    const sections = [
      {
        key: "qaidah_quran_progress",
        title: "Qaidah / Quran",
        color: "#e3f2fd",
        icon: "📖",
      },
      {
        key: "islamic_studies_progress",
        title: "Islamic Studies",
        color: "#e8f5e9",
        icon: "📚",
      },
      {
        key: "dua_surah_progress",
        title: "Dua / Surah",
        color: "#fff8e1",
        icon: "🕌",
      },
      {
        key: "gift_for_muslim_progress",
        title: "Gift for Muslim",
        color: "#fff3e0",
        icon: "🎁",
      },
    ];

    // Filter based on student type and whether progress data exists
    return sections.filter((section) => {
      const progress = progressData[section.key];
      if (!progress) return false;

      // For gift_muslim type, only show qaidah_quran and gift_for_muslim
      if (type === "gift_muslim") {
        return (
          section.key === "qaidah_quran_progress" ||
          section.key === "gift_for_muslim_progress"
        );
      }

      // For normal type, show all except gift_for_muslim if it's null
      return section.key !== "gift_for_muslim_progress";
    });
  };

  return (
    <div className="container-fluid p-3">
      <h3 className="mb-4 fw-semibold">Reports Summary</h3>

      {/* Filters */}
      <div className="row align-items-end mb-4 g-3">
        <div className="col-md-8 d-flex flex-wrap gap-3">
          {!showOverallSummary && (
            <div style={{ minWidth: "200px" }}>
              <label className="form-label fw-semibold">Month</label>
              <select
                className="form-select"
                value={month}
                onChange={handleMonthChange}
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

          <div style={{ minWidth: "200px" }}>
            <label className="form-label fw-semibold">Year</label>
            <select
              className="form-select"
              value={year}
              onChange={handleYearChange}
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

          {/* Search Field */}
          <div style={{ minWidth: "250px" }}>
            <label className="form-label fw-semibold">
              Search Student or Class
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by student name or class..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4 text-md-end">
          <button className="btn btn-dark" onClick={handleOverallSummaryClick}>
            {showOverallSummary ? "Show Monthly View" : "Overall Summary"}
          </button>
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && !isError && originalDataCount > 0 && (
        <div className="mb-3">
          <small className="text-muted">
            Showing {filteredCount} of {originalDataCount} student
            {originalDataCount !== 1 ? "s" : ""}
            {searchTerm && (
              <span>
                {" "}
                for "<strong>{searchTerm}</strong>"
              </span>
            )}
          </small>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSpinnerDash />
      ) : isError && !isNoDataError ? (
        <div className="alert alert-danger">Error loading data</div>
      ) : isEmpty ? (
        <div className="alert alert-info text-center">
          {searchTerm ? (
            <>
              No students found matching "<strong>{searchTerm}</strong>"
              {originalDataCount > 0 && (
                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleClearSearch}
                  >
                    Clear search to show all {originalDataCount} students
                  </button>
                </div>
              )}
            </>
          ) : showOverallSummary ? (
            `No yearly data found for ${year}`
          ) : month ? (
            `No lessons found for ${month} ${year}`
          ) : (
            "Please select filters to view data"
          )}
        </div>
      ) : (
        <div className="row g-3">
          {displayData.map((item, idx) => {
            const progressData = showOverallSummary ? item.progress : item;
            const sections = getProgressSections(progressData, item.type);
            const isGiftMuslim = item.type === "gift_muslim";

            return (
              <div key={item.student_id || idx} className="col-lg-6 col-xl-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    {/* Header */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fw-bold text-dark">
                            {item.student_name}
                          </h5>
                          <p className="mb-1 text-muted small">
                            <i className="fas fa-user-graduate me-1"></i>
                            {item.class_name}
                          </p>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-secondary mb-1">
                            {showOverallSummary
                              ? `Year ${item.year}`
                              : `${item.month} ${item.year}`}
                          </span>
                          <br />
                          <span
                            className={`badge ${
                              isGiftMuslim ? "bg-info" : "bg-success"
                            }`}
                          >
                            {isGiftMuslim ? "Gift for Muslim" : "Normal"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Sections */}
                    <div className="flex-grow-1 d-flex flex-column">
                      {sections.length > 0 ? (
                        <div
                          className={`flex-grow-1 d-flex flex-column ${
                            isGiftMuslim ? "gap-0" : "gap-3"
                          }`}
                          style={{ minHeight: isGiftMuslim ? "200px" : "auto" }}
                        >
                          {sections.map((section, index) => {
                            const progress = progressData[section.key];
                            const progressInfo = getProgressInfo(progress);

                            return (
                              <div
                                key={section.key}
                                className={`p-3 rounded border ${
                                  isGiftMuslim ? "flex-grow-1" : ""
                                } ${isGiftMuslim && index === 0 ? "mb-2" : ""}`}
                                style={{
                                  backgroundColor: section.color,
                                  minHeight: isGiftMuslim ? "48%" : "auto",
                                }}
                              >
                                <h6 className="fw-semibold mb-2 d-flex align-items-center">
                                  <span className="me-2">{section.icon}</span>
                                  {section.title}
                                </h6>

                                {progressInfo.length > 0 ? (
                                  <div className="row g-1">
                                    {progressInfo.map((info, i) => (
                                      <div key={i} className="col-6">
                                        <div className="d-flex justify-content-between">
                                          <small className="text-muted">
                                            {info.label}:
                                          </small>
                                          <small className="fw-bold text-dark">
                                            {info.value}
                                          </small>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <small className="text-muted">
                                    No progress data
                                  </small>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted flex-grow-1 d-flex align-items-center justify-content-center">
                          <div>
                            <i className="fas fa-clipboard-list fa-2x mb-2"></i>
                            <p className="mb-0">No progress data available</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 pt-3 border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {sections.length} subject
                          {sections.length !== 1 ? "s" : ""}
                        </small>
                        <button
                          className="btn btn-sm btn-warning text-white fw-semibold"
                          onClick={() =>
                            handlePublish(item.processedDocumentIds)
                          }
                        >
                          <i className="fas fa-upload me-1"></i>
                          Publish
                        </button>
                      </div>
                    </div>
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
