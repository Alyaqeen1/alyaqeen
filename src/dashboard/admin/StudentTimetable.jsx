import React, { useMemo } from "react";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";

const sessionMap = {
  S1: "04:30 PM - 06:00 PM",
  S2: "06:00 PM - 07:30 PM",
  WM: "10:00 AM - 12:30 PM",
  WA: "12:30 PM - 02:30 PM",
};

const sessionDays = {
  weekdays: {
    S1: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    S2: ["Monday", "Tuesday", "Wednesday", "Thursday"],
  },
  weekend: {
    WM: ["Saturday", "Sunday"],
    WA: ["Saturday", "Sunday"],
  },
};

// Days in order for display
const daysOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Saturday",
  "Sunday",
];

export default function StudentTimetable({ student }) {
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: classes = [] } = useGetClassesQuery();

  const timetableData = useMemo(() => {
    if (
      !student?.academic?.enrollments ||
      !departments.length ||
      !classes.length
    ) {
      return { schedule: {}, days: [] };
    }

    const schedule = {};

    // Process each enrollment
    student.academic.enrollments.forEach((enrollment) => {
      const dept = departments.find((d) => d._id === enrollment.dept_id);
      const cls = classes.find((c) => c._id === enrollment.class_id);

      if (!dept || !cls) return;

      const timeKey = enrollment.session_time || cls.session_time;
      const sessionType = enrollment.session || cls.session;
      const timeLabel = sessionMap[timeKey] || `${timeKey} (Time not mapped)`;

      // Get days for this session
      const days =
        sessionDays[sessionType]?.[timeKey] ||
        (sessionType === "weekdays"
          ? ["Monday", "Tuesday", "Wednesday", "Thursday"]
          : ["Saturday", "Sunday"]);

      // Create class info display
      const classInfo = {
        className: cls.class_name,
        department: dept.dept_name,
        sessionTime: timeLabel,
        timeKey: timeKey,
        sessionType: sessionType,
      };

      // Add to schedule for each day
      days.forEach((day) => {
        if (!schedule[timeLabel]) {
          schedule[timeLabel] = {};
        }
        if (!schedule[timeLabel][day]) {
          schedule[timeLabel][day] = [];
        }
        schedule[timeLabel][day].push(classInfo);
      });
    });

    // Sort time slots in order
    const sortedSchedule = {};
    Object.keys(schedule)
      .sort((a, b) => {
        const timeOrder = [
          "09:00 AM",
          "10:00 AM",
          "12:30 PM",
          "04:30 PM",
          "06:00 PM",
        ];
        const getTimeValue = (str) => {
          for (let i = 0; i < timeOrder.length; i++) {
            if (str.includes(timeOrder[i])) return i;
          }
          return timeOrder.length;
        };
        return getTimeValue(a) - getTimeValue(b);
      })
      .forEach((time) => {
        sortedSchedule[time] = schedule[time];
      });

    return { schedule: sortedSchedule, days: daysOrder };
  }, [student, departments, classes]);

  // Check if student has any classes
  const hasClasses = useMemo(() => {
    return student?.academic?.enrollments?.length > 0;
  }, [student]);

  if (!hasClasses) {
    return (
      <div className="text-center py-5">
        <h5>No Timetable Available</h5>
        <p className="text-muted">
          This student is not enrolled in any classes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="timetable-container">
      {/* Timetable Header */}
      <div className="mb-4">
        <h5 className="fw-bold">Weekly Class Schedule</h5>
        <div className="d-flex flex-wrap gap-3">
          {student.academic.enrollments.map((enrollment, idx) => {
            const dept = departments.find((d) => d._id === enrollment.dept_id);
            const cls = classes.find((c) => c._id === enrollment.class_id);

            return (
              <div
                key={idx}
                className="badge bg-primary-subtle text-primary p-2"
              >
                <span className="fw-bold">
                  {cls?.class_name || "Unknown Class"}
                </span>
                <span className="mx-1">•</span>
                <span>{dept?.dept_name || "Unknown Department"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timetable Table */}
      <div className="table-responsive">
        <table
          className="table table-bordered align-middle"
          style={{ minWidth: "800px" }}
        >
          <thead className="table-dark">
            <tr>
              <th className="text-center py-3" style={{ width: "15%" }}>
                Time Slot
              </th>
              {timetableData.days.map((day) => (
                <th key={day} className="text-center py-3">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(timetableData.schedule).map(
              ([timeSlot, daySchedule]) => (
                <tr key={timeSlot}>
                  <td className="text-center fw-bold py-3 bg-light">
                    {timeSlot}
                  </td>
                  {timetableData.days.map((day) => {
                    const classesForDay = daySchedule[day] || [];

                    return (
                      <td
                        key={day}
                        className="py-3"
                        style={{ minHeight: "80px" }}
                      >
                        {classesForDay.length > 0 ? (
                          <div className="d-flex flex-column gap-2">
                            {classesForDay.map((classInfo, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded border"
                                style={{
                                  backgroundColor: "#e3f2fd",
                                  borderColor: "#90caf9 !important",
                                }}
                              >
                                <div className="fw-bold text-primary mb-1">
                                  {classInfo.className}
                                </div>
                                <div className="text-muted small">
                                  {classInfo.department}
                                </div>
                                <div className="text-success small mt-1">
                                  <i className="bi bi-clock me-1"></i>
                                  {classInfo.sessionTime}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted small py-3">
                            No Class
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Session Information */}
      <div className="mt-4">
        <h6 className="fw-bold mb-2">Session Information</h6>
        <div className="row">
          <div className="col-md-6">
            <div className="card bg-light border-0">
              <div className="card-body">
                <h6 className="card-title">Weekday Sessions</h6>
                <ul className="list-unstyled mb-0">
                  <li>
                    <strong>S1:</strong> 04:30 PM - 06:00 PM (Mon-Thu)
                  </li>
                  <li>
                    <strong>S2:</strong> 06:00 PM - 07:30 PM (Mon-Thu)
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-light border-0">
              <div className="card-body">
                <h6 className="card-title">Weekend Sessions</h6>
                <ul className="list-unstyled mb-0">
                  <li>
                    <strong>WM:</strong> 10:00 AM - 12:30 PM (Sat-Sun)
                  </li>
                  <li>
                    <strong>WA:</strong> 12:30 PM - 02:30 PM (Sat-Sun)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
