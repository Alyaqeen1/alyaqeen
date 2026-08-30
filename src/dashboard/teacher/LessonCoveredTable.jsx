import React, { useState } from "react";
import { FaTrashAlt, FaPen } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  useGetYearlyReportsQuery,
  useDeleteYearlyReportMutation,
} from "../../redux/features/yearly_reports/yearly_reportsApi";
import { useGetTeacherByEmailQuery } from "../../redux/features/teachers/teachersApi";
import useAuth from "../../hooks/useAuth";
import LessonCoveredUpdateModal from "../shared/LessonCoveredUpdateModal";

export default function LessonCoveredTable() {
  const currentYear = new Date().getFullYear();
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterName, setFilterName] = useState("");
  const [filterReportType, setFilterReportType] = useState("");
  const { user } = useAuth();

  const { data: teacher } = useGetTeacherByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  // ===== GET ALL REPORTS (already has student_name from backend) =====
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

  // ===== FILTER REPORTS =====
  const filteredReports = allReports.filter((report) => {
    // Filter by teacher
    if (report.teacher_id !== teacher?._id) return false;

    // Filter by year
    if (filterYear && !report.academic_year?.includes(filterYear)) {
      return false;
    }

    // Filter by report type
    if (filterReportType && report.report_type !== filterReportType) {
      return false;
    }

    // Filter by student name (now available directly from report)
    if (filterName) {
      const studentName = report.student_name || "Unknown Student";
      if (!studentName.toLowerCase().includes(filterName.toLowerCase())) {
        return false;
      }
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
        academic_year: report.academic_year,
        beginning: null,
        ending: null,
        type: report.type,
        notes: [],
        report_ids: [],
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

  const handleDelete = async (reportIds) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const id of reportIds) {
            await deleteYearlyReport(id).unwrap();
          }
          Swal.fire({
            title: "Deleted!",
            text: "The report has been deleted.",
            icon: "success",
          });
          refetchReports();
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error?.data?.message || "Failed to delete report",
            icon: "error",
          });
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

  const renderSubjectDetails = (lessons, subject, type) => {
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
            {renderSubjectDetails(lessons, "qaidah_quran", type)}
          </li>
          <li className="list-group-item">
            <strong>Gift for Muslim:</strong>
            <br />
            {renderSubjectDetails(lessons, "gift_for_muslim", type)}
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Quran/Qaidah:</strong>
            <br />
            {renderSubjectDetails(lessons, "qaidah_quran", type)}
          </li>
          <li className="list-group-item">
            <strong>Islamic Studies:</strong>
            <br />
            {renderSubjectDetails(lessons, "islamic_studies", type)}
          </li>
          <li className="list-group-item">
            <strong>Dua/Surah:</strong>
            <br />
            {renderSubjectDetails(lessons, "dua_surah", type)}
          </li>
        </ul>
      );
    }
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
              <label className="form-label">Academic Year</label>
              <select
                className="form-control"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                  (yr) => (
                    <option key={yr} value={yr}>
                      {yr}-{yr + 1}
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
                  Academic Year
                </th>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Beginning Report
                </th>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  End Report
                </th>
                <th
                  className="text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Notes
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
                const hasBeginning = !!reportGroup.beginning;
                const hasEnding = !!reportGroup.ending;
                const notesCount = reportGroup.notes?.length || 0;

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
                        {hasBeginning ? (
                          <span className="badge bg-success">✅ Available</span>
                        ) : (
                          <span className="badge bg-secondary">
                            ❌ Not Added
                          </span>
                        )}
                      </td>
                      <td>
                        {hasEnding ? (
                          <span className="badge bg-success">✅ Available</span>
                        ) : (
                          <span className="badge bg-secondary">
                            ❌ Not Added
                          </span>
                        )}
                      </td>
                      <td>
                        {notesCount > 0 ? (
                          <span className="badge bg-info">
                            📝 {notesCount} note{notesCount > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="badge bg-secondary">No notes</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const reportIds = reportGroup.report_ids || [];
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
                        </div>
                      </td>
                    </tr>

                    {expandedRows.has(idx) && (
                      <tr>
                        <td colSpan="9" className="p-0">
                          <div className="p-3 bg-light">
                            <h6 className="mb-3 text-primary">
                              Progress Details for {reportGroup.student_name} -{" "}
                              {reportGroup.academic_year} (
                              {educationType === "gift_muslim"
                                ? "Gift For Muslim"
                                : "Normal Education"}
                              )
                            </h6>

                            {/* Notes Section */}
                            {notesCount > 0 && (
                              <div className="mb-3">
                                <h6 className="text-info">
                                  <i className="fas fa-sticky-note me-2"></i>
                                  Notes ({notesCount})
                                </h6>
                                <div className="bg-white p-2 rounded">
                                  {reportGroup.notes.map((note, noteIdx) => (
                                    <div
                                      key={note.id || noteIdx}
                                      className="border-bottom py-1"
                                    >
                                      <small>
                                        <strong>
                                          {formatDate(note.date)}:
                                        </strong>{" "}
                                        {note.text}
                                      </small>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="row">
                              {/* Beginning of Year */}
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
                                            reportGroup.beginning.created_at ||
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

                              {/* End of Year */}
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
