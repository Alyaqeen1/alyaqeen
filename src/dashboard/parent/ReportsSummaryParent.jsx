import React, { useState, useEffect } from "react";
import { useGetEnrolledFullFamilyQuery } from "../../redux/features/families/familiesApi";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";
import { useGetYearlyReportsQuery } from "../../redux/features/yearly_reports/yearly_reportsApi";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

const currentYear = new Date().getFullYear();

// Helper function to get current academic year
const getCurrentAcademicYear = () => {
  const year = new Date().getFullYear();
  return `${year}-${year + 1}`;
};

export default function ReportsSummaryParent() {
  const { user, loading } = useAuth();
  const [academicYear, setAcademicYear] = useState(getCurrentAcademicYear());

  const { data: enrolledFamily = {}, isFetching: loadingFamily } =
    useGetEnrolledFullFamilyQuery(user?.email, {
      skip: loading || !user?.email,
    });

  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();

  // Get student IDs from enrolled family
  const studentIds = enrolledFamily?.childrenDocs?.map((s) => s._id) || [];

  // ===== GET PUBLISHED YEARLY REPORTS =====
  const {
    data: allReports = [],
    isFetching: loadingReports,
    error: reportsError,
    refetch: refetchReports,
  } = useGetYearlyReportsQuery(undefined, {
    skip: !studentIds.length,
    refetchOnMountOrArgChange: true,
  });

  // Filter ONLY published reports for parents
  const publishedReports = allReports.filter(
    (report) => report.is_published === true,
  );

  // Filter reports for the selected academic year
  const filteredByYear = publishedReports.filter(
    (report) => report.academic_year === academicYear,
  );

  // Filter reports for the student's children
  const studentReports = filteredByYear.filter((report) =>
    studentIds.includes(report.student_id),
  );

  // Group reports by student
  const groupedReports = studentReports.reduce((acc, report) => {
    const key = report.student_id;
    if (!acc[key]) {
      acc[key] = {
        student_id: report.student_id,
        reports: [],
        beginning: null,
        ending: null,
        allNotes: [], // Collect all notes from both reports
      };
    }

    if (report.report_type === "beginning_of_year") {
      acc[key].beginning = report;
    } else if (report.report_type === "end_of_year") {
      acc[key].ending = report;
    }

    // Collect notes
    if (report.notes && report.notes.length > 0) {
      acc[key].allNotes = [...acc[key].allNotes, ...report.notes];
    }

    acc[key].reports.push(report);
    return acc;
  }, {});

  // Helper function to get academic information for display
  const getAcademicDisplay = (academic) => {
    if (!academic) return { departments: [], classes: [], sessions: [] };

    // Handle new multi-department structure
    if (academic.enrollments && Array.isArray(academic.enrollments)) {
      const deptNames = academic.enrollments.map((enrollment) => {
        const dept = departments?.find((d) => d._id === enrollment.dept_id);
        return dept ? dept.dept_name : "Unknown Department";
      });

      const classNames = academic.enrollments.map((enrollment) => {
        const cls = classes?.find((c) => c._id === enrollment.class_id);
        return cls ? cls.class_name : "Unknown Class";
      });

      return {
        departments: [...new Set(deptNames)],
        classes: [...new Set(classNames)],
        count: academic.enrollments.length,
      };
    }

    // Handle old single department structure
    if (academic.dept_id) {
      const dept = departments?.find((d) => d._id === academic.dept_id);
      const cls = classes?.find((c) => c._id === academic.class_id);

      return {
        departments: [
          dept?.dept_name || academic.department || "Unknown Department",
        ],
        classes: [cls?.class_name || academic.class || "Unknown Class"],
        count: 1,
      };
    }

    return {
      departments: [academic.department || "Not assigned"],
      classes: [academic.class || "Not assigned"],
      count: 1,
    };
  };

  // Format date helper
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

  // Get progress fields with ALL details
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

  // Get education type
  const getEducationType = (report) => {
    return report?.type || "normal";
  };

  // Gradient styles
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const cardGradients = {
    primary: { background: "linear-gradient(135deg, #667eea, #764ba2)" },
    secondary: { background: "linear-gradient(135deg, #f093fb, #f5576c)" },
    info: { background: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    warning: { background: "linear-gradient(135deg, #ffd89b, #19547b)" },
    note: { background: "linear-gradient(135deg, #f6d365, #fda085)" },
  };

  // Get the correct progress sections based on type
  const getProgressSections = (report) => {
    if (!report || !report.lessons) return [];

    const type = getEducationType(report);
    const sections = [];

    // Always show Quran/Qaidah
    if (report.lessons.qaidah_quran) {
      sections.push({
        key: "qaidah_quran",
        label: "Quran/Qaidah",
        icon: "📖",
        gradient: cardGradients.primary,
      });
    }

    if (type === "normal") {
      if (report.lessons.islamic_studies) {
        sections.push({
          key: "islamic_studies",
          label: "Islamic Studies",
          icon: "🕌",
          gradient: cardGradients.info,
        });
      }
      if (report.lessons.dua_surah) {
        sections.push({
          key: "dua_surah",
          label: "Dua/Surah",
          icon: "✨",
          gradient: cardGradients.secondary,
        });
      }
    } else if (type === "gift_muslim") {
      if (report.lessons.gift_for_muslim) {
        sections.push({
          key: "gift_for_muslim",
          label: "Gift for Muslim",
          icon: "🎁",
          gradient: cardGradients.warning,
        });
      }
    }

    return sections;
  };

  // ===== RENDER NOTES SECTION =====
  const renderNotes = (notes) => {
    if (!notes || notes.length === 0) return null;

    return (
      <div className="mt-3">
        <h6 className="small text-warning mb-2">
          <i className="fas fa-sticky-note me-2"></i>
          Notes ({notes.length})
        </h6>
        <div className="bg-warning bg-opacity-10 p-2 rounded">
          {notes.map((note, idx) => (
            <div
              key={note.id || idx}
              className="border-bottom py-1 last:border-0"
            >
              <small className="text-dark">
                <span className="fw-bold">{formatDate(note.date)}:</span>{" "}
                {note.text}
              </small>
            </div>
          ))}
        </div>
      </div>
    );
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

  const isLoading = loadingReports;

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
            </div>

            <div className="col-md-4 text-md-end">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => refetchReports()}
                disabled={isLoading}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinnerDash />}

      {/* Student Reports */}
      {!isLoading && (
        <div className="row g-4">
          {enrolledFamily?.childrenDocs?.map((student) => {
            const studentReport = groupedReports[student._id];
            const academicInfo = getAcademicDisplay(student.academic);
            const hasBeginning = !!studentReport?.beginning;
            const hasEnding = !!studentReport?.ending;
            const allNotes = studentReport?.allNotes || [];

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
                          <div className="d-flex flex-wrap gap-2 align-items-center">
                            <div className="d-flex flex-wrap gap-1">
                              {academicInfo.departments
                                .slice(0, 2)
                                .map((dept, idx) => (
                                  <span
                                    key={idx}
                                    className="badge bg-primary text-wrap"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {dept}
                                  </span>
                                ))}
                              {academicInfo.departments.length > 2 && (
                                <span
                                  className="badge bg-secondary"
                                  style={{ fontSize: "0.65rem" }}
                                >
                                  +{academicInfo.departments.length - 2} more
                                </span>
                              )}
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                              {academicInfo.classes
                                .slice(0, 2)
                                .map((cls, idx) => (
                                  <span
                                    key={idx}
                                    className="badge bg-success text-wrap"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {cls}
                                  </span>
                                ))}
                              {academicInfo.classes.length > 2 && (
                                <span
                                  className="badge bg-secondary"
                                  style={{ fontSize: "0.65rem" }}
                                >
                                  +{academicInfo.classes.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-primary">{academicYear}</span>
                        {allNotes.length > 0 && (
                          <span className="badge bg-warning text-dark ms-1">
                            📝 {allNotes.length} notes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    {/* No Reports Available */}
                    {!studentReport && (
                      <div className="text-center py-4">
                        <div style={{ fontSize: "3rem", opacity: 0.3 }}>📊</div>
                        <h5 className="text-muted mt-3">
                          No published reports available
                        </h5>
                        <p className="text-muted small">
                          Reports will appear here once published by the
                          teacher.
                        </p>
                      </div>
                    )}

                    {/* Reports Available */}
                    {studentReport && (
                      <div className="row g-4">
                        {/* Beginning of Year */}
                        {hasBeginning && (
                          <div className="col-md-6">
                            <div className="card h-100 border-0 shadow-sm">
                              <div className="card-header bg-info text-white">
                                <h6 className="mb-0">
                                  📘 Beginning of Year Report
                                </h6>
                              </div>
                              <div className="card-body">
                                <div className="mb-2">
                                  <small className="text-muted">
                                    Date:{" "}
                                    {formatDate(
                                      studentReport.beginning.created_at,
                                    )}
                                  </small>
                                </div>
                                {getProgressSections(
                                  studentReport.beginning,
                                ).map((section, idx) => {
                                  const lessons =
                                    studentReport.beginning.lessons;
                                  const progressInfo = getProgressInfo(
                                    lessons,
                                    getEducationType(studentReport.beginning),
                                  );
                                  const filteredInfo = progressInfo.filter(
                                    (info) => {
                                      if (section.key === "qaidah_quran") {
                                        return (
                                          info.label === "Quran/Hifz" ||
                                          info.label === "Qaidah/Tajweed"
                                        );
                                      }
                                      if (section.key === "islamic_studies") {
                                        return info.label === "Islamic Studies";
                                      }
                                      if (section.key === "dua_surah") {
                                        return info.label === "Dua/Surah";
                                      }
                                      if (section.key === "gift_for_muslim") {
                                        return info.label === "Gift for Muslim";
                                      }
                                      return false;
                                    },
                                  );

                                  return (
                                    <div
                                      key={idx}
                                      className="p-3 rounded mb-2"
                                      style={section.gradient}
                                    >
                                      <div className="text-white">
                                        <h6 className="fw-bold mb-2">
                                          {section.icon} {section.label}
                                        </h6>
                                        {filteredInfo.length > 0 ? (
                                          filteredInfo.map((info, i) => (
                                            <div
                                              key={i}
                                              className="d-flex justify-content-between"
                                            >
                                              <small className="opacity-90">
                                                {info.label}:
                                              </small>
                                              <small className="fw-bold">
                                                {info.value}
                                              </small>
                                            </div>
                                          ))
                                        ) : (
                                          <small className="opacity-75">
                                            No data available
                                          </small>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* Beginning Notes */}
                                {studentReport.beginning.notes &&
                                  studentReport.beginning.notes.length > 0 && (
                                    <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
                                      <h6 className="small text-warning mb-2">
                                        <i className="fas fa-sticky-note me-2"></i>
                                        Notes (
                                        {studentReport.beginning.notes.length})
                                      </h6>
                                      {studentReport.beginning.notes.map(
                                        (note, idx) => (
                                          <div
                                            key={note.id || idx}
                                            className="border-bottom py-1 last:border-0"
                                          >
                                            <small className="text-dark">
                                              <span className="fw-bold">
                                                {formatDate(note.date)}:
                                              </span>{" "}
                                              {note.text}
                                            </small>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* End of Year */}
                        {hasEnding && (
                          <div className="col-md-6">
                            <div className="card h-100 border-0 shadow-sm">
                              <div className="card-header bg-warning text-dark">
                                <h6 className="mb-0">📗 End of Year Report</h6>
                              </div>
                              <div className="card-body">
                                <div className="mb-2">
                                  <small className="text-muted">
                                    Date:{" "}
                                    {formatDate(
                                      studentReport.ending.created_at,
                                    )}
                                  </small>
                                </div>
                                {getProgressSections(studentReport.ending).map(
                                  (section, idx) => {
                                    const lessons =
                                      studentReport.ending.lessons;
                                    const progressInfo = getProgressInfo(
                                      lessons,
                                      getEducationType(studentReport.ending),
                                    );
                                    const filteredInfo = progressInfo.filter(
                                      (info) => {
                                        if (section.key === "qaidah_quran") {
                                          return (
                                            info.label === "Quran/Hifz" ||
                                            info.label === "Qaidah/Tajweed"
                                          );
                                        }
                                        if (section.key === "islamic_studies") {
                                          return (
                                            info.label === "Islamic Studies"
                                          );
                                        }
                                        if (section.key === "dua_surah") {
                                          return info.label === "Dua/Surah";
                                        }
                                        if (section.key === "gift_for_muslim") {
                                          return (
                                            info.label === "Gift for Muslim"
                                          );
                                        }
                                        return false;
                                      },
                                    );

                                    return (
                                      <div
                                        key={idx}
                                        className="p-3 rounded mb-2"
                                        style={section.gradient}
                                      >
                                        <div className="text-white">
                                          <h6 className="fw-bold mb-2">
                                            {section.icon} {section.label}
                                          </h6>
                                          {filteredInfo.length > 0 ? (
                                            filteredInfo.map((info, i) => (
                                              <div
                                                key={i}
                                                className="d-flex justify-content-between"
                                              >
                                                <small className="opacity-90">
                                                  {info.label}:
                                                </small>
                                                <small className="fw-bold">
                                                  {info.value}
                                                </small>
                                              </div>
                                            ))
                                          ) : (
                                            <small className="opacity-75">
                                              No data available
                                            </small>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  },
                                )}

                                {/* Ending Notes */}
                                {studentReport.ending.notes &&
                                  studentReport.ending.notes.length > 0 && (
                                    <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
                                      <h6 className="small text-warning mb-2">
                                        <i className="fas fa-sticky-note me-2"></i>
                                        Notes (
                                        {studentReport.ending.notes.length})
                                      </h6>
                                      {studentReport.ending.notes.map(
                                        (note, idx) => (
                                          <div
                                            key={note.id || idx}
                                            className="border-bottom py-1 last:border-0"
                                          >
                                            <small className="text-dark">
                                              <span className="fw-bold">
                                                {formatDate(note.date)}:
                                              </span>{" "}
                                              {note.text}
                                            </small>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        )}
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
