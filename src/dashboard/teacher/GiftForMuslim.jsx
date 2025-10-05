import React, { useState, useEffect } from "react";

export default function GiftForMuslimForm({ previousData, reset }) {
  const [fields, setFields] = useState({
    gift_for_muslim_level: "",
    gift_for_muslim_page: "",
    gift_for_muslim_target: "",
    gift_for_muslim_lesson_name: "",
  });

  const [hasPrefilled, setHasPrefilled] = useState(false);

  // Update form values whenever previousData or reset changes
  useEffect(() => {
    // Handle reset
    if (reset) {
      setFields({
        gift_for_muslim_level: "",
        gift_for_muslim_page: "",
        gift_for_muslim_target: "",
        gift_for_muslim_lesson_name: "",
      });
      setHasPrefilled(false);
      return;
    }

    const giftData = previousData?.lessons?.gift_for_muslim;

    if (giftData) {
      // Check if any field has meaningful data
      const hasData =
        giftData.level?.trim() ||
        giftData.page?.toString().trim() ||
        giftData.target?.toString().trim() ||
        giftData.lesson_name?.trim();

      if (hasData) {
        setFields({
          gift_for_muslim_level: giftData.level || "",
          gift_for_muslim_page: giftData.page || "",
          gift_for_muslim_target: giftData.target || "",
          gift_for_muslim_lesson_name: giftData.lesson_name || "",
        });
        setHasPrefilled(true);
      }
    } else {
      // Only reset if we had previously pre-filled and now no data
      if (hasPrefilled) {
        setFields({
          gift_for_muslim_level: "",
          gift_for_muslim_page: "",
          gift_for_muslim_target: "",
          gift_for_muslim_lesson_name: "",
        });
        setHasPrefilled(false);
      }
    }
  }, [previousData, reset, hasPrefilled]);

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
      <h6 className="fw-bold mb-3">Gift for Muslim</h6>

      {showPreFillAlert && (
        <div className="alert alert-info py-2 mb-3">
          <small>
            <i className="fas fa-info-circle me-2"></i>
            Pre-filled with previous month's data
          </small>
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Level</label>
          <select
            className="form-control"
            name="gift_for_muslim_level"
            value={fields.gift_for_muslim_level}
            onChange={handleFieldChange}
            required
          >
            <option value="">Select Level</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={`level ${i + 1}`}>
                Level {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Page</label>
          <input
            type="number"
            name="gift_for_muslim_page"
            className="form-control"
            value={fields.gift_for_muslim_page}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Target</label>
          <input
            type="number"
            name="gift_for_muslim_target"
            className="form-control"
            value={fields.gift_for_muslim_target}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Lesson Name</label>
          <input
            type="text"
            name="gift_for_muslim_lesson_name"
            className="form-control"
            value={fields.gift_for_muslim_lesson_name}
            onChange={handleFieldChange}
            required
          />
        </div>
      </div>
    </div>
  );
}
