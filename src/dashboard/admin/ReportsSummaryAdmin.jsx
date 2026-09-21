import React, { useState } from "react";
import {
  useGetYearlyReportsQuery,
  useUpdateYearlyReportMutation,
} from "../../redux/features/yearly_reports/yearly_reportsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const TERMS = [
  { value: "autumn", label: "Autumn Term", period: "1 Sep – 31 Dec" },
  { value: "spring", label: "Spring Term", period: "1 Jan – 30 Apr" },
  { value: "summer", label: "Summer Term", period: "1 May – 31 Aug" },
];

export default function ReportsSummaryAdmin() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedTerm, setSelectedTerm] = useState("autumn");
  const [searchTerm, setSearchTerm] = useState("");

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

  // ===== FILTER =====
  const filteredReports = allReports.filter((report) => {
    if (report.report_type !== "term_progress") return false;
    if (year && Number(report.year) !== Number(year)) return false;
    if (selectedTerm !== "all" && report.term !== selectedTerm) return false;

    if (searchTerm) {
      const s = searchTerm.toLowerCase().trim();
      return (
        (report.student_name || "").toLowerCase().includes(s) ||
        (report.teacher_name || "").toLowerCase().includes(s) ||
        (report.class_name || "").toLowerCase().includes(s)
      );
    }
    return true;
  });

  const sortedReports = [...filteredReports].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
  );

  const isLoading = reportsLoading || isFetchingReports;

  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return "N/A";
      return dt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getTermLabel = (term) =>
    TERMS.find((t) => t.value === term)?.label || term;

  // ===== PUBLISH SINGLE REPORT =====
  const handlePublish = async (report) => {
    if (report.is_published) {
      toast.info("This report is already published.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      html: `
        <div class="text-start">
          <div><b>Student:</b> ${report.student_name || "Unknown"}</div>
          <div><b>Term:</b> ${getTermLabel(report.term)} ${report.year}</div>
          <div class="mt-2 text-muted">
            Once published, the parent will be able to view this report.
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, publish!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateYearlyReport({
        id: report._id,
        data: { is_published: true },
      }).unwrap();

      Swal.fire(
        "Published!",
        "The report has been published successfully.",
        "success",
      );
      refetchReports();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to publish report.");
    }
  };

  // ===== SUBJECT ROWS =====
  const getSubjectRows = (report) => {
    const s = report.subjects || {};
    const rows = [];

    if (s.qaida_quran_tajweed) {
      const d = s.qaida_quran_tajweed;
      if (d.beginning || d.end || d.total_learning) {
        rows.push({
          label: d.title || "Qaida / Qur'an / Tajweed",
          beginning: d.beginning,
          end: d.end,
          summary: d.total_learning,
        });
      }
    }

    if (!report.is_gfm && s.duas_surahs) {
      const d = s.duas_surahs;
      if (d.beginning || d.end || d.total_learning) {
        rows.push({
          label: "Duas & Surahs",
          beginning: d.beginning,
          end: d.end,
          summary: d.total_learning,
        });
      }
    }

    if (s.islamic_studies) {
      const d = s.islamic_studies;
      if (d.beginning || d.end || d.total_learning) {
        rows.push({
          label: "Islamic Studies",
          beginning: d.beginning,
          end: d.end,
          summary: d.total_learning,
        });
      }
    }

    return rows;
  };

  return (
    <div className="container-fluid p-3">
      <h3 className="mb-4 fw-semibold">📊 Term Progress Reports</h3>

      {/* ===== FILTERS ===== */}
      <div className="row align-items-end mb-4 g-3">
        <div className="col-md-8 d-flex flex-wrap gap-3">
          <div style={{ minWidth: "200px" }}>
            <label className="form-label fw-semibold">Year</label>
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ),
              )}
            </select>
          </div>

          <div style={{ minWidth: "250px" }}>
            <label className="form-label fw-semibold">Term</label>
            <select
              className="form-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="all">All Terms</option>
              {TERMS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label} ({t.period})
                </option>
              ))}
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

      {/* ===== COUNT ===== */}
      {!isLoading && !isError && sortedReports.length > 0 && (
        <div className="mb-3">
          <small className="text-muted">
            Showing {sortedReports.length} report
            {sortedReports.length !== 1 ? "s" : ""}
            {selectedTerm !== "all" && (
              <span>
                {" "}
                for <strong>{getTermLabel(selectedTerm)}</strong>
              </span>
            )}
          </small>
        </div>
      )}

      {/* ===== CONTENT ===== */}
      {isLoading ? (
        <LoadingSpinnerDash />
      ) : isError ? (
        <div className="alert alert-danger">Error loading data</div>
      ) : sortedReports.length === 0 ? (
        <div className="alert alert-info text-center">
          No term progress reports found for {getTermLabel(selectedTerm)} {year}
        </div>
      ) : (
        <div className="row g-3">
          {sortedReports.map((report, idx) => {
            const subjectRows = getSubjectRows(report);
            const isPublished = report.is_published;

            return (
              <div key={report._id || idx} className="col-lg-6 col-xl-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    {/* ===== HEADER ===== */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1 fw-bold text-dark">
                            {report.student_name || "Unknown"}
                          </h5>
                          <p className="mb-1 text-muted small">
                            <i className="fas fa-user-graduate me-1"></i>
                            {report.class_name || "N/A"}
                          </p>
                          <p className="mb-0 text-muted small">
                            <i className="fas fa-chalkboard-teacher me-1"></i>
                            {report.teacher_name || "N/A"}
                          </p>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-primary d-block mb-1">
                            {getTermLabel(report.term)} {report.year}
                          </span>
                          <span
                            className={`badge ${
                              report.is_gfm ? "bg-info" : "bg-success"
                            } d-block`}
                          >
                            {report.is_gfm ? "Gift for Muslim" : "Normal"}
                          </span>
                          {isPublished && (
                            <span className="badge bg-primary d-block mt-1">
                              ✅ Published
                            </span>
                          )}
                          {!isPublished && (
                            <span className="badge bg-warning text-dark d-block mt-1">
                              ⏳ Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ===== SUBJECTS ===== */}
                    {subjectRows.length === 0 ? (
                      <p className="text-muted small mb-0">
                        No subject data available
                      </p>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {subjectRows.map((row, i) => (
                          <div key={i} className="p-2 bg-light rounded">
                            <h6 className="mb-1 small text-primary">
                              {row.label}
                            </h6>
                            <div className="small">
                              <div>
                                <span className="text-muted">Beginning: </span>
                                {row.beginning || "—"}
                              </div>
                              <div>
                                <span className="text-muted">End: </span>
                                {row.end || "—"}
                              </div>
                              <div>
                                <span className="text-muted">Summary: </span>
                                {row.summary || "—"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ===== ACTIONS ===== */}
                    <div className="mt-3 pt-3 border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Submitted: {formatDate(report.created_at)}
                        </small>
                        {isPublished ? (
                          <button
                            className="btn btn-sm btn-outline-success"
                            disabled
                          >
                            <i className="fas fa-check-circle me-1"></i>
                            Published
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-warning text-white fw-semibold"
                            onClick={() => handlePublish(report)}
                          >
                            <i className="fas fa-upload me-1"></i>
                            Publish
                          </button>
                        )}
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
