import React, { useEffect, useState } from "react";

export default function IslamicStudiesForm({ previousData, reset }) {
  const [formValues, setFormValues] = useState({
    islamic_studies_book: "",
    islamic_studies_page: "",
    islamic_studies_lesson_name: "",
  });

  // Track if user has manually edited the form
  const [hasUserEdited, setHasUserEdited] = useState(false);

  useEffect(() => {
    // Handle reset - only clear if reset is explicitly true
    if (reset) {
      setFormValues({
        islamic_studies_book: "",
        islamic_studies_page: "",
        islamic_studies_lesson_name: "",
      });
      setHasUserEdited(false);
      return;
    }

    // If we have previous data and user hasn't edited yet, pre-fill
    if (previousData?.lessons?.islamic_studies && !hasUserEdited) {
      const islamic = previousData.lessons.islamic_studies;

      // Check if any field has meaningful data
      const hasData =
        islamic.book?.trim() ||
        islamic.page?.toString().trim() ||
        islamic.lesson_name?.trim();

      if (hasData) {
        setFormValues({
          islamic_studies_book: islamic.book || "",
          islamic_studies_page: islamic.page || "",
          islamic_studies_lesson_name: islamic.lesson_name || "",
        });
      }
    }
  }, [previousData, reset, hasUserEdited]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Mark as user edited
    if (!hasUserEdited) {
      setHasUserEdited(true);
    }
  };

  // Show alert only when we actually pre-filled from previous data
  const showPreFillAlert =
    !hasUserEdited &&
    previousData?.lessons?.islamic_studies &&
    (previousData.lessons.islamic_studies.book?.trim() ||
      previousData.lessons.islamic_studies.page?.toString().trim() ||
      previousData.lessons.islamic_studies.lesson_name?.trim());

  return (
    <div className="border rounded p-3 mb-4">
      <h6 className="fw-bold mb-3">Islamic Studies</h6>

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
            name="islamic_studies_book"
            value={formValues.islamic_studies_book}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Book</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={`book ${i + 1}`}>
                Book {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Page</label>
          <input
            type="number"
            name="islamic_studies_page"
            className="form-control"
            value={formValues.islamic_studies_page}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Lesson Name</label>
          <input
            name="islamic_studies_lesson_name"
            type="text"
            className="form-control"
            value={formValues.islamic_studies_lesson_name}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
}
