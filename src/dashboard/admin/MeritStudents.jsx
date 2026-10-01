import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import { useGetTopMeritsQuery } from "../../redux/features/merits/meritsApi";

export default function MeritStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("merit");

  const queryArg = searchTerm ? searchTerm : { category: activeTab };
  const {
    data: merits = [],
    isLoading,
    error,
  } = useGetTopMeritsQuery(queryArg);

  const { meritStudents, demeritStudents } = useMemo(() => {
    const merit = [];
    const demerit = [];
    merits.forEach((s) => {
      if (s.totalMerit >= 50) merit.push(s);
      else if (s.totalMerit <= -25) demerit.push(s);
    });
    return { meritStudents: merit, demeritStudents: demerit };
  }, [merits]);

  if (isLoading) return <div className="p-4">Loading merit students...</div>;
  if (error) return <div className="p-4 text-danger">Error loading data</div>;

  const displayed = activeTab === "merit" ? meritStudents : demeritStudents;
  const thresholdText =
    activeTab === "merit" ? "(50+ points)" : "(-25 or lower)";
  const emptyText =
    activeTab === "merit"
      ? "with 50+ merit points"
      : "with demerit points of -25 or lower";

  return (
    <div className="container py-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h3 className="fs-2 fw-bold mb-0">
            🎖️ {activeTab === "merit" ? "Merit Students" : "Demerit Students"}{" "}
            {!searchTerm && thresholdText}
          </h3>
        </div>
        <div className="col-md-6 mt-3 mt-md-0">
          <input
            type="text"
            name="student_name"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
      </div>

      {!searchTerm && (
        <div className="d-flex gap-2 mb-4">
          <button
            className={`btn ${
              activeTab === "merit" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setActiveTab("merit")}
          >
            ⭐ Merit Students ({meritStudents.length})
          </button>
          <button
            className={`btn ${
              activeTab === "demerit" ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={() => setActiveTab("demerit")}
          >
            ⚠️ Demerit Students ({demeritStudents.length})
          </button>
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="alert alert-warning">
          No students found {searchTerm ? "matching your search" : emptyText}.
        </div>
      ) : (
        <div className="row gy-3">
          {displayed.map((student) => {
            const isDemerit = student.totalMerit <= -25;
            return (
              <div className="col-md-6" key={student.student_id}>
                <div
                  className={`border p-3 rounded bg-white shadow-sm ${
                    isDemerit ? "border-danger" : ""
                  }`}
                >
                  <h5 className="mb-1 fw-semibold">
                    <Link
                      className="student-link"
                      to={`/dashboard/admin/view-student/${student.student_id}`}
                    >
                      {student.student_name}{" "}
                      {student.family_name && `(${student.family_name})`}
                    </Link>
                  </h5>

                  <p className="mb-1 text-muted">
                    Class: {student.class} | Department: {student.department}
                  </p>
                  <p
                    className={`mb-0 fw-medium ${
                      isDemerit
                        ? "text-danger"
                        : student.totalMerit >= 50
                          ? "text-success"
                          : "text-primary"
                    }`}
                  >
                    {isDemerit ? "Total Demerit Points" : "Total Merit Points"}:{" "}
                    {student.totalMerit}
                    {!searchTerm &&
                      student.totalMerit < 50 &&
                      student.totalMerit > -25 &&
                      " (Below threshold)"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
