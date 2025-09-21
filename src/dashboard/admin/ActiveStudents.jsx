import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import {
  useDeleteStudentDataMutation,
  useGetStudentByActivityQuery,
  useUpdateStudentActivityMutation,
} from "../../redux/features/students/studentsApi";
import { FaChevronCircleDown } from "react-icons/fa";
import Swal from "sweetalert2";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { Link } from "react-router";
import toast from "react-hot-toast";
import StudentModal from "../shared/StudentModal";
import { useGetFamiliesQuery } from "../../redux/features/families/familiesApi";

// utils/colorMap.js
const colors = [
  "#e57373", // red
  "#64b5f6", // blue
  "#81c784", // green
  "#ffb74d", // orange
  "#ba68c8", // purple
  "#4dd0e1", // teal
  "#ffd54f", // yellow
  "#90a4ae", // grey
];

export function getColorForName(name) {
  if (!name) return "#ccc";
  const firstChar = name[0].toUpperCase();
  const index = firstChar.charCodeAt(0) % colors.length;
  return colors[index];
}
export function getInitials(name = "") {
  if (!name) return "";
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  } else {
    return parts[0].substring(0, 2).toUpperCase();
  }
}

const formatDateToDmy = (dateStr) => {
  if (!dateStr) return "N/A";

  // Handle both YYYY-MM-DD and YYYY-DD-MM formats
  const [part1, part2, part3] = dateStr.split("-");

  // Determine which part is day/month/year (assuming year is always first)
  const year = part1;
  const day = part3?.length === 2 ? part3 : part2; // Fallback to part2 if needed
  const month = part3?.length === 2 ? part2 : part3; // Fallback to part3 if needed

  return `${day}-${month}-${year}`;
};
export default function ActiveStudents() {
  const [activeRow, setActiveRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { data: families } = useGetFamiliesQuery();
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);
  const {
    data: students = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetStudentByActivityQuery({
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

  const [deleteStudentData, { isLoading: localLoading }] =
    useDeleteStudentDataMutation();
  const [updateStudentActivity, { isLoading: updateLoading }] =
    useUpdateStudentActivityMutation();

  // Toggle modal visibility
  const handleShow = (id) => {
    setActiveRow(null); // Close dropdown first
    setSelectedStudentId(id);
    setShowModal(true);
  };

  const toggleActions = (event, id) => {
    event.stopPropagation();
    setReferenceElement(event.currentTarget);
    setActiveRow((prev) => (prev === id ? null : id));
  };

  const handleMakeInactive = async (studentId) => {
    try {
      setActiveRow(null); // Close dropdown
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
    setActiveRow(null); // Close dropdown first
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
  const [studentColorMap, setStudentColorMap] = useState({});

  useEffect(() => {
    if (families?.length) {
      const map = {};
      let colorIndex = 0;

      families.forEach((family) => {
        const familyColor = colors[colorIndex % colors.length];
        colorIndex++;

        family.children.forEach((childUid) => {
          map[childUid] = familyColor;
        });
      });

      setStudentColorMap(map);
    }
  }, [families]);
  const getColorForStudent = (student) => {
    if (student?.uid && studentColorMap[student.uid]) {
      return studentColorMap[student.uid];
    }
    return "#ccc"; // fallback if not found
  };

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  return (
    <div>
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h3 className="fs-2 fw-bold">
            Active Students ({students.length} students)
          </h3>
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
                "Sr #",
                "Student Name",
                "Starting Date",
                "ID #",
                "Department",
                "Time",
                "Class",
                "Fee",
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
                      {students?.length - idx}
                    </td>
                    <td className="border h6 text-center align-middle">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            backgroundColor: getColorForStudent(student),
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        >
                          {getInitials(student?.name)}
                        </div>
                        <Link
                          className="text-dark student-link"
                          to={`/dashboard/admin/view-student/${student?._id}`}
                        >
                          {student?.name}
                        </Link>
                      </div>
                    </td>
                    <td className="border h6 text-center align-middle">
                      {formatDateToDmy(student?.startingDate)}
                    </td>
                    <td className="border text-center align-middle">
                      {student?.student_id}
                    </td>
                    <td className="border text-center align-middle">
                      {student?.academic?.department}
                    </td>

                    <td className="border text-center align-middle">
                      {student?.academic?.time === "S1"
                        ? "Weekdays Early"
                        : student?.academic?.time === "S2"
                        ? "Weekdays Late"
                        : student?.academic?.time === "WM"
                        ? "Weekend Morning"
                        : "Weekend Afternoon"}
                    </td>

                    <td className="border text-center align-middle">
                      {student?.academic?.class}
                    </td>
                    <td className="border text-center align-middle">
                      £{student?.monthly_fee}
                    </td>
                    {/* <td className="border text-center align-middle">
                      {student?.activity}
                    </td> */}
                    <td className="border text-center align-middle position-relative">
                      <FaChevronCircleDown
                        ref={setReferenceElement}
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
          <div className="d-flex flex-column gap-1">
            <button
              className="btn btn-sm btn-primary text-nowrap"
              onClick={() => handleShow(activeRow)}
            >
              View Student Details
            </button>
            <Link
              to={`/dashboard/online-admissions/update/${activeRow}`}
              className="btn btn-sm btn-secondary text-nowrap"
              onClick={() => setActiveRow(null)}
            >
              Edit Student Details
            </Link>
            <button
              className="btn btn-sm btn-warning text-nowrap"
              onClick={() => handleMakeInactive(activeRow)}
            >
              Make Inactive
            </button>
            <button
              className="btn btn-sm btn-danger text-nowrap"
              disabled={localLoading}
              onClick={() => handleDelete(activeRow)}
            >
              Delete Record
            </button>
          </div>
        </div>
      )}

      <StudentModal
        studentId={selectedStudentId}
        showModal={showModal}
        handleClose={handleClose}
      />
    </div>
  );
}
