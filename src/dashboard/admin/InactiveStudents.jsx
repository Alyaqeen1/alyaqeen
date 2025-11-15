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
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";

// Helper function to format session time
const formatSessionTime = (time) => {
  switch (time) {
    case "S1":
      return "Weekdays Early";
    case "S2":
      return "Weekdays Late";
    case "WM":
      return "Weekend Morning";
    case "WA":
      return "Weekend Afternoon";
    default:
      return time || "Not assigned";
  }
};

export default function InactiveStudents() {
  const [activeRow, setActiveRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();

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
    activity: "inactive",
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

  // Helper function to get department display
  const getDepartmentDisplay = (academic) => {
    if (!academic) return "Not assigned";

    // Handle new multi-department structure
    if (academic.enrollments && Array.isArray(academic.enrollments)) {
      if (academic.enrollments.length === 0) return "Not assigned";

      // Get unique department names
      const deptNames = academic.enrollments.map((enrollment) => {
        const dept = departments?.find((d) => d._id === enrollment.dept_id);
        return dept ? dept.dept_name : "Unknown Dept";
      });

      // Remove duplicates and limit to 2 for display
      const uniqueDepts = [...new Set(deptNames)].slice(0, 2);

      if (uniqueDepts.length === 1) {
        return (
          <div className="text-center">
            <div className="small">{uniqueDepts[0]}</div>
          </div>
        );
      }

      return (
        <div className="text-center">
          <div className="small">{uniqueDepts[0]}</div>
          <div className="small">{uniqueDepts[1]}</div>
          {academic.enrollments.length > 2 && (
            <div className="small text-muted">
              +{academic.enrollments.length - 2} more
            </div>
          )}
        </div>
      );
    }

    // Handle old single department structure
    if (academic.dept_id) {
      const dept = departments?.find((d) => d._id === academic.dept_id);
      return (
        <div className="text-center">
          <div className="small">{dept ? dept.dept_name : "Unknown Dept"}</div>
        </div>
      );
    }

    if (academic.department) {
      return (
        <div className="text-center">
          <div className="small">{academic.department}</div>
        </div>
      );
    }

    return "Not assigned";
  };

  // Helper function to get class display
  const getClassDisplay = (academic) => {
    if (!academic) return "Not assigned";

    // Handle new multi-department structure
    if (academic.enrollments && Array.isArray(academic.enrollments)) {
      if (academic.enrollments.length === 0) return "Not assigned";

      // Get class names
      const classNames = academic.enrollments.map((enrollment) => {
        const cls = classes?.find((c) => c._id === enrollment.class_id);
        return cls ? cls.class_name : "Unknown Class";
      });

      // Remove duplicates and limit to 2 for display
      const uniqueClasses = [...new Set(classNames)].slice(0, 2);

      if (uniqueClasses.length === 1) {
        return (
          <div className="text-center">
            <div className="small">{uniqueClasses[0]}</div>
          </div>
        );
      }

      return (
        <div className="text-center">
          <div className="small">{uniqueClasses[0]}</div>
          <div className="small">{uniqueClasses[1]}</div>
          {classNames.length > 2 && (
            <div className="small text-muted">
              +{classNames.length - 2} more
            </div>
          )}
        </div>
      );
    }

    // Handle old single department structure
    if (academic.class_id) {
      const cls = classes?.find((c) => c._id === academic.class_id);
      return (
        <div className="text-center">
          <div className="small">{cls ? cls.class_name : "Unknown Class"}</div>
        </div>
      );
    }

    if (academic.class) {
      return (
        <div className="text-center">
          <div className="small">{academic.class}</div>
        </div>
      );
    }

    return "Not assigned";
  };

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

  const handleMakeActive = async (studentId) => {
    try {
      setActiveRow(null); // Close dropdown
      const data = await updateStudentActivity({
        id: studentId,
        activity: "active",
      }).unwrap();

      if (data?.modifiedCount) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Student made active successfully`,
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

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  return (
    <div>
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h3 className="fs-2 fw-bold">Inactive Students</h3>
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
                "Student Name",
                "Email",
                "ID #",
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
                      {students?.length - idx}
                    </td>
                    <td className="border h6 text-center align-middle">
                      {student?.name}
                    </td>
                    <td className="border text-center align-middle">
                      {student?.email}
                    </td>
                    <td className="border text-center align-middle">
                      {student?.student_id}
                    </td>

                    {/* Updated Department Column */}
                    <td className="border text-center align-middle">
                      {getDepartmentDisplay(student?.academic)}
                    </td>

                    {/* Updated Class Column */}
                    <td className="border text-center align-middle">
                      {getClassDisplay(student?.academic)}
                    </td>

                    <td className="border text-center align-middle">
                      {student?.activity}
                    </td>
                    <td className="border text-center align-middle position-relative">
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={(e) => toggleActions(e, student._id)}
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
                <td colSpan={8}>
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
              onClick={() => handleMakeActive(activeRow)}
            >
              Make Active
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
