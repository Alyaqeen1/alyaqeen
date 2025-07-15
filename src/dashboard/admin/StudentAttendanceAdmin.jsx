import React, { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { format, addWeeks, startOfWeek, addDays, isSameWeek } from "date-fns";
import { skipToken } from "@reduxjs/toolkit/query";

import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import {
  useGetClassByParamsQuery,
  useGetClassesQuery,
} from "../../redux/features/classes/classesApi";
import { useGetGroupByParamsQuery } from "../../redux/features/groups/groupsApi";
import { useGetStudentsByGroupQuery } from "../../redux/features/students/studentsApi";

import {
  useAddAttendanceMutation,
  useGetAttendancesQuery,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} from "../../redux/features/attendances/attendancesApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const dayMap = {
  weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
  weekend: ["Saturday", "Sunday"],
};

export default function StudentAttendanceAdmin() {
  /* ─────────────────── state for filters ─────────────────── */
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState(""); // weekdays | weekend
  const [time, setTime] = useState(""); // S1/S2/WM/WA
  const [classId, setClassId] = useState("");
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week
  const { data: attendances } = useGetAttendancesQuery();

  /* ───────────────────  RTK‑Query data  ─────────────────── */
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: classes = [] } = useGetClassesQuery();

  const { data: group } = useGetClassByParamsQuery(
    department && classId && session && time
      ? { dept_id: department, class_id: classId, session, time }
      : skipToken
  );

  // const { data: group } = useGetGroupByParamsQuery(
  //   department && classId && session && time
  //     ? { dept_id: department, class_id: classId, session, time }
  //     : skipToken
  // );

  const groupId = group?._id;
  const { data: students = [] } = useGetStudentsByGroupQuery(groupId, {
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
        const dayName = format(date, "EEEE");
        return session ? dayMap[session].includes(dayName) : false;
      }),
    [allWeekDates, session]
  );

  // Check if current view is the current week
  const isCurrentWeek = isSameWeek(baseMonday, new Date(), { weekStartsOn: 1 });

  /* ─────────────────── attendance mutations ─────────────────── */
  const [addAttendance] = useAddAttendanceMutation(); // POST
  const [updateAttendance] = useUpdateAttendanceMutation(); // PATCH
  const [deleteAttendance] = useDeleteAttendanceMutation(); // DELETE

  /* ─────────────────── local UI state for hover ─────────────────── */
  const [hoverKey, setHoverKey] = useState(null); // `${studentId}-${dateISO}`

  /* ─────────────────── CRUD helpers ─────────────────── */
  const saveStatus = async (studentId, dateISO, status) => {
    try {
      const data = await addAttendance({
        group_id: groupId,
        student_id: studentId,
        date: dateISO,
        status,
        attendance: "student",
      }).unwrap();
      if (data?.insertedId) {
        toast.success(`${status} attendance given`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const changeStatus = async (recordId, status) => {
    try {
      const data = await updateAttendance({ id: recordId, status }).unwrap();
      if (data?.modifiedCount) {
        toast.success(`updated to ${status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeStatus = async (recordId) => {
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAttendance(recordId).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "Your Attendance has been deleted.",
            icon: "success",
          });
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  /* ─────────────────── render ─────────────────── */
  return (
    <div>
      {/* ── TOP BAR ─────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center my-2">
        <h3>Student Attendance</h3>
        <div>
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
                  <option value="S2">Late - 6:00 PM – 7:30 PM (1½ hrs)</option>
                </>
              )}
              {session === "weekend" && (
                <>
                  <option value="WM">
                    Morning - 10:00 AM – 12:30 PM (1½ hrs)
                  </option>
                  <option value="WA">
                    Afternoon - 12:30 PM – 2:30 PM (1½ hrs)
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
          {/* <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm">Present All</button>
            <button className="btn btn-danger  btn-sm">Remove All</button>
          </div> */}
        </div>

        <table className="table mb-0">
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
              {weekDates.map((d) => (
                <th
                  key={format(d, "yyyy-MM-dd")}
                  style={{ backgroundColor: "var(--border2)" }}
                  className="text-white text-center border"
                >
                  {format(d, "EEEE")} <br /> {format(d, "dd-MM-yyyy")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.length ? (
              students.map((stu, idx) => (
                <tr key={stu._id}>
                  <td className="text-center border align-middle">{idx + 1}</td>
                  <td className="text-center border align-middle">
                    {stu.name}
                  </td>

                  {weekDates.map((date) => {
                    const dateISO = format(date, "yyyy-MM-dd");
                    const cellKey = `${stu._id}-${dateISO}`;

                    // Find attendance record from global attendance list
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
                        onMouseEnter={() => setHoverKey(cellKey)}
                        onMouseLeave={() => setHoverKey(null)}
                        style={{ minWidth: 90 }}
                      >
                        {/* Content for non-hover state */}
                        {!status && hoverKey !== cellKey && <span>&nbsp;</span>}

                        {/* Hover elements - only show for this specific cell */}
                        {hoverKey === cellKey && (
                          <>
                            {/* Show status buttons in center when no status is set */}
                            {!status && (
                              <div className="d-flex justify-content-center gap-1">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() =>
                                    saveStatus(stu._id, dateISO, "present")
                                  }
                                />
                                <button
                                  className="btn btn-sm btn-primary border border-white"
                                  onClick={() =>
                                    saveStatus(stu._id, dateISO, "late")
                                  }
                                />
                                <button
                                  className="btn btn-sm btn-danger border border-white"
                                  onClick={() =>
                                    saveStatus(stu._id, dateISO, "absent")
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
                                    record?._id && removeStatus(record._id)
                                  }
                                />

                                <div className="position-absolute start-0 ms-1 d-flex gap-1">
                                  <button
                                    className={`btn btn-xs p-1 border border-white ${
                                      status === "present"
                                        ? "btn-light"
                                        : "btn-success"
                                    }`}
                                    onClick={() =>
                                      changeStatus(record._id, "present")
                                    }
                                  />
                                  <button
                                    className={`btn btn-xs p-1 border border-white ${
                                      status === "late"
                                        ? "btn-light"
                                        : "btn-primary"
                                    }`}
                                    onClick={() =>
                                      changeStatus(record._id, "late")
                                    }
                                  />
                                  <button
                                    className={`btn btn-xs p-1 border border-white ${
                                      status === "absent"
                                        ? "btn-light"
                                        : "btn-danger"
                                    }`}
                                    onClick={() =>
                                      changeStatus(record._id, "absent")
                                    }
                                  />
                                </div>
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
                  {groupId
                    ? "No students found."
                    : "Select filters to view attendance."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
