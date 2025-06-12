import React from "react";
import { FaCheck } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import {
  useGetStudentsByStatusQuery,
  useUpdateStudentStatusMutation,
} from "../../redux/features/students/studentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";

export default function HoldStudent() {
  const [updateStudentStatus] = useUpdateStudentStatusMutation();

  const {
    data: students,
    isLoading,
    isError,
    refetch,
  } = useGetStudentsByStatusQuery("hold");

  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  const handleStatus = async (id, newStatus) => {
    try {
      await updateStudentStatus({ id, status: newStatus });

      // if (data.modifiedCount) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Student ${newStatus} successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    } catch (err) {
      // }
      console.error("Failed to update status:", err);
    }
  };

  return (
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
                    {student?.school_year}
                  </td>
                  <td
                    className={`border d-flex gap-2 justify-content-center h6 text-center align-middle text-nowrap`}
                  >
                    <button
                      className="text-white py-1 px-2 rounded-2"
                      style={{ backgroundColor: "var(--border2)" }}
                      onClick={() => handleStatus(student?._id, "enrolled")}
                    >
                      <FaCheck></FaCheck>
                    </button>
                    <button
                      className="text-white py-1 px-2 rounded-2"
                      style={{ backgroundColor: "var(--border2)" }}
                      onClick={() => handleStatus(student?._id, "approved")}
                    >
                      <ImCross />
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
      </div>
    </div>
  );
}
