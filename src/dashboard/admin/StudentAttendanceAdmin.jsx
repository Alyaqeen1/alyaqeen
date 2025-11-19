import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCircle,
  FaTrashAlt,
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
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useGetHolidaysQuery } from "../../redux/features/holidays/holidaysApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

const dayMap = {
  weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
  weekend: ["Saturday", "Sunday"],
};

// Safe format function to prevent invalid date errors - moved to top
const safeFormat = (date, formatStr) => {
  if (!date || !isValid(date)) return "Invalid Date";
  try {
    return format(date, formatStr);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

export default function StudentAttendanceAdmin() {
  /* ─────────────────── state for filters ─────────────────── */
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [time, setTime] = useState("");
  const [classId, setClassId] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);

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

  const { data: holidays = [] } = useGetHolidaysQuery();
  const holidaySet = useMemo(
    () => new Set(holidays.map((h) => h.date)),
    [holidays]
  );

  /* ───────────────────  RTK‑Query data  ─────────────────── */
  const { data: departments = [], isLoading: isLoadingDept } =
    useGetDepartmentsQuery();
  const { data: classes = [], isLoading: isLoadingClass } =
    useGetClassesQuery();

  const {
    data: group,
    isLoading: isLoadingGroup,
    isFetching: isFetchingGroup,
  } = useGetClassByParamsQuery(
    department && classId && session && time
      ? { dept_id: department, class_id: classId, session, time }
      : skipToken
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
    [weekOffset]
  );

  // Get all days of the week
  const allWeekDates = useMemo(
    () => Array.from({ length: 7 }).map((_, idx) => addDays(baseMonday, idx)),
    [baseMonday]
  );

  // Filter to only show days for the selected session
  const weekDates = useMemo(
    () =>
      allWeekDates.filter((date) => {
        const dayName = safeFormat(date, "EEEE");
        return session ? dayMap[session]?.includes(dayName) : false;
      }),
    [allWeekDates, session]
  );

  // Get date range for the current week view
  const dateRange = useMemo(() => {
    if (weekDates.length === 0) return { startDate: "", endDate: "" };

    const dates = weekDates.map((date) => safeFormat(date, "yyyy-MM-dd"));
    return {
      startDate: dates[0],
      endDate: dates[dates.length - 1],
    };
  }, [weekDates]);

  // Get student IDs for filtered query
  const studentIds = useMemo(() => {
    return students.map((student) => student._id);
  }, [students]);

  // Check if all filters are selected
  const areAllFiltersSelected = department && session && time && classId;

  // Fetch only the necessary attendance data
  const {
    data: attendances = [],
    isLoading: isLoadingAttendance,
    isFetching: isFetchingAttendance,
  } = useGetFilteredAttendancesQuery(
    areAllFiltersSelected && studentIds.length > 0 && dateRange.startDate
      ? {
          studentIds: studentIds.join(","),
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }
      : skipToken,
    {
      // Skip refetching on focus to prevent unnecessary loading states
      refetchOnFocus: false,
    }
  );

  // Bulk attendance mutations
  const [presentAllStudents] = usePresentAllStudentsMutation();
  const [removeAllAttendance] = useRemoveAllAttendanceMutation();

  // Individual attendance mutations
  const [addAttendance] = useAddAttendanceMutation();
  const [updateAttendance] = useUpdateAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  // Effect to track initial loading state only when filters change
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

    // Only set loading to false when we have all the data and no ongoing operations
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

  // Check if current view is the current week
  const isCurrentWeek = isSameWeek(baseMonday, new Date(), { weekStartsOn: 1 });

  // Get week display text safely
  const weekDisplayText = useMemo(() => {
    if (weekDates.length === 0) return "No dates to display";

    const firstDate = weekDates[0];
    const lastDate = weekDates[weekDates.length - 1];

    if (!firstDate || !lastDate) return "Invalid dates";

    return `${safeFormat(firstDate, "MMM dd")} - ${safeFormat(
      lastDate,
      "MMM dd, yyyy"
    )}`;
  }, [weekDates]);

  /* ─────────────────── local UI state for hover ─────────────────── */
  const [hoverKey, setHoverKey] = useState(null);

  /* ─────────────────── CRUD helpers ─────────────────── */
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
      html: `Are you sure you want to mark all <strong>${
        students.length
      }</strong> students as present for <strong>${safeFormat(
        new Date(dateISO),
        "EEEE, MMMM dd, yyyy"
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
              `Marked ${result.insertedCount} students as present`
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
        "EEEE, MMMM dd, yyyy"
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
              `Removed ${result.deletedCount} attendance records`
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

  if (isLoadingDept || isLoadingClass) {
    return <LoadingSpinnerDash />;
  }

  /* ─────────────────── render ─────────────────── */
  return (
    <div>
      {/* ── TOP BAR ─────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center my-2">
        <h3>Student Attendance</h3>
        <div className="d-flex align-items-center gap-2">
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
              backgroundColor: isCurrentWeek
                ? "var(--border2)"
                : "var(--border2)",
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
          {/* Dept */}
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
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.dept_name}
                </option>
              ))}
            </select>
          </div>
          {/* Session */}
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
          {/* Session time */}
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
          {/* Class */}
          <div className="col-md-3">
            <label className="form-label">Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="form-control"
              style={{ borderColor: "var(--border2)" }}
            >
              <option value="">Select Class</option>
              {classes
                .filter(
                  (c) =>
                    c.dept_id === department &&
                    c.session === session &&
                    c.session_time === time
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
            <span className="bg-danger  px-2 rounded-1 mx-2" /> Absent
          </div>
          <div className="text-muted">
            Students: {students.length} | Dates: {weekDates.length}
          </div>
        </div>

        {/* Show loading spinner only during initial filter loading */}
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
            <table
              className="table mb-0"
              style={{
                minWidth: 700,
              }}
            >
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
                            title={`Mark all present for ${safeFormat(
                              d,
                              "MMM dd"
                            )}`}
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
                </tr>
              </thead>

              <tbody>
                {students?.length ? (
                  students?.map((stu, idx) => (
                    <tr key={stu._id}>
                      <td className="text-center border align-middle">
                        {idx + 1}
                      </td>
                      <td className="text-center border align-middle">
                        {stu.name}
                      </td>

                      {weekDates.map((date) => {
                        const dateISO = safeFormat(date, "yyyy-MM-dd");
                        const cellKey = `${stu._id}-${dateISO}`;
                        const isHoliday = holidaySet.has(dateISO);
                        const isLoading = loadingCells.has(cellKey);

                        // Find attendance record from filtered attendance data
                        const record = attendances?.find(
                          (a) => a.student_id === stu._id && a.date === dateISO
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
                                {/* Content for non-hover state */}
                                {!status && hoverKey !== cellKey && (
                                  <span>&nbsp;</span>
                                )}

                                {/* Hover elements - only show for this specific cell */}
                                {hoverKey === cellKey && (
                                  <>
                                    {/* Show status buttons in center when no status is set */}
                                    {!status && (
                                      <div className="d-flex justify-content-center gap-1">
                                        <button
                                          style={{
                                            width: 25,
                                            height: 25,
                                          }}
                                          className="btn btn-sm btn-success"
                                          onClick={() =>
                                            saveStatus(
                                              stu._id,
                                              dateISO,
                                              "present"
                                            )
                                          }
                                        />
                                        <button
                                          style={{
                                            width: 25,
                                            height: 25,
                                          }}
                                          className="btn btn-sm btn-primary border border-white"
                                          onClick={() =>
                                            saveStatus(stu._id, dateISO, "late")
                                          }
                                        />
                                        <button
                                          style={{
                                            width: 25,
                                            height: 25,
                                          }}
                                          className="btn btn-sm btn-danger border border-white"
                                          onClick={() =>
                                            saveStatus(
                                              stu._id,
                                              dateISO,
                                              "absent"
                                            )
                                          }
                                        />
                                      </div>
                                    )}

                                    {/* Show trash and update buttons when status exists */}
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
                                              dateISO
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
                                                dateISO
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
                                                dateISO
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
                                                dateISO
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={weekDates.length + 2} className="text-center">
                      No students found for the selected class.
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
