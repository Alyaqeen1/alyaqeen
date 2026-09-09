import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import {
  useDeleteStudentDataMutation,
  useGenerateReportMutation,
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
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";

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

  const [part1, part2, part3] = dateStr.split("-");
  const year = part1;
  const day = part3?.length === 2 ? part3 : part2;
  const month = part3?.length === 2 ? part2 : part3;

  return `${day}-${month}-${year}`;
};

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

// Helper function to get session category
const getSessionCategory = (time) => {
  switch (time) {
    case "S1":
      return "weekday";
    case "S2":
      return "weekday";
    case "WM":
      return "weekend";
    case "WA":
      return "weekend";
    default:
      return "unassigned";
  }
};

// Helper function to get session time slot
const getSessionSlot = (time) => {
  switch (time) {
    case "S1":
      return "early";
    case "S2":
      return "late";
    case "WM":
      return "morning";
    case "WA":
      return "afternoon";
    default:
      return "unassigned";
  }
};

// Get available time slots based on session type
const getAvailableTimeSlots = (sessionType) => {
  if (sessionType === "weekday") {
    return [
      { value: "early", label: "Early (S1)" },
      { value: "late", label: "Late (S2)" },
    ];
  } else if (sessionType === "weekend") {
    return [
      { value: "morning", label: "Morning (WM)" },
      { value: "afternoon", label: "Afternoon (WA)" },
    ];
  } else {
    return [
      { value: "early", label: "Early (S1)" },
      { value: "late", label: "Late (S2)" },
      { value: "morning", label: "Morning (WM)" },
      { value: "afternoon", label: "Afternoon (WA)" },
    ];
  }
};

export default function ActiveStudents() {
  const [activeRow, setActiveRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Filter states
  const [sessionFilter, setSessionFilter] = useState("all"); // all, weekday, weekend
  const [timeSlotFilter, setTimeSlotFilter] = useState("all"); // all, early, late, morning, afternoon

  const { data: families } = useGetFamiliesQuery();
  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();
  const [generateReport, { isLoading: reportLoading }] =
    useGenerateReportMutation();

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
          offset: [0, 8],
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
    setActiveRow(null);
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
      setActiveRow(null);
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
    setActiveRow(null);
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
    return "#ccc";
  };

  // Helper function to get department display
  const getDepartmentDisplay = (academic) => {
    if (!academic) return "Not assigned";

    if (academic.enrollments && Array.isArray(academic.enrollments)) {
      if (academic.enrollments.length === 0) return "Not assigned";

      const deptNames = academic.enrollments.map((enrollment) => {
        const dept = departments?.find((d) => d._id === enrollment.dept_id);
        return dept ? dept.dept_name : "Unknown Dept";
      });

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

  // Helper function to get time display
  const getTimeDisplay = (academic) => {
    if (!academic) return "Not assigned";

    if (academic.enrollments && Array.isArray(academic.enrollments)) {
      if (academic.enrollments.length === 0) return "Not assigned";

      const sessionTimes = academic.enrollments.map((enrollment) => {
        return formatSessionTime(enrollment.session_time);
      });

      const uniqueTimes = [...new Set(sessionTimes)].slice(0, 2);

      if (uniqueTimes.length === 1) {
        return (
          <div className="text-center">
            <div className="small">{uniqueTimes[0]}</div>
          </div>
        );
      }

      return (
        <div className="text-center">
          <div className="small">{uniqueTimes[0]}</div>
          <div className="small">{uniqueTimes[1]}</div>
          {sessionTimes.length > 2 && (
            <div className="small text-muted">
              +{sessionTimes.length - 2} more
            </div>
          )}
        </div>
      );
    }

    if (academic.time) {
      return (
        <div className="text-center">
          <div className="small">{formatSessionTime(academic.time)}</div>
        </div>
      );
    }

    return "Not assigned";
  };

  // Helper function to get class display
  const getClassDisplay = (academic) => {
    if (!academic) return "Not assigned";

    if (academic.enrollments && Array.isArray(academic.enrollments)) {
      if (academic.enrollments.length === 0) return "Not assigned";

      const classNames = academic.enrollments.map((enrollment) => {
        const cls = classes?.find((c) => c._id === enrollment.class_id);
        return cls ? cls.class_name : "Unknown Class";
      });

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

  const handleGenerateReport = async (studentId) => {
    setActiveRow(null);

    Swal.fire({
      title: "Generating Report",
      html: "Please wait while we generate the PDF report...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const result = await generateReport({ id: studentId }).unwrap();

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Report Generated Successfully!",
        html: `
          <p>PDF has been created and saved to the student record.</p>
          <a href="${result.reportUrl}" target="_blank" class="btn btn-success mt-2">
            View PDF
          </a>
        `,
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Failed to Generate Report",
        text: error?.data?.error || "Something went wrong",
      });
    }
  };

  // Apply filters to students
  const getFilteredStudents = () => {
    return students.filter((student) => {
      if (!student?.academic) return false;

      // Get session times from enrollments
      let sessionTimes = [];
      if (
        student.academic.enrollments &&
        Array.isArray(student.academic.enrollments)
      ) {
        sessionTimes = student.academic.enrollments.map((e) => e.session_time);
      } else if (student.academic.time) {
        sessionTimes = [student.academic.time];
      }

      if (sessionTimes.length === 0)
        return sessionFilter === "all" && timeSlotFilter === "all";

      // Check session category filter (weekday/weekend)
      if (sessionFilter !== "all") {
        const hasMatchingCategory = sessionTimes.some((time) => {
          const category = getSessionCategory(time);
          return category === sessionFilter;
        });
        if (!hasMatchingCategory) return false;
      }

      // Check time slot filter (early/late/morning/afternoon)
      if (timeSlotFilter !== "all") {
        const hasMatchingSlot = sessionTimes.some((time) => {
          const slot = getSessionSlot(time);
          return slot === timeSlotFilter;
        });
        if (!hasMatchingSlot) return false;
      }

      return true;
    });
  };

  const filteredStudents = getFilteredStudents();

  // Get counts for each category
  const getCategoryCounts = () => {
    const counts = {
      weekday: 0,
      weekend: 0,
      unassigned: 0,
    };

    students.forEach((student) => {
      if (!student?.academic) return;

      let sessionTimes = [];
      if (
        student.academic.enrollments &&
        Array.isArray(student.academic.enrollments)
      ) {
        sessionTimes = student.academic.enrollments.map((e) => e.session_time);
      } else if (student.academic.time) {
        sessionTimes = [student.academic.time];
      }

      if (sessionTimes.length === 0) {
        counts.unassigned++;
        return;
      }

      const hasWeekday = sessionTimes.some(
        (time) => getSessionCategory(time) === "weekday",
      );
      const hasWeekend = sessionTimes.some(
        (time) => getSessionCategory(time) === "weekend",
      );

      if (hasWeekday) counts.weekday++;
      if (hasWeekend) counts.weekend++;
    });

    return counts;
  };

  // Get time slot counts
  const getTimeSlotCounts = () => {
    const counts = {
      early: 0,
      late: 0,
      morning: 0,
      afternoon: 0,
    };

    students.forEach((student) => {
      if (!student?.academic) return;

      let sessionTimes = [];
      if (
        student.academic.enrollments &&
        Array.isArray(student.academic.enrollments)
      ) {
        sessionTimes = student.academic.enrollments.map((e) => e.session_time);
      } else if (student.academic.time) {
        sessionTimes = [student.academic.time];
      }

      // Get unique time slots for this student
      const uniqueSlots = new Set();
      sessionTimes.forEach((time) => {
        const slot = getSessionSlot(time);
        if (slot !== "unassigned") {
          uniqueSlots.add(slot);
        }
      });

      // Count each unique slot once per student
      uniqueSlots.forEach((slot) => {
        if (counts[slot] !== undefined) {
          counts[slot]++;
        }
      });
    });

    return counts;
  };

  const counts = getCategoryCounts();
  const slotCounts = getTimeSlotCounts();

  // Get available time slots based on selected session type
  const availableTimeSlots = getAvailableTimeSlots(sessionFilter);

  // Reset time slot filter when session type changes
  const handleSessionFilterChange = (value) => {
    setSessionFilter(value);
    setTimeSlotFilter("all"); // Reset time slot when session type changes
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

      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="fw-bold mb-1">Session Type</label>
          <select
            className="form-select"
            value={sessionFilter}
            onChange={(e) => handleSessionFilterChange(e.target.value)}
          >
            <option value="all">All Sessions ({students.length})</option>
            <option value="weekday">Weekday ({counts.weekday})</option>
            <option value="weekend">Weekend ({counts.weekend})</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="fw-bold mb-1">Time Slot</label>
          <select
            className="form-select"
            value={timeSlotFilter}
            onChange={(e) => setTimeSlotFilter(e.target.value)}
          >
            <option value="all">All Slots</option>
            {availableTimeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label} ({slotCounts[slot.value] || 0})
              </option>
            ))}
          </select>
          {sessionFilter !== "all" && (
            <small className="text-muted">
              {sessionFilter === "weekday" ? "Weekday" : "Weekend"} options only
            </small>
          )}
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSessionFilter("all");
              setTimeSlotFilter("all");
            }}
          >
            Clear Filters
          </button>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <div className="w-100 text-end">
            <span className="badge bg-primary me-1">
              Weekday: {counts.weekday}
            </span>
            <span className="badge bg-success me-1">
              Weekend: {counts.weekend}
            </span>
            <span className="badge bg-secondary">
              Unassigned: {counts.unassigned}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-2">
            <span className="fw-bold me-2">Quick Filter:</span>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                setSessionFilter("weekday");
                setTimeSlotFilter("early");
              }}
            >
              Weekday Early
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                setSessionFilter("weekday");
                setTimeSlotFilter("late");
              }}
            >
              Weekday Late
            </button>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => {
                setSessionFilter("weekend");
                setTimeSlotFilter("morning");
              }}
            >
              Weekend Morning
            </button>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => {
                setSessionFilter("weekend");
                setTimeSlotFilter("afternoon");
              }}
            >
              Weekend Afternoon
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setSessionFilter("all");
                setTimeSlotFilter("all");
              }}
            >
              Reset
            </button>
          </div>
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
            {filteredStudents?.length > 0 ? (
              filteredStudents.map((student, idx) => (
                <React.Fragment key={student._id}>
                  <tr>
                    <td className="border h6 text-center align-middle">
                      {filteredStudents?.length - idx}
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
                      {getDepartmentDisplay(student?.academic)}
                    </td>
                    <td className="border text-center align-middle">
                      {getTimeDisplay(student?.academic)}
                    </td>
                    <td className="border text-center align-middle">
                      {getClassDisplay(student?.academic)}
                    </td>
                    <td className="border text-center align-middle">
                      £{student?.monthly_fee}
                    </td>
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
                <td colSpan={9}>
                  <h5 className="text-center my-2">
                    {students.length === 0
                      ? "No students available."
                      : "No students match the selected filters."}
                  </h5>
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
            <button
              className="btn btn-sm btn-info text-nowrap"
              disabled={reportLoading}
              onClick={() => handleGenerateReport(activeRow)}
            >
              Generate Report
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
