import React, { useEffect, useRef, useState } from "react";
import {
  useDeleteTeacherMutation,
  useGetTeacherByActivityQuery,
  useUpdateTeacherActivityMutation,
} from "../../redux/features/teachers/teachersApi";
import { FaChevronCircleDown } from "react-icons/fa";
import Swal from "sweetalert2";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { Link } from "react-router";

export default function ActiveTeachers() {
  const {
    data: teachers,
    isLoading,
    refetch,
  } = useGetTeacherByActivityQuery("active");
  const [activeRow, setActiveRow] = useState(null);
  const dropdownRef = useRef(null);
  const [deleteTeacher, { isLoading: localLoading }] =
    useDeleteTeacherMutation();
  const [updateTeacherActivity, { isLoading: updateLoading }] =
    useUpdateTeacherActivityMutation();

  const toggleActions = (id) => {
    setActiveRow((prev) => (prev === id ? null : id));
  };

  const handleMakeInactive = async (teacherId) => {
    try {
      const data = await updateTeacherActivity({
        id: teacherId,
        activity: "inactive",
      }).unwrap();

      if (data?.modifiedCount) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Teacher made inactive successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (err) {
      // }
      console.error("Failed to update activity:", err);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveRow(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        deleteTeacher(id)
          .unwrap()
          .then((res) => {
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
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

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
              {[
                "#",
                "Name",
                "Department",
                "Designation",
                "Mobile No",
                "Status",
                "Actions",
              ].map((header, index) => (
                <th
                  key={index}
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ position: "relative", overflow: "visible" }}>
            {teachers?.length > 0 ? (
              teachers.map((teacher, idx) => (
                <React.Fragment key={teacher._id}>
                  <tr>
                    <td className="border h6 text-center align-middle">
                      {idx + 1}
                    </td>
                    <td className="border d-flex gap-2 align-items-center align-middle">
                      <img
                        style={{ width: "50px" }}
                        className="rounded-5"
                        src={teacher?.teacher_photo}
                        alt="teacher"
                      />
                      {teacher?.name}
                    </td>
                    <td className="border text-center align-middle">
                      {teacher?.department}
                    </td>
                    <td className="border text-center align-middle">
                      {teacher?.designation}
                    </td>
                    <td className="border text-center align-middle">
                      {teacher?.number}
                    </td>
                    <td className="border text-center align-middle">
                      {teacher?.activity}
                    </td>
                    <td className="border text-center align-middle position-relative">
                      <FaChevronCircleDown
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleActions(teacher._id)}
                      />
                      {activeRow === teacher._id && (
                        <div
                          ref={dropdownRef}
                          className="position-absolute bg-light border rounded p-2 z-5"
                          style={{
                            top: "35px",
                            right: "0",
                            zIndex: 999,
                            minWidth: "150px",
                            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Link
                            to={`/dashboard/teacher/details/${teacher?._id}`}
                            className="btn btn-sm btn-primary w-100 mb-1"
                          >
                            View Staff Details
                          </Link>
                          <Link
                            to={`/dashboard/teacher/update/${teacher?._id}`}
                            className="btn btn-sm btn-secondary w-100 mb-1"
                            // onClick={() => handleMakeInactive(teacher.name)}
                          >
                            Edit Staff Details
                          </Link>
                          <button
                            className="btn btn-sm btn-warning w-100 mb-1"
                            onClick={() => handleMakeInactive(teacher?._id)}
                          >
                            Make Inactive
                          </button>
                          <button
                            className="btn btn-sm btn-danger w-100"
                            disabled={localLoading}
                            onClick={() => handleDelete(teacher?._id)}
                          >
                            Delete Record
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  <h5 className="text-center my-2">No teachers available.</h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
