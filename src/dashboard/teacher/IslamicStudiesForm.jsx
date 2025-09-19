import React from "react";

export default function IslamicStudiesForm() {
  return (
    <div className="border rounded p-3 mb-4">
      <h6 className="fw-bold mb-3">Islamic Studies</h6>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Lesson Name</label>
          <input
            name="islamic_studies_lesson_name"
            type="text"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Page Number</label>
          <input
            type="number"
            name="islamic_studies_page"
            className="form-control"
            required
          />
        </div>
      </div>
    </div>
  );
}
