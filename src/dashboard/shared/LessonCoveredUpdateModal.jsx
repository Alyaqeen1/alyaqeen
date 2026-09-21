import React, { useEffect, useState } from "react";
import {
  useUpdateYearlyReportMutation,
  useDeleteNoteFromYearlyReportMutation,
} from "../../redux/features/yearly_reports/yearly_reportsApi";
import Swal from "sweetalert2";

// ===== TERMS =====
const TERMS = [
  { value: "autumn", label: "Autumn Term", period: "1 Sep – 31 Dec" },
  { value: "spring", label: "Spring Term", period: "1 Jan – 30 Apr" },
  { value: "summer", label: "Summer Term", period: "1 May – 31 Aug" },
];

// ===== TERM SUBJECTS =====
const TERM_SUBJECTS = [
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

export default function LessonCoveredUpdateModal({
  student,
  handleClose,
  showModal,
}) {
  const [updateYearlyReport, { isLoading }] = useUpdateYearlyReportMutation();
  const [deleteNoteFromReport, { isLoading: isDeletingNote }] =
    useDeleteNoteFromYearlyReportMutation();

  // ===== DETECT MODE =====
  const isTermMode = student?.report_kind === "term";

  // ===== YEARLY STATE =====
  const [beginningData, setBeginningData] = useState({
    _id: "",
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
    type: "normal",
    notes: [],
  });

  const [endingData, setEndingData] = useState({
    _id: "",
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
    type: "normal",
    notes: [],
  });

  // ===== TERM STATE =====
  const [termEdits, setTermEdits] = useState({});

  // ===== FORMAT DATE =====
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

  // ===== INITIAL LOAD =====
  useEffect(() => {
    if (!student) return;

    // ===== TERM MODE: hydrate termEdits from student.terms =====
    if (isTermMode) {
      const edits = {};
      const terms = student.terms || {};

      Object.keys(terms).forEach((termKey) => {
        const t = terms[termKey];
        if (!t) return;

        edits[t._id] = {
          _id: t._id,
          year: t.year,
          term: t.term,
          is_gfm: t.is_gfm || false,
          qaida_quran_tajweed: {
            title: t.subjects?.qaida_quran_tajweed?.title || "Qaida",
            beginning: t.subjects?.qaida_quran_tajweed?.beginning || "",
            end: t.subjects?.qaida_quran_tajweed?.end || "",
            total_learning:
              t.subjects?.qaida_quran_tajweed?.total_learning || "",
          },
          duas_surahs: {
            title: "",
            beginning: t.subjects?.duas_surahs?.beginning || "",
            end: t.subjects?.duas_surahs?.end || "",
            total_learning: t.subjects?.duas_surahs?.total_learning || "",
          },
          islamic_studies: {
            title: "",
            beginning: t.subjects?.islamic_studies?.beginning || "",
            end: t.subjects?.islamic_studies?.end || "",
            total_learning: t.subjects?.islamic_studies?.total_learning || "",
          },
        };
      });

      setTermEdits(edits);
      return;
    }

    // ===== YEARLY MODE =====
    if (student?.beginning) {
      const beginningType = student.beginning.type || "normal";
      setBeginningData({
        _id: student.beginning._id,
        type: beginningType,
        notes: student.beginning.notes || [],
        lessons: {
          qaidah_quran: student.beginning.lessons?.qaidah_quran || {
            selected: "",
            data: { level: "", lesson_name: "", page: "", line: "" },
          },
          islamic_studies: student.beginning.lessons?.islamic_studies || {
            lesson_name: "",
            page: "",
            book: "",
          },
          dua_surah: student.beginning.lessons?.dua_surah || {
            lesson_name: "",
            book: "",
            level: "",
            page: "",
            target: "",
            dua_number: "",
          },
          gift_for_muslim: student.beginning.lessons?.gift_for_muslim || {
            lesson_name: "",
            level: "",
            page: "",
            target: "",
          },
        },
      });
    }

    if (student?.ending) {
      const endingType = student.ending.type || "normal";
      setEndingData({
        _id: student.ending._id,
        type: endingType,
        notes: student.ending.notes || [],
        lessons: {
          qaidah_quran: student.ending.lessons?.qaidah_quran || {
            selected: "",
            data: { level: "", lesson_name: "", page: "", line: "" },
          },
          islamic_studies: student.ending.lessons?.islamic_studies || {
            lesson_name: "",
            page: "",
            book: "",
          },
          dua_surah: student.ending.lessons?.dua_surah || {
            lesson_name: "",
            book: "",
            level: "",
            page: "",
            target: "",
            dua_number: "",
          },
          gift_for_muslim: student.ending.lessons?.gift_for_muslim || {
            lesson_name: "",
            level: "",
            page: "",
            target: "",
          },
        },
      });
    }
  }, [student, isTermMode]);

  // ===== DELETE NOTE =====
  const handleDeleteNote = async (reportId, noteId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This note will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteNoteFromReport({
            id: reportId,
            noteId: noteId,
          }).unwrap();

          if (beginningData._id === reportId) {
            setBeginningData({
              ...beginningData,
              notes: beginningData.notes.filter((note) => note.id !== noteId),
            });
          } else if (endingData._id === reportId) {
            setEndingData({
              ...endingData,
              notes: endingData.notes.filter((note) => note.id !== noteId),
            });
          }

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Note deleted successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: error?.data?.message || "Failed to delete note",
            showConfirmButton: true,
          });
        }
      }
    });
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ===== TERM MODE SUBMIT =====
      if (isTermMode) {
        const ids = Object.keys(termEdits);
        if (ids.length === 0) {
          Swal.fire("Info", "No saved terms to update.", "info");
          return;
        }

        let updatedCount = 0;

        for (const id of ids) {
          const edit = termEdits[id];

          const payload = {
            year: Number(edit.year),
            term: edit.term,
            is_gfm: edit.is_gfm,
            subjects: {
              qaida_quran_tajweed: {
                title: edit.qaida_quran_tajweed.title,
                beginning: edit.qaida_quran_tajweed.beginning,
                end: edit.qaida_quran_tajweed.end,
                total_learning: edit.qaida_quran_tajweed.total_learning,
              },
              duas_surahs: {
                beginning: edit.duas_surahs.beginning,
                end: edit.duas_surahs.end,
                total_learning: edit.duas_surahs.total_learning,
              },
              islamic_studies: {
                beginning: edit.islamic_studies.beginning,
                end: edit.islamic_studies.end,
                total_learning: edit.islamic_studies.total_learning,
              },
            },
          };

          const data = await updateYearlyReport({ id, data: payload }).unwrap();
          if (data?.modifiedCount !== undefined) updatedCount++;
        }

        Swal.fire({
          position: "center",
          icon: "success",
          title: `${updatedCount} term report(s) updated successfully!`,
          showConfirmButton: false,
          timer: 1500,
        });

        handleClose();
        return;
      }

      // ===== YEARLY MODE SUBMIT =====
      if (beginningData?._id) {
        const beginningPayload = {
          ...beginningData,
          academic_year: student?.academic_year,
          report_type: "beginning_of_year",
        };
        delete beginningPayload._id;

        const data = await updateYearlyReport({
          id: beginningData._id,
          data: beginningPayload,
        }).unwrap();

        if (data?.modifiedCount) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Beginning of Year report updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }

      if (endingData?._id) {
        const endingPayload = {
          ...endingData,
          academic_year: student?.academic_year,
          report_type: "end_of_year",
        };
        delete endingPayload._id;

        const data = await updateYearlyReport({
          id: endingData._id,
          data: endingPayload,
        }).unwrap();

        if (data?.modifiedCount) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "End of Year report updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }

      handleClose();
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        position: "center",
        icon: "error",
        title: err?.data?.error || err?.data?.message || "Update Failed",
        showConfirmButton: true,
      });
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  // ===== YEARLY HANDLERS =====
  const handleLessonChange = (
    period,
    subject,
    field,
    value,
    subField = null,
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

  // ===== TERM HANDLERS =====
  const handleTermFieldChange = (reportId, subjectKey, field, value) => {
    setTermEdits((prev) => ({
      ...prev,
      [reportId]: {
        ...prev[reportId],
        [subjectKey]: {
          ...prev[reportId][subjectKey],
          [field]: value,
        },
      },
    }));
  };

  const handleTermGFMChange = (reportId, value) => {
    setTermEdits((prev) => ({
      ...prev,
      [reportId]: {
        ...prev[reportId],
        is_gfm: value,
      },
    }));
  };

  // ===== RENDER NOTES =====
  const renderNotesSection = (period, data) => {
    const notes = data?.notes || [];
    const reportId = data?._id;

    if (notes.length === 0) {
      return (
        <div className="text-center text-muted py-2">
          <i className="fas fa-info-circle me-2"></i>
          No notes available for this report.
        </div>
      );
    }

    return (
      <div className="notes-list">
        {notes.map((note, index) => (
          <div
            key={note.id || index}
            className="card mb-2 border-start border-4 border-warning"
          >
            <div className="card-body py-2 px-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <p className="mb-1">{note.text}</p>
                  <small className="text-muted">
                    <i className="far fa-calendar-alt me-1"></i>
                    {formatDate(note.date)}
                  </small>
                </div>
                <div className="ms-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteNote(reportId, note.id)}
                    disabled={isDeletingNote}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ===== RENDER YEARLY FIELDS =====
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
                      "para",
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
                      "page",
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
                      "line",
                    )
                  }
                />
              </div>
            </div>
          )}

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
                      "level",
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
                      "lesson_name",
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
                      "page",
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
                      "line",
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
                    e.target.value,
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
                    e.target.value,
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
                    e.target.value,
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
                    e.target.value,
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
                      e.target.value,
                    )
                  }
                >
                  <option value="">Select Book</option>
                  {Array.from({ length: 8 }, (_, i) => (
                    <option key={i} value={`book ${i + 1}`}>
                      Book {i + 1}
                    </option>
                  ))}
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
                      e.target.value,
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
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

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
                      e.target.value,
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
                      e.target.value,
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
                      e.target.value,
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
                      e.target.value,
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
                      e.target.value,
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
                      e.target.value,
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

  // ===== RENDER TERM CARD =====
  const renderTermCard = (termKey, edit, colClass = "col-md-4") => {
    if (!edit) return null;

    return (
      <div className={`${colClass} mb-4`} key={termKey}>
        <div className="card h-100">
          <div className="card-header bg-primary text-white">
            <h6 className="mb-0">
              📅 {TERMS.find((t) => t.value === termKey)?.label}
            </h6>
          </div>
          <div className="card-body">
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id={`gfm-${edit._id}`}
                checked={edit.is_gfm}
                onChange={(e) =>
                  handleTermGFMChange(edit._id, e.target.checked)
                }
              />
              <label
                className="form-check-label fw-bold"
                htmlFor={`gfm-${edit._id}`}
              >
                Gift for Muslim (GFM)
              </label>
            </div>

            {TERM_SUBJECTS.map((subject) => {
              if (subject.key === "duas_surahs" && edit.is_gfm) return null;

              const data = edit[subject.key];

              return (
                <div key={subject.key} className="mb-3">
                  <div className="fw-bold small mb-1 text-primary">
                    {subject.label}
                  </div>

                  {subject.hasTitleDropdown && (
                    <div className="mb-1">
                      <select
                        className="form-control form-control-sm"
                        value={data.title}
                        onChange={(e) =>
                          handleTermFieldChange(
                            edit._id,
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

                  <div className="mb-1">
                    <label className="form-label small mb-0">Beginning</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={data.beginning}
                      onChange={(e) =>
                        handleTermFieldChange(
                          edit._id,
                          subject.key,
                          "beginning",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="mb-1">
                    <label className="form-label small mb-0">End</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={data.end}
                      onChange={(e) =>
                        handleTermFieldChange(
                          edit._id,
                          subject.key,
                          "end",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label small mb-0">Summary</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      value={data.total_learning}
                      onChange={(e) =>
                        handleTermFieldChange(
                          edit._id,
                          subject.key,
                          "total_learning",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!showModal) return null;

  return (
    <div>
      <div className="modal-backdrop fade show"></div>

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
                {isTermMode
                  ? `Edit Term Progress - ${student?.student_name} (${student?.academic_year})`
                  : `Edit Reports - ${student?.student_name} (${student?.academic_year})`}
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
                {/* ===== TERM MODE UI: only terms being edited ===== */}
                {isTermMode && (
                  <div className="row">
                    {(() => {
                      const edits = Object.values(termEdits).sort((a, b) => {
                        const order = { autumn: 1, spring: 2, summer: 3 };
                        return order[a.term] - order[b.term];
                      });

                      // If editing 1 term only → full width
                      // If editing multiple → 3-column grid
                      const colClass =
                        edits.length === 1 ? "col-12" : "col-md-4";

                      return edits.map((edit) => {
                        // Temporarily use full-width col for single term
                        return renderTermCard(edit.term, edit, colClass);
                      });
                    })()}
                  </div>
                )}

                {/* ===== YEARLY MODE UI ===== */}
                {!isTermMode && (
                  <>
                    {beginningData?._id && (
                      <>
                        <h5 className="text-primary mb-3">
                          📘 Beginning of Year
                        </h5>
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
                          ? renderGiftForMuslimFields(
                              "beginning",
                              beginningData,
                            )
                          : renderNormalEducationFields(
                              "beginning",
                              beginningData,
                            )}

                        <div className="mt-3">
                          <h6 className="text-warning">
                            <i className="fas fa-sticky-note me-2"></i>
                            Notes ({beginningData.notes?.length || 0})
                          </h6>
                          {renderNotesSection("beginning", beginningData)}
                        </div>
                      </>
                    )}

                    {endingData?._id && (
                      <>
                        <hr className="my-4" />
                        <h5 className="text-primary mb-3">📗 End of Year</h5>
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

                        <div className="mt-3">
                          <h6 className="text-warning">
                            <i className="fas fa-sticky-note me-2"></i>
                            Notes ({endingData.notes?.length || 0})
                          </h6>
                          {renderNotesSection("ending", endingData)}
                        </div>
                      </>
                    )}
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
                  {isLoading
                    ? "Updating..."
                    : isTermMode
                      ? "Update Term"
                      : "Update Reports"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
