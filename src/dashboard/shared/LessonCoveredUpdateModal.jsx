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
      qaidah_quran: {
        selected: "",
        data: { level: "", lesson_name: "", page: "", line: "" },
      },
      islamic_studies: { lesson_name: "", page: "", book: "" },
      dua_surah: {
        lesson_name: "",
        book: "",
        level: "",
        page: "",
        target: "",
        dua_number: "",
      },
      gift_for_muslim: {
        lesson_name: "",
        level: "",
        page: "",
        target: "",
      },
    },
    description: "",
    type: "normal",
  });

  const [endingData, setEndingData] = useState({
    lessons: {
      qaidah_quran: {
        selected: "",
        data: { level: "", lesson_name: "", page: "", line: "" },
      },
      islamic_studies: { lesson_name: "", page: "", book: "" },
      dua_surah: {
        lesson_name: "",
        book: "",
        level: "",
        page: "",
        target: "",
        dua_number: "",
      },
      gift_for_muslim: {
        lesson_name: "",
        level: "",
        page: "",
        target: "",
      },
    },
    description: "",
    type: "normal",
  });

  useEffect(() => {
    if (student) {
      const beginningType = student?.beginning?.type || "normal";
      const endingType = student?.ending?.type || "normal";

      if (student?.beginning) {
        setBeginningData({
          ...student?.beginning,
          type: beginningType,
          lessons: {
            qaidah_quran: student?.beginning.lessons?.qaidah_quran || {
              selected: "",
              data: { level: "", lesson_name: "", page: "", line: "" },
            },
            islamic_studies: student?.beginning.lessons?.islamic_studies || {
              lesson_name: "",
              page: "",
              book: "",
            },
            dua_surah: student?.beginning?.lessons?.dua_surah || {
              lesson_name: "",
              book: "",
              level: "",
              page: "",
              target: "",
              dua_number: "",
            },
            gift_for_muslim: student?.beginning.lessons?.gift_for_muslim || {
              lesson_name: "",
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
          type: endingType,
          lessons: {
            qaidah_quran: student?.ending.lessons?.qaidah_quran || {
              selected: "",
              data: { level: "", lesson_name: "", page: "", line: "" },
            },
            islamic_studies: student?.ending.lessons?.islamic_studies || {
              lesson_name: "",
              page: "",
              book: "",
            },
            dua_surah: student?.ending.lessons?.dua_surah || {
              lesson_name: "",
              book: "",
              level: "",
              page: "",
              target: "",
              dua_number: "",
            },
            gift_for_muslim: student?.ending.lessons?.gift_for_muslim || {
              lesson_name: "",
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
      if (beginningData?._id) {
        const data = await updateLessonCovered({
          id: beginningData?._id,
          data: beginningData,
        }).unwrap();
        if (data?.modifiedCount) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Beginning of Month data updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
      if (endingData?._id) {
        const data = await updateLessonCovered({
          id: endingData?._id,
          data: endingData,
        }).unwrap();
        if (data?.modifiedCount) {
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
      Swal.fire({
        position: "center",
        icon: "error",
        title: err?.data?.message || "Update Failed",
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
        ...currentData?.lessons,
        [subject]: {
          ...currentData?.lessons[subject],
          ...(subField
            ? {
                [field]: {
                  ...currentData?.lessons[subject][field],
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

  const renderQuranQaidahFields = (period, data) => {
    const selectedOption = data?.lessons?.qaidah_quran?.selected;
    const optionLabels = {
      quran: "Quran",
      qaidah: "Qaidah",
      tajweed: "Tajweed",
      hifz: "Hifz",
    };

    return (
      <div className="card mb-3">
        <div className="card-header bg-light">
          <h6 className="mb-0">Quran/Qaidah</h6>
        </div>
        <div className="card-body">
          {/* Display selected option (read-only) */}
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">Selected Option</label>
              <input
                type="text"
                className="form-control"
                value={optionLabels[selectedOption] || "Not selected"}
                readOnly
                disabled
              />
              <small className="text-muted">Option cannot be changed</small>
            </div>
          </div>

          {/* Quran/Hifz Fields */}
          {["quran", "hifz"]?.includes(selectedOption) && (
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Para</label>
                <input
                  type="text"
                  className="form-control"
                  value={data?.lessons?.qaidah_quran?.data?.para || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "qaidah_quran",
                      "data",
                      e.target.value,
                      "para"
                    )
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Page</label>
                <input
                  type="text"
                  className="form-control"
                  value={data?.lessons?.qaidah_quran?.data?.page || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "qaidah_quran",
                      "data",
                      e.target.value,
                      "page"
                    )
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Line (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={data?.lessons?.qaidah_quran?.data?.line || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "qaidah_quran",
                      "data",
                      e.target.value,
                      "line"
                    )
                  }
                />
              </div>
            </div>
          )}

          {/* Qaidah/Tajweed Fields */}
          {["qaidah", "tajweed"].includes(selectedOption) && (
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Level</label>
                <select
                  className="form-control"
                  value={data?.lessons?.qaidah_quran?.data?.level || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "qaidah_quran",
                      "data",
                      e.target.value,
                      "level"
                    )
                  }
                >
                  <option value="">Select Level</option>
                  {selectedOption === "qaidah"
                    ? Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={`level ${i + 1}`}>
                          Level {i + 1}
                        </option>
                      ))
                    : Array.from({ length: 8 }, (_, i) => (
                        <option key={i} value={`level ${i + 1}`}>
                          Level {i + 1}
                        </option>
                      ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Lesson Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={data?.lessons?.qaidah_quran?.data?.lesson_name || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "qaidah_quran",
                      "data",
                      e.target.value,
                      "lesson_name"
                    )
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Page</label>
                <input
                  type="text"
                  className="form-control"
                  value={data?.lessons?.qaidah_quran?.data?.page || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
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
                  value={data?.lessons?.qaidah_quran?.data?.line || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "qaidah_quran",
                      "data",
                      e.target.value,
                      "line"
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGiftForMuslimFields = (period, data) => {
    return (
      <div className="card mb-3">
        <div className="card-header bg-light">
          <h6 className="mb-0">Gift for Muslim</h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Level</label>
              <select
                className="form-control"
                value={data?.lessons?.gift_for_muslim?.level || ""}
                onChange={(e) =>
                  handleLessonChange(
                    period,
                    "gift_for_muslim",
                    "level",
                    e.target.value
                  )
                }
              >
                <option value="">Select Level</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`level ${i + 1}`}>
                    Level {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Page</label>
              <input
                type="number"
                className="form-control"
                value={data?.lessons?.gift_for_muslim?.page || ""}
                onChange={(e) =>
                  handleLessonChange(
                    period,
                    "gift_for_muslim",
                    "page",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Target</label>
              <input
                type="number"
                className="form-control"
                value={data?.lessons?.gift_for_muslim?.target || ""}
                onChange={(e) =>
                  handleLessonChange(
                    period,
                    "gift_for_muslim",
                    "target",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Lesson Name</label>
              <input
                type="text"
                className="form-control"
                value={data?.lessons?.gift_for_muslim?.lesson_name || ""}
                onChange={(e) =>
                  handleLessonChange(
                    period,
                    "gift_for_muslim",
                    "lesson_name",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNormalEducationFields = (period, data) => {
    return (
      <>
        {/* Islamic Studies Section */}
        <div className="card mb-3">
          <div className="card-header bg-light">
            <h6 className="mb-0">Islamic Studies</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Book</label>
                <select
                  className="form-control"
                  value={data?.lessons?.islamic_studies?.book || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "islamic_studies",
                      "book",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Book</option>
                  <option value="book 1">Book 1</option>
                  <option value="book 2">Book 2</option>
                  <option value="book 3">Book 3</option>
                  <option value="book 4">Book 4</option>
                  <option value="book 5">Book 5</option>
                  <option value="book 6">Book 6</option>
                  <option value="book 7">Book 7</option>
                  <option value="book 8">Book 8</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Page</label>
                <input
                  type="text"
                  className="form-control"
                  value={data?.lessons?.islamic_studies?.page || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "islamic_studies",
                      "page",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Lesson Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={data?.lessons?.islamic_studies?.lesson_name || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "islamic_studies",
                      "lesson_name",
                      e.target.value
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
              <div className="col-md-4">
                <label className="form-label">Book</label>
                <select
                  className="form-control"
                  value={data?.lessons?.dua_surah?.book || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "dua_surah",
                      "book",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Book</option>
                  <option value="book 1">Book 1</option>
                  <option value="book 2">Book 2</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Level</label>
                <select
                  className="form-control"
                  value={data?.lessons?.dua_surah?.level || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "dua_surah",
                      "level",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Level</option>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <option key={lvl} value={`level ${lvl}`}>
                      Level {lvl}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Target</label>
                <input
                  type="number"
                  className="form-control"
                  value={data?.lessons?.dua_surah?.target || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "dua_surah",
                      "target",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Dua Number</label>
                <input
                  type="number"
                  className="form-control"
                  value={data?.lessons?.dua_surah?.dua_number || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "dua_surah",
                      "dua_number",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Page</label>
                <input
                  type="number"
                  className="form-control"
                  value={data?.lessons?.dua_surah?.page || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "dua_surah",
                      "page",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Lesson Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={data?.lessons?.dua_surah?.lesson_name || ""}
                  onChange={(e) =>
                    handleLessonChange(
                      period,
                      "dua_surah",
                      "lesson_name",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
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
                {beginningData?._id && (
                  <>
                    <h5 className="text-primary mb-3">Beginning of Month</h5>
                    <div className="mb-3">
                      <span className="badge bg-info">
                        Type:{" "}
                        {beginningData?.type === "gift_muslim"
                          ? "Gift For Muslim"
                          : "Normal Education"}
                      </span>
                    </div>

                    {renderQuranQaidahFields("beginning", beginningData)}

                    {beginningData?.type === "gift_muslim"
                      ? renderGiftForMuslimFields("beginning", beginningData)
                      : renderNormalEducationFields("beginning", beginningData)}
                  </>
                )}

                {/* Ending of Month */}
                {endingData?._id && (
                  <>
                    <hr className="my-4" />
                    <h5 className="text-primary mb-3">End of Month</h5>
                    <div className="mb-3">
                      <span className="badge bg-info">
                        Type:{" "}
                        {endingData?.type === "gift_muslim"
                          ? "Gift For Muslim"
                          : "Normal Education"}
                      </span>
                    </div>

                    {renderQuranQaidahFields("ending", endingData)}

                    {endingData?.type === "gift_muslim"
                      ? renderGiftForMuslimFields("ending", endingData)
                      : renderNormalEducationFields("ending", endingData)}

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={endingData?.description || ""}
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
