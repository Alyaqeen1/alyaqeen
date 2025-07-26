import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
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
  const [activeRow, setActiveRow] = useState(null);
  const [deleteTeacher, { isLoading: localLoading }] =
    useDeleteTeacherMutation();
  const [updateTeacherActivity, { isLoading: updateLoading }] =
    useUpdateTeacherActivityMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);
  const {
    data: teachers,
    isLoading,
    refetch,
  } = useGetTeacherByActivityQuery({
    activity: "active",
    search: debouncedSearchTerm,
  });

  // Popper.js setup
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          boundary: "viewport",
          padding: 10,
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["top-end", "bottom-start"],
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8], // [skid, distance]
        },
      },
    ],
  });

  const toggleActions = (event, id) => {
    event.stopPropagation(); // Prevent event bubbling
    setActiveRow((prev) => (prev === id ? null : id));
    setReferenceElement(event.currentTarget);
  };
  const handleAction = async (actionFn, id) => {
    setActiveRow(null); // Close dropdown first
    await actionFn(id); // Then perform action
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
      console.error("Failed to update activity:", err);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popperElement &&
        !popperElement.contains(event.target) &&
        referenceElement &&
        !referenceElement.contains(event.target)
      ) {
        setActiveRow(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popperElement, referenceElement]);

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
    return <LoadingSpinnerDash />;
  }

  return (
    <div>
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h3 className="fs-2 fw-bold">Active Teachers</h3>
        </div>
        <div className="col-md-6 mt-3 mt-md-0">
          <input
            type="text"
            name="student_name"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
      </div>
      <div className="table-responsive mb-3">
        <table className="table mb-0" style={{ minWidth: 700 }}>
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
                      {teacher?.teacher_photo ? (
                        <img
                          style={{ width: "50px" }}
                          className="rounded-5"
                          src={teacher?.teacher_photo}
                          alt=""
                        />
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "var(--border2)",
                            color: "#fff",
                            fontSize: "26px",
                            fontWeight: "bold",
                          }}
                        >
                          {teacher?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
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
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={(e) => toggleActions(e, teacher._id)}
                        ref={setReferenceElement}
                      >
                        <FaChevronCircleDown />
                      </button>
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

      {activeRow && (
        <div
          ref={setPopperElement}
          style={{
            ...styles.popper,
            zIndex: 9999,
            width: "180px",
          }}
          {...attributes.popper}
          className="bg-light border rounded p-2 shadow"
        >
          <Link
            to={`/dashboard/teacher/details/${activeRow}`}
            className="btn btn-sm btn-primary w-100 mb-1"
            onClick={() => setActiveRow(null)} // Close dropdown
          >
            View Staff Details
          </Link>
          <Link
            to={`/dashboard/teacher/update/${activeRow}`}
            onClick={() => setActiveRow(null)} // Close dropdown
            className="btn btn-sm btn-secondary w-100 mb-1"
          >
            Edit Staff Details
          </Link>
          <button
            className="btn btn-sm btn-warning w-100 mb-1"
            onClick={() => handleAction(handleMakeInactive, activeRow)}
          >
            Make Inactive
          </button>
          <button
            className="btn btn-sm btn-danger w-100"
            disabled={localLoading}
            onClick={() => handleAction(handleDelete, activeRow)}
          >
            Delete Record
          </button>
        </div>
      )}
    </div>
  );
}
