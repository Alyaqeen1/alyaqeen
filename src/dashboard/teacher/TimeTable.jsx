import React from "react";
import useAuth from "../../hooks/useAuth";
import {
  useGetTeacherByEmailQuery,
  useGetTeacherWithDetailsQuery,
} from "../../redux/features/teachers/teachersApi";

const sessionMap = {
  S1: "04:30 PM - 06:00 PM",
  S2: "06:00 PM - 07:30 PM",
  WM: "10:00 AM - 12:30 PM",
  WA: "12:30 PM - 02:30 PM",
};

const sessionDays = {
  S1: ["Monday", "Tuesday", "Wednesday", "Thursday"],
  S2: ["Monday", "Tuesday", "Wednesday", "Thursday"],
  WM: ["Saturday", "Sunday"],
  WA: ["Saturday", "Sunday"],
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Saturday",
  "Sunday",
];

export default function TimeTable() {
  const { user } = useAuth();

  const { data: teacher } = useGetTeacherByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  const { data: teacherWithDetails } = useGetTeacherWithDetailsQuery(
    teacher?._id,
    { skip: !teacher?._id }
  );

  if (!teacherWithDetails) return null;
  // pull department info from teacherWithDetails
  const deptInfos = teacherWithDetails.departments_info || []; // ← add this
  // You already have assigned subjects in teacherWithDetails.subjects_info
  const teacherSubjects = teacherWithDetails.subjects_info || [];
  const classInfos = teacherWithDetails.classes_info || [];

  // Get the time code (WM, WA, S1, S2) from class info
  const classTimeMap = {};
  classInfos.forEach((cls) => {
    classTimeMap[cls._id] = cls.session_time;
  });

  // Group subjects by time + days
  const scheduleMap = {};

  teacherSubjects.forEach((subject) => {
    const timeKey = classTimeMap[subject.class_id]; // WM, WA, S1, …
    const classInfo = classInfos.find((c) => c._id === subject.class_id);
    if (!classInfo) return;

    /* -------- default values from session ---------- */
    let timeLabel = sessionMap[timeKey] || "Unknown Time";
    let activeDays = sessionDays[timeKey] || [];

    /* ----------  custom overrides  ----------------- */
    // 1️⃣ Arabic Language  (weekend)
    const isArabicWeekend =
      classInfo.session === "weekend" &&
      deptInfos.some(
        (d) => d._id === classInfo.dept_id && d.dept_name === "Arabic Language"
      );

    // 2️⃣ Maths, English & Science  (10–1)
    const isMathEngSci =
      subject.subject_name.trim().toLowerCase() ===
      "maths,english & science".toLowerCase();

    // 3️⃣ Maths & English  (10–12)
    const isMathEng =
      subject.subject_name.trim().toLowerCase() ===
      "maths & english".toLowerCase();

    if (isArabicWeekend) {
      timeLabel = "09:00 AM - 10:00 AM";
      activeDays = ["Saturday", "Sunday"];
    } else if (isMathEngSci) {
      timeLabel = "10:00 AM - 01:00 PM";
      activeDays = ["Saturday", "Sunday"];
    } else if (isMathEng) {
      timeLabel = "10:00 AM - 12:00 PM";
      activeDays = ["Saturday", "Sunday"];
    }

    /* ----------- push into scheduleMap -------------- */
    activeDays.forEach((day) => {
      if (!scheduleMap[timeLabel]) scheduleMap[timeLabel] = {};
      if (!scheduleMap[timeLabel][day]) scheduleMap[timeLabel][day] = [];
      scheduleMap[timeLabel][day].push(
        `${classInfo.class_name}\n(${
          deptInfos.find((d) => d._id === classInfo.dept_id)?.dept_name ||
          "Dept"
        })\n${subject.subject_name}`
      );
    });
  });

  return (
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
              className="font-danger text-white fw-bolder border h6 text-center align-middle"
              style={{ backgroundColor: "var(--border2)" }}
            >
              Period Time
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(scheduleMap).map(([timeLabel, dayMap]) => (
            <tr key={timeLabel}>
              <td className="border h6 text-center align-middle text-nowrap">
                {timeLabel}
              </td>
              {days.map((day) => (
                <td
                  key={day}
                  className="border h6 text-center align-middle text-nowrap"
                >
                  {dayMap[day]?.map((item, i) => (
                    <div key={i} style={{ whiteSpace: "pre-line" }}>
                      {item}
                    </div>
                  )) || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
