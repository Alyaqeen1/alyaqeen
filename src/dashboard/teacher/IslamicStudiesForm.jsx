import React from "react";

export default function IslamicStudiesForm() {
  return (
    <div className="border rounded p-3 mb-4">
      <h6 className="fw-bold mb-3">Islamic Studies</h6>
      <div className="row g-3">
                   <div className="col-md-4">
          <label className="form-label">Book</label>
          <select className="form-control" name="islamic_studies_book" required>
            <option value="">Select Book</option>
            <option value="book1">Book 1</option>
            <option value="book2">Book 2</option>
            <option value="book3">Book 3</option>
            <option value="book4">Book 4</option>
            <option value="book5">Book 5</option>
            <option value="book6">Book 6</option>
            <option value="book7">Book 7</option>
            <option value="book8">Book 8</option>
          </select>
        </div>
        

        <div className="col-md-4">
          <label className="form-label">Page</label>
          <input
            type="number"
            name="islamic_studies_page"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Lesson Name</label>
          <input
            name="islamic_studies_lesson_name"
            type="text"
            className="form-control"
            required
          />
        </div>
        
      </div>
    </div>
  );
}
