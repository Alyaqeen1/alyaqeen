import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCircle,
  FaTrashAlt,
  FaStar,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  format,
  addWeeks,
  startOfWeek,
  addDays,
  isSameWeek,
  isValid,
} from "date-fns";
import { skipToken } from "@reduxjs/toolkit/query";

import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import {
  useGetClassByParamsQuery,
  useGetClassesQuery,
} from "../../redux/features/classes/classesApi";
import { useGetStudentsByGroupQuery } from "../../redux/features/students/studentsApi";

import {
  useAddAttendanceMutation,
  useGetFilteredAttendancesQuery,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  usePresentAllStudentsMutation,
  useRemoveAllAttendanceMutation,
} from "../../redux/features/attendances/attendancesApi";
import { useAddMeritMutation } from "../../redux/features/merits/meritsApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  useGetTeacherByEmailQuery,
  useGetTeacherWithDetailsQuery,
} from "../../redux/features/teachers/teachersApi";
import useAuth from "../../hooks/useAuth";
import { useGetHolidaysQuery } from "../../redux/features/holidays/holidaysApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

// Merit/Demerit Modal Component
const MeritDemeritModal = ({
  isOpen,
  onClose,
  student,
  teacherId,
  onSuccess,
}) => {
  const [selectedType, setSelectedType] = useState("merit"); // "merit" or "demerit"
  const [selectedReason, setSelectedReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addMerit] = useAddMeritMutation();

  // Behavior options (Merits)
  const behaviorOptions = [
    { label: "Excellent Homework (1)", value: "Excellent Homework", points: 1 },
    {
      label: "Excellent Classwork (1)",
      value: "Excellent Classwork",
      points: 1,
    },
    { label: "Excellent Conduct (2)", value: "Excellent Conduct", points: 2 },
    {
      label: "Excellent Punctuality (2)",
      value: "Excellent Punctuality",
      points: 2,
    },
    { label: "Excellent Manners (2)", value: "Excellent Manners", points: 2 },
    { label: "Correct Equipment (2)", value: "Correct Equipment", points: 2 },
    {
      label: "Helping students with sabaq (3)",
      value: "Helping students with sabaq",
      points: 3,
    },
    { label: "Helping Staff (3)", value: "Helping Staff", points: 3 },
    {
      label: "Perfect in all aspects (4)",
      value: "Perfect in all aspects",
      points: 4,
    },
    {
      label: "Treating staff respectfully (2)",
      value: "Treating staff respectfully",
      points: 2,
    },
  ];

  // Incident categories (Demerits)
  const incidentCategories = {
    lesson_class: [
      {
        label: "Not Reading loudly (-1)",
        value: "Not Reading loudly",
        points: -1,
      },
      {
        label: "Not Reciting/Practicing when told to (-2)",
        value: "Not Reciting/Practicing when told to",
        points: -2,
      },
      {
        label: "Not Memorizing Duas (-2)",
        value: "Not Memorizing Duas",
        points: -2,
      },
      {
        label: "Not paying attention when the lesson explained (-2)",
        value: "Not paying attention when the lesson explained",
        points: -2,
      },
      {
        label: "Of task not focussing (-1)",
        value: "Of task not focussing",
        points: -1,
      },
      {
        label: "Quran/Book Disruption (-1)",
        value: "Quran/Book Disruption",
        points: -1,
      },
      { label: "No Book (-2)", value: "No Book", points: -2 },
      {
        label: "No Equipment/Stationary (-1)",
        value: "No Equipment/Stationary",
        points: -1,
      },
      { label: "No Homework (-1)", value: "No Homework", points: -1 },
      { label: "Inadequate Work (-2)", value: "Inadequate Work", points: -2 },
      {
        label: "Poor / Inadequate Uniform (-2)",
        value: "Poor / Inadequate Uniform",
        points: -2,
      },
      {
        label: "Moving seats without permission (-1)",
        value: "Moving seats without permission",
        points: -1,
      },
    ],
    misbehavior: [
      {
        label: "Disrespecting to anyone (-1)",
        value: "Disrespecting to anyone",
        points: -1,
      },
      {
        label: "Bad behavior (Disruption) (-1)",
        value: "Bad behavior (Disruption)",
        points: -1,
      },
      {
        label: "Shouting in Corridor (-1)",
        value: "Shouting in Corridor",
        points: -1,
      },
      {
        label: "Dishonesty/Cheating (-3)",
        value: "Dishonesty/Cheating",
        points: -3,
      },
      { label: "Rude to staff (-3)", value: "Rude to staff", points: -3 },
      {
        label: "Answering back to the teacher (-3)",
        value: "Answering back to the teacher",
        points: -3,
      },
      {
        label: "Promoting bad behaviour (-4)",
        value: "Promoting bad behaviour",
        points: -4,
      },
    ],
    safety: [
      { label: "Shoe Safety (-2)", value: "Shoe Safety", points: -2 },
      {
        label: "Bag Safety (Bags stored in an unsafe place) (-1)",
        value: "Bag Safety (Bags stored in an unsafe place)",
        points: -1,
      },
      {
        label: "Bringing fizzy drinks (-1)",
        value: "Bringing fizzy drinks",
        points: -1,
      },
      { label: "Out of Bounds (-2)", value: "Out of Bounds", points: -2 },
      { label: "Play fighting (-2)", value: "Play fighting", points: -2 },
      {
        label: "Running in Corridor (-2)",
        value: "Running in Corridor",
        points: -2,
      },
      {
        label: "Misbehaving in Corridor (Disruption) (-2)",
        value: "Misbehaving in Corridor (Disruption)",
        points: -2,
      },
      {
        label: "Disruption Outside Academy (-2)",
        value: "Disruption Outside Academy",
        points: -2,
      },
      {
        label: "Using a Mobile phone (-5)",
        value: "Using a Mobile phone",
        points: -5,
      },
    ],
    punctuality: [
      { label: "Late to Class (-2)", value: "Late to Class", points: -2 },
      { label: "Late to Salaah (-2)", value: "Late to Salaah", points: -2 },
      { label: "Late to Academy (-1)", value: "Late to Academy", points: -1 },
      {
        label: "Non Attendance to Detention (-2)",
        value: "Non Attendance to Detention",
        points: -2,
      },
    ],
    bullying: [
      { label: "Name Calling (-2)", value: "Name Calling", points: -2 },
      {
        label: "Verbal harassment or Swearing (-5)",
        value: "Verbal harassment or Swearing",
        points: -5,
      },
      {
        label: "Emotional bullying (-5)",
        value: "Emotional bullying",
        points: -5,
      },
      { label: "Group bullying (-4)", value: "Group bullying", points: -4 },
      {
        label: "Fighting around in class (-5)",
        value: "Fighting around in class",
        points: -5,
      },
      {
        label: "Physical violence or Fighting (-10)",
        value: "Physical violence or Fighting",
        points: -10,
      },
    ],
    off_task: [
      {
        label: "Not Following Instruction (-2)",
        value: "Not Following Instruction",
        points: -2,
      },
      {
        label: "Eating in lesson time (-1)",
        value: "Eating in lesson time",
        points: -1,
      },
      { label: "Chewing Gum (-1)", value: "Chewing Gum", points: -1 },
      {
        label: "Breaktime Disruption (-1)",
        value: "Breaktime Disruption",
        points: -1,
      },
      {
        label: "Salaah Disruption (-1)",
        value: "Salaah Disruption",
        points: -1,
      },
      {
        label: "Damage the Property/Desk or bench (-4)",
        value: "Damage the Property/Desk or bench",
        points: -4,
      },
    ],
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error("Please select a reason");
      return;
    }

    setIsSubmitting(true);

    let payload;
    if (selectedType === "merit") {
      const merit = behaviorOptions.find((b) => b.value === selectedReason);
      payload = {
        student_id: student._id,
        teacher_id: teacherId,
        behavior: selectedReason,
        incident: "",
        merit_points: merit?.points || 0,
        date: new Date().toISOString(),
      };
    } else {
      // Find which category the incident belongs to
      let incidentPoints = 0;
      for (const category in incidentCategories) {
        const incident = incidentCategories[category].find(
          (i) => i.value === selectedReason,
        );
        if (incident) {
          incidentPoints = incident.points;
          break;
        }
      }
      payload = {
        student_id: student._id,
        teacher_id: teacherId,
        behavior: "",
        incident: selectedReason,
        merit_points: incidentPoints,
        date: new Date().toISOString(),
      };
    }

    try {
      const data = await addMerit(payload).unwrap();
      if (data?.insertedId) {
        toast.success(
          `${selectedType === "merit" ? "Merit" : "Demerit"} given successfully!`,
        );
        onSuccess();
        onClose();
        setSelectedReason("");
        setSelectedType("merit");
      }
    } catch (error) {
      console.error("Error saving merit/demerit:", error);
      toast.error("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {selectedType === "merit" ? "Give Merit to" : "Give Demerit to"}{" "}
              {student?.name}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Type Selection */}
            <div className="mb-3">
              <label className="form-label fw-bold">Type</label>
              <div className="d-flex gap-3">
                <button
                  className={`btn ${selectedType === "merit" ? "btn-success" : "btn-outline-success"}`}
                  onClick={() => {
                    setSelectedType("merit");
                    setSelectedReason("");
                  }}
                >
                  <FaStar className="me-1" /> Merit (Positive)
                </button>
                <button
                  className={`btn ${selectedType === "demerit" ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => {
                    setSelectedType("demerit");
                    setSelectedReason("");
                  }}
                >
                  <FaExclamationTriangle className="me-1" /> Demerit (Negative)
                </button>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                {selectedType === "merit"
                  ? "Select Behavior"
                  : "Select Incident"}
              </label>
              {selectedType === "merit" ? (
                <select
                  className="form-select"
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                >
                  <option value="">Choose behavior...</option>
                  {behaviorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="row">
                  {Object.entries(incidentCategories).map(
                    ([category, incidents]) => (
                      <div key={category} className="col-md-6 mb-3">
                        <label className="form-label text-capitalize fw-bold">
                          {category.replace("_", " ")}
                        </label>
                        <select
                          className="form-select"
                          value={selectedReason}
                          onChange={(e) => setSelectedReason(e.target.value)}
                        >
                          <option value="">
                            Select from {category.replace("_", " ")}...
                          </option>
                          {incidents.map((incident) => (
                            <option key={incident.value} value={incident.value}>
                              {incident.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn ${selectedType === "merit" ? "btn-success" : "btn-danger"}`}
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
            >
              {isSubmitting
                ? "Submitting..."
                : `Give ${selectedType === "merit" ? "Merit" : "Demerit"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Safe format function to prevent invalid date errors
const safeFormat = (date, formatStr) => {
  if (!date || !isValid(date)) return "Invalid Date";
  try {
    return format(date, formatStr);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

export default function StudentAttendance() {
  /* ─────────────────── state for filters ─────────────────── */
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [time, setTime] = useState("");
  const [classId, setClassId] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Track initial load vs real-time updates
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingCells, setLoadingCells] = useState(new Set());
  const [bulkLoadingDates, setBulkLoadingDates] = useState(new Set());

  // Track filter changes
  const prevFilters = useRef({
    department,
    session,
    time,
    classId,
    weekOffset,
  });

  const { user } = useAuth();
  const { data: holidays = [] } = useGetHolidaysQuery();
  const holidaySet = useMemo(
    () => new Set(holidays.map((h) => h.date)),
    [holidays],
  );

  const { data: teacher } = useGetTeacherByEmailQuery(user?.email, {
    skip: !user?.email,
  });
  const { data: teacherWithDetails } = useGetTeacherWithDetailsQuery(
    teacher?._id,
    {
      skip: !teacher?._id,
    },
  );

  /* ───────────────────  RTK‑Query data  ─────────────────── */
  const {
    data: group,
    isLoading: isLoadingGroup,
    isFetching: isFetchingGroup,
  } = useGetClassByParamsQuery(
    department && classId && session && time
      ? { dept_id: department, class_id: classId, session, time }
      : skipToken,
  );

  const groupId = group?._id;
  const {
    data: students = [],
    isLoading: isLoadingStudents,
    isFetching: isFetchingStudents,
  } = useGetStudentsByGroupQuery(groupId, {
    skip: !groupId,
  });

  /* ─────────────────── helper: current week dates ─────────────────── */
  const baseMonday = useMemo(
    () => addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset),
    [weekOffset],
  );

  const allWeekDates = useMemo(
    () => Array.from({ length: 7 }).map((_, idx) => addDays(baseMonday, idx)),
    [baseMonday],
  );

  const weekDates = useMemo(() => {
    const dayMap = {
      weekdays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Saturday",
        "Sunday",
      ],
      weekend: ["Saturday", "Sunday"],
    };
    return allWeekDates.filter((date) => {
      const dayName = safeFormat(date, "EEEE");
      return session ? dayMap[session]?.includes(dayName) : false;
    });
  }, [allWeekDates, session]);

  const dateRange = useMemo(() => {
    if (weekDates.length === 0) return { startDate: "", endDate: "" };
    const dates = weekDates.map((date) => safeFormat(date, "yyyy-MM-dd"));
    return {
      startDate: dates[0],
      endDate: dates[dates.length - 1],
    };
  }, [weekDates]);

  const studentIds = useMemo(
    () => students.map((student) => student._id),
    [students],
  );
  const areAllFiltersSelected = department && session && time && classId;

  const {
    data: attendanceData = { attendance: [], meritStats: {} },
    isLoading: isLoadingAttendance,
    isFetching: isFetchingAttendance,
  } = useGetFilteredAttendancesQuery(
    areAllFiltersSelected && studentIds.length > 0 && dateRange.startDate
      ? {
          studentIds: studentIds.join(","),
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          classId: classId,
        }
      : skipToken,
    {
      refetchOnFocus: false,
    },
  );

  // Then use the data:
  const attendances = attendanceData.attendance || [];
  const meritStats = attendanceData.meritStats || {};

  console.log({ attendanceData, attendances, meritStats });
  // Bulk attendance mutations
  const [presentAllStudents] = usePresentAllStudentsMutation();
  const [removeAllAttendance] = useRemoveAllAttendanceMutation();

  // Individual attendance mutations
  const [addAttendance] = useAddAttendanceMutation();
  const [updateAttendance] = useUpdateAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  // Effect to track initial loading state
  useEffect(() => {
    const currentFilters = { department, session, time, classId, weekOffset };
    const filtersChanged =
      prevFilters.current.department !== department ||
      prevFilters.current.session !== session ||
      prevFilters.current.time !== time ||
      prevFilters.current.classId !== classId ||
      prevFilters.current.weekOffset !== weekOffset;

    if (filtersChanged && areAllFiltersSelected) {
      setIsInitialLoading(true);
      prevFilters.current = currentFilters;
    }

    if (
      areAllFiltersSelected &&
      !isFetchingGroup &&
      !isFetchingStudents &&
      !isFetchingAttendance &&
      !isLoadingGroup &&
      !isLoadingStudents &&
      !isLoadingAttendance
    ) {
      setIsInitialLoading(false);
    }
  }, [
    department,
    session,
    time,
    classId,
    weekOffset,
    areAllFiltersSelected,
    isFetchingGroup,
    isFetchingStudents,
    isFetchingAttendance,
    isLoadingGroup,
    isLoadingStudents,
    isLoadingAttendance,
  ]);

  const isCurrentWeek = isSameWeek(baseMonday, new Date(), { weekStartsOn: 1 });
  const weekDisplayText = useMemo(() => {
    if (weekDates.length === 0) return "No dates to display";
    const firstDate = weekDates[0];
    const lastDate = weekDates[weekDates.length - 1];
    if (!firstDate || !lastDate) return "Invalid dates";
    return `${safeFormat(firstDate, "MMM dd")} - ${safeFormat(lastDate, "MMM dd, yyyy")}`;
  }, [weekDates]);

  const [hoverKey, setHoverKey] = useState(null);

  /* ─────────────────── CRUD helpers for attendance ─────────────────── */
  const saveStatus = async (studentId, dateISO, status) => {
    const cellKey = `${studentId}-${dateISO}`;
    setLoadingCells((prev) => new Set(prev).add(cellKey));

    try {
      const data = await addAttendance({
        class_id: groupId,
        student_id: studentId,
        date: dateISO,
        status,
        attendance: "student",
      }).unwrap();
      if (data?.insertedId) {
        toast.success(`${status} attendance given`);
      }
    } catch (e) {
      console.error("Error saving attendance:", e);
      toast.error("Failed to save attendance");
    } finally {
      setLoadingCells((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }
  };

  const changeStatus = async (recordId, status, studentId, dateISO) => {
    const cellKey = `${studentId}-${dateISO}`;
    setLoadingCells((prev) => new Set(prev).add(cellKey));

    try {
      const data = await updateAttendance({ id: recordId, status }).unwrap();
      if (data?.modifiedCount) {
        toast.success(`updated to ${status}`);
      }
    } catch (e) {
      console.error("Error updating attendance:", e);
      toast.error("Failed to update attendance");
    } finally {
      setLoadingCells((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }
  };

  const removeStatus = async (recordId, studentId, dateISO) => {
    const cellKey = `${studentId}-${dateISO}`;

    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingCells((prev) => new Set(prev).add(cellKey));
        try {
          await deleteAttendance(recordId).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "Your Attendance has been deleted.",
            icon: "success",
          });
        } catch (e) {
          console.error("Error deleting attendance:", e);
          toast.error("Failed to delete attendance");
        } finally {
          setLoadingCells((prev) => {
            const newSet = new Set(prev);
            newSet.delete(cellKey);
            return newSet;
          });
        }
      }
    });
  };

  /* ─────────────────── BULK OPERATIONS ─────────────────── */
  const handlePresentAll = async (dateISO) => {
    if (!studentIds.length || !classId) {
      toast.error("No students found or class not selected");
      return;
    }

    Swal.fire({
      title: "Mark All as Present?",
      html: `Are you sure you want to mark all <strong>${students.length}</strong> students as present for <strong>${safeFormat(
        new Date(dateISO),
        "EEEE, MMMM dd, yyyy",
      )}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark all present!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setBulkLoadingDates((prev) => new Set(prev).add(dateISO));
        try {
          const result = await presentAllStudents({
            studentIds: studentIds,
            classId: classId,
            date: dateISO,
          }).unwrap();

          toast.success(
            result.message ||
              `Marked ${result.insertedCount} students as present`,
          );
        } catch (e) {
          console.error("Error marking all present:", e);
          toast.error("Failed to mark all students as present");
        } finally {
          setBulkLoadingDates((prev) => {
            const newSet = new Set(prev);
            newSet.delete(dateISO);
            return newSet;
          });
        }
      }
    });
  };

  const handleRemoveAll = async (dateISO) => {
    if (!classId) {
      toast.error("Class not selected");
      return;
    }

    Swal.fire({
      title: "Remove All Attendance?",
      html: `Are you sure you want to remove all attendance records for <strong>${safeFormat(
        new Date(dateISO),
        "EEEE, MMMM dd, yyyy",
      )}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove all!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setBulkLoadingDates((prev) => new Set(prev).add(dateISO));
        try {
          const result = await removeAllAttendance({
            classId: classId,
            date: dateISO,
          }).unwrap();

          toast.success(
            result.message ||
              `Removed ${result.deletedCount} attendance records`,
          );
        } catch (e) {
          console.error("Error removing all attendance:", e);
          toast.error("Failed to remove all attendance");
        } finally {
          setBulkLoadingDates((prev) => {
            const newSet = new Set(prev);
            newSet.delete(dateISO);
            return newSet;
          });
        }
      }
    });
  };

  /* ─────────────────── Merit/Demerit Handlers ─────────────────── */
  const handleOpenMeritModal = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleMeritSuccess = () => {
    // Refresh any data if needed
    // You could refetch student merits data here if you have a query for that
  };

  if (!teacherWithDetails) {
    return <LoadingSpinnerDash />;
  }

  /* ─────────────────── render ─────────────────── */
  return (
    <div>
      {/* Merit/Demerit Modal */}
      {modalOpen && selectedStudent && (
        <MeritDemeritModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          teacherId={teacher?._id}
          onSuccess={handleMeritSuccess}
        />
      )}

      {/* ── TOP BAR ─────────────────────────────────── */}
      <div className="row my-2">
        <h3 className="col-md-6">Student Attendance & Behavior Management</h3>
        <div className="col-md-6 d-flex justify-content-end align-items-center gap-2">
          <span className="text-muted">Week: {weekDisplayText}</span>
          <button
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
            onClick={() => setWeekOffset((p) => p - 1)}
          >
            <FaArrowLeft />
          </button>
          <button
            style={{
              backgroundColor: "var(--border2)",
              cursor: isCurrentWeek ? "default" : "pointer",
            }}
            className="btn text-white mx-1"
            disabled={isCurrentWeek}
            onClick={() => !isCurrentWeek && setWeekOffset(0)}
          >
            <FaCircle />
          </button>
          <button
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
            onClick={() => setWeekOffset((p) => p + 1)}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* ── FILTERS ─────────────────────────────────── */}
      <div className="border border-black p-3">
        <div className="row align-items-center">
          <div className="col-md-3">
            <label className="form-label">Departments:</label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setClassId("");
              }}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
            >
              <option value="">Select Department</option>
              {teacherWithDetails?.departments_info?.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.dept_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Session</label>
            <select
              value={session}
              onChange={(e) => {
                setSession(e.target.value);
                setTime("");
              }}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
            >
              <option value="">Select Session</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekend">Weekend</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Session Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
            >
              <option value="">Select Session Time</option>
              {session === "weekdays" && (
                <>
                  <option value="S1">Early - 4:30 PM – 6:00 PM (1½ hrs)</option>
                  <option value="S2">Late - 5:45 PM – 7:15 PM (1½ hrs)</option>
                </>
              )}
              {session === "weekend" && (
                <>
                  <option value="WM">
                    Morning - 10:00 AM – 12:30 PM (2½ hrs)
                  </option>
                  <option value="WA">
                    Afternoon - 12:30 PM – 2:30 PM (2 hrs)
                  </option>
                </>
              )}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
            >
              <option value="">Select Class</option>
              {teacherWithDetails?.classes_info
                ?.filter(
                  (c) =>
                    c.dept_id === department &&
                    c.session === session &&
                    c.session_time === time,
                )
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.class_name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── ATTENDANCE TABLE ────────────────────────── */}
      <div className="border border-black mt-4 p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="bg-success px-2 rounded-1 mx-2" /> Present
            <span className="bg-primary px-2 rounded-1 mx-2" /> Late
            <span className="bg-danger px-2 rounded-1 mx-2" /> Absent
            {/* <span className="bg-warning px-2 rounded-1 mx-2" />
            <FaStar className="text-white" /> Merit
            <span
              className="bg-danger px-2 rounded-1 mx-2"
              style={{ backgroundColor: "#dc3545" }}
            >
              <FaExclamationTriangle className="text-white" /> Demerit
            </span> */}
          </div>
          <div className="text-muted">
            Students: {students.length} | Dates: {weekDates.length}
          </div>
        </div>

        {!areAllFiltersSelected ? (
          <div className="text-center py-4">
            <p className="text-muted">
              Please select all filters to view attendance
            </p>
          </div>
        ) : isInitialLoading ? (
          <div className="text-center py-4">
            <LoadingSpinnerDash />
            <p className="mt-2">Loading attendance data...</p>
          </div>
        ) : (
          <div className="table-responsive mb-3">
            <table className="table mb-0" style={{ minWidth: 800 }}>
              <thead>
                <tr>
                  <th
                    style={{ backgroundColor: "var(--border2)" }}
                    className="text-white text-center border"
                  >
                    #
                  </th>
                  <th
                    style={{ backgroundColor: "var(--border2)" }}
                    className="text-white text-center border"
                  >
                    Student Name
                  </th>
                  <th
                    style={{ backgroundColor: "var(--border2)" }}
                    className="text-white text-center border"
                  >
                    Actions
                  </th>
                  {weekDates.map((d) => {
                    const dateISO = safeFormat(d, "yyyy-MM-dd");
                    const isBulkLoading = bulkLoadingDates.has(dateISO);

                    return (
                      <th
                        key={dateISO}
                        style={{ backgroundColor: "var(--border2)" }}
                        className="text-white text-center border"
                      >
                        <div>{safeFormat(d, "EEEE")}</div>
                        <div>{safeFormat(d, "dd-MM-yyyy")}</div>
                        <div className="mt-1">
                          <button
                            className="btn btn-success btn-xs me-1"
                            style={{
                              fontSize: "0.7rem",
                              padding: "2px 5px",
                              opacity: isBulkLoading ? 0.6 : 1,
                            }}
                            onClick={() => handlePresentAll(dateISO)}
                            disabled={isBulkLoading}
                            title={`Mark all present for ${safeFormat(d, "MMM dd")}`}
                          >
                            {isBulkLoading ? (
                              <div
                                className="spinner-border spinner-border-sm"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            ) : (
                              "All"
                            )}
                          </button>
                          <button
                            className="btn btn-danger btn-xs"
                            style={{
                              fontSize: "0.7rem",
                              padding: "2px 5px",
                              opacity: isBulkLoading ? 0.6 : 1,
                            }}
                            onClick={() => handleRemoveAll(dateISO)}
                            disabled={isBulkLoading}
                            title={`Remove all for ${safeFormat(d, "MMM dd")}`}
                          >
                            {isBulkLoading ? (
                              <div
                                className="spinner-border spinner-border-sm"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            ) : (
                              "×"
                            )}
                          </button>
                        </div>
                      </th>
                    );
                  })}
                  <th
                    style={{ backgroundColor: "var(--border2)" }}
                    className="text-white text-center border"
                  >
                    Merit Summary
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.length ? (
                  students.map((stu, idx) => (
                    <tr key={stu._id}>
                      <td className="text-center border align-middle">
                        {idx + 1}
                      </td>
                      <td className="text-center border align-middle">
                        {stu.name}
                      </td>
                      <td className="text-center border align-middle">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleOpenMeritModal(stu)}
                            title="Give Merit/Demerit"
                          >
                            <FaStar className="me-1" /> Give
                          </button>
                        </div>
                      </td>

                      {weekDates.map((date) => {
                        const dateISO = safeFormat(date, "yyyy-MM-dd");
                        const cellKey = `${stu._id}-${dateISO}`;
                        const isHoliday = holidaySet.has(dateISO);
                        const isLoading = loadingCells.has(cellKey);

                        const record = attendances?.find(
                          (a) => a.student_id === stu._id && a.date === dateISO,
                        );
                        const status = record?.status;

                        const statusColor =
                          status === "present"
                            ? "bg-success"
                            : status === "late"
                              ? "bg-primary"
                              : status === "absent"
                                ? "bg-danger"
                                : "";

                        return (
                          <td
                            key={dateISO}
                            className={`text-center border align-middle position-relative ${
                              status ? statusColor : ""
                            }`}
                            style={{
                              minWidth: 90,
                              backgroundColor: isHoliday ? "#eee" : undefined,
                              color: isHoliday ? "#999" : undefined,
                              cursor:
                                isHoliday || isLoading
                                  ? "not-allowed"
                                  : "pointer",
                              opacity: isHoliday || isLoading ? 0.6 : 1,
                            }}
                            onMouseEnter={() =>
                              !isLoading && setHoverKey(cellKey)
                            }
                            onMouseLeave={() => !isLoading && setHoverKey(null)}
                          >
                            {isLoading ? (
                              <div className="d-flex justify-content-center">
                                <div
                                  className="spinner-border spinner-border-sm text-white"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              </div>
                            ) : isHoliday ? (
                              <span title="Holiday">—</span>
                            ) : (
                              <>
                                {!status && hoverKey !== cellKey && (
                                  <span>&nbsp;</span>
                                )}
                                {hoverKey === cellKey && (
                                  <>
                                    {!status && (
                                      <div className="d-flex justify-content-center gap-1">
                                        <button
                                          style={{ width: 25, height: 25 }}
                                          className="btn btn-sm btn-success"
                                          onClick={() =>
                                            saveStatus(
                                              stu._id,
                                              dateISO,
                                              "present",
                                            )
                                          }
                                        />
                                        <button
                                          style={{ width: 25, height: 25 }}
                                          className="btn btn-sm btn-primary border border-white"
                                          onClick={() =>
                                            saveStatus(stu._id, dateISO, "late")
                                          }
                                        />
                                        <button
                                          style={{ width: 25, height: 25 }}
                                          className="btn btn-sm btn-danger border border-white"
                                          onClick={() =>
                                            saveStatus(
                                              stu._id,
                                              dateISO,
                                              "absent",
                                            )
                                          }
                                        />
                                      </div>
                                    )}
                                    {status && (
                                      <>
                                        <FaTrashAlt
                                          className="position-absolute end-0 me-1 text-white"
                                          style={{
                                            cursor: "pointer",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                          }}
                                          onClick={() =>
                                            record?._id &&
                                            removeStatus(
                                              record._id,
                                              stu._id,
                                              dateISO,
                                            )
                                          }
                                        />
                                        <div className="position-absolute start-0 ms-1 d-flex gap-1">
                                          <button
                                            style={{
                                              width: 15,
                                              height: 15,
                                              borderRadius: 50,
                                            }}
                                            className={`btn btn-xs p-1 border border-white ${
                                              status === "present"
                                                ? "btn-light"
                                                : "btn-success"
                                            }`}
                                            onClick={() =>
                                              changeStatus(
                                                record._id,
                                                "present",
                                                stu._id,
                                                dateISO,
                                              )
                                            }
                                          />
                                          <button
                                            style={{
                                              width: 15,
                                              height: 15,
                                              borderRadius: 50,
                                            }}
                                            className={`btn btn-xs p-1 border border-white ${
                                              status === "late"
                                                ? "btn-light"
                                                : "btn-primary"
                                            }`}
                                            onClick={() =>
                                              changeStatus(
                                                record._id,
                                                "late",
                                                stu._id,
                                                dateISO,
                                              )
                                            }
                                          />
                                          <button
                                            style={{
                                              width: 15,
                                              height: 15,
                                              borderRadius: 50,
                                            }}
                                            className={`btn btn-xs p-1 border border-white ${
                                              status === "absent"
                                                ? "btn-light"
                                                : "btn-danger"
                                            }`}
                                            onClick={() =>
                                              changeStatus(
                                                record._id,
                                                "absent",
                                                stu._id,
                                                dateISO,
                                              )
                                            }
                                          />
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        );
                      })}
                      <td className="text-center border align-middle">
                        {meritStats[stu._id] ? (
                          <div className="d-flex flex-column gap-1">
                            <div className="text-success">
                              👍 +{meritStats[stu._id].totalPositiveMerits} pts
                              <small>
                                {" "}
                                ({meritStats[stu._id].positiveCount})
                              </small>
                            </div>
                            {meritStats[stu._id].totalDemerits > 0 && (
                              <div className="text-danger">
                                👎 -{meritStats[stu._id].totalDemerits} pts
                                <small>
                                  {" "}
                                  ({meritStats[stu._id].demeritCount})
                                </small>
                              </div>
                            )}
                            <div
                              className={`fw-bold ${meritStats[stu._id].netPoints >= 0 ? "text-success" : "text-danger"}`}
                            >
                              Net: {meritStats[stu._id].netPoints} pts
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted">No records</div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={weekDates.length + 3} className="text-center">
                      {areAllFiltersSelected
                        ? "No students found for the selected class."
                        : "Select all filters to view attendance."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
