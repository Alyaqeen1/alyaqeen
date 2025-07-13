// StaffAttendance.jsx
import React, { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCircle,
  FaTrashAlt,
  FaClock,
} from "react-icons/fa";
import { format, addWeeks, startOfWeek, addDays, isSameWeek } from "date-fns";

import { useGetTeachersQuery } from "../../redux/features/teachers/teachersApi";
import {
  useAddAttendanceMutation,
  useGetAttendancesQuery,
  useDeleteAttendanceMutation,
  useTimeoutAttendanceMutation,
} from "../../redux/features/attendances/attendancesApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

/* ───────────────────────── constants ───────────────────────── */
const EXCLUDED_DAYS = ["Friday"]; // 👈 Remove Friday

const getBaseMonday = (offset = 0) =>
  addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), offset);

const getWeekDates = (baseMonday) =>
  Array.from({ length: 7 }, (_, i) => addDays(baseMonday, i)).filter(
    (d) => !EXCLUDED_DAYS.includes(format(d, "EEEE"))
  );

/* ───────────────────────── component ───────────────────────── */
export default function StaffAttendance() {
  const [weekOffset, setWeekOffset] = useState(0);
  const baseMonday = useMemo(() => getBaseMonday(weekOffset), [weekOffset]);
  const weekDates = useMemo(() => getWeekDates(baseMonday), [baseMonday]);
  const isCurrentWeek = isSameWeek(baseMonday, new Date(), { weekStartsOn: 1 });

  // 🟢 No filters: get all teachers
  const { data: teachers = [] } = useGetTeachersQuery();
  const { data: attendances = [] } = useGetAttendancesQuery();

  const [addAttendance] = useAddAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();
  const [timeoutAttendance] = useTimeoutAttendanceMutation();

  const [hoverKey, setHoverKey] = useState(null);

  const saveStatus = async (teacherId, dateISO, status) => {
    try {
      const now = new Date();
      const time_in = now.toTimeString().split(" ")[0]; // "HH:MM:SS"

      const data = await addAttendance({
        staff_id: teacherId,
        date: dateISO,
        status,
        time_in,
        attendance: "staff",
      }).unwrap();
      if (data?.insertedId) {
        if (status === "absent") {
          toast.success(`${status} attendance given`);
        } else {
          toast.success(`Time in marked and ${status} attendance given`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimeOut = async (recordId) => {
    try {
      const data = await timeoutAttendance(recordId).unwrap();
      if (data?.modifiedCount) {
        toast.success("Time out marked");
      }
    } catch (err) {
      console.error("Error marking time out:", err);
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
  const formatTotalHours = (timeString) => {
    if (!timeString) return "0h 0m";

    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Format as "2h 15m 30s" or "2h 15m" if seconds are 0
    return (
      [
        hours > 0 ? `${hours}h` : null,
        minutes > 0 ? `${minutes}m` : null,
        seconds > 0 ? `${seconds}s` : null,
      ]
        .filter(Boolean)
        .join(" ") || "0m"
    );
  };
  return (
    <div>
      {/* ───── Header ───── */}
      <div className="d-flex justify-content-between align-items-center my-2">
        <h3>Staff Attendance</h3>
        <div>
          <button
            className="btn text-white"
            style={{ backgroundColor: "var(--border2)" }}
            onClick={() => setWeekOffset((p) => p - 1)}
          >
            <FaArrowLeft />
          </button>
          <button
            className="btn text-white mx-1"
            style={{ backgroundColor: "var(--border2)" }}
            disabled={isCurrentWeek}
            onClick={() => !isCurrentWeek && setWeekOffset(0)}
          >
            <FaCircle />
          </button>
          <button
            className="btn text-white"
            style={{ backgroundColor: "var(--border2)" }}
            onClick={() => setWeekOffset((p) => p + 1)}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* ───── Legend ───── */}
      <div className="mb-2">
        <span className="bg-success px-2 rounded-1 mx-2" /> Present
        <span className="bg-primary px-2 rounded-1 mx-2" /> Late
        <span className="bg-danger px-2 rounded-1 mx-2" /> Absent
      </div>

      {/* ───── Table ───── */}
      <div className="border border-black p-3">
        <table className="table mb-0">
          <thead>
            <tr>
              <th
                className="text-center border text-white"
                style={{ backgroundColor: "var(--border2)" }}
              >
                #
              </th>
              <th
                className="text-center border text-white"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Staff Name
              </th>
              {weekDates.map((d) => (
                <th
                  key={format(d, "yyyy-MM-dd")}
                  className="text-center border text-white"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  {format(d, "EEEE")} <br /> {format(d, "dd-MM-yyyy")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.length ? (
              teachers.map((t, idx) => (
                <tr key={t._id}>
                  <td className="text-center border align-middle">{idx + 1}</td>
                  <td className="text-center border align-middle">{t.name}</td>

                  {weekDates.map((date) => {
                    const dateISO = format(date, "yyyy-MM-dd");
                    const cellKey = `${t._id}-${dateISO}`;
                    const record = attendances?.find(
                      (a) => a.staff_id === t._id && a.date === dateISO
                    );
                    const status = record?.status;

                    const color =
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
                        className={`text-center border align-middle position-relative ${color}`}
                        style={{ minWidth: 90 }}
                        onMouseEnter={() => setHoverKey(cellKey)}
                        onMouseLeave={() => setHoverKey(null)}
                      >
                        {/* Show time-out button automatically if present/late and no time-out */}
                        {["present", "late"].includes(status) &&
                          !record?.time_out && (
                            <button
                              className="btn btn-sm btn-light"
                              title="Mark Time Out"
                              onClick={() => handleTimeOut(record._id)}
                            >
                              <FaClock />
                            </button>
                          )}

                        {/* Show attendance time info if available */}
                        {record?.time_in && (
                          <div className="small text-white">
                            {record?.time_out && (
                              <>
                                <div className="d-flex flex-column">
                                  <span>
                                    Total:{" "}
                                    {formatTotalHours(record.total_hours)}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Only show action buttons on hover for empty cells */}
                        {!status && hoverKey === cellKey && (
                          <div className="d-flex justify-content-center gap-1">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() =>
                                saveStatus(t._id, dateISO, "present")
                              }
                            />
                            <button
                              className="btn btn-sm btn-primary border border-white"
                              onClick={() => saveStatus(t._id, dateISO, "late")}
                            />
                            <button
                              className="btn btn-sm btn-danger border border-white"
                              onClick={() =>
                                saveStatus(t._id, dateISO, "absent")
                              }
                            />
                          </div>
                        )}

                        {/* Show delete button on hover for marked cells */}
                        {status && hoverKey === cellKey && (
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
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={weekDates.length + 2} className="text-center">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
