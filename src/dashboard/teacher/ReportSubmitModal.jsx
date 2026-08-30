import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import {
  useCreateYearlyReportMutation,
  useGetBeginningOfYearQuery,
  useAddNoteToYearlyReportMutation,
  useGetStudentYearlyReportsQuery,
} from "../../redux/features/yearly_reports/yearly_reportsApi";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import QuranQaidahForm from "./QuranQaidahForm";
import DuaSurahForm from "./DuaSurahForm";
import IslamicStudiesForm from "./IslamicStudiesForm";
import GiftForMuslimForm from "./GiftForMuslim";

export default function ReportSubmitModal({
  studentId,
  teacherId,
  classId,
  departmentId,
  showModal,
  setShowModal,
}) {
  // ===== TAB STATE =====
  const [activeTab, setActiveTab] = useState("full"); // "quick" or "full"

  // ===== FULL REPORT STATE =====
  const [quranOption, setQuranOption] = useState("");
  const [reportType, setReportType] = useState("");
  const currentYear = new Date().getFullYear();
  const [academicYear, setAcademicYear] = useState(
    `${currentYear}-${currentYear + 1}`,
  );
  const [type, setType] = useState("");

  // ===== QUICK NOTE STATE =====
  const [quickNoteText, setQuickNoteText] = useState("");
  const [quickNoteAcademicYear, setQuickNoteAcademicYear] = useState(
    `${currentYear}-${currentYear + 1}`,
  );

  const { data: student } = useGetStudentsByIdQuery(studentId, {
    skip: !studentId,
  });

  // ===== API HOOKS =====
  const [createYearlyReport, { isLoading: isCreating }] =
    useCreateYearlyReportMutation();
  const [addNoteToReport, { isLoading: isAddingNote }] =
    useAddNoteToYearlyReportMutation();

  // ===== GET ALL STUDENT REPORTS =====
  const { data: allStudentReports, isLoading: isLoadingReports } =
    useGetStudentYearlyReportsQuery(
      {
        studentId: studentId,
      },
      {
        skip: !studentId,
      },
    );

  // ===== GET EXISTING BEGINNING REPORT FOR QUICK NOTES =====
  const {
    data: existingBeginningReport,
    refetch: refetchBeginningReport,
    isFetching: isFetchingBeginning,
  } = useGetBeginningOfYearQuery(
    {
      studentId: studentId,
      academic_year: quickNoteAcademicYear,
    },
    {
      skip: !studentId || !quickNoteAcademicYear,
    },
  );

  // ===== GET PREVIOUS YEAR DATA FOR PRE-FILL =====
  const {
    data: previousYearData,
    refetch: refetchPreviousYearData,
    isFetching: isFetchingPreviousData,
  } = useGetBeginningOfYearQuery(
    {
      studentId: studentId,
      academic_year: getPreviousAcademicYear(academicYear),
    },
    {
      skip: !studentId || reportType !== "beginning_of_year",
    },
  );

  // ===== HELPER FUNCTIONS =====
  function getCurrentAcademicYear() {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
  }

  function getPreviousAcademicYear(currentAcademicYear) {
    const [startYear] = currentAcademicYear.split("-");
    const prevStartYear = parseInt(startYear) - 1;
    return `${prevStartYear}-${prevStartYear + 1}`;
  }

  function generateAcademicYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -2; i <= 2; i++) {
      const start = currentYear + i;
      years.push(`${start}-${start + 1}`);
    }
    return years;
  }

  // ===== GET YEARS WITH BEGINNING REPORTS =====
  const getYearsWithBeginningReports = () => {
    if (!allStudentReports) return [];

    const years = allStudentReports
      .filter((report) => report.report_type === "beginning_of_year")
      .map((report) => report.academic_year);

    return [...new Set(years)];
  };

  const yearsWithBeginning = getYearsWithBeginningReports();

  // ===== QUICK NOTE HANDLER =====
  const handleSubmitQuickNote = async (e) => {
    e.preventDefault();

    if (!quickNoteText.trim()) {
      return toast.error("Please enter a note");
    }
    if (!quickNoteAcademicYear) {
      return toast.error("Please select academic year");
    }

    // Check if the selected year has a Beginning report
    if (!yearsWithBeginning.includes(quickNoteAcademicYear)) {
      return toast.error(
        `❌ No Beginning of Year report found for ${quickNoteAcademicYear}. Please create a full report first.`,
      );
    }

    try {
      if (existingBeginningReport) {
        await addNoteToReport({
          id: existingBeginningReport._id,
          text: quickNoteText.trim(),
          teacher_id: teacherId,
        }).unwrap();

        toast.success("✅ Quick note added successfully!");
        setQuickNoteText("");
        refetchBeginningReport();
      } else {
        toast.error(
          "❌ No Beginning of Year report found for this academic year. Please create a full report first.",
        );
      }
    } catch (error) {
      console.error("Error adding quick note:", error);
      toast.error(error?.data?.message || "Failed to add note");
    }
  };

  // ===== FULL REPORT HANDLER =====
  const handleSubmitFullReport = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Validate required fields
    if (!reportType) {
      return toast.error("Please select report type");
    }
    if (!type) {
      return toast.error("Please select type of education");
    }
    if (!academicYear) {
      return toast.error("Please select academic year");
    }

    // Common fields
    const qaidah_tajweed_level = form.qaidah_tajweed_level?.value?.trim() || "";
    const qaidah_tajweed_lesson_name =
      form.qaidah_tajweed_lesson_name?.value?.trim() || "";
    const qaidah_tajweed_page = form.qaidah_tajweed_page?.value?.trim() || "";
    const qaidah_tajweed_line = form.qaidah_tajweed_line?.value?.trim() || "";
    const quran_hifz_para = form.quran_hifz_para?.value?.trim() || "";
    const quran_hifz_page = form.quran_hifz_page?.value?.trim() || "";
    const quran_hifz_line = form.quran_hifz_line?.value?.trim() || "";

    // Type-specific fields
    const islamic_studies_lesson_name =
      form.islamic_studies_lesson_name?.value?.trim() || "";
    const islamic_studies_book =
      form?.islamic_studies_book?.value?.trim() || "";
    const islamic_studies_page = form.islamic_studies_page?.value?.trim() || "";
    const dua_surah_lesson_name =
      form.dua_surah_lesson_name?.value?.trim() || "";
    const dua_surah_book = form.dua_surah_book?.value?.trim() || "";
    const dua_surah_level = form.dua_surah_level?.value?.trim() || "";
    const dua_surah_page = form.dua_surah_page?.value?.trim() || "";
    const dua_surah_target = form.dua_surah_target?.value?.trim() || "";
    const dua_surah_dua_number = form.dua_surah_dua_number?.value?.trim() || "";
    const gift_for_muslim_lesson_name =
      form.gift_for_muslim_lesson_name?.value?.trim() || "";
    const gift_for_muslim_level =
      form.gift_for_muslim_level?.value?.trim() || "";
    const gift_for_muslim_page = form.gift_for_muslim_page?.value?.trim() || "";
    const gift_for_muslim_target =
      form.gift_for_muslim_target?.value?.trim() || "";

    // Validation
    if (!quranOption) {
      return toast.error(
        "Please select an option for Qaidah/Quran/Tajweed/Hifz",
      );
    }

    if (quranOption === "qaidah" || quranOption === "tajweed") {
      if (!qaidah_tajweed_level)
        return toast.error("Please enter Qaidah/Tajweed level");
      if (!qaidah_tajweed_lesson_name)
        return toast.error("Please enter Qaidah/Tajweed lesson name");
      if (!qaidah_tajweed_page)
        return toast.error("Please enter Qaidah/Tajweed page");
      if (!qaidah_tajweed_line)
        return toast.error("Please enter Qaidah/Tajweed line");
    } else if (quranOption === "quran" || quranOption === "hifz") {
      if (!quran_hifz_para) return toast.error("Please enter Quran/Hifz para");
      if (!quran_hifz_page) return toast.error("Please enter Quran/Hifz page");
    }

    if (type === "normal") {
      if (!islamic_studies_lesson_name)
        return toast.error("Please enter Islamic Studies lesson name");
      if (!islamic_studies_book)
        return toast.error("Please enter Islamic Studies book");
      if (!islamic_studies_page)
        return toast.error("Please enter Islamic Studies page");
      if (!dua_surah_lesson_name)
        return toast.error("Please enter Dua/Surah lesson name");
      if (!dua_surah_book) return toast.error("Please enter Dua/Surah book");
      if (!dua_surah_level) return toast.error("Please enter Dua/Surah level");
      if (!dua_surah_page) return toast.error("Please enter Dua/Surah page");
      if (!dua_surah_target)
        return toast.error("Please enter Dua/Surah target");
      if (!dua_surah_dua_number)
        return toast.error("Please enter Dua/Surah dua number");
    } else if (type === "gift_muslim") {
      if (!gift_for_muslim_lesson_name)
        return toast.error("Please enter Gift for Muslim lesson name");
      if (!gift_for_muslim_level)
        return toast.error("Please enter Gift for Muslim level");
      if (!gift_for_muslim_page)
        return toast.error("Please enter Gift for Muslim page");
      if (!gift_for_muslim_target)
        return toast.error("Please enter Gift for Muslim target");
    }

    // Prepare Quran data
    let quranData = null;
    if (quranOption === "qaidah" || quranOption === "tajweed") {
      quranData = {
        selected: quranOption,
        data: {
          level: qaidah_tajweed_level,
          lesson_name: qaidah_tajweed_lesson_name,
          page: qaidah_tajweed_page,
          line: qaidah_tajweed_line,
        },
      };
    } else if (quranOption === "quran" || quranOption === "hifz") {
      quranData = {
        selected: quranOption,
        data: {
          para: quran_hifz_para,
          page: quran_hifz_page,
          line: quran_hifz_line,
        },
      };
    }

    // Prepare report data
    let reportData = {
      student_id: studentId,
      teacher_id: teacherId,
      class_id: classId,
      department_id: departmentId,
      type,
      academic_year: academicYear,
      report_type: reportType,
      lessons: {
        qaidah_quran: quranData,
      },
    };

    if (type === "normal") {
      reportData.lessons.islamic_studies = {
        lesson_name: islamic_studies_lesson_name,
        page: islamic_studies_page,
        book: islamic_studies_book,
      };
      reportData.lessons.dua_surah = {
        lesson_name: dua_surah_lesson_name,
        book: dua_surah_book,
        level: dua_surah_level,
        page: dua_surah_page,
        target: dua_surah_target,
        dua_number: dua_surah_dua_number,
      };
    } else if (type === "gift_muslim") {
      reportData.lessons.gift_for_muslim = {
        lesson_name: gift_for_muslim_lesson_name,
        level: gift_for_muslim_level,
        page: gift_for_muslim_page,
        target: gift_for_muslim_target,
      };
    }

    try {
      const data = await createYearlyReport(reportData).unwrap();
      if (data?.insertedId) {
        toast.success("✅ Report saved successfully!");
        form.reset();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.error || "Failed to save report.");
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      setQuranOption("");
      setType("");
      setReportType("");
      setQuickNoteText("");
      setActiveTab("full");
    }
  }, [showModal]);

  const handleClose = () => {
    setShowModal(false);
    setQuranOption("");
    setType("");
    setReportType("");
    setQuickNoteText("");
    setActiveTab("full");
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

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
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title">
                <i className="fas fa-user-graduate me-2"></i>
                {student?.name || "Student"} - Progress Report
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              />
            </div>

            {/* ===== TABS ===== */}
            <ul className="nav nav-tabs mt-3 mb-3 border-0">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "full" ? "active" : ""}`}
                  onClick={() => setActiveTab("full")}
                  style={{
                    backgroundColor:
                      activeTab === "full" ? "var(--border2)" : "transparent",
                    color: activeTab === "full" ? "white" : "var(--border2)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "500",
                  }}
                >
                  <i className="fas fa-file-alt me-2"></i>
                  Full Report
                </button>
              </li>
              <li className="nav-item ms-2">
                <button
                  className={`nav-link ${activeTab === "quick" ? "active" : ""}`}
                  onClick={() => setActiveTab("quick")}
                  style={{
                    backgroundColor:
                      activeTab === "quick" ? "var(--border2)" : "transparent",
                    color: activeTab === "quick" ? "white" : "var(--border2)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "500",
                  }}
                >
                  <i className="fas fa-bolt me-2"></i>
                  Quick Note
                </button>
              </li>
            </ul>

            {/* ===== TAB CONTENT ===== */}
            <div
              className="modal-body"
              style={{ maxHeight: "65vh", overflowY: "auto" }}
            >
              {/* ================================ */}
              {/* ===== QUICK NOTE TAB ===== */}
              {activeTab === "quick" && (
                <div className="quick-note-tab">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Add a quick note about student's progress. Notes will be
                    attached to the <strong>Beginning of Year</strong> report
                    for the selected academic year.
                  </div>

                  {/* Academic Year Selection */}
                  <div className="mb-3">
                    <label className="form-label">Academic Year</label>
                    <select
                      className="form-control"
                      required
                      value={quickNoteAcademicYear}
                      onChange={(e) => {
                        setQuickNoteAcademicYear(e.target.value);
                      }}
                    >
                      <option value="">Select Academic Year</option>
                      {generateAcademicYears().map((year) => {
                        const hasReport = yearsWithBeginning.includes(year);
                        return (
                          <option
                            key={year}
                            value={year}
                            style={{
                              color: hasReport ? "inherit" : "#999",
                              backgroundColor: hasReport
                                ? "inherit"
                                : "#f5f5f5",
                            }}
                          >
                            {year} {hasReport ? "✅" : "⚠️ (No report)"}
                          </option>
                        );
                      })}
                    </select>
                    {quickNoteAcademicYear &&
                      !yearsWithBeginning.includes(quickNoteAcademicYear) && (
                        <small className="text-danger d-block mt-1">
                          ⚠️ No Beginning of Year report found for this academic
                          year. Please create a full report first.
                        </small>
                      )}
                  </div>

                  {/* Quick Note Input */}
                  <div className="mb-3">
                    <label className="form-label">Quick Note</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="What did the student complete? (e.g., Completed Surah Al-Fatiha, memorized dua #45, finished page 120...)"
                      value={quickNoteText}
                      onChange={(e) => setQuickNoteText(e.target.value)}
                    />
                  </div>

                  {/* ===== FIXED: Status of Beginning Report ===== */}
                  {quickNoteAcademicYear && (
                    <div className="mb-3">
                      {isFetchingBeginning ? (
                        <div className="alert alert-secondary">
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Checking for existing report...
                        </div>
                      ) : yearsWithBeginning.includes(quickNoteAcademicYear) &&
                        existingBeginningReport ? (
                        <div className="alert alert-success">
                          <i className="fas fa-check-circle me-2"></i>✅
                          Beginning of Year report exists. Your note will be
                          attached to it.
                        </div>
                      ) : (
                        <div className="alert alert-warning">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          ⚠️ No Beginning of Year report found for{" "}
                          {quickNoteAcademicYear}.
                          <br />
                          <small>
                            Please create a full report first using the "Full
                            Report" tab.
                          </small>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleSubmitQuickNote}
                    disabled={
                      isAddingNote ||
                      !existingBeginningReport ||
                      !quickNoteText.trim() ||
                      isFetchingBeginning ||
                      !yearsWithBeginning.includes(quickNoteAcademicYear)
                    }
                  >
                    {isAddingNote ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Adding Note...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus-circle me-2"></i>
                        Add Quick Note
                      </>
                    )}
                  </button>

                  {/* Available years with reports */}
                  {yearsWithBeginning.length > 0 && (
                    <div className="mt-3 p-2 bg-light rounded">
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        Quick notes available for:{" "}
                        <strong>{yearsWithBeginning.join(", ")}</strong>
                      </small>
                    </div>
                  )}
                </div>
              )}

              {/* ================================ */}
              {/* ===== FULL REPORT TAB ===== */}
              {/* ================================ */}
              {activeTab === "full" && (
                <form onSubmit={handleSubmitFullReport}>
                  {/* Selection Area */}
                  <div className="row mb-3">
                    <div className="col-lg-4">
                      <label className="form-label">Academic Year</label>
                      <select
                        className="form-control"
                        required
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                      >
                        <option value="">Select Academic Year</option>
                        {generateAcademicYears().map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-4">
                      <label className="form-label">Report Type</label>
                      <select
                        className="form-control"
                        required
                        value={reportType}
                        onChange={(e) => {
                          setReportType(e.target.value);
                          if (e.target.value === "beginning_of_year") {
                            refetchPreviousYearData();
                          }
                        }}
                      >
                        <option value="">Select Report Type</option>
                        <option value="beginning_of_year">
                          <i className="fas fa-play-circle me-1"></i>
                          Beginning of Year
                        </option>
                        <option value="end_of_year">
                          <i className="fas fa-check-circle me-1"></i>
                          End of Year
                        </option>
                      </select>
                    </div>
                    <div className="col-lg-4">
                      <label className="form-label">Type Of Education</label>
                      <select
                        className="form-control"
                        required
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Select Type</option>
                        <option value="normal">Normal Education</option>
                        <option value="gift_muslim">Gift For Muslim</option>
                      </select>
                    </div>
                  </div>

                  {/* Info Alerts */}
                  {reportType === "beginning_of_year" && previousYearData && (
                    <div className="alert alert-info py-2 mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Previous year's data loaded for pre-fill
                      {isFetchingPreviousData && " (Loading...)"}
                    </div>
                  )}

                  {reportType === "beginning_of_year" &&
                    !previousYearData &&
                    !isFetchingPreviousData &&
                    academicYear && (
                      <div className="alert alert-secondary py-2 mb-3">
                        <i className="fas fa-info-circle me-2"></i>
                        No previous year data found. Please enter starting
                        points manually.
                      </div>
                    )}

                  {/* Quran/Qaidah Section */}
                  <QuranQaidahForm
                    quranOption={quranOption}
                    setQuranOption={setQuranOption}
                    previousData={
                      reportType === "beginning_of_year"
                        ? previousYearData
                        : null
                    }
                  />

                  {/* Type-specific sections */}
                  {type === "normal" ? (
                    <>
                      <IslamicStudiesForm
                        previousData={
                          reportType === "beginning_of_year"
                            ? previousYearData
                            : null
                        }
                      />
                      <DuaSurahForm
                        previousData={
                          reportType === "beginning_of_year"
                            ? previousYearData
                            : null
                        }
                      />
                    </>
                  ) : type === "gift_muslim" ? (
                    <GiftForMuslimForm
                      previousData={
                        reportType === "beginning_of_year"
                          ? previousYearData
                          : null
                      }
                    />
                  ) : (
                    <div className="alert alert-light text-center py-3 mt-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Please select education type to see the form
                    </div>
                  )}

                  {/* Quick Summary */}
                  {reportType && type && (
                    <div className="alert alert-success py-2 mt-3">
                      <small>
                        <i className="fas fa-check-circle me-2"></i>
                        You are saving a{" "}
                        <strong>{reportType.replace("_", " ")}</strong> report
                        for <strong>{student?.name}</strong> for academic year{" "}
                        <strong>{academicYear}</strong>
                      </small>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="modal-footer border-0 pt-3 justify-content-center px-0">
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "var(--border2)",
                        color: "white",
                      }}
                      className="px-4 py-2 border-0 rounded"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Save Full Report
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
