import React, { useEffect, useState } from "react";
import { useUpdateLessonCoveredMutation } from "../../redux/features/lessons_covered/lessons_coveredApi";
import Swal from "sweetalert2";

export default function LessonCoveredUpdateModal({
  student,
  handleClose,
  showModal,
}) {
  const [updateLessonCovered, { isLoading }] = useUpdateLessonCoveredMutation();

  const [beginningData, setBeginningData] = useState({
    lessons: {
      qaidah_quran: { selected: "", data: { para: "", page: "", line: "" } },
      islamic_studies: { lesson_name: "", page: "" },
      dua_surah: { lesson_name: "", book: "", level: "", page: "", target: "" },
    },
    description: "",
  });

  const [endingData, setEndingData] = useState({
    lessons: {
      qaidah_quran: { selected: "", data: { para: "", page: "", line: "" } },
      islamic_studies: { lesson_name: "", page: "" },
      dua_surah: { lesson_name: "", book: "", level: "", page: "", target: "" },
    },
    description: "",
  });

  useEffect(() => {
    if (student) {
      if (student.beginning) {
        setBeginningData({
          ...student.beginning,
          lessons: {
            qaidah_quran: student.beginning.lessons?.qaidah_quran || {
              selected: "",
              data: { para: "", page: "", line: "" },
            },
            islamic_studies: student.beginning.lessons?.islamic_studies || {
              lesson_name: "",
              page: "",
            },
            dua_surah: student.beginning.lessons?.dua_surah || {
              lesson_name: "",
              book: "",
              level: "",
              page: "",
              target: "",
            },
          },
        });
      }

      if (student.ending) {
        setEndingData({
          ...student.ending,
          lessons: {
            qaidah_quran: student.ending.lessons?.qaidah_quran || {
              selected: "",
              data: { para: "", page: "", line: "" },
            },
            islamic_studies: student.ending.lessons?.islamic_studies || {
              lesson_name: "",
              page: "",
            },
            dua_surah: student.ending.lessons?.dua_surah || {
              lesson_name: "",
              book: "",
              level: "",
              page: "",
              target: "",
            },
          },
        });
      }
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (beginningData._id) {
        const data = await updateLessonCovered({
          id: beginningData._id,
          data: beginningData,
        }).unwrap();
        if (data.modifiedCount) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Beginning of Month data updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
      if (endingData._id) {
        const data = await updateLessonCovered({
          id: endingData._id,
          data: endingData,
        }).unwrap();
        if (data.modifiedCount) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "End of Month data updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
      handleClose();
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Update failed. Please try again.",
        showConfirmButton: true,
      });
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  const handleLessonChange = (
    period,
    subject,
    field,
    value,
    subField = null
  ) => {
    const setter = period === "beginning" ? setBeginningData : setEndingData;
    const currentData = period === "beginning" ? beginningData : endingData;

    setter({
      ...currentData,
      lessons: {
        ...currentData.lessons,
        [subject]: {
          ...currentData.lessons[subject],
          ...(subField
            ? {
                [field]: {
                  ...currentData.lessons[subject][field],
                  [subField]: value,
                },
              }
            : { [field]: value }),
        },
      },
    });
  };

  const handleDescriptionChange = (period, value) => {
    const setter = period === "beginning" ? setBeginningData : setEndingData;
    setter((prev) => ({ ...prev, description: value }));
  };

  if (!showModal) return null;

  return (
    <div>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none", zIndex: 1050 }}
        onMouseDown={handleBackdropClick}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Edit Lessons - {student?.student_name} ({student?.month}{" "}
                {student?.year})
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                {/* Beginning of Month */}
                {beginningData._id && (
                  <>
                    <h5 className="text-primary mb-3">Beginning of Month</h5>

                    {/* Quran/Qaidah Section */}
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Quran/Qaidah</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label">Selected</label>
                            <select
                              className="form-control"
                              value={
                                beginningData.lessons.qaidah_quran.selected ||
                                ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "qaidah_quran",
                                  "selected",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Type</option>
                              <option value="quran">Quran</option>
                              <option value="qaidah">Qaidah</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Para</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                beginningData.lessons.qaidah_quran.data?.para ||
                                ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "qaidah_quran",
                                  "data",
                                  e.target.value,
                                  "para"
                                )
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Page</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                beginningData.lessons.qaidah_quran.data?.page ||
                                ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "qaidah_quran",
                                  "data",
                                  e.target.value,
                                  "page"
                                )
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Line</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                beginningData.lessons.qaidah_quran.data?.line ||
                                ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "qaidah_quran",
                                  "data",
                                  e.target.value,
                                  "line"
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dua/Surah Section */}
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Dua/Surah</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label">Lesson Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                beginningData.lessons.dua_surah.lesson_name ||
                                ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "dua_surah",
                                  "lesson_name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Book</label>
                            <input
                              type="text"
                              className="form-control"
                              value={beginningData.lessons.dua_surah.book || ""}
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "dua_surah",
                                  "book",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Level</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                beginningData.lessons.dua_surah.level || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "dua_surah",
                                  "level",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Page</label>
                            <input
                              type="text"
                              className="form-control"
                              value={beginningData.lessons.dua_surah.page || ""}
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "dua_surah",
                                  "page",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Target</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                beginningData.lessons.dua_surah.target || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "dua_surah",
                                  "target",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Islamic Studies Section */}
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Islamic Studies</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label">Lesson Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                beginningData.lessons.islamic_studies
                                  .lesson_name || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "islamic_studies",
                                  "lesson_name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Page</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                beginningData.lessons.islamic_studies.page || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "beginning",
                                  "islamic_studies",
                                  "page",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={beginningData.description || ""}
                        onChange={(e) =>
                          handleDescriptionChange("beginning", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}

                {/* Ending of Month */}
                {endingData._id && (
                  <>
                    <hr className="my-4" />
                    <h5 className="text-primary mb-3">End of Month</h5>

                    {/* Quran/Qaidah Section */}
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Quran/Qaidah</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label">Selected</label>
                            <select
                              className="form-control"
                              value={
                                endingData.lessons.qaidah_quran.selected || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "qaidah_quran",
                                  "selected",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Type</option>
                              <option value="quran">Quran</option>
                              <option value="qaidah">Qaidah</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Para</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                endingData.lessons.qaidah_quran.data?.para || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "qaidah_quran",
                                  "data",
                                  e.target.value,
                                  "para"
                                )
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Page</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                endingData.lessons.qaidah_quran.data?.page || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "qaidah_quran",
                                  "data",
                                  e.target.value,
                                  "page"
                                )
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Line</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                endingData.lessons.qaidah_quran.data?.line || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "qaidah_quran",
                                  "data",
                                  e.target.value,
                                  "line"
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dua/Surah Section */}
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Dua/Surah</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label">Lesson Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                endingData.lessons.dua_surah.lesson_name || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "dua_surah",
                                  "lesson_name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Book</label>
                            <input
                              type="text"
                              className="form-control"
                              value={endingData.lessons.dua_surah.book || ""}
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "dua_surah",
                                  "book",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Level</label>
                            <input
                              type="text"
                              className="form-control"
                              value={endingData.lessons.dua_surah.level || ""}
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "dua_surah",
                                  "level",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Page</label>
                            <input
                              type="text"
                              className="form-control"
                              value={endingData.lessons.dua_surah.page || ""}
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "dua_surah",
                                  "page",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Target</label>
                            <input
                              type="text"
                              className="form-control"
                              value={endingData.lessons.dua_surah.target || ""}
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "dua_surah",
                                  "target",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Islamic Studies Section */}
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Islamic Studies</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label">Lesson Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                endingData.lessons.islamic_studies
                                  .lesson_name || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "islamic_studies",
                                  "lesson_name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Page</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                endingData.lessons.islamic_studies.page || ""
                              }
                              onChange={(e) =>
                                handleLessonChange(
                                  "ending",
                                  "islamic_studies",
                                  "page",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={endingData.description || ""}
                        onChange={(e) =>
                          handleDescriptionChange("ending", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
