import React, { useState, useMemo } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaBook,
} from "react-icons/fa";
import { useGetStudentAttendanceQuery } from "../../redux/features/attendances/attendancesApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";

const AttendanceCalendar = ({ studentId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("all"); // "all" or specific class_id

  const { data: attendanceData = [], isLoading } = useGetStudentAttendanceQuery(
    studentId,
    {
      skip: !studentId,
    }
  );

  const { data: classes = [], isLoading: classesLoading } =
    useGetClassesQuery();

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Get unique class IDs from attendance data
  const uniqueClassIds = useMemo(() => {
    const classIds = new Set();
    attendanceData.forEach((item) => classIds.add(item.class_id));
    return Array.from(classIds);
  }, [attendanceData]);

  // Get class information for each unique class ID
  const classInfo = useMemo(() => {
    return uniqueClassIds.map((classId) => {
      const classData = classes.find((c) => c._id === classId);
      return {
        id: classId,
        name: classData?.class_name || `Class ${classId.substring(0, 8)}...`,
        dept_id: classData?.dept_id,
        session: classData?.session,
        session_time: classData?.session_time,
      };
    });
  }, [uniqueClassIds, classes]);

  // Filter attendance data based on selected class
  const filteredAttendanceData = useMemo(() => {
    if (selectedClass === "all") {
      return attendanceData;
    }
    return attendanceData.filter((item) => item.class_id === selectedClass);
  }, [attendanceData, selectedClass]);

  // Calculate summary statistics for the selected class
  const summaryStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthAttendance = filteredAttendanceData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === year && itemDate.getMonth() === month;
    });

    // Remove duplicates by date (for "all" view, we need to handle multiple classes on same date)
    const uniqueAttendance = [];
    const seenDates = new Set();

    monthAttendance.forEach((item) => {
      const key =
        selectedClass === "all" ? `${item.date}-${item.class_id}` : item.date;
      if (!seenDates.has(key)) {
        seenDates.add(key);
        uniqueAttendance.push(item);
      }
    });

    const present = uniqueAttendance.filter(
      (a) => a.status === "present"
    ).length;
    const absent = uniqueAttendance.filter((a) => a.status === "absent").length;
    const late = uniqueAttendance.filter((a) => a.status === "late").length;
    const total = present + absent + late;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      present,
      absent,
      late,
      total,
      attendanceRate,
      totalSchoolDays: getTotalSchoolDays(year, month),
    };
  }, [currentDate, filteredAttendanceData, selectedClass]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7; // Monday start
    const totalDays = lastDay.getDate();

    // Create a map for faster lookup
    // For "all" view, we need to handle multiple classes on same date
    const attendanceMap = {};
    filteredAttendanceData.forEach((item) => {
      const dateKey = item.date;
      if (!attendanceMap[dateKey]) {
        attendanceMap[dateKey] = [];
      }
      attendanceMap[dateKey].push(item);
    });

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);

      // Format date as YYYY-MM-DD
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateString = `${yyyy}-${mm}-${dd}`;

      const attendanceForDay = attendanceMap[dateString] || null;

      days.push({
        date: i,
        fullDate: date,
        dateString,
        attendance: attendanceForDay,
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }

    return days;
  }, [currentDate, filteredAttendanceData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-success text-white";
      case "absent":
        return "bg-danger text-white";
      case "late":
        return "bg-primary text-white";
      default:
        return "bg-light text-muted";
    }
  };

  // Get status for a date when there are multiple classes
  const getDateStatus = (attendanceArray) => {
    if (!attendanceArray || attendanceArray.length === 0) return null;

    if (selectedClass === "all") {
      // For "all" view, show the worst status if multiple classes
      const statuses = attendanceArray.map((a) => a.status);
      if (statuses.includes("absent")) return "absent";
      if (statuses.includes("late")) return "late";
      if (statuses.includes("present")) return "present";
      return null;
    }

    // For specific class view
    return attendanceArray[0]?.status || null;
  };

  function getTotalSchoolDays(year, month) {
    let count = 0;
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const day = d.getDay();
      if (day >= 1 && day <= 4) {
        count++;
      }
    }
    return count;
  }

  // Get class name for display
  const getClassName = (classId) => {
    const classData = classes.find((c) => c._id === classId);
    return classData?.class_name || `Class ${classId.substring(0, 8)}...`;
  };

  if (isLoading || classesLoading)
    return <div className="text-center py-5">Loading...</div>;

  // Don't show tabs if only one class
  const showClassTabs = uniqueClassIds.length > 1;

  return (
    <div className="attendance-container">
      {/* Header with Class Tabs */}
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-primary text-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <FaCalendarAlt className="me-2" />
            <h5 className="mb-0">
              Attendance -{" "}
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h5>
          </div>

          {/* Class Tabs - Only show if multiple classes */}
          {showClassTabs && (
            <div className="attendance-tabs">
              <div className="nav nav-pills">
                <button
                  className={`nav-link ${
                    selectedClass === "all" ? "active" : ""
                  }`}
                  onClick={() => setSelectedClass("all")}
                >
                  <FaBook className="me-1" />
                  All Classes
                </button>
                {classInfo.map((classItem) => (
                  <button
                    key={classItem.id}
                    className={`nav-link ${
                      selectedClass === classItem.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedClass(classItem.id)}
                  >
                    {classItem.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Class Info Display */}
        <div className="card-body py-2">
          {selectedClass === "all" ? (
            <div className="d-flex align-items-center">
              <FaBook className="me-2 text-primary" />
              <span className="fw-bold">Viewing all classes</span>
              <span className="ms-2 text-muted">
                ({uniqueClassIds.length} classes)
              </span>
            </div>
          ) : (
            <div className="d-flex align-items-center flex-wrap">
              <FaBook className="me-2 text-primary" />
              <span className="fw-bold me-2">
                {getClassName(selectedClass)}
              </span>
              {classInfo.find((c) => c.id === selectedClass)?.session && (
                <span className="badge bg-info me-2">
                  {classInfo.find((c) => c.id === selectedClass)?.session}
                </span>
              )}
              {classInfo.find((c) => c.id === selectedClass)?.session_time && (
                <span className="badge bg-secondary">
                  {classInfo.find((c) => c.id === selectedClass)?.session_time}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="card shadow-sm mb-3">
        <div className="card-body p-2 p-md-3">
          {/* Title */}
          <h6 className="card-title fw-bold mb-3 text-center">
            {selectedClass === "all" ? "Overall Summary" : "Class Summary"}
          </h6>

          {/* Cards - Responsive layout */}
          <div className="row g-2 g-md-3">
            {/* Present Card */}
            <div className="col-4">
              <div className="d-flex align-items-center p-2 border rounded bg-success bg-opacity-10 h-100">
                <div className="d-none d-sm-flex">
                  <div
                    className="rounded-circle bg-success d-flex align-items-center justify-content-center me-2 me-md-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                    }}
                  >
                    <FaCheckCircle className="text-white" size={20} />
                  </div>
                </div>
                <div className="flex-grow-1 text-center text-sm-start">
                  <div className="fw-bold text-success fs-3 fs-md-2 fs-lg-1">
                    {summaryStats.present}
                  </div>
                  <div className="text-muted small">Present</div>
                </div>
              </div>
            </div>

            {/* Absent Card */}
            <div className="col-4">
              <div className="d-flex align-items-center p-2 border rounded bg-danger bg-opacity-10 h-100">
                <div className="d-none d-sm-flex">
                  <div
                    className="rounded-circle bg-danger d-flex align-items-center justify-content-center me-2 me-md-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                    }}
                  >
                    <FaTimesCircle className="text-white" size={20} />
                  </div>
                </div>
                <div className="flex-grow-1 text-center text-sm-start">
                  <div className="fw-bold text-danger fs-3 fs-md-2 fs-lg-1">
                    {summaryStats.absent}
                  </div>
                  <div className="text-muted small">Absent</div>
                </div>
              </div>
            </div>

            {/* Late Card */}
            <div className="col-4">
              <div className="d-flex align-items-center p-2 border rounded bg-primary bg-opacity-10 h-100">
                <div className="d-none d-sm-flex">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2 me-md-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                    }}
                  >
                    <FaClock className="text-white" size={20} />
                  </div>
                </div>
                <div className="flex-grow-1 text-center text-sm-start">
                  <div className="fw-bold text-primary fs-3 fs-md-2 fs-lg-1">
                    {summaryStats.late}
                  </div>
                  <div className="text-muted small">Late</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="d-none d-md-block mt-3 pt-3 border-top">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="text-muted small">
                  <span className="fw-bold">School Days:</span>{" "}
                  {summaryStats.totalSchoolDays} |
                  <span className="fw-bold ms-2">Recorded:</span>{" "}
                  {summaryStats.total}
                  {selectedClass === "all" && (
                    <span className="ms-2">
                      ({uniqueClassIds.length} classes)
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div className="fw-bold text-secondary fs-4">
                  {summaryStats.attendanceRate}%
                </div>
                <div className="text-muted small">Attendance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Calendar Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigateMonth(-1)}
            >
              &larr; Prev
            </button>
            <h4 className="mb-0 fw-bold text-center">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h4>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigateMonth(1)}
            >
              Next &rarr;
            </button>
          </div>

          {/* Calendar */}
          <div className="p-2 p-md-3">
            {/* Weekdays */}
            <div className="d-flex mb-2">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="flex-fill text-center fw-bold text-primary py-2"
                  style={{ fontSize: "0.8rem" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="d-flex flex-wrap">
              {calendarDays.map((day, index) => {
                if (!day)
                  return (
                    <div
                      key={`empty-${index}`}
                      className="p-1 p-md-2 flex-fill"
                      style={{
                        width: "14.28%",
                        height: window.innerWidth < 768 ? "40px" : "50px",
                      }}
                    />
                  );

                const status = getDateStatus(day.attendance);
                const hasMultipleClasses =
                  day.attendance && day.attendance.length > 1;

                return (
                  <div
                    key={day.dateString}
                    className={`m-1 rounded d-flex align-items-center justify-content-center ${getStatusColor(
                      status
                    )}`}
                    style={{
                      width: "calc(14.28% - 0.5rem)",
                      height: window.innerWidth < 768 ? "40px" : "50px",
                      cursor: day.attendance ? "pointer" : "default",
                      border: day.isToday
                        ? "3px solid #0d6efd"
                        : "1px solid #dee2e6",
                      fontSize: window.innerWidth < 768 ? "0.85rem" : "0.95rem",
                      transition: "all 0.2s",
                      position: "relative",
                    }}
                    onClick={() => day.attendance && setSelectedDate(day)}
                    onMouseEnter={(e) => {
                      if (day.attendance) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0,0,0,0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (day.attendance) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                    title={
                      day.attendance
                        ? selectedClass === "all"
                          ? `${day.dateString}: ${day.attendance.length} class(es)`
                          : `${day.dateString}: ${
                              status?.toUpperCase() || "No record"
                            }`
                        : "No attendance record"
                    }
                  >
                    <div className="fw-bold">{day.date}</div>
                    {hasMultipleClasses && selectedClass === "all" && (
                      <div className="position-absolute top-0 end-0 translate-middle">
                        <div
                          className="badge bg-warning text-dark rounded-circle p-1"
                          style={{ fontSize: "0.5rem" }}
                        >
                          {day.attendance.length}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 pt-3 border-top">
            <div className="row justify-content-center g-2">
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-success rounded-circle me-2"
                    style={{ width: "12px", height: "12px" }}
                  />
                  <span className="small">Present</span>
                </div>
              </div>
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-danger rounded-circle me-2"
                    style={{ width: "12px", height: "12px" }}
                  />
                  <span className="small">Absent</span>
                </div>
              </div>
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary rounded-circle me-2"
                    style={{ width: "12px", height: "12px" }}
                  />
                  <span className="small">Late</span>
                </div>
              </div>
              {selectedClass === "all" && (
                <div className="col-auto">
                  <div className="d-flex align-items-center">
                    <div
                      className="badge bg-warning text-dark rounded-circle me-2"
                      style={{
                        width: "12px",
                        height: "12px",
                        fontSize: "0.5rem",
                      }}
                    >
                      2
                    </div>
                    <span className="small">Multiple classes</span>
                  </div>
                </div>
              )}
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <div
                    className="border border-primary bg-white rounded-circle me-2"
                    style={{ width: "12px", height: "12px" }}
                  />
                  <span className="small">Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Enhanced for multiple classes */}
      {selectedDate && selectedDate.attendance && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Attendance Details -{" "}
                  {selectedDate.fullDate.toLocaleDateString("en-GB")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedDate(null)}
                />
              </div>
              <div className="modal-body">
                {selectedClass === "all" ? (
                  // Multiple classes view
                  <div>
                    <div className="text-center mb-3">
                      <div className="fw-bold fs-5">
                        {selectedDate.attendance.length} Class
                        {selectedDate.attendance.length > 1 ? "es" : ""}
                      </div>
                      <div className="text-muted">
                        {selectedDate.fullDate.toLocaleDateString()}
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>Status</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDate.attendance.map((att, idx) => {
                            const classData = classes.find(
                              (c) => c._id === att.class_id
                            );
                            return (
                              <tr key={idx}>
                                <td>{classData?.class_name || att.class_id}</td>
                                <td>
                                  <span
                                    className={`badge ${getStatusColor(
                                      att.status
                                    ).replace("text-white", "")}`}
                                  >
                                    {att.status.toUpperCase()}
                                  </span>
                                </td>
                                <td>{classData?.session_time || "N/A"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  // Single class view
                  <div className="text-center">
                    <div
                      className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 ${getStatusColor(
                        selectedDate.attendance[0]?.status
                      )}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        fontSize: "1.5rem",
                      }}
                    >
                      {selectedDate.attendance[0]?.status === "present" && (
                        <FaCheckCircle />
                      )}
                      {selectedDate.attendance[0]?.status === "absent" && (
                        <FaTimesCircle />
                      )}
                      {selectedDate.attendance[0]?.status === "late" && (
                        <FaClock />
                      )}
                    </div>
                    <p>
                      Status:{" "}
                      <strong>
                        {selectedDate.attendance[0]?.status.toUpperCase()}
                      </strong>
                    </p>
                    <p>Date: {selectedDate.fullDate.toLocaleDateString()}</p>
                    <p>
                      Day:{" "}
                      {selectedDate.fullDate.toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </p>
                    <p>Class: {getClassName(selectedClass)}</p>
                    {selectedDate.attendance[0]?.createdAt && (
                      <p className="text-muted small">
                        Recorded:{" "}
                        {new Date(
                          selectedDate.attendance[0]?.createdAt
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedDate(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
