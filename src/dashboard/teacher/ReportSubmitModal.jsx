import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useAddLessonCoveredMutation } from "../../redux/features/lessons_covered/lessons_coveredApi";
import { useGetStudentsByIdQuery } from "../../redux/features/students/studentsApi";
import QuranQaidahForm from "./QuranQaidahForm";
import DuaSurahForm from "./DuaSurahForm";
import IslamicStudiesForm from "./IslamicStudiesForm";

export default function ReportSubmitModal({
  studentId,
  teacherId,
  classId,
  departmentId,
  subjectId,
  showModal,
  //   handleClose,
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
  console.log(studentId);
  // console.log(quranData);
  const handleClose = () => {
    setShowModal(false);
    setType("");
    setQuranOption("");
    setTime_of_month("");
    setMonth(currentMonth);
    setYear(currentYear.toString());
  };
  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const qaidah_tajweed_level = form.qaidah_tajweed_level?.value?.trim() || "";
    const qaidah_tajweed_lesson_name =
      form.qaidah_tajweed_lesson_name?.value?.trim() || "";
    const qaidah_tajweed_page = form.qaidah_tajweed_page?.value?.trim() || "";
    const qaidah_tajweed_line = form.qaidah_tajweed_line?.value?.trim() || "";
    const quran_hifz_para = form.quran_hifz_para?.value?.trim() || "";
    const quran_hifz_page = form.quran_hifz_page?.value?.trim() || "";
    const quran_hifz_line = form.quran_hifz_line?.value?.trim() || "";
    const islamic_studies_lesson_name =
      form.islamic_studies_lesson_name?.value?.trim() || "";
    const islamic_studies_page = form.islamic_studies_page?.value?.trim() || "";
    const dua_surah_lesson_name =
      form.dua_surah_lesson_name?.value?.trim() || "";
    const dua_surah_book = form.dua_surah_book?.value?.trim() || "";
    const dua_surah_level = form.dua_surah_level?.value?.trim() || "";
    const dua_surah_page = form.dua_surah_page?.value?.trim() || "";
    const dua_surah_target = form.dua_surah_target?.value?.trim() || "";
    const description = form.description?.value?.trim() || "";

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

    const reportData = {
      student_id: studentId,
      teacher_id: teacherId,
      class_id: classId,
      department_id: departmentId,
      subject_id: subjectId,
      type,
      month,
      year,
      time_of_month,
      monthly_publish: false,
      yearly_publish: false,
      date: new Date().toISOString(),
      description: description || "",
      lessons: {
        qaidah_quran: quranData, // ✅ clearly shows which one is selected
        islamic_studies: {
          lesson_name: islamic_studies_lesson_name,
          page: islamic_studies_page,
        },
        dua_surah: {
          lesson_name: dua_surah_lesson_name,
          book: dua_surah_book,
          level: dua_surah_level,
          page: dua_surah_page,
          target: dua_surah_target,
        },
      },
    };
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
    console.log("Final Structured Report:", reportData);
  };

  return (
    <>
      {/* Backdrop */}
      {/* Dark Background (Backdrop) */}
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
          overflow: "hidden", // Add this
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

                {/* Time of Month */}
                <div className="row mb-2">
                  <div className="col-lg-3">
                    <label className="form-label">Month</label>
                    <select
                      className="form-control"
                      required
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
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
                      onChange={(e) => setYear(e.target.value)}
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
                    <label className="form-label">time of month</label>
                    <select
                      className="form-control"
                      required
                      value={time_of_month}
                      onChange={(e) => setTime_of_month(e.target.value)}
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

                <h3 className="fw-bolder mb-2">
                  {time_of_month === "ending" &&
                    `Target Achieved at the end of the month`}

                  {time_of_month === "beginning" &&
                    `Starting Point at the beginning of the month`}
                </h3>

                {type === "normal" ? (
                  <>
                    {/* ---------------- Quran / Qaidah Section ---------------- */}
                    <QuranQaidahForm
                      quranOption={quranOption}
                      setQuranOption={setQuranOption}
                    ></QuranQaidahForm>

                    {/* ---------------- Islamic Studies Section ---------------- */}
                    <IslamicStudiesForm></IslamicStudiesForm>

                    {/* ---------------- Dua & Surah Section ---------------- */}
                    <DuaSurahForm></DuaSurahForm>
                  </>
                ) : type === "gift_muslim" ? (
                  <>
                    {/* ---------------- Islamic Studies Section ---------------- */}
                    <IslamicStudiesForm></IslamicStudiesForm>

                    {/* ---------------- Dua & Surah Section ---------------- */}
                    <DuaSurahForm></DuaSurahForm>
                  </>
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
