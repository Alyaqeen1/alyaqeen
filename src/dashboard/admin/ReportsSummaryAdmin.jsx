import React, { useState, useEffect } from "react";
import {
  useGetYearlyReportsQuery,
  useUpdateYearlyReportMutation,
} from "../../redux/features/yearly_reports/yearly_reportsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ReportsSummaryAdmin() {
  const currentYear = new Date().getFullYear();
  const [academicYear, setAcademicYear] = useState(
    `${currentYear}-${currentYear + 1}`,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("all"); // "all", "beginning", "ending"

  // ===== GET ALL REPORTS =====
  const {
    data: allReports = [],
    isLoading: reportsLoading,
    isFetching: isFetchingReports,
    isError,
    refetch: refetchReports,
  } = useGetYearlyReportsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateYearlyReport] = useUpdateYearlyReportMutation();

  // ===== FILTER REPORTS =====
  const filteredReports = allReports.filter((report) => {
    // Filter by academic year
    if (academicYear && report.academic_year !== academicYear) {
      return false;
    }

    // Filter by report type
    if (
      viewMode === "beginning" &&
      report.report_type !== "beginning_of_year"
    ) {
      return false;
    }
    if (viewMode === "ending" && report.report_type !== "end_of_year") {
      return false;
    }

    // Filter by search term (student name, class name, teacher name)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      const studentName = report.student_name || "";
      const teacherName = report.teacher_name || "";
      const className = report.class_name || "";

      return (
        studentName.toLowerCase().includes(searchLower) ||
        teacherName.toLowerCase().includes(searchLower) ||
        className.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // ===== GROUP REPORTS BY STUDENT AND ACADEMIC YEAR =====
  const groupedReports = filteredReports.reduce((acc, report) => {
    const key = `${report.student_id}-${report.academic_year}`;
    if (!acc[key]) {
      acc[key] = {
        student_id: report.student_id,
        student_name: report.student_name || "Unknown Student",
        class_name: report.class_name || "N/A",
        teacher_name: report.teacher_name || "N/A",
        academic_year: report.academic_year,
        beginning: null,
        ending: null,
        type: report.type,
        notes: [],
        report_ids: [],
        is_published: false,
        unpublished_ids: [], // Track unpublished report IDs
      };
    }

    // Add notes to the group
    if (report.notes && report.notes.length > 0) {
      acc[key].notes = [...acc[key].notes, ...report.notes];
    }

    // Add report ID
    if (report._id) {
      acc[key].report_ids.push(report._id);
    }

    // Track if any report is published
    if (report.is_published) {
      acc[key].is_published = true;
    } else {
      // Track unpublished report IDs
      acc[key].unpublished_ids.push(report._id);
    }

    // Assign beginning or ending
    if (report.report_type === "beginning_of_year") {
      acc[key].beginning = report;
    } else if (report.report_type === "end_of_year") {
      acc[key].ending = report;
    }

    // Set type from beginning if available, else from ending
    if (!acc[key].type && report.type) {
      acc[key].type = report.type;
    }

    return acc;
  }, {});

  const groupedReportsArray = Object.values(groupedReports);

  // ===== HANDLE PUBLISH =====
  const handlePublish = async (reportIds) => {
    if (!reportIds || reportIds.length === 0) {
      toast.error("No reports to publish.");
      return;
    }

    // Filter only unpublished reports
    const unpublishedIds = reportIds.filter((id) => {
      const report = allReports.find((r) => r._id === id);
      return report && !report.is_published;
    });

    if (unpublishedIds.length === 0) {
      toast.info("All selected reports are already published.");
      return;
    }

    const publishCount = unpublishedIds.length;

    Swal.fire({
      title: "Are you sure?",
      text: `Publish ${publishCount} unpublished report(s)? Parents will be able to see them.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, publish ${publishCount} report(s)!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Update only unpublished reports
          for (const id of unpublishedIds) {
            await updateYearlyReport({
              id,
              data: { is_published: true },
            }).unwrap();
          }

          Swal.fire(
            "Published!",
            `${publishCount} report(s) have been published successfully.`,
            "success",
          );
          refetchReports();
        } catch (error) {
          toast.error(error?.data?.message || "Failed to publish reports.");
        }
      }
    });
  };

  // ===== HELPER: Format Date =====
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // ===== FIXED: GET PROGRESS INFO WITH ALL DETAILS =====
  const getProgressInfo = (lessons, type) => {
    if (!lessons) return [];

    const info = [];

    // Qaidah/Quran - Show ALL details
    if (lessons.qaidah_quran) {
      const q = lessons.qaidah_quran;
      if (q.selected === "quran" || q.selected === "hifz") {
        const details = [];
        if (q.data?.para) details.push(`Para: ${q.data.para}`);
        if (q.data?.page) details.push(`Page: ${q.data.page}`);
        if (q.data?.line) details.push(`Line: ${q.data.line}`);
        info.push({
          label: "Quran/Hifz",
          value: details.join(", ") || "N/A",
        });
      } else {
        const details = [];
        if (q.data?.level) details.push(`Level: ${q.data.level}`);
        if (q.data?.lesson_name) details.push(`Lesson: ${q.data.lesson_name}`);
        if (q.data?.page) details.push(`Page: ${q.data.page}`);
        if (q.data?.line) details.push(`Line: ${q.data.line}`);
        info.push({
          label: "Qaidah/Tajweed",
          value: details.join(", ") || "N/A",
        });
      }
    }

    // Islamic Studies (only for normal type)
    if (type === "normal" && lessons.islamic_studies) {
      const is = lessons.islamic_studies;
      const details = [];
      if (is.book) details.push(`Book: ${is.book}`);
      if (is.page) details.push(`Page: ${is.page}`);
      if (is.lesson_name) details.push(`Lesson: ${is.lesson_name}`);
      info.push({
        label: "Islamic Studies",
        value: details.join(", ") || "N/A",
      });
    }

    // Dua/Surah (only for normal type)
    if (type === "normal" && lessons.dua_surah) {
      const ds = lessons.dua_surah;
      const details = [];
      if (ds.book) details.push(`Book: ${ds.book}`);
      if (ds.level) details.push(`Level: ${ds.level}`);
      if (ds.page) details.push(`Page: ${ds.page}`);
      if (ds.target) details.push(`Target: ${ds.target}`);
      if (ds.dua_number) details.push(`Dua #: ${ds.dua_number}`);
      if (ds.lesson_name) details.push(`Lesson: ${ds.lesson_name}`);
      info.push({
        label: "Dua/Surah",
        value: details.join(", ") || "N/A",
      });
    }

    // Gift for Muslim - Show ALL details
    if (type === "gift_muslim" && lessons.gift_for_muslim) {
      const gm = lessons.gift_for_muslim;
      const details = [];
      if (gm.level) details.push(`Level: ${gm.level}`);
      if (gm.lesson_name) details.push(`Lesson: ${gm.lesson_name}`);
      if (gm.page) details.push(`Page: ${gm.page}`);
      if (gm.target) details.push(`Target: ${gm.target}`);
      info.push({
        label: "Gift for Muslim",
        value: details.join(", ") || "N/A",
      });
    }

    return info;
  };

  // ===== GET EDUCATION TYPE =====
  const getEducationType = (reportGroup) => {
    if (reportGroup?.beginning?.type) return reportGroup.beginning.type;
    if (reportGroup?.ending?.type) return reportGroup.ending.type;
    if (reportGroup?.type) return reportGroup.type;
    return "normal";
  };

  const isLoading = reportsLoading || isFetchingReports;

  return (
    <div className="container-fluid p-3">
      <h3 className="mb-4 fw-semibold">📊 Reports Summary - Admin</h3>

      {/* Filters */}
      <div className="row align-items-end mb-4 g-3">
        <div className="col-md-8 d-flex flex-wrap gap-3">
          <div style={{ minWidth: "200px" }}>
            <label className="form-label fw-semibold">Academic Year</label>
            <select
              className="form-select"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                (yr) => (
                  <option key={yr} value={`${yr}-${yr + 1}`}>
                    {yr}-{yr + 1}
                  </option>
                ),
              )}
            </select>
          </div>

          <div style={{ minWidth: "200px" }}>
            <label className="form-label fw-semibold">Report Type</label>
            <select
              className="form-select"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="beginning">Beginning of Year</option>
              <option value="ending">End of Year</option>
            </select>
          </div>

          <div style={{ minWidth: "250px" }}>
            <label className="form-label fw-semibold">
              Search Student, Class, or Teacher
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, class, or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4 text-md-end">
          <button
            className="btn btn-outline-secondary"
            onClick={() => refetchReports()}
            disabled={isLoading}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && !isError && groupedReportsArray.length > 0 && (
        <div className="mb-3">
          <small className="text-muted">
            Showing {groupedReportsArray.length} student
            {groupedReportsArray.length !== 1 ? "s" : ""}
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
      ) : isError ? (
        <div className="alert alert-danger">Error loading data</div>
      ) : groupedReportsArray.length === 0 ? (
        <div className="alert alert-info text-center">
          {searchTerm ? (
            <>
              No reports found matching "<strong>{searchTerm}</strong>"
              <div className="mt-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </button>
              </div>
            </>
          ) : (
            `No reports found for ${academicYear}`
          )}
        </div>
      ) : (
        <div className="row g-3">
          {groupedReportsArray.map((group, idx) => {
            const educationType = getEducationType(group);
            const isGiftMuslim = educationType === "gift_muslim";
            const hasBeginning = !!group.beginning;
            const hasEnding = !!group.ending;
            const isPublished = group.is_published;
            const hasUnpublished = group.unpublished_ids.length > 0;

            // Determine button text and state
            let buttonText = "Publish All";
            let isButtonDisabled = false;

            if (group.report_ids.length === 0) {
              buttonText = "No Reports";
              isButtonDisabled = true;
            } else if (!hasUnpublished) {
              buttonText = "✅ All Published";
              isButtonDisabled = true;
            } else if (hasUnpublished && isPublished) {
              buttonText = `Publish ${group.unpublished_ids.length} Unpublished`;
              isButtonDisabled = false;
            }

            return (
              <div key={idx} className="col-lg-6 col-xl-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    {/* Header */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1 fw-bold text-dark">
                            {group.student_name}
                          </h5>
                          <p className="mb-1 text-muted small">
                            <i className="fas fa-user-graduate me-1"></i>
                            {group.class_name}
                          </p>
                          <p className="mb-0 text-muted small">
                            <i className="fas fa-chalkboard-teacher me-1"></i>
                            {group.teacher_name}
                          </p>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-secondary d-block mb-1">
                            {group.academic_year}
                          </span>
                          <span
                            className={`badge ${
                              isGiftMuslim ? "bg-info" : "bg-success"
                            } d-block`}
                          >
                            {isGiftMuslim ? "Gift for Muslim" : "Normal"}
                          </span>
                          {isPublished && (
                            <span className="badge bg-primary d-block mt-1">
                              ✅ Published
                            </span>
                          )}
                          {!isPublished && hasBeginning && hasEnding && (
                            <span className="badge bg-warning text-dark d-block mt-1">
                              ⏳ Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Report Status */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div
                          className={`p-2 rounded text-center ${
                            hasBeginning
                              ? group.beginning?.is_published
                                ? "bg-success text-white"
                                : "bg-warning text-dark"
                              : "bg-secondary text-white"
                          }`}
                        >
                          <small>
                            {hasBeginning
                              ? group.beginning?.is_published
                                ? "✅ Beginning"
                                : "⏳ Beginning"
                              : "❌ Beginning"}
                          </small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div
                          className={`p-2 rounded text-center ${
                            hasEnding
                              ? group.ending?.is_published
                                ? "bg-success text-white"
                                : "bg-warning text-dark"
                              : "bg-secondary text-white"
                          }`}
                        >
                          <small>
                            {hasEnding
                              ? group.ending?.is_published
                                ? "✅ End"
                                : "⏳ End"
                              : "❌ End"}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Beginning Report Details */}
                    {hasBeginning && (
                      <div className="mb-2 p-2 bg-light rounded">
                        <h6 className="mb-1 small text-primary">
                          📘 Beginning
                          {group.beginning?.is_published && (
                            <span className="badge bg-success ms-2">
                              Published
                            </span>
                          )}
                          {!group.beginning?.is_published && (
                            <span className="badge bg-warning text-dark ms-2">
                              Pending
                            </span>
                          )}
                        </h6>
                        {getProgressInfo(
                          group.beginning.lessons,
                          educationType,
                        ).map((info, i) => (
                          <div
                            key={i}
                            className="d-flex justify-content-between small"
                          >
                            <span className="text-muted">{info.label}:</span>
                            <span className="fw-bold">{info.value}</span>
                          </div>
                        ))}
                        <small className="text-muted">
                          {formatDate(group.beginning.created_at)}
                        </small>
                      </div>
                    )}

                    {/* Ending Report Details */}
                    {hasEnding && (
                      <div className="mb-2 p-2 bg-light rounded">
                        <h6 className="mb-1 small text-warning">
                          📗 End
                          {group.ending?.is_published && (
                            <span className="badge bg-success ms-2">
                              Published
                            </span>
                          )}
                          {!group.ending?.is_published && (
                            <span className="badge bg-warning text-dark ms-2">
                              Pending
                            </span>
                          )}
                        </h6>
                        {getProgressInfo(
                          group.ending.lessons,
                          educationType,
                        ).map((info, i) => (
                          <div
                            key={i}
                            className="d-flex justify-content-between small"
                          >
                            <span className="text-muted">{info.label}:</span>
                            <span className="fw-bold">{info.value}</span>
                          </div>
                        ))}
                        <small className="text-muted">
                          {formatDate(group.ending.created_at)}
                        </small>
                      </div>
                    )}

                    {/* Notes */}
                    {group.notes.length > 0 && (
                      <div className="mt-2 p-2 bg-warning bg-opacity-10 rounded">
                        <h6 className="mb-1 small text-warning">
                          📝 Notes ({group.notes.length})
                        </h6>
                        <div className="small">
                          {group.notes.slice(0, 2).map((note, i) => (
                            <div key={i} className="text-muted">
                              <span className="fw-bold">
                                {formatDate(note.date)}:
                              </span>{" "}
                              {note.text}
                            </div>
                          ))}
                          {group.notes.length > 2 && (
                            <span className="text-muted">
                              +{group.notes.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-3 pt-3 border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {group.report_ids.length} report
                          {group.report_ids.length !== 1 ? "s" : ""}
                          {hasUnpublished &&
                            ` (${group.unpublished_ids.length} unpublished)`}
                        </small>
                        <button
                          className="btn btn-sm btn-warning text-white fw-semibold"
                          onClick={() => handlePublish(group.report_ids)}
                          disabled={isButtonDisabled}
                        >
                          <i className="fas fa-upload me-1"></i>
                          {buttonText}
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
