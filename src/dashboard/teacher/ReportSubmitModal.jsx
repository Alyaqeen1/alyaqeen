import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  useCreateYearlyReportMutation,
  useGetStudentYearlyReportsQuery,
} from "../../redux/features/yearly_reports/yearly_reportsApi";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";

// ===== TERM CONFIG =====
const TERMS = [
  { value: "autumn", label: "Autumn Term", period: "1 Sep – 31 Dec" },
  { value: "spring", label: "Spring Term", period: "1 Jan – 30 Apr" },
  { value: "summer", label: "Summer Term", period: "1 May – 31 Aug" },
];

// ===== SUBJECT CONFIG =====
const SUBJECTS = [
  {
    key: "qaida_quran_tajweed",
    label: "Qaida / Qur'an / Tajweed",
    hasTitleDropdown: true,
    titleOptions: ["Qaida", "Qur'an", "Tajweed"],
  },
  {
    key: "duas_surahs",
    label: "Duas & Surahs",
    hasTitleDropdown: false,
  },
  {
    key: "islamic_studies",
    label: "Islamic Studies",
    hasTitleDropdown: false,
  },
];

// ===== EMPTY SUBJECT FACTORY =====
const emptySubject = (hasTitleDropdown = false) => ({
  title: hasTitleDropdown ? "Qaida" : "",
  beginning: "",
  end: "",
  total_learning: "",
});

export default function TermProgressModal({
  studentId,
  teacherId,
  classId, // optional — derived from student if not passed
  departmentId, // optional — derived from student if not passed
  showModal,
  setShowModal,
}) {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [isGFM, setIsGFM] = useState(false);
  const [subjects, setSubjects] = useState({
    qaida_quran_tajweed: emptySubject(true),
    duas_surahs: emptySubject(false),
    islamic_studies: emptySubject(false),
  });

  const { data: student } = useGetStudentsByIdQuery(studentId, {
    skip: !studentId,
  });

  const [createYearlyReport, { isLoading: isSaving }] =
    useCreateYearlyReportMutation();

  const { data: allReports, refetch: refetchReports } =
    useGetStudentYearlyReportsQuery({ studentId }, { skip: !studentId });

  // ===== DERIVE CLASS/DEPT FROM STUDENT ENROLLMENT =====
  const primaryEnrollment = student?.academic?.enrollments?.[0];
  const effectiveClassId = classId || primaryEnrollment?.class_id;
  const effectiveDeptId = departmentId || primaryEnrollment?.dept_id;

  // ===== YEAR OPTIONS =====
  const generateYears = () => {
    const years = [];
    for (let i = -2; i <= 2; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  // ===== EXISTING TERMS FOR THIS YEAR =====
  const existingTermsForYear = (allReports || [])
    .filter(
      (r) =>
        r.report_type === "term_progress" && Number(r.year) === Number(year),
    )
    .map((r) => r.term);

  // ===== IS CURRENT SELECTED TERM ALREADY SAVED? =====
  const isTermAlreadySaved =
    selectedTerm && existingTermsForYear.includes(selectedTerm);

  // ===== HANDLE FIELD CHANGE =====
  const handleFieldChange = (subjectKey, field, value) => {
    setSubjects((prev) => ({
      ...prev,
      [subjectKey]: { ...prev[subjectKey], [field]: value },
    }));
  };

  // ===== RESET FORM =====
  const resetForm = () => {
    setSelectedTerm("");
    setIsGFM(false);
    setSubjects({
      qaida_quran_tajweed: emptySubject(true),
      duas_surahs: emptySubject(false),
      islamic_studies: emptySubject(false),
    });
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year) return toast.error("Please select year");
    if (!selectedTerm) return toast.error("Please select a term");

    // ===== DERIVE / VALIDATE REQUIRED IDS =====
    const enrollment = student?.academic?.enrollments?.[0];

    const finalClassId = classId || enrollment?.class_id;
    const finalDeptId = departmentId || enrollment?.dept_id;

    if (!finalClassId) {
      return toast.error(
        "Class not found. Please ensure the student has a valid enrollment.",
        { duration: 5000 },
      );
    }
    if (!finalDeptId) {
      return toast.error(
        "Department not found. Please ensure the student has a valid enrollment.",
        { duration: 5000 },
      );
    }
    if (!teacherId) {
      return toast.error("Teacher not identified. Please log in again.", {
        duration: 5000,
      });
    }

    // ===== BLOCK IF TERM ALREADY EXISTS =====
    if (isTermAlreadySaved) {
      const termLabel =
        TERMS.find((t) => t.value === selectedTerm)?.label || selectedTerm;
      return toast.error(
        `${termLabel} for ${year} already exists. Please choose a different term or delete the existing record first.`,
        { duration: 5000 },
      );
    }

    // ===== VALIDATE SUBJECT DATA =====
    const quran = subjects.qaida_quran_tajweed;
    const islamic = subjects.islamic_studies;

    const hasQuran = quran.beginning || quran.end || quran.total_learning;
    const hasIslamic =
      islamic.beginning || islamic.end || islamic.total_learning;

    if (!hasQuran && !hasIslamic) {
      return toast.error(
        "Please fill in at least Qaida/Qur'an/Tajweed or Islamic Studies",
        { duration: 5000 },
      );
    }

    // ===== BUILD PAYLOAD =====
    const payload = {
      student_id: studentId,
      teacher_id: teacherId,
      class_id: finalClassId,
      department_id: finalDeptId,
      year: Number(year),
      report_type: "term_progress",
      term: selectedTerm,
      is_gfm: isGFM,
      subjects: {
        qaida_quran_tajweed: {
          title: subjects.qaida_quran_tajweed.title,
          beginning: subjects.qaida_quran_tajweed.beginning,
          end: subjects.qaida_quran_tajweed.end,
          total_learning: subjects.qaida_quran_tajweed.total_learning,
        },
        duas_surahs: {
          beginning: subjects.duas_surahs.beginning,
          end: subjects.duas_surahs.end,
          total_learning: subjects.duas_surahs.total_learning,
        },
        islamic_studies: {
          beginning: subjects.islamic_studies.beginning,
          end: subjects.islamic_studies.end,
          total_learning: subjects.islamic_studies.total_learning,
        },
      },
    };

    console.log("📤 Term progress payload:", payload);

    try {
      const data = await createYearlyReport(payload).unwrap();
      if (data?.insertedId) {
        toast.success("✅ Term progress saved successfully!");
        resetForm();
        refetchReports();
      }
    } catch (error) {
      console.error("Save term progress error:", error);

      // ===== EXTRACT ACTUAL BACKEND ERROR MESSAGE =====
      const message =
        error?.error ||
        error?.data?.error ||
        error?.message ||
        "Failed to save term progress";

      toast.error(message, { duration: 5000 });
    }
  };

  // ===== CLOSE =====
  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal")) {
      handleClose();
    }
  };

  useEffect(() => {
    if (showModal) {
      resetForm();
    }
  }, [showModal]);

  return (
    <>
      {showModal && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        style={{
          display: showModal ? "block" : "none",
          zIndex: 1050,
          overflow: "hidden",
        }}
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
          <div className="modal-content p-4 rounded-4 shadow-lg">
            {/* ===== HEADER ===== */}
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title">
                <i className="fas fa-book-reader me-2"></i>
                {student?.name || "Student"} - Term Progress
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              />
            </div>

            {/* ===== BODY ===== */}
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <form onSubmit={handleSubmit}>
                {/* ===== TOP INFO ===== */}
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Fill in the student's progress for the selected term. All
                  fields are entered manually by the teacher.
                  {isGFM && (
                    <span className="d-block mt-1">
                      <strong>GFM mode:</strong> Duas & Surahs can be left
                      empty.
                    </span>
                  )}
                </div>

                {/* ===== YEAR + TERM + GFM ===== */}
                <div className="row mb-4">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Year</label>
                    <select
                      className="form-control"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    >
                      {generateYears().map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">
                      Select Term <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      required
                    >
                      <option value="">-- Select Term --</option>
                      {TERMS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label} ({t.period})
                          {existingTermsForYear.includes(t.value)
                            ? " ✓ saved"
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="gfm-check"
                        checked={isGFM}
                        onChange={(e) => setIsGFM(e.target.checked)}
                      />
                      <label
                        className="form-check-label fw-bold"
                        htmlFor="gfm-check"
                      >
                        Gift for Muslim (GFM)
                      </label>
                    </div>
                  </div>
                </div>

                {/* ===== WARNING IF TERM ALREADY SAVED ===== */}
                {isTermAlreadySaved && (
                  <div className="alert alert-warning py-2 mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>
                      {TERMS.find((t) => t.value === selectedTerm)?.label} for{" "}
                      {year}
                    </strong>{" "}
                    has already been saved. To change the data, please delete
                    the existing record first, or select a different term.
                  </div>
                )}

                {/* ===== SUBJECTS ===== */}
                {SUBJECTS.map((subject) => {
                  if (subject.key === "duas_surahs" && isGFM) return null;

                  const data = subjects[subject.key];
                  const isOptional = subject.key === "duas_surahs";

                  return (
                    <div
                      key={subject.key}
                      className="card mb-4 border-2"
                      style={{ borderColor: "var(--border2)" }}
                    >
                      <div
                        className="card-header border-0"
                        style={{
                          backgroundColor: "var(--border2)",
                          backgroundImage: "none",
                          borderTopLeftRadius: "0.375rem",
                          borderTopRightRadius: "0.375rem",
                        }}
                      >
                        <h6 className="text-white mb-0">
                          <i className="fas fa-book me-2"></i>
                          {subject.label}
                          {isOptional && (
                            <small className="ms-2 opacity-75">
                              (optional)
                            </small>
                          )}
                        </h6>
                      </div>

                      <div className="card-body">
                        {subject.hasTitleDropdown && (
                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              Select Subject
                            </label>
                            <select
                              className="form-control"
                              value={data.title}
                              onChange={(e) =>
                                handleFieldChange(
                                  subject.key,
                                  "title",
                                  e.target.value,
                                )
                              }
                            >
                              {subject.titleOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">
                              Beginning of Term
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Surah Al-Fil, page 5"
                              value={data.beginning}
                              onChange={(e) =>
                                handleFieldChange(
                                  subject.key,
                                  "beginning",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">
                              End of Term
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Surah Al-Mulk, page 25"
                              value={data.end}
                              onChange={(e) =>
                                handleFieldChange(
                                  subject.key,
                                  "end",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-bold">
                              Total Learning / Summary
                            </label>
                            <textarea
                              className="form-control"
                              rows="3"
                              placeholder="e.g., Covered 20 pages, memorized 3 Surahs..."
                              value={data.total_learning}
                              onChange={(e) =>
                                handleFieldChange(
                                  subject.key,
                                  "total_learning",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* ===== SAVE BUTTON ===== */}
                <div className="text-center mt-3">
                  <button
                    type="submit"
                    className="px-5 py-2 border-0 rounded text-white"
                    style={{
                      backgroundColor: isTermAlreadySaved
                        ? "#6c757d" // gray when term already saved
                        : "var(--border2)",
                      cursor: isTermAlreadySaved ? "not-allowed" : "pointer",
                    }}
                    disabled={isSaving || !selectedTerm || isTermAlreadySaved}
                  >
                    {isSaving ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Saving...
                      </>
                    ) : isTermAlreadySaved ? (
                      <>
                        <i className="fas fa-ban me-2"></i>
                        Term Already Saved
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Save Term Progress
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
