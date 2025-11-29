import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import {
  useAddLessonCoveredMutation,
  useGetPreviousLessonsCoveredDataQuery,
} from "../../redux/features/lessons_covered/lessons_coveredApi";
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
  const [quranOption, setQuranOption] = useState("");
  const [time_of_month, setTime_of_month] = useState("");
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const [month, setMonth] = useState(currentMonth);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [type, setType] = useState("");
  const { data: student } = useGetStudentsByIdQuery(studentId, {
    skip: !studentId,
  });
  const [addLessonCovered] = useAddLessonCoveredMutation();

  // Track if we have valid previous data for current month/year
  const [hasValidPreviousData, setHasValidPreviousData] = useState(false);

  // Add the previous data query
  const {
    data: previousData,
    refetch: refetchPreviousData,
    isFetching: isFetchingPreviousData,
    error: previousDataError,
  } = useGetPreviousLessonsCoveredDataQuery(
    {
      student_id: studentId,
      month,
      year,
    },
    {
      skip: !studentId || time_of_month !== "beginning",
    }
  );

  // Check if we have valid previous data for the current context
  useEffect(() => {
    if (previousData && time_of_month === "beginning") {
      setHasValidPreviousData(true);

      // Set the type from previous data
      if (previousData.type) {
        setType(previousData.type);
      }

      // Set Quran/Qaidah option and data
      if (previousData.lessons?.qaidah_quran) {
        setQuranOption(previousData.lessons.qaidah_quran.selected);
        toast.success("Previous month data loaded for pre-fill!");
      }
    } else {
      setHasValidPreviousData(false);
    }
  }, [previousData, time_of_month]);

  // Handle error case - when no data found
  useEffect(() => {
    if (previousDataError && time_of_month === "beginning") {
      setHasValidPreviousData(false);
      // Don't show error toast as it's normal to not have previous data
    }
  }, [previousDataError, time_of_month]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!showModal) {
      setQuranOption("");
      setType("");
      setHasValidPreviousData(false);
    }
  }, [showModal]);

  // Refetch previous data when month/year/time_of_month changes
  useEffect(() => {
    if (time_of_month === "beginning" && studentId && month && year) {
      refetchPreviousData();
    }
  }, [month, year, time_of_month, studentId, refetchPreviousData]);

  const handleClose = () => {
    setShowModal(false);
    setType("");
    setQuranOption("");
    setTime_of_month("");
    setMonth(currentMonth);
    setYear(currentYear.toString());
    setHasValidPreviousData(false);
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  // Function to manually fetch previous data
  const handleFetchPreviousData = () => {
    if (time_of_month === "beginning" && studentId && month && year) {
      refetchPreviousData();
    } else {
      toast.error("Please select beginning of month to fetch previous data");
    }
  };

  // Handle month change - REMOVED field resetting
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    // DON'T reset form fields - let child components handle it based on new data
  };

  // Handle year change - REMOVED field resetting
  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setYear(newYear);
    // DON'T reset form fields - let child components handle it based on new data
  };

  // Handle time of month change
  const handleTimeOfMonthChange = (e) => {
    const newTimeOfMonth = e.target.value;
    setTime_of_month(newTimeOfMonth);

    // Reset form when switching to ending
    if (newTimeOfMonth === "ending") {
      setQuranOption("");
      setType("");
      setHasValidPreviousData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Common fields
    const qaidah_tajweed_level = form.qaidah_tajweed_level?.value?.trim() || "";
    const qaidah_tajweed_lesson_name =
      form.qaidah_tajweed_lesson_name?.value?.trim() || "";
    const qaidah_tajweed_page = form.qaidah_tajweed_page?.value?.trim() || "";
    const qaidah_tajweed_line = form.qaidah_tajweed_line?.value?.trim() || "";
    const quran_hifz_para = form.quran_hifz_para?.value?.trim() || "";
    const quran_hifz_page = form.quran_hifz_page?.value?.trim() || "";
    const quran_hifz_line = form.quran_hifz_line?.value?.trim() || "";
    const description = form.description?.value?.trim() || "";

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

    // ========== VALIDATION START ==========

    // 1. Validate basic required fields
    if (!time_of_month) {
      return toast.error("Please select time of month");
    }
    if (!type) {
      return toast.error("Please select type of education");
    }
    if (!month) {
      return toast.error("Please select month");
    }
    if (!year) {
      return toast.error("Please select year");
    }

    // 2. Validate Quran/Qaidah section
    if (!quranOption) {
      return toast.error(
        "Please select an option for Qaidah/Quran/Tajweed/Hifz"
      );
    }

    if (quranOption === "qaidah" || quranOption === "tajweed") {
      if (!qaidah_tajweed_level) {
        return toast.error("Please enter Qaidah/Tajweed level");
      }
      if (!qaidah_tajweed_lesson_name) {
        return toast.error("Please enter Qaidah/Tajweed lesson name");
      }
      if (!qaidah_tajweed_page) {
        return toast.error("Please enter Qaidah/Tajweed page");
      }
      if (!qaidah_tajweed_line) {
        return toast.error("Please enter Qaidah/Tajweed line");
      }
    } else if (quranOption === "quran" || quranOption === "hifz") {
      if (!quran_hifz_para) {
        return toast.error("Please enter Quran/Hifz para");
      }
      if (!quran_hifz_page) {
        return toast.error("Please enter Quran/Hifz page");
      }
    }

    // 3. Validate type-specific sections
    if (type === "normal") {
      // Islamic Studies validation
      if (!islamic_studies_lesson_name) {
        return toast.error("Please enter Islamic Studies lesson name");
      }
      if (!islamic_studies_book) {
        return toast.error("Please enter Islamic Studies book");
      }
      if (!islamic_studies_page) {
        return toast.error("Please enter Islamic Studies page");
      }

      // Dua/Surah validation
      if (!dua_surah_lesson_name) {
        return toast.error("Please enter Dua/Surah lesson name");
      }
      if (!dua_surah_book) {
        return toast.error("Please enter Dua/Surah book");
      }
      if (!dua_surah_level) {
        return toast.error("Please enter Dua/Surah level");
      }
      if (!dua_surah_page) {
        return toast.error("Please enter Dua/Surah page");
      }
      if (!dua_surah_target) {
        return toast.error("Please enter Dua/Surah target");
      }
      if (!dua_surah_dua_number) {
        return toast.error("Please enter Dua/Surah dua number");
      }
    } else if (type === "gift_muslim") {
      // Gift for Muslim validation
      if (!gift_for_muslim_lesson_name) {
        return toast.error("Please enter Gift for Muslim lesson name");
      }
      if (!gift_for_muslim_level) {
        return toast.error("Please enter Gift for Muslim level");
      }
      if (!gift_for_muslim_page) {
        return toast.error("Please enter Gift for Muslim page");
      }
      if (!gift_for_muslim_target) {
        return toast.error("Please enter Gift for Muslim target");
      }
    }

    // ========== VALIDATION END ==========

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

    // Prepare report data based on type
    let reportData = {
      student_id: studentId,
      teacher_id: teacherId,
      class_id: classId,
      department_id: departmentId,
      type,
      month,
      year,
      time_of_month,
      monthly_publish: false,
      yearly_publish: false,
      date: new Date().toISOString(),
      description: description || "",
      lessons: {
        qaidah_quran: quranData,
      },
    };

    // Add type-specific fields
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
      const data = await addLessonCovered(reportData).unwrap();
      if (data?.insertedId) {
        toast.success("Lessons covered saved successfully.");
        form.reset();
        setTime_of_month("");
        setType("");
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to save lessons covered.");
    }
  };
  return (
    <>
      {/* Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
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
              <h5 className="modal-title">Submit Lessons Report</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="modal-body "
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <p>
                  Submitting report for <strong>{student?.name}</strong>
                </p>

                {/* Previous Data Info - Only show when we have valid data */}
                {time_of_month === "beginning" && hasValidPreviousData && (
                  <div className="alert alert-info py-2">
                    <small>
                      <i className="fas fa-info-circle me-2"></i>
                      Pre-filled with previous month's ending data
                      {isFetchingPreviousData && " (Loading...)"}
                    </small>
                  </div>
                )}

                {/* Loading State */}
                {time_of_month === "beginning" && isFetchingPreviousData && (
                  <div className="alert alert-warning py-2">
                    <small>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Loading previous month data...
                    </small>
                  </div>
                )}

                {/* No Data Found State */}
                {time_of_month === "beginning" &&
                  previousDataError &&
                  !isFetchingPreviousData && (
                    <div className="alert alert-secondary py-2">
                      <small>
                        <i className="fas fa-info-circle me-2"></i>
                        No previous month data found. Please fill in the
                        starting points manually.
                      </small>
                    </div>
                  )}

                {/* Time of Month */}
                <div className="row mb-2">
                  <div className="col-lg-3">
                    <label className="form-label">Month</label>
                    <select
                      className="form-control"
                      required
                      value={month}
                      onChange={handleMonthChange}
                    >
                      <option value="">Select month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label">Year</label>
                    <select
                      className="form-control"
                      required
                      value={year}
                      onChange={handleYearChange}
                    >
                      <option value="">Select year</option>
                      {Array.from(
                        { length: 5 },
                        (_, i) => currentYear - 2 + i
                      ).map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-3">
                    <label className="form-label">Time of month</label>
                    <select
                      className="form-control"
                      required
                      value={time_of_month}
                      onChange={handleTimeOfMonthChange}
                    >
                      <option value="">Select time of the month</option>
                      <option value="beginning">Beginning Of The Month</option>
                      <option value="ending">End Of The Month</option>
                    </select>
                  </div>
                  <div className="col-lg-3">
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

                {/* Manual fetch button */}
                {time_of_month === "beginning" && (
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleFetchPreviousData}
                      disabled={isFetchingPreviousData}
                    >
                      <i className="fas fa-sync-alt me-2"></i>
                      {isFetchingPreviousData
                        ? "Loading..."
                        : "Load Previous Month Data"}
                    </button>
                  </div>
                )}

                <h3 className="fw-bolder mb-2">
                  {time_of_month === "ending" &&
                    `Target Achieved at the end of the month`}

                  {time_of_month === "beginning" &&
                    `Starting Point at the beginning of the month`}
                </h3>

                {/* ---------------- Quran / Qaidah Section ---------------- */}
                <QuranQaidahForm
                  quranOption={quranOption}
                  setQuranOption={setQuranOption}
                  previousData={
                    time_of_month === "beginning" ? previousData : null
                  }
                  reset={!hasValidPreviousData || !previousData}
                />

                {/* Type-specific sections */}
                {/* Type-specific sections */}
                {type === "normal" ? (
                  <>
                    <IslamicStudiesForm
                      previousData={
                        time_of_month === "beginning" ? previousData : null
                      }
                      reset={!hasValidPreviousData || !previousData}
                    />

                    <DuaSurahForm
                      previousData={
                        time_of_month === "beginning" ? previousData : null
                      }
                      reset={!hasValidPreviousData || !previousData}
                    />
                  </>
                ) : type === "gift_muslim" ? (
                  <GiftForMuslimForm
                    previousData={
                      time_of_month === "beginning" ? previousData : null
                    }
                    reset={!hasValidPreviousData || !previousData}
                  />
                ) : (
                  <h5>Please Choose a type</h5>
                )}

                {/* Description */}
                {time_of_month === "ending" && (
                  <div className="mb-3">
                    <label className="form-label">Description (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer border-0 pt-3 justify-content-center">
                <button
                  type="submit"
                  style={{ backgroundColor: "var(--border2)", color: "white" }}
                  className="px-4 py-2"
                >
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
