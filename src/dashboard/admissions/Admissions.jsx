import React, { useEffect, useState } from "react";
import { useGetStudentsQuery } from "../../redux/features/students/StudentsApi";
import { Link } from "react-router";
import { FaCheck, FaEye, FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import StudentModal from "../shared/StudentModal";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";

export default function Admissions() {
  const { data: students, isLoading, isError, refetch } = useGetStudentsQuery();
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const axiosPublic = useAxiosPublic();
  // Toggle modal visibility
  const handleShow = (id) => {
    setSelectedStudentId(id);
    setShowModal(true);
  };
  useEffect(() => {
    refetch();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/students/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Student has been deleted.",
              icon: "success",
            });
            refetch();
          }
        });
      }
    });
  };

  const handleClose = () => setShowModal(false);
  console.log(students);

  return (
    <div className="mt-8">
      <h3 className={`fs-1 fw-bold text-center`}>All Students List</h3>
      <p className="text-center mb-3">
        Manage all students here—approve, track, and ensure the right
        connections are made.
      </p>

      {/* Filter Dropdown */}
      {/* <label className="block mb-2">
        Filter by Status:
        <select
          className="ml-2 p-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </label> */}

      {/* Table */}
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
                Student Email
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Date of Birth
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Gender
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                School Year
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
            {students?.length > 0 ? (
              students?.map((student, idx) => (
                <tr key={student?._id}>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {idx + 1}
                  </td>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.name}
                  </td>
                  <td
                    className={`fw-medium border text-center align-middle text-nowrap`}
                  >
                    {student?.email}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.dob}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.gender}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {student?.schoolYear}
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
                    <button
                      className="text-white py-1 px-2 rounded-2"
                      style={{ backgroundColor: "var(--border2)" }}
                    >
                      <FaPen></FaPen>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12}>
                  <h5>No students available.</h5>
                </td>
              </tr>
            )}
            {}
          </tbody>
        </table>
        <StudentModal
          studentId={selectedStudentId}
          showModal={showModal}
          handleClose={handleClose}
        ></StudentModal>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-between items-center mt-4">
        <button
          className="btn bg-gradient-to-r text-white from-primary to-secondary  disabled:text-gray-400"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn bg-gradient-to-r text-white from-primary to-secondary  disabled:text-gray-400"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div> */}
    </div>
  );
}
