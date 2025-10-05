import React, { useEffect, useState } from "react";

export default function QuranQaidahForm({
  quranOption,
  setQuranOption,
  previousData,
}) {
  const [fields, setFields] = useState({
    quran_hifz_para: "",
    quran_hifz_page: "",
    quran_hifz_line: "",
    qaidah_tajweed_level: "",
    qaidah_tajweed_lesson_name: "",
    qaidah_tajweed_page: "",
    qaidah_tajweed_line: "",
  });

  const [hasPrefilled, setHasPrefilled] = useState(false);

  // Update form values when previousData changes
  useEffect(() => {
    const quranData = previousData?.lessons?.qaidah_quran;

    if (quranData && quranData.selected) {
      setQuranOption(quranData.selected);

      if (["quran", "hifz"].includes(quranData.selected)) {
        setFields((prev) => ({
          ...prev,
          quran_hifz_para: quranData.data?.para || "",
          quran_hifz_page: quranData.data?.page || "",
          quran_hifz_line: quranData.data?.line || "",
        }));
      } else if (["qaidah", "tajweed"].includes(quranData.selected)) {
        setFields((prev) => ({
          ...prev,
          qaidah_tajweed_level: quranData.data?.level || "",
          qaidah_tajweed_lesson_name: quranData.data?.lesson_name || "",
          qaidah_tajweed_page: quranData.data?.page || "",
          qaidah_tajweed_line: quranData.data?.line || "",
        }));
      }

      setHasPrefilled(true);
    } else {
      // Reset only if we had previously pre-filled and now no data
      if (hasPrefilled) {
        setFields({
          quran_hifz_para: "",
          quran_hifz_page: "",
          quran_hifz_line: "",
          qaidah_tajweed_level: "",
          qaidah_tajweed_lesson_name: "",
          qaidah_tajweed_page: "",
          qaidah_tajweed_line: "",
        });
        setHasPrefilled(false);
      }
    }
  }, [previousData, setQuranOption, hasPrefilled]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));

    // Clear pre-fill status when user starts typing
    if (hasPrefilled) {
      setHasPrefilled(false);
    }
  };

  // Show alert only when we actually pre-filled from previous data
  const showPreFillAlert = hasPrefilled;

  return (
    <div className="border rounded p-3 mb-4">
      <h6 className="fw-bold mb-3">Quran / Qaidah</h6>

      {showPreFillAlert && (
        <div className="alert alert-info py-2 mb-3">
          <small>
            <i className="fas fa-info-circle me-2"></i>
            Pre-filled with previous month's data
          </small>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Select Option</label>
        <select
          className="form-control"
          value={quranOption}
          onChange={(e) => setQuranOption(e.target.value)}
        >
          <option value="">Select</option>
          <option value="quran">Quran</option>
          <option value="qaidah">Qaidah</option>
          <option value="tajweed">Tajweed</option>
          <option value="hifz">Hifz</option>
        </select>
      </div>

      {["quran", "hifz"].includes(quranOption) && (
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Juz (Para)</label>
            <input
              type="number"
              className="form-control"
              name="quran_hifz_para"
              value={fields.quran_hifz_para}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Page</label>
            <input
              type="number"
              className="form-control"
              name="quran_hifz_page"
              value={fields.quran_hifz_page}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Line (Optional)</label>
            <input
              type="number"
              className="form-control"
              name="quran_hifz_line"
              value={fields.quran_hifz_line}
              onChange={handleFieldChange}
            />
          </div>
        </div>
      )}

      {["qaidah", "tajweed"].includes(quranOption) && (
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Level</label>
            <select
              className="form-control"
              name="qaidah_tajweed_level"
              value={fields.qaidah_tajweed_level}
              onChange={handleFieldChange}
              required
            >
              <option value="">Select Level</option>
              {quranOption === "qaidah"
                ? Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={`level${i + 1}`}>
                      Level {i + 1}
                    </option>
                  ))
                : Array.from({ length: 8 }, (_, i) => (
                    <option key={i} value={`level${i + 1}`}>
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
              name="qaidah_tajweed_lesson_name"
              value={fields.qaidah_tajweed_lesson_name}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Page</label>
            <input
              type="number"
              className="form-control"
              name="qaidah_tajweed_page"
              value={fields.qaidah_tajweed_page}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Line</label>
            <input
              type="number"
              className="form-control"
              name="qaidah_tajweed_line"
              value={fields.qaidah_tajweed_line}
              onChange={handleFieldChange}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
}
