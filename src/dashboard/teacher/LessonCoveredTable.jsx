import React, { useState } from "react";
import { FaTrashAlt, FaPen } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDeleteManyLessonCoveredMutation } from "../../redux/features/lessons_covered/lessons_coveredApi";
import LessonCoveredUpdateModal from "../shared/LessonCoveredUpdateModal";

export default function LessonCoveredTable({
  lessonsCovered,
  filterMonth,
  setFilterMonth,
  filterName,
  setFilterName,
  filterYear,
  setFilterYear,
}) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const currentYear = new Date().getFullYear();
  const [deleteManyLessonCovered] = useDeleteManyLessonCoveredMutation();

  const toggleRowExpansion = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleShow = (student) => {
    setSelectedGroup(student);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleDelete = async (ids) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = await deleteManyLessonCovered(ids).unwrap();
        if (data?.deletedCount) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      }
    });
  };

  const renderSubjectDetails = (lessons, subject) => {
    if (!lessons || !lessons[subject]) return "N/A";

    const data = lessons[subject];

    switch (subject) {
      case "qaidah_quran":
        return data.selected === "quran" || data.selected === "hifz"
          ? `Para: ${data.data?.para || "N/A"}, Page: ${
              data.data?.page || "N/A"
            }, Line: ${data.data?.line || "N/A"}`
          : `Level: ${data.data?.level || "N/A"}, Lesson: ${
              data.data?.lesson_name || "N/A"
            }, Page: ${data.data?.page || "N/A"}`;

      case "islamic_studies":
        return `Book: ${data.book || "N/A"}, Page: ${
          data.page || "N/A"
        }, Lesson: ${data.lesson_name || "N/A"}`;

      case "dua_surah":
        return `Book: ${data.book || "N/A"}, Level: ${
          data.level || "N/A"
        }, Page: ${data.page || "N/A"}, Target: ${data.target || "N/A"}`;

      default:
        return "N/A";
    }
  };

  return (
    <div>
      <h3 className="text-center mb-4">Previously Added Reports</h3>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Table Filters</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Month</label>
              <select
                className="form-control"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option value="">All Months</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Year</label>
              <select
                className="form-control"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
                  (yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Student Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {lessonsCovered?.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="">
              <tr>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)", width: "40px" }}
                ></th>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  #
                </th>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Student Name
                </th>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Month
                </th>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Year
                </th>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Beginning Report
                </th>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Ending Report
                </th>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {lessonsCovered.map((student, idx) => (
                <React.Fragment key={idx}>
                  <tr
                    className="clickable-row"
                    onClick={() => toggleRowExpansion(idx)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{expandedRows.has(idx) ? "▼" : "►"}</td>
                    <td>{idx + 1}</td>
                    <td className="fw-bold">{student.student_name}</td>
                    <td>{student.month}</td>
                    <td>{student.year}</td>
                    <td>
                      {student.beginning ? (
                        <span className="badge bg-success">Available</span>
                      ) : (
                        <span className="badge bg-secondary">Not Added</span>
                      )}
                    </td>
                    <td>
                      {student.ending ? (
                        <span className="badge bg-success">Available</span>
                      ) : (
                        <span className="badge bg-secondary">Not Added</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(
                              [
                                student.beginning?._id,
                                student.ending?._id,
                              ].filter(Boolean)
                            );
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShow(student);
                          }}
                        >
                          <FaPen />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRows.has(idx) && (
                    <tr>
                      <td colSpan="8" className="p-0">
                        <div className="p-3 bg-light">
                          <h6 className="mb-3 text-primary">
                            Progress Details for {student.student_name} -{" "}
                            {student.month} {student.year}
                          </h6>

                          <div className="row">
                            {/* Beginning of Month */}
                            <div className="col-md-6 mb-4">
                              <div className="card">
                                <div className="card-header bg-info text-white">
                                  <h6 className="mb-0">Beginning of Month</h6>
                                </div>
                                <div className="card-body">
                                  {student.beginning ? (
                                    <>
                                      <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(
                                          student.beginning.date
                                        ).toLocaleDateString()}
                                      </p>
                                      <p>
                                        <strong>Description:</strong>{" "}
                                        {student.beginning.description ||
                                          "No description"}
                                      </p>

                                      <div className="mt-3">
                                        <h6>Subjects:</h6>
                                        <ul className="list-group">
                                          <li className="list-group-item">
                                            <strong>Quran/Qaidah:</strong>
                                            <br />
                                            {renderSubjectDetails(
                                              student.beginning.lessons,
                                              "qaidah_quran"
                                            )}
                                          </li>
                                          <li className="list-group-item">
                                            <strong>Islamic Studies:</strong>
                                            <br />
                                            {renderSubjectDetails(
                                              student.beginning.lessons,
                                              "islamic_studies"
                                            )}
                                          </li>
                                          <li className="list-group-item">
                                            <strong>Dua/Surah:</strong>
                                            <br />
                                            {renderSubjectDetails(
                                              student.beginning.lessons,
                                              "dua_surah"
                                            )}
                                          </li>
                                        </ul>
                                      </div>
                                    </>
                                  ) : (
                                    <p className="text-muted">
                                      No beginning report available
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* End of Month */}
                            <div className="col-md-6 mb-4">
                              <div className="card">
                                <div className="card-header bg-warning text-dark">
                                  <h6 className="mb-0">End of Month</h6>
                                </div>
                                <div className="card-body">
                                  {student.ending ? (
                                    <>
                                      <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(
                                          student.ending.date
                                        ).toLocaleDateString()}
                                      </p>
                                      <p>
                                        <strong>Description:</strong>{" "}
                                        {student.ending.description ||
                                          "No description"}
                                      </p>

                                      <div className="mt-3">
                                        <h6>Subjects:</h6>
                                        <ul className="list-group">
                                          <li className="list-group-item">
                                            <strong>Quran/Qaidah:</strong>
                                            <br />
                                            {renderSubjectDetails(
                                              student.ending.lessons,
                                              "qaidah_quran"
                                            )}
                                          </li>
                                          <li className="list-group-item">
                                            <strong>Islamic Studies:</strong>
                                            <br />
                                            {renderSubjectDetails(
                                              student.ending.lessons,
                                              "islamic_studies"
                                            )}
                                          </li>
                                          <li className="list-group-item">
                                            <strong>Dua/Surah:</strong>
                                            <br />
                                            {renderSubjectDetails(
                                              student.ending.lessons,
                                              "dua_surah"
                                            )}
                                          </li>
                                        </ul>
                                      </div>
                                    </>
                                  ) : (
                                    <p className="text-muted">
                                      No end of month report available
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <LessonCoveredUpdateModal
            student={selectedGroup}
            showModal={showModal}
            handleClose={handleClose}
          />
        </div>
      ) : (
        <div className="text-center p-5 bg-light rounded">
          <h5 className="text-muted">No lessons covered data found</h5>
          <p className="text-muted">
            Try adjusting your filters or add new reports
          </p>
        </div>
      )}
    </div>
  );
}
