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

  const formatQuranData = (data) => {
    if (!data) return "N/A";
    return `Para: ${data.para}, Page: ${data.page}, Line: ${data.line}`;
  };

  const formatDuaSurahData = (data) => {
    if (!data) return "N/A";
    return `${data.lesson_name} (Book: ${data.book}, Level: ${data.level}, Page: ${data.page})`;
  };

  const formatIslamicStudiesData = (data) => {
    if (!data) return "N/A";
    return `${data.lesson_name} (Page: ${data.page})`;
  };

  return (
    <div>
      <h3 className="text-center">Previously Added Reports</h3>
      <h4>Table Filters</h4>
      <div className="row mb-3">
        <div className="col-lg-4">
          <label className="form-label">Month</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="">Select month</option>
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
        <div className="col-lg-4">
          <label className="form-label">Year</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="">Select year</option>
            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
              (yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              )
            )}
          </select>
        </div>
        <div className="col-lg-4">
          <label className="form-label">Student Name</label>
          <input
            type="text"
            style={{ borderColor: "var(--border2)" }}
            className="form-control"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>
      </div>

      {lessonsCovered?.length > 0 ? (
        <div className="table-responsive mb-3">
          <table className="table mb-0" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th
                  style={{ backgroundColor: "var(--border2)", width: "30px" }}
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {lessonsCovered.map((student, idx) => (
                <React.Fragment key={idx}>
                  <tr
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleRowExpansion(idx)}
                  >
                    <td className="border text-center align-middle">
                      {expandedRows.has(idx) ? "▼" : "►"}
                    </td>
                    <td className="border h6 text-center align-middle">
                      {idx + 1}
                    </td>
                    <td className="border h6 text-center align-middle">
                      {student.student_name}
                    </td>
                    <td className="border h6 text-center align-middle">
                      {student.month}
                    </td>
                    <td className="border h6 text-center align-middle">
                      {student.year}
                    </td>
                    <td className="border d-flex gap-2 justify-content-center align-middle">
                      <button
                        className="text-white py-1 px-2 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
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
                        className="text-white py-1 px-2 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShow(student);
                        }}
                      >
                        <FaPen />
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(idx) && (
                    <tr>
                      <td colSpan="6" className="p-0 border-0">
                        <div className="px-4 py-2 bg-light">
                          <h6 className="mb-3">
                            Progress Details for {student.month} {student.year}
                          </h6>

                          <div className="row mb-4">
                            <div className="col-md-6">
                              <h6 className="text-primary">
                                Beginning of Month
                              </h6>
                              <p className="mb-1">
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  student.beginning?.date
                                ).toLocaleDateString() || "N/A"}
                              </p>
                              <p className="mb-1">
                                <strong>Description:</strong>{" "}
                                {student.beginning?.description || "N/A"}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <h6 className="text-primary">End of Month</h6>
                              <p className="mb-1">
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  student.ending?.date
                                ).toLocaleDateString() || "N/A"}
                              </p>
                              <p className="mb-1">
                                <strong>Description:</strong>{" "}
                                {student.ending?.description || "N/A"}
                              </p>
                            </div>
                          </div>

                          <table className="table table-bordered table-sm">
                            <thead>
                              <tr>
                                <th
                                  rowSpan="2"
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                  }}
                                >
                                  Subject
                                </th>
                                <th
                                  colSpan="4"
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                    textAlign: "center",
                                  }}
                                >
                                  Beginning of Month
                                </th>
                                <th
                                  colSpan="4"
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                    textAlign: "center",
                                  }}
                                >
                                  End of Month
                                </th>
                              </tr>
                              <tr>
                                {/* Beginning of Month columns */}
                                <th
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                  }}
                                >
                                  Level/Book
                                </th>
                                <th
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                  }}
                                >
                                  Page
                                </th>
                                <th
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                  }}
                                >
                                  Line/Name
                                </th>
                                <th
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                  }}
                                >
                                  Target/Para
                                </th>

                                {/* End of Month columns */}
                                <th
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                  }}
                                >
                                  Level/Book
                                </th>
                                <th
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                  }}
                                >
                                  Page
                                </th>
                                <th
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                  }}
                                >
                                  Line/Name
                                </th>
                                <th
                                  style={{
                                    backgroundColor: "var(--border2)",
                                    color: "white",
                                  }}
                                >
                                  Target/Para
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Quran/Qaidah Row */}
                              <tr>
                                <td>
                                  <strong>Quran/Qaidah</strong>
                                </td>

                                {/* Beginning of Month - Quran/Qaidah */}
                                <td>
                                  {student.beginning?.lessons?.qaidah_quran
                                    ?.selected || "N/A"}
                                </td>
                                <td>
                                  {student.beginning?.lessons?.qaidah_quran
                                    ?.data?.page || "N/A"}
                                </td>
                                <td>
                                  {student.beginning?.lessons?.qaidah_quran
                                    ?.data?.line || "N/A"}
                                </td>
                                <td>
                                  {student.beginning?.lessons?.qaidah_quran
                                    ?.data?.para || "N/A"}
                                </td>

                                {/* End of Month - Quran/Qaidah */}
                                <td>
                                  {student.ending?.lessons?.qaidah_quran
                                    ?.selected || "N/A"}
                                </td>
                                <td>
                                  {student.ending?.lessons?.qaidah_quran?.data
                                    ?.page || "N/A"}
                                </td>
                                <td>
                                  {student.ending?.lessons?.qaidah_quran?.data
                                    ?.line || "N/A"}
                                </td>
                                <td>
                                  {student.ending?.lessons?.qaidah_quran?.data
                                    ?.para || "N/A"}
                                </td>
                              </tr>

                              {/* Dua/Surah Row */}
                              <tr>
                                <td>
                                  <strong>Dua/Surah</strong>
                                </td>

                                {/* Beginning of Month - Dua/Surah */}
                                <td>
                                  {student.beginning?.lessons?.dua_surah
                                    ?.level || "N/A"}
                                </td>
                                <td>
                                  {student.beginning?.lessons?.dua_surah
                                    ?.page || "N/A"}
                                </td>
                                <td>
                                  {student.beginning?.lessons?.dua_surah
                                    ?.lesson_name || "N/A"}
                                </td>
                                <td>
                                  {student.beginning?.lessons?.dua_surah
                                    ?.target || "N/A"}
                                </td>

                                {/* End of Month - Dua/Surah */}
                                <td>
                                  {student.ending?.lessons?.dua_surah?.level ||
                                    "N/A"}
                                </td>
                                <td>
                                  {student.ending?.lessons?.dua_surah?.page ||
                                    "N/A"}
                                </td>
                                <td>
                                  {student.ending?.lessons?.dua_surah
                                    ?.lesson_name || "N/A"}
                                </td>
                                <td>
                                  {student.ending?.lessons?.dua_surah?.target ||
                                    "N/A"}
                                </td>
                              </tr>

                              {/* Islamic Studies Row */}
                              <tr>
                                <td>
                                  <strong>Islamic Studies</strong>
                                </td>
                                {/* Beginning of Month - Islamic Studies */}
                                <td>{"N/A"}</td>{" "}
                                {/* Islamic Studies doesn't have level/book */}
                                <td>
                                  {student.beginning?.lessons?.islamic_studies
                                    ?.page || "N/A"}
                                </td>
                                <td>
                                  {student.beginning?.lessons?.islamic_studies
                                    ?.lesson_name || "N/A"}
                                </td>
                                <td>{"N/A"}</td>{" "}
                                {/* Islamic Studies doesn't have target/para */}
                                {/* End of Month - Islamic Studies */}
                                <td>{"N/A"}</td>{" "}
                                {/* Islamic Studies doesn't have level/book */}
                                <td>
                                  {student.ending?.lessons?.islamic_studies
                                    ?.page || "N/A"}
                                </td>
                                <td>
                                  {student.ending?.lessons?.islamic_studies
                                    ?.lesson_name || "N/A"}
                                </td>
                                <td>{"N/A"}</td>{" "}
                                {/* Islamic Studies doesn't have target/para */}
                              </tr>
                            </tbody>
                          </table>
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
        <div className="text-center p-4">
          <p>No lessons covered data found.</p>
        </div>
      )}
    </div>
  );
}
