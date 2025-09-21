import React from "react";

export default function GiftForMuslimForm() {
  return (
    <div className="border rounded p-3 mb-4">
      <h6 className="fw-bold mb-3">Gift for Muslim</h6>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Level</label>
          <select
            className="form-control"
            name="gift_for_muslim_level"
            required
          >
            <option value="">Select Level</option>
            <option value="level 1">Level 1</option>
            <option value="level 2">Level 2</option>
            <option value="level 3">Level 3</option>
            <option value="level 4">Level 4</option>
            <option value="level 5">Level 5</option>
            <option value="level 6">Level 6</option>
            <option value="level 7">Level 7</option>
            <option value="level 8">Level 8</option>
            <option value="level 9">Level 9</option>
            <option value="level 10">Level 10</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Page</label>
          <input
            type="number"
            name="gift_for_muslim_page"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Target</label>
          <input
            type="number"
            name="gift_for_muslim_target"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Lesson Name</label>
          <input
            name="gift_for_muslim_lesson_name"
            type="text"
            className="form-control"
            required
          />
        </div>
      </div>
    </div>
  );
}
