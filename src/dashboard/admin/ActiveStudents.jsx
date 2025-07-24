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
import {
  useDeleteStudentDataMutation,
  useGetStudentByActivityQuery,
  useUpdateStudentActivityMutation,
} from "../../redux/features/students/studentsApi";
import toast from "react-hot-toast";
import StudentModal from "../shared/StudentModal";

export default function ActiveStudents() {
  const {
    data: students,
    isLoading,
    refetch,
  } = useGetStudentByActivityQuery("active");
  const [activeRow, setActiveRow] = useState(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [deleteStudentData, { isLoading: localLoading }] =
    useDeleteStudentDataMutation();
  const [updateStudentActivity, { isLoading: updateLoading }] =
    useUpdateStudentActivityMutation();
  // Toggle modal visibility
  const handleShow = (id) => {
    setSelectedStudentId(id);
    setShowModal(true);
  };
  useEffect(() => {
    refetch();
  }, []);

  const toggleActions = (event, id) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setActiveRow((prev) => (prev === id ? null : id));
    setDropdownPos({
      top: rect.bottom + window.scrollY,
      left: rect.right - 160,
    }); // adjust width
  };

  const handleMakeInactive = async (studentId) => {
    try {
      const data = await updateStudentActivity({
        id: studentId,
        activity: "inactive",
      }).unwrap();

      if (data?.modifiedCount) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Student made inactive successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (err) {
      toast.error(err?.message);
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
        deleteStudentData(id)
          .unwrap()
          .then((res) => {
            console.log(res);
            if (res?.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Student has been deleted successfully.",
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
                error.response?.data?.message || "Failed to delete student.",
              icon: "error",
            });
          });
      }
    });
  };

  const handleClose = () => setShowModal(false);
  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }
  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center`}>Active Students</h3>
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
                "Student Name",
                "Email",
                "Department",
                "Class",
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
            {students?.length > 0 ? (
              students.map((student, idx) => (
                <React.Fragment key={student._id}>
                  <tr>
                    <td className="border h6 text-center align-middle">
                      {idx + 1}
                    </td>
                    <td className="border h6 text-center align-middle">
                      {student?.name}
                    </td>
                    <td className="border text-center align-middle">
                      {student?.email}
                    </td>
                    <td className="border text-center align-middle">
                      {student?.academic?.department}
                    </td>
                    <td className="border text-center align-middle">
                      {student?.academic?.class}
                    </td>
                    <td className="border text-center align-middle">
                      {student?.activity}
                    </td>
                    <td className="border text-center align-middle position-relative">
                      <FaChevronCircleDown
                        style={{ cursor: "pointer" }}
                        onClick={(e) => toggleActions(e, student._id)}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  <h5 className="text-center my-2">No students available.</h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {activeRow && dropdownPos && (
        <div
          ref={dropdownRef}
          className="position-fixed bg-light border rounded p-2"
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            zIndex: 9999,
            minWidth: "160px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <button
            className="btn btn-sm btn-primary w-100 mb-1"
            onClick={() => handleShow(activeRow)}
          >
            View Student Details
          </button>
          <Link
            to={`/dashboard/online-admissions/update/${activeRow}`}
            className="btn btn-sm btn-secondary w-100 mb-1"
          >
            Edit Student Details
          </Link>
          <button
            className="btn btn-sm btn-warning w-100 mb-1"
            onClick={() => handleMakeInactive(activeRow)}
          >
            Make Inactive
          </button>
          <button
            className="btn btn-sm btn-danger w-100"
            disabled={localLoading}
            onClick={() => handleDelete(activeRow)}
          >
            Delete Record
          </button>
        </div>
      )}
      <StudentModal
        studentId={selectedStudentId}
        showModal={showModal}
        handleClose={handleClose}
      ></StudentModal>
    </div>
  );
}
