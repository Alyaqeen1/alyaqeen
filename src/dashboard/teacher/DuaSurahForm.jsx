import React from "react";

export default function DuaSurahForm({}) {
  return (
    <div className="border rounded p-3 mb-4">
      <h6 className="fw-bold mb-3">Dua & Surah</h6>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Lesson Name</label>
          <input
            type="text"
            name="dua_surah_lesson_name"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Book</label>
          <select className="form-control" name="dua_surah_book" required>
            <option value="">Select Book</option>
            <option value="book1">Book 1</option>
            <option value="book2">Book 2</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Level</label>
          <select className="form-control" name="dua_surah_level" required>
            <option value="">Select Level</option>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <option key={lvl} value={`level${lvl}`}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Page</label>
          <input
            type="number"
            name="dua_surah_page"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Target</label>
          <input
            type="number"
            name="dua_surah_target"
            className="form-control"
            required
          />
        </div>
      </div>
    </div>
  );
}
