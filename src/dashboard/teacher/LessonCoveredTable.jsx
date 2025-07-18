import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaEye, FaPen } from "react-icons/fa6";
import { Link } from "react-router";
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

  const currentYear = new Date().getFullYear();
  const [deleteManyLessonCovered] = useDeleteManyLessonCoveredMutation();
  // Toggle modal visibility
  const handleShow = (student) => {
    setSelectedGroup(student);
    setShowModal(true);
  };
  // useEffect(() => {
  //   refetch();
  // }, []);
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
  return (
    <div>
      <h3 className="text-center">Previously Added Lessons</h3>
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
        <div>
          <div className="table-responsive mb-3">
            <table
              className="table mb-0"
              style={{
                minWidth: 700,
              }}
            >
              <thead>
                <tr>
                  <th
                    rowSpan="2"
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    #
                  </th>
                  <th
                    rowSpan="2"
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Student Name
                  </th>
                  <th
                    rowSpan="2"
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Month
                  </th>
                  <th
                    rowSpan="2"
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Subject Name
                  </th>
                  <th
                    colSpan="2"
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Quran Qaidah Pages Done in Month
                  </th>
                  <th
                    colSpan="2"
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Duas / Surahs Done
                  </th>
                  <th
                    colSpan="2"
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Islamic Studies Pages Done
                  </th>

                  <th
                    rowSpan="2"
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    All Other Info
                  </th>
                  <th
                    rowSpan="2"
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Actions
                  </th>
                </tr>
                <tr>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Beginning
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Ending
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Beginning
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Ending
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Beginning
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Ending
                  </th>
                  {/* <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Quran Pages
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Duas/Surahs
                  </th> */}
                </tr>
              </thead>

              <tbody>
                {lessonsCovered?.length > 0 ? (
                  lessonsCovered?.map((student, idx) => (
                    <tr key={idx}>
                      <td
                        className={` border h6 text-center align-middle text-nowrap`}
                      >
                        {idx + 1}
                      </td>
                      <td
                        className={` border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.student_name}
                      </td>
                      <td
                        className={`fw-medium border text-center align-middle text-nowrap`}
                      >
                        {student?.month}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.subject_name || "N/A"}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.entries.filter(
                          (e) => e.time_of_month === "beginning"
                        )[0]?.qaidahPages || "N/A"}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.entries.filter(
                          (e) => e.time_of_month === "ending"
                        )[0]?.qaidahPages || "N/A"}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.entries.filter(
                          (e) => e.time_of_month === "beginning"
                        )[0]?.duasSurahs || "N/A"}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.entries.filter(
                          (e) => e.time_of_month === "ending"
                        )[0]?.duasSurahs || "N/A"}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.entries.filter(
                          (e) => e.time_of_month === "beginning"
                        )[0]?.islamicStudiesPages || "N/A"}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.entries.filter(
                          (e) => e.time_of_month === "ending"
                        )[0]?.islamicStudiesPages || "N/A"}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.entries?.[0]?.description || "N/A"}
                      </td>
                      <td
                        className={`border d-flex gap-2 justify-content-center h6 text-center align-middle text-nowrap`}
                      >
                        {/* <button
                          className="text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                          onClick={() => handleShow(student?._id)}
                        >
                          <FaEye></FaEye>
                        </button> */}
                        <button
                          className="text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                          onClick={() =>
                            handleDelete(student?.entries.map((e) => e._id))
                          }
                        >
                          <FaTrashAlt></FaTrashAlt>
                        </button>
                        <button
                          className="text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                          onClick={() => handleShow(student)}
                        >
                          <FaPen />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12}>
                      <h5>No data available.</h5>
                    </td>
                  </tr>
                )}
                {}
              </tbody>
            </table>
            <LessonCoveredUpdateModal
              student={selectedGroup}
              showModal={showModal}
              handleClose={handleClose}
            ></LessonCoveredUpdateModal>
          </div>
        </div>
      ) : (
        <div className="text-center p-4">
          <p>No lessons covered data found.</p>
        </div>
      )}
    </div>
  );
}
