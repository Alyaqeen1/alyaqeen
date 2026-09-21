import React, { useState } from "react";
import { useGetEnrolledFullFamilyQuery } from "../../redux/features/families/familiesApi";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";
import { useGetYearlyReportsQuery } from "../../redux/features/yearly_reports/yearly_reportsApi";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

const currentYear = new Date().getFullYear();

const TERMS = [
  { value: "autumn", label: "Autumn Term" },
  { value: "spring", label: "Spring Term" },
  { value: "summer", label: "Summer Term" },
];

export default function ReportsSummaryParent() {
  const { user, loading } = useAuth();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: enrolledFamily = {}, isFetching: loadingFamily } =
    useGetEnrolledFullFamilyQuery(user?.email, {
      skip: loading || !user?.email,
    });

  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();

  const studentIds = enrolledFamily?.childrenDocs?.map((s) => s._id) || [];

  const {
    data: allReports = [],
    isFetching: loadingReports,
    refetch: refetchReports,
  } = useGetYearlyReportsQuery(undefined, {
    skip: !studentIds.length,
    refetchOnMountOrArgChange: true,
  });

  const getReportYear = (report) => {
    if (report.report_type === "term_progress") return Number(report.year);
    if (report.academic_year)
      return Number(String(report.academic_year).split("-")[0]);
    return null;
  };

  const publishedReports = allReports.filter((report) => {
    if (report.is_published !== true) return false;
    if (!studentIds.includes(report.student_id)) return false;
    if (getReportYear(report) !== Number(selectedYear)) return false;
    return true;
  });

  const groupedReports = publishedReports.reduce((acc, report) => {
    const key = report.student_id;
    if (!acc[key]) {
      acc[key] = {
        student_id: report.student_id,
        beginning: null,
        ending: null,
        terms: { autumn: null, spring: null, summer: null },
        allNotes: [],
      };
    }

    if (report.report_type === "beginning_of_year") {
      acc[key].beginning = report;
    } else if (report.report_type === "end_of_year") {
      acc[key].ending = report;
    } else if (report.report_type === "term_progress") {
      acc[key].terms[report.term] = report;
    }

    if (report.notes?.length) {
      acc[key].allNotes = [...acc[key].allNotes, ...report.notes];
    }

    return acc;
  }, {});

  const getAcademicDisplay = (academic) => {
    if (!academic) return { departments: [], classes: [] };

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
      };
    }

    if (academic.dept_id) {
      const dept = departments?.find((d) => d._id === academic.dept_id);
      const cls = classes?.find((c) => c._id === academic.class_id);
      return {
        departments: [
          dept?.dept_name || academic.department || "Unknown Department",
        ],
        classes: [cls?.class_name || academic.class || "Unknown Class"],
      };
    }

    return {
      departments: [academic.department || "Not assigned"],
      classes: [academic.class || "Not assigned"],
    };
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      const date = new Date(d);
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

  const getTermLabel = (term) =>
    TERMS.find((t) => t.value === term)?.label || term;

  const getProgressInfo = (lessons, type) => {
    if (!lessons) return [];
    const info = [];

    if (lessons.qaidah_quran) {
      const q = lessons.qaidah_quran;
      if (q.selected === "quran" || q.selected === "hifz") {
        const d = [];
        if (q.data?.para) d.push(`Para: ${q.data.para}`);
        if (q.data?.page) d.push(`Page: ${q.data.page}`);
        if (q.data?.line) d.push(`Line: ${q.data.line}`);
        info.push({ label: "Quran/Hifz", value: d.join(", ") || "N/A" });
      } else {
        const d = [];
        if (q.data?.level) d.push(`Level: ${q.data.level}`);
        if (q.data?.lesson_name) d.push(`Lesson: ${q.data.lesson_name}`);
        if (q.data?.page) d.push(`Page: ${q.data.page}`);
        if (q.data?.line) d.push(`Line: ${q.data.line}`);
        info.push({ label: "Qaidah/Tajweed", value: d.join(", ") || "N/A" });
      }
    }

    if (type === "normal" && lessons.islamic_studies) {
      const is = lessons.islamic_studies;
      const d = [];
      if (is.book) d.push(`Book: ${is.book}`);
      if (is.page) d.push(`Page: ${is.page}`);
      if (is.lesson_name) d.push(`Lesson: ${is.lesson_name}`);
      info.push({ label: "Islamic Studies", value: d.join(", ") || "N/A" });
    }

    if (type === "normal" && lessons.dua_surah) {
      const ds = lessons.dua_surah;
      const d = [];
      if (ds.book) d.push(`Book: ${ds.book}`);
      if (ds.level) d.push(`Level: ${ds.level}`);
      if (ds.page) d.push(`Page: ${ds.page}`);
      if (ds.target) d.push(`Target: ${ds.target}`);
      if (ds.dua_number) d.push(`Dua #: ${ds.dua_number}`);
      if (ds.lesson_name) d.push(`Lesson: ${ds.lesson_name}`);
      info.push({ label: "Dua/Surah", value: d.join(", ") || "N/A" });
    }

    if (type === "gift_muslim" && lessons.gift_for_muslim) {
      const gm = lessons.gift_for_muslim;
      const d = [];
      if (gm.level) d.push(`Level: ${gm.level}`);
      if (gm.lesson_name) d.push(`Lesson: ${gm.lesson_name}`);
      if (gm.page) d.push(`Page: ${gm.page}`);
      if (gm.target) d.push(`Target: ${gm.target}`);
      info.push({ label: "Gift for Muslim", value: d.join(", ") || "N/A" });
    }

    return info;
  };

  const getTermSubjectRows = (termData) => {
    if (!termData?.subjects) return [];
    const s = termData.subjects;
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

    if (!termData.is_gfm && s.duas_surahs) {
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

  const headerGradient = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  if (loading || loadingFamily) return <LoadingSpinnerDash />;

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
      {/* ===== HEADER ===== */}
      <div
        className="rounded-4 shadow overflow-hidden mb-4"
        style={{ background: "white" }}
      >
        <div style={headerGradient} className="text-white p-4">
          <div className="d-flex align-items-center flex-wrap gap-4">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
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

        {/* Controls */}
        <div className="p-4">
          <div className="row align-items-end g-3">
            <div className="col-md-8 d-flex flex-wrap gap-3 align-items-end">
              <div style={{ minWidth: "200px" }}>
                <label className="form-label fw-semibold">Year</label>
                <select
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                    (yr) => (
                      <option key={yr} value={yr}>
                        {yr}
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

      {/* ===== LOADING ===== */}
      {isLoading && <LoadingSpinnerDash />}

      {/* ===== REPORTS ===== */}
      {!isLoading && (
        <div className="row g-4">
          {enrolledFamily?.childrenDocs?.map((student) => {
            const studentReport = groupedReports[student._id];
            const academicInfo = getAcademicDisplay(student.academic);
            const hasBeginning = !!studentReport?.beginning;
            const hasEnding = !!studentReport?.ending;
            const savedTerms = studentReport
              ? Object.entries(studentReport.terms).filter(([, v]) => v)
              : [];
            const allNotes = studentReport?.allNotes || [];

            return (
              <div key={student._id} className="col-12">
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                  {/* ===== STUDENT HEADER ===== */}
                  <div className="card-header bg-light border-0 py-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle text-white"
                          style={{
                            width: "50px",
                            height: "50px",
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
                          }}
                        >
                          <span>👤</span>
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
                                    className="badge bg-primary"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {dept}
                                  </span>
                                ))}
                              {academicInfo.departments.length > 2 && (
                                <span className="badge bg-secondary">
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
                                    className="badge bg-success"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {cls}
                                  </span>
                                ))}
                              {academicInfo.classes.length > 2 && (
                                <span className="badge bg-secondary">
                                  +{academicInfo.classes.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-primary">{selectedYear}</span>
                        {allNotes.length > 0 && (
                          <span className="badge bg-warning text-dark ms-1">
                            📝 {allNotes.length} notes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    {/* ===== NO REPORTS ===== */}
                    {!studentReport && (
                      <div className="text-center py-4">
                        <div style={{ fontSize: "3rem", opacity: 0.3 }}>📊</div>
                        <h5 className="text-muted mt-3">
                          No published reports available
                        </h5>
                        <p className="text-muted small mb-0">
                          Reports will appear here once published by the
                          teacher.
                        </p>
                      </div>
                    )}
                    {savedTerms.length > 0 && (
                      <div className="mb-4">
                        <h6 className="fw-bold text-dark mb-3">
                          📅 Term Progress
                        </h6>
                        <div className="row g-3">
                          {savedTerms.map(([termKey, termData]) => {
                            const subjectRows = getTermSubjectRows(termData);

                            return (
                              <div key={termKey} className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm">
                                  {/* Term header */}
                                  <div
                                    className="card-header border-0 text-white"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #4facfe, #00f2fe)",
                                    }}
                                  >
                                    <div className="d-flex justify-content-between align-items-center">
                                      <h6 className="mb-0 fw-bold">
                                        {getTermLabel(termKey)}
                                      </h6>
                                      {termData.is_gfm && (
                                        <span className="badge bg-warning text-dark">
                                          GFM
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="card-body p-3">
                                    <small className="text-muted d-block mb-3">
                                      <i className="far fa-calendar-alt me-1"></i>
                                      Published:{" "}
                                      {formatDate(
                                        termData.updated_at ||
                                          termData.created_at,
                                      )}
                                    </small>

                                    {subjectRows.length === 0 ? (
                                      <p className="text-muted small mb-0">
                                        No subject data
                                      </p>
                                    ) : (
                                      subjectRows.map((row, i) => (
                                        <div key={i} className="mb-3">
                                          {/* Subject title */}
                                          <div className="fw-bold text-primary small mb-2">
                                            {row.label}
                                          </div>

                                          {/* Beginning row */}
                                          <div
                                            className="p-2 rounded mb-2"
                                            style={{
                                              background: "#e7f1ff",
                                              borderLeft: "3px solid #4facfe",
                                            }}
                                          >
                                            <div className="d-block d-sm-flex align-items-sm-start">
                                              <span
                                                className="fw-bold small text-primary d-block d-sm-inline-block"
                                                style={{
                                                  minWidth: "85px",
                                                  flexShrink: 0,
                                                }}
                                              >
                                                Beginning:
                                              </span>
                                              <span
                                                className="small d-block d-sm-inline-block flex-grow-1"
                                                style={{
                                                  wordBreak: "break-word",
                                                  color: "#1a3d6b",
                                                }}
                                              >
                                                {row.beginning || "—"}
                                              </span>
                                            </div>
                                          </div>

                                          {/* End row */}
                                          <div
                                            className="p-2 rounded mb-2"
                                            style={{
                                              background: "#fff4e6",
                                              borderLeft: "3px solid #ffa726",
                                            }}
                                          >
                                            <div className="d-block d-sm-flex align-items-sm-start">
                                              <span
                                                className="fw-bold small d-block d-sm-inline-block"
                                                style={{
                                                  minWidth: "85px",
                                                  flexShrink: 0,
                                                  color: "#b35900",
                                                }}
                                              >
                                                End:
                                              </span>
                                              <span
                                                className="small d-block d-sm-inline-block flex-grow-1"
                                                style={{
                                                  wordBreak: "break-word",
                                                  color: "#6b3a00",
                                                }}
                                              >
                                                {row.end || "—"}
                                              </span>
                                            </div>
                                          </div>

                                          {/* Summary row */}
                                          <div
                                            className="p-2 rounded"
                                            style={{
                                              background: "#f1f3f5",
                                              borderLeft: "3px solid #868e96",
                                            }}
                                          >
                                            <div className="d-block d-sm-flex align-items-sm-start">
                                              <span
                                                className="fw-bold small text-secondary d-block d-sm-inline-block"
                                                style={{
                                                  minWidth: "85px",
                                                  flexShrink: 0,
                                                }}
                                              >
                                                Summary:
                                              </span>
                                              <span
                                                className="small d-block d-sm-inline-block flex-grow-1"
                                                style={{
                                                  wordBreak: "break-word",
                                                  color: "#343a40",
                                                }}
                                              >
                                                {row.summary || "—"}
                                              </span>
                                            </div>
                                          </div>

                                          {i < subjectRows.length - 1 && (
                                            <hr className="my-3" />
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ===== YEARLY REPORTS ===== */}
                    {(hasBeginning || hasEnding) && (
                      <div className="row g-4">
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
                                {getProgressInfo(
                                  studentReport.beginning.lessons,
                                  studentReport.beginning.type || "normal",
                                ).map((info, i) => (
                                  <div key={i} className="d-flex mb-2">
                                    <small
                                      className="text-muted"
                                      style={{
                                        minWidth: "130px",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {info.label}:
                                    </small>
                                    <small
                                      className="fw-bold flex-grow-1"
                                      style={{ wordBreak: "break-word" }}
                                    >
                                      {info.value}
                                    </small>
                                  </div>
                                ))}

                                {studentReport.beginning.notes?.length > 0 && (
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
                                          className="border-bottom py-1"
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
                                {getProgressInfo(
                                  studentReport.ending.lessons,
                                  studentReport.ending.type || "normal",
                                ).map((info, i) => (
                                  <div key={i} className="d-flex mb-2">
                                    <small
                                      className="text-muted"
                                      style={{
                                        minWidth: "130px",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {info.label}:
                                    </small>
                                    <small
                                      className="fw-bold flex-grow-1"
                                      style={{ wordBreak: "break-word" }}
                                    >
                                      {info.value}
                                    </small>
                                  </div>
                                ))}

                                {studentReport.ending.notes?.length > 0 && (
                                  <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
                                    <h6 className="small text-warning mb-2">
                                      <i className="fas fa-sticky-note me-2"></i>
                                      Notes ({studentReport.ending.notes.length}
                                      )
                                    </h6>
                                    {studentReport.ending.notes.map(
                                      (note, idx) => (
                                        <div
                                          key={note.id || idx}
                                          className="border-bottom py-1"
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
