import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaEye, FaPen } from "react-icons/fa6";
import { Link } from "react-router";

export default function LessonCoveredSummary({ lessonsCovered }) {
  return (
    <div>
      {" "}
      {lessonsCovered?.length > 0 ? (
        <div>
          <h4>Previously Added Lessons</h4>
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
                    Quran Qaidah Pages Done in Month
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Duas / Surahs Done
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    Islamic Studies Pages Done
                  </th>
                  <th
                    className="font-danger text-white fw-bolder border h6 text-center align-middle"
                    style={{ backgroundColor: "var(--border2)" }}
                  >
                    All Other Info
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
                {lessonsCovered?.length > 0 ? (
                  lessonsCovered?.map((student, idx) => (
                    <tr key={student?._id}>
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
                        {student?.qaidahProgress}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.duasSurahsProgress}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.islamicStudiesProgress}
                      </td>
                      <td
                        className={`border h6 text-center align-middle text-nowrap`}
                      >
                        {student?.description}
                      </td>
                      <td
                        className={`border d-flex gap-2 justify-content-center h6 text-center align-middle text-nowrap`}
                      >
                        <button
                          className="text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                          onClick={() => handleShow(student?._id)}
                        >
                          <FaEye></FaEye>
                        </button>
                        <button
                          className="text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                          onClick={() => handleDelete(student?._id)}
                        >
                          <FaTrashAlt></FaTrashAlt>
                        </button>
                        <Link
                          to={`/dashboard/online-admissions/update/${student?._id}`}
                          className="text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                        >
                          <FaPen></FaPen>
                        </Link>
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
            {/* <StudentModal
                    studentId={selectedStudentId}
                    showModal={showModal}
                    handleClose={handleClose}
                  ></StudentModal> */}
          </div>
          {/* {lessonsCovered?.map((lesson, index) => (
            <div
              key={lesson._id}
              className="border p-3 mb-3 bg-light rounded shadow-sm"
            >
              <h5>
                {index + 1}. {lesson.student_info?.name || "Unknown Student"}
              </h5>
              <p>Department: {lesson.department_info?.dept_name || "N/A"}</p>
              <p>Class: {lesson.class_info?.class_name || "N/A"}</p>
              <p>Subject: {lesson.subject_info?.subject_name || "N/A"}</p>
              <p>Time of Month: {lesson.time_of_month || "N/A"}</p>
              <p>Book Name: {lesson.book_name || "N/A"}</p>
              <p>Qaidah Pages: {lesson.qaidahPages || "N/A"}</p>
              <p>Duas / Surahs: {lesson.duasSurahs || "N/A"}</p>
              <p>Islamic Studies: {lesson.islamicStudiesPages || "N/A"}</p>
              <p>Description: {lesson.description || "N/A"}</p>
              <p className="text-muted small">
                Added on: {new Date(lesson.date).toLocaleDateString()}
              </p>
            </div>
          ))} */}
        </div>
      ) : (
        <div className="text-center p-4">
          <p>No lessons covered data found.</p>
        </div>
      )}
    </div>
  );
}
