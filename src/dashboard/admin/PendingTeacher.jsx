import React, { useEffect, useState } from "react";
import {
  useDeleteTeacherMutation,
  useGetPendingRejectedTeacherQuery,
  useGetTeacherByStatusQuery,
} from "../../redux/features/teachers/teachersApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { FaEye, FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router";
import Swal from "sweetalert2";
import TeacherModal from "../shared/TeacherModal";

export default function PendingTeacher() {
  const {
    data: teachers,
    isLoading,
    isError,
    refetch,
  } = useGetPendingRejectedTeacherQuery();
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [deleteTeacher] = useDeleteTeacherMutation();

  // Toggle modal visibility
  const handleShow = (id) => {
    setSelectedTeacherId(id);
    setShowModal(true);
  };
  useEffect(() => {
    refetch();
  }, []);

  const handleClose = () => setShowModal(false);
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
        deleteTeacher(id)
          .unwrap()
          .then((res) => {
            console.log(res);
            // You can optionally check res.status === 200
            if (res?.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Teacher has been deleted successfully.",
                icon: "success",
              });
              refetch();
            } else {
              Swal.fire({
                title: "Error",
                text: "Something went wrong.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text:
                error.response?.data?.message || "Failed to delete teacher.",
              icon: "error",
            });
          });
      }
    });
  };
  if (isLoading) {
    return <LoadingSpinnerDash />;
  }
  return (
    <div>
      {" "}
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
                Teacher Name
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Email
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
                Designation
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
            {teachers?.length > 0 ? (
              teachers?.map((teacher, idx) => (
                <tr key={teacher?._id}>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {idx + 1}
                  </td>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {teacher?.name}
                  </td>
                  <td
                    className={`fw-medium border text-center align-middle text-nowrap`}
                  >
                    {teacher?.email}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {teacher?.dob}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {teacher?.gender}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {teacher?.designation}
                  </td>
                  <td
                    className={`border d-flex gap-2 justify-content-center h6 text-center align-middle text-nowrap`}
                  >
                    <button
                      className="text-white py-1 px-2 rounded-2"
                      style={{ backgroundColor: "var(--border2)" }}
                      onClick={() => handleShow(teacher?._id)}
                    >
                      <FaEye></FaEye>
                    </button>
                    <button
                      className="text-white py-1 px-2 rounded-2"
                      style={{ backgroundColor: "var(--border2)" }}
                      onClick={() => handleDelete(teacher?._id)}
                    >
                      <FaTrashAlt></FaTrashAlt>
                    </button>
                    <Link
                      to={`/dashboard/teacher/update/${teacher?._id}`}
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
                  <h5>No students available.</h5>
                </td>
              </tr>
            )}
            {}
          </tbody>
        </table>
        <TeacherModal
          teacherId={selectedTeacherId}
          showModal={showModal}
          handleClose={handleClose}
        ></TeacherModal>
      </div>
    </div>
  );
}
