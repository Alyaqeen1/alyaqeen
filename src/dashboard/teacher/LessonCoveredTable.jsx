import React, { useState } from "react";
import { FaTrashAlt, FaPen, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  useGetYearlyReportsQuery,
  useDeleteYearlyReportMutation,
  useUpdateYearlyReportMutation,
} from "../../redux/features/yearly_reports/yearly_reportsApi";
import { useGetTeacherByEmailQuery } from "../../redux/features/teachers/teachersApi";
import useAuth from "../../hooks/useAuth";
import LessonCoveredUpdateModal from "../shared/LessonCoveredUpdateModal";

// ===== TERM LABELS =====
const TERM_LABELS = {
  autumn: "Autumn",
  spring: "Spring",
  summer: "Summer",
};

export default function LessonCoveredTable() {
  const currentYear = new Date().getFullYear();
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterName, setFilterName] = useState("");
  const [filterReportType, setFilterReportType] = useState("");
  const { user } = useAuth();

  const { data: teacher } = useGetTeacherByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  const {
    data: allReports = [],
    isLoading: reportsLoading,
    refetch: refetchReports,
  } = useGetYearlyReportsQuery(undefined, {
    skip: !teacher?._id,
  });

  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const [deleteYearlyReport] = useDeleteYearlyReportMutation();
  const [updateYearlyReport] = useUpdateYearlyReportMutation();

  const getReportYearStart = (report) => {
    if (report.report_type === "term_progress") {
      return String(report.year);
    }
    if (report.academic_year) {
      return String(report.academic_year).split("-")[0];
    }
    return "";
  };

  const filteredReports = allReports.filter((report) => {
    if (report.teacher_id !== teacher?._id) return false;
    if (filterYear) {
      const reportYear = getReportYearStart(report);
      if (reportYear !== filterYear) return false;
    }
    if (filterReportType && report.report_type !== filterReportType) {
      return false;
    }
    if (filterName) {
      const studentName = report.student_name || "Unknown Student";
      if (!studentName.toLowerCase().includes(filterName.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const groupedReports = filteredReports.reduce((acc, report) => {
    let key;
    if (report.report_type === "term_progress") {
      key = `${report.student_id}-term-${report.year}`;
    } else {
      key = `${report.student_id}-${report.academic_year}`;
    }

    if (!acc[key]) {
      acc[key] = {
        student_id: report.student_id,
        student_name: report.student_name || "Unknown Student",
        academic_year: report.academic_year || `${report.year}`,
        report_kind: report.report_type === "term_progress" ? "term" : "yearly",
        year: report.year,
        beginning: null,
        ending: null,
        terms: { autumn: null, spring: null, summer: null },
        type: report.type,
        report_ids: [],
      };
    }

    if (report._id) {
      acc[key].report_ids.push(report._id);
    }

    if (report.report_type === "beginning_of_year") {
      acc[key].beginning = report;
    } else if (report.report_type === "end_of_year") {
      acc[key].ending = report;
    } else if (report.report_type === "term_progress") {
      acc[key].terms[report.term] = report;
    }

    if (!acc[key].type && report.type) {
      acc[key].type = report.type;
    }

    return acc;
  }, {});

  const groupedReportsArray = Object.values(groupedReports);

  const toggleRowExpansion = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleShow = (reportGroup) => {
    setSelectedReport(reportGroup);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    refetchReports();
  };

  // ===== DELETE WHOLE GROUP =====
  const handleDelete = async (reportIds) => {
    Swal.fire({
      title: "Delete all reports in this group?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete all!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const id of reportIds) {
            await deleteYearlyReport(id).unwrap();
          }
          Swal.fire({
            title: "Deleted!",
            text: "All reports have been deleted.",
            icon: "success",
          });
          refetchReports();
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error?.data?.error || "Failed to delete reports",
            icon: "error",
          });
        }
      }
    });
  };

  // ===== DELETE SINGLE TERM =====
  const handleDeleteSingleTerm = async (termReport, termLabel) => {
    const confirm = await Swal.fire({
      title: `Delete ${termLabel} Term?`,
      html: `
        <div class="text-start">
          <div><b>Student:</b> ${termReport.student_name || "Unknown"}</div>
          <div><b>Term:</b> ${termLabel} ${termReport.year}</div>
          <div class="mt-2 text-danger">
            This action cannot be undone.
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteYearlyReport(termReport._id).unwrap();
      Swal.fire({
        title: "Deleted!",
        text: `${termLabel} term has been deleted.`,
        icon: "success",
      });
      refetchReports();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to delete term.");
    }
  };

  // ===== EDIT SINGLE TERM =====
  const handleEditSingleTerm = (reportGroup, termKey, termData) => {
    // Pass a group with only this term so the modal edits just one
    handleShow({
      ...reportGroup,
      report_kind: "term",
      terms: { [termKey]: termData },
    });
  };

  // ===== PUBLISH SINGLE TERM =====
  const handlePublishTerm = async (termReport, termLabel) => {
    if (termReport.is_published) {
      toast.info("This term is already published.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Publish this term?",
      html: `
        <div class="text-start">
          <div><b>Student:</b> ${termReport.student_name || "Unknown"}</div>
          <div><b>Term:</b> ${termLabel} ${termReport.year}</div>
          <div class="mt-2 text-muted">
            Once published, the parent will be able to view this report.
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, publish",
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateYearlyReport({
        id: termReport._id,
        data: { is_published: true },
      }).unwrap();

      toast.success("Term published successfully!");
      refetchReports();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to publish term.");
    }
  };

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
    } catch {
      return "N/A";
    }
  };

  const renderSubjectDetails = (lessons, subject) => {
    if (!lessons || !lessons[subject]) return "N/A";
    const data = lessons[subject];

    switch (subject) {
      case "qaidah_quran":
        return data.selected === "quran" || data.selected === "hifz"
          ? `Para: ${data.data?.para || "N/A"}, Page: ${data.data?.page || "N/A"}, Line: ${data.data?.line || "N/A"}`
          : `Level: ${data.data?.level || "N/A"}, Lesson: ${data.data?.lesson_name || "N/A"}, Page: ${data.data?.page || "N/A"}`;
      case "islamic_studies":
        return `Book: ${data.book || "N/A"}, Page: ${data.page || "N/A"}, Lesson: ${data.lesson_name || "N/A"}`;
      case "dua_surah":
        return `Book: ${data.book || "N/A"}, Level: ${data.level || "N/A"}, Page: ${data.page || "N/A"}, Target: ${data.target || "N/A"}, Dua Number: ${data.dua_number || "N/A"}, Lesson Name: ${data.lesson_name || "N/A"}`;
      case "gift_for_muslim":
        return `Level: ${data.level || "N/A"}, Lesson: ${data.lesson_name || "N/A"}, Page: ${data.page || "N/A"}, Target: ${data.target || "N/A"}`;
      default:
        return "N/A";
    }
  };

  const getEducationType = (reportGroup) => {
    if (reportGroup?.beginning?.type) return reportGroup.beginning.type;
    if (reportGroup?.ending?.type) return reportGroup.ending.type;
    if (reportGroup?.type) return reportGroup.type;
    return "normal";
  };

  const renderSubjectsList = (lessons, type) => {
    if (!lessons) return <p className="text-muted">No lessons data</p>;

    if (type === "gift_muslim") {
      return (
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Quran/Qaidah:</strong>
            <br />
            {renderSubjectDetails(lessons, "qaidah_quran")}
          </li>
          <li className="list-group-item">
            <strong>Gift for Muslim:</strong>
            <br />
            {renderSubjectDetails(lessons, "gift_for_muslim")}
          </li>
        </ul>
      );
    }

    return (
      <ul className="list-group">
        <li className="list-group-item">
          <strong>Quran/Qaidah:</strong>
          <br />
          {renderSubjectDetails(lessons, "qaidah_quran")}
        </li>
        <li className="list-group-item">
          <strong>Islamic Studies:</strong>
          <br />
          {renderSubjectDetails(lessons, "islamic_studies")}
        </li>
        <li className="list-group-item">
          <strong>Dua/Surah:</strong>
          <br />
          {renderSubjectDetails(lessons, "dua_surah")}
        </li>
      </ul>
    );
  };

  const renderTermSubjects = (termData, isGFM) => {
    if (!termData?.subjects) return <p className="text-muted">No data</p>;

    const s = termData.subjects;

    const renderBlock = (label, data) => {
      const hasData = data?.beginning || data?.end || data?.total_learning;
      return (
        <li className="list-group-item">
          <strong>{label}:</strong>
          {hasData ? (
            <>
              <br />
              <small>
                <strong>Beginning:</strong> {data.beginning || "—"}
                <br />
                <strong>End:</strong> {data.end || "—"}
                <br />
                <strong>Summary:</strong> {data.total_learning || "—"}
              </small>
            </>
          ) : (
            <span className="text-muted"> — no data</span>
          )}
        </li>
      );
    };

    return (
      <ul className="list-group">
        {renderBlock(
          s.qaida_quran_tajweed?.title || "Qaida / Qur'an / Tajweed",
          s.qaida_quran_tajweed,
        )}
        {!isGFM && renderBlock("Duas & Surahs", s.duas_surahs)}
        {renderBlock("Islamic Studies", s.islamic_studies)}
      </ul>
    );
  };

  const countSavedTerms = (group) => {
    return Object.values(group.terms || {}).filter(Boolean).length;
  };

  return (
    <div>
      <h3 className="text-center mb-4">Yearly Reports</h3>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Table Filters</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Year</label>
              <select
                className="form-control"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                  (yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Report Type</label>
              <select
                className="form-control"
                value={filterReportType}
                onChange={(e) => setFilterReportType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="beginning_of_year">Beginning of Year</option>
                <option value="end_of_year">End of Year</option>
                <option value="term_progress">Term Progress</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Student Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {reportsLoading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : groupedReportsArray.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)", width: "40px" }}
                ></th>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  #
                </th>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Student Name
                </th>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Type
                </th>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Year
                </th>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Progress
                </th>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedReportsArray.map((reportGroup, idx) => {
                const educationType = getEducationType(reportGroup);
                const isTermGroup = reportGroup.report_kind === "term";

                const hasBeginning = !!reportGroup.beginning;
                const hasEnding = !!reportGroup.ending;
                const savedTermCount = countSavedTerms(reportGroup);

                return (
                  <React.Fragment key={idx}>
                    <tr
                      className="clickable-row"
                      onClick={() => toggleRowExpansion(idx)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{expandedRows.has(idx) ? "▼" : "►"}</td>
                      <td>{idx + 1}</td>
                      <td className="fw-bold">{reportGroup.student_name}</td>
                      <td>
                        <span
                          className={`badge ${
                            educationType === "gift_muslim"
                              ? "bg-info"
                              : "bg-primary"
                          }`}
                        >
                          {educationType === "gift_muslim"
                            ? "Gift For Muslim"
                            : "Normal Education"}
                        </span>
                      </td>
                      <td>{reportGroup.academic_year}</td>
                      <td>
                        {isTermGroup ? (
                          savedTermCount > 0 ? (
                            <span className="badge bg-info">
                              📅 {savedTermCount} / 3 terms
                            </span>
                          ) : (
                            <span className="badge bg-secondary">
                              ❌ No terms
                            </span>
                          )
                        ) : (
                          <div className="d-flex gap-1 justify-content-center">
                            <span
                              className={`badge ${
                                hasBeginning ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              Beg: {hasBeginning ? "✅" : "❌"}
                            </span>
                            <span
                              className={`badge ${
                                hasEnding ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              End: {hasEnding ? "✅" : "❌"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          {/* Group delete (only for yearly groups) */}
                          {!isTermGroup && (
                            <>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const reportIds =
                                    reportGroup.report_ids || [];
                                  if (reportIds.length === 0) {
                                    Swal.fire({
                                      title: "No Reports",
                                      text: "There are no reports to delete.",
                                      icon: "info",
                                    });
                                    return;
                                  }
                                  handleDelete(reportIds);
                                }}
                                title="Delete group"
                              >
                                <FaTrashAlt />
                              </button>

                              <button
                                className="btn btn-primary btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShow(reportGroup);
                                }}
                                disabled={!hasBeginning && !hasEnding}
                              >
                                <FaPen />
                              </button>
                            </>
                          )}
                          {isTermGroup && (
                            <span className="text-muted small">
                              Edit per term ↓
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {expandedRows.has(idx) && (
                      <tr>
                        <td colSpan="7" className="p-0">
                          <div className="p-3 bg-light">
                            <h6 className="mb-3 text-primary">
                              {isTermGroup
                                ? `Term Progress for ${reportGroup.student_name} - ${reportGroup.academic_year}`
                                : `Progress Details for ${reportGroup.student_name} - ${reportGroup.academic_year}`}
                            </h6>

                            {!isTermGroup && (
                              <div className="row">
                                <div className="col-md-6 mb-4">
                                  <div className="card h-100">
                                    <div className="card-header bg-info text-white">
                                      <h6 className="mb-0">
                                        📘 Beginning of Year
                                      </h6>
                                    </div>
                                    <div className="card-body">
                                      {hasBeginning ? (
                                        <>
                                          <p>
                                            <strong>Date:</strong>{" "}
                                            {formatDate(
                                              reportGroup.beginning
                                                .created_at ||
                                                reportGroup.beginning.date,
                                            )}
                                          </p>
                                          <div className="mt-3">
                                            <h6>Subjects:</h6>
                                            {renderSubjectsList(
                                              reportGroup.beginning.lessons,
                                              educationType,
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        <p className="text-muted">
                                          No beginning of year report available
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-6 mb-4">
                                  <div className="card h-100">
                                    <div className="card-header bg-warning text-dark">
                                      <h6 className="mb-0">📗 End of Year</h6>
                                    </div>
                                    <div className="card-body">
                                      {hasEnding ? (
                                        <>
                                          <p>
                                            <strong>Date:</strong>{" "}
                                            {formatDate(
                                              reportGroup.ending.created_at ||
                                                reportGroup.ending.date,
                                            )}
                                          </p>
                                          <div className="mt-3">
                                            <h6>Subjects:</h6>
                                            {renderSubjectsList(
                                              reportGroup.ending.lessons,
                                              educationType,
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        <p className="text-muted">
                                          No end of year report available
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {isTermGroup && (
                              <div className="row">
                                {["autumn", "spring", "summer"].map((term) => {
                                  const termData = reportGroup.terms[term];
                                  return (
                                    <div key={term} className="col-md-4 mb-4">
                                      <div className="card h-100">
                                        {/* ===== CARD HEADER with per-term actions ===== */}
                                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center flex-wrap gap-1">
                                          <h6 className="mb-0">
                                            📅 {TERM_LABELS[term]} Term
                                          </h6>

                                          {termData && (
                                            <div className="d-flex align-items-center gap-1">
                                              {termData.is_published ? (
                                                <span className="badge bg-success">
                                                  ✅ Published
                                                </span>
                                              ) : (
                                                <span className="badge bg-warning text-dark">
                                                  ⏳ Pending
                                                </span>
                                              )}

                                              <button
                                                className="btn btn-sm btn-light"
                                                title="Edit this term"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEditSingleTerm(
                                                    reportGroup,
                                                    term,
                                                    termData,
                                                  );
                                                }}
                                              >
                                                <FaPen size={12} />
                                              </button>

                                              <button
                                                className="btn btn-sm btn-danger"
                                                title="Delete this term"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteSingleTerm(
                                                    termData,
                                                    TERM_LABELS[term],
                                                  );
                                                }}
                                              >
                                                <FaTrashAlt size={12} />
                                              </button>
                                            </div>
                                          )}
                                        </div>

                                        <div className="card-body">
                                          {termData ? (
                                            <>
                                              {termData.is_gfm && (
                                                <span className="badge bg-warning text-dark mb-2">
                                                  GFM
                                                </span>
                                              )}
                                              <p className="small text-muted mb-2">
                                                <strong>Saved:</strong>{" "}
                                                {formatDate(
                                                  termData.created_at,
                                                )}
                                              </p>
                                              {renderTermSubjects(
                                                termData,
                                                termData.is_gfm,
                                              )}
                                            </>
                                          ) : (
                                            <p className="text-muted mb-0">
                                              Not saved yet
                                            </p>
                                          )}
                                        </div>

                                        {/* ===== Publish button per term ===== */}
                                        {termData && (
                                          <div className="card-footer bg-white border-top d-flex justify-content-end">
                                            {termData.is_published ? (
                                              <button
                                                className="btn btn-sm btn-outline-success"
                                                disabled
                                              >
                                                <FaCheckCircle className="me-1" />
                                                Published
                                              </button>
                                            ) : (
                                              <button
                                                className="btn btn-sm btn-warning text-white fw-semibold"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handlePublishTerm(
                                                    termData,
                                                    TERM_LABELS[term],
                                                  );
                                                }}
                                              >
                                                <FaPaperPlane className="me-1" />
                                                Publish
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          <LessonCoveredUpdateModal
            student={selectedReport}
            showModal={showModal}
            handleClose={handleClose}
          />
        </div>
      ) : (
        <div className="text-center p-5 bg-light rounded">
          <h5 className="text-muted">No yearly reports found</h5>
          <p className="text-muted">
            Try adjusting your filters or add new reports
          </p>
        </div>
      )}
    </div>
  );
}
