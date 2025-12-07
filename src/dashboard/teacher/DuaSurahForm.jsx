import React, { useState, useEffect } from "react";

export default function DuaSurahForm({ previousData, reset }) {
  const [fields, setFields] = useState({
    dua_surah_book: "",
    dua_surah_level: "",
    dua_surah_target: "",
    dua_surah_dua_number: "",
    dua_surah_page: "",
    dua_surah_lesson_name: "",
  });

  const [hasUserEdited, setHasUserEdited] = useState(false);

  // Update form values whenever previousData or reset changes
  useEffect(() => {
    // Handle reset
    if (reset) {
      setFields({
        dua_surah_book: "",
        dua_surah_level: "",
        dua_surah_target: "",
        dua_surah_dua_number: "",
        dua_surah_page: "",
        dua_surah_lesson_name: "",
      });
      setHasUserEdited(false);
      return;
    }

    const duaSurahData = previousData?.lessons?.dua_surah;

    if (duaSurahData && !hasUserEdited) {
      // Check if any field has meaningful data
      const hasData =
        duaSurahData.book?.trim() ||
        duaSurahData.level?.trim() ||
        duaSurahData.target?.toString().trim() ||
        duaSurahData.dua_number?.toString().trim() ||
        duaSurahData.page?.toString().trim() ||
        duaSurahData.lesson_name?.trim();

      if (hasData) {
        setFields({
          dua_surah_book: duaSurahData.book || "",
          dua_surah_level: duaSurahData.level || "",
          dua_surah_target: duaSurahData.target || "",
          dua_surah_dua_number: duaSurahData.dua_number || "",
          dua_surah_page: duaSurahData.page || "",
          dua_surah_lesson_name: duaSurahData.lesson_name || "",
        });
        // setHasPrefilled(true);
      }
    }
  }, [previousData, reset, hasUserEdited]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));

    // Mark as user edited
    if (!hasUserEdited) {
      setHasUserEdited(true);
    }
  };
  // Show alert only when we actually pre-filled from previous data
  const showPreFillAlert = !hasUserEdited && previousData?.lessons?.dua_surah;

  return (
    <div className="border rounded p-3 mb-4">
      <h6 className="fw-bold mb-3">Dua & Surah</h6>

      {showPreFillAlert && (
        <div className="alert alert-info py-2 mb-3">
          <small>
            <i className="fas fa-info-circle me-2"></i>
            Pre-filled with previous month's data
          </small>
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Book</label>
          <select
            className="form-control"
            name="dua_surah_book"
            value={fields.dua_surah_book}
            onChange={handleFieldChange}
            required
          >
            <option value="">Select Book</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={`book ${i + 1}`}>
                Book {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Level</label>
          <select
            className="form-control"
            name="dua_surah_level"
            value={fields.dua_surah_level}
            onChange={handleFieldChange}
            required
          >
            <option value="">Select Level</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
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
            name="dua_surah_target"
            className="form-control"
            value={fields.dua_surah_target}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Dua Number</label>
          <input
            type="text"
            name="dua_surah_dua_number"
            className="form-control"
            value={fields.dua_surah_dua_number}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Page</label>
          <input
            type="number"
            name="dua_surah_page"
            className="form-control"
            value={fields.dua_surah_page}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Lesson Name</label>
          <input
            type="text"
            name="dua_surah_lesson_name"
            className="form-control"
            value={fields.dua_surah_lesson_name}
            onChange={handleFieldChange}
            required
          />
        </div>
      </div>
    </div>
  );
}
