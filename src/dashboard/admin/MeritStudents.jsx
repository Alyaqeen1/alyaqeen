import React, { useState } from "react";
import { useGetTopMeritsQuery } from "../../redux/features/merits/meritsApi";

export default function MeritStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: merits = [],
    isLoading,
    error,
  } = useGetTopMeritsQuery(searchTerm);

  if (isLoading) return <div>Loading merit students...</div>;
  if (error) return <div>Error loading data</div>;
  console.log(error);

  return (
    <div className="container py-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h3 className="fs-2 fw-bold mb-0">
            🎖️ Merit Students {!searchTerm && "(50+ points)"}
          </h3>
        </div>
        <div className="col-md-6 mt-3 mt-md-0">
          <input
            type="text"
            name="student_name"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
      </div>

      {merits.length === 0 ? (
        <div className="alert alert-warning">
          No students found{" "}
          {searchTerm ? "matching your search" : "with 50+ merit points"}.
        </div>
      ) : (
        <div className="row gy-3">
          {merits.map((student) => (
            <div className="col-md-6" key={student.student_id}>
              <div className="border p-3 rounded bg-white shadow-sm">
                <h5 className="mb-1 fw-semibold">
                  {student.student_name}{" "}
                  {student.family_name && `(${student.family_name})`}
                </h5>
                <p className="mb-1 text-muted">
                  Class: {student.class} | Department: {student.department}
                </p>
                <p
                  className={`mb-0 fw-medium ${
                    student.totalMerit >= 50 ? "text-success" : "text-primary"
                  }`}
                >
                  Total Merit Points: {student.totalMerit}
                  {student.totalMerit < 50 && " (Below threshold)"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
