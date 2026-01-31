import React, { useState } from "react";
import AbsentStudentsModal from "./AbsentStudentsModal";
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long", // use "short" for Jan, Feb
    year: "numeric",
  }).format(new Date(dateString));
};

const AttendanceSummary = ({ data, screenSize, themeColors, getBgColor }) => {
  const [showTeachersWithAttendance, setShowTeachersWithAttendance] =
    useState(true);
  const [absentStudentsModalOpen, setAbsentStudentsModalOpen] = useState(false);

  const {
    summary,
    teachers_with_attendance,
    teachers_without_attendance,
    absent_students,
  } = data;

  const displayedTeachers = showTeachersWithAttendance
    ? teachers_with_attendance
    : teachers_without_attendance;

  const hasTeachersWithAttendance = teachers_with_attendance?.length > 0;
  const hasTeachersWithoutAttendance = teachers_without_attendance?.length > 0;

  let displayedTitle = "";
  let emptyStateMessage = "";
  let showEmptyStateIcon = true;

  if (showTeachersWithAttendance) {
    displayedTitle = `Teachers With Attendance (${teachers_with_attendance?.length || 0})`;
    if (!hasTeachersWithAttendance) {
      emptyStateMessage = "No teachers have taken attendance yet";
      showEmptyStateIcon = true;
    }
  } else {
    displayedTitle = `Teachers Without Attendance (${teachers_without_attendance?.length || 0})`;
    if (!hasTeachersWithoutAttendance) {
      emptyStateMessage = "All teachers have taken attendance!";
      showEmptyStateIcon = false;
    }
  }

  const shouldShowEmptyState = showTeachersWithAttendance
    ? !hasTeachersWithAttendance
    : !hasTeachersWithoutAttendance;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        border: `1px solid ${themeColors.border}`,
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h4
          style={{
            fontSize: "16px",
            fontWeight: 600,
            margin: 0,
            color: themeColors.textPrimary,
          }}
        >
          Today's Attendance <br />({formatDate(data?.date)})
        </h4>

        <button
          onClick={() =>
            setShowTeachersWithAttendance(!showTeachersWithAttendance)
          }
          style={{
            backgroundColor: showTeachersWithAttendance
              ? getBgColor("success", 0.2)
              : getBgColor("warning", 0.2),
            border: "none",
            borderRadius: "20px",
            padding: "6px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "13px",
            fontWeight: 500,
            color: showTeachersWithAttendance
              ? themeColors.success
              : themeColors.warning,
          }}
        >
          <span>{showTeachersWithAttendance ? "✓ With" : "✗ Without"}</span>
          <i
            className={`bi bi-toggle-${showTeachersWithAttendance ? "on" : "off"}`}
          ></i>
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "4px",
          marginBottom: "16px",
          padding: "12px",
          backgroundColor: getBgColor("info", 0.05),
          borderRadius: "8px",
        }}
      >
        {[
          {
            label: "Teachers",
            value: summary?.total_teachers,
            color: themeColors.textPrimary,
          },
          {
            label: "With Att.",
            value: summary?.teachers_with_attendance,
            color: themeColors.success,
          },
          {
            label: "Without Att.",
            value: summary?.teachers_without_attendance,
            color: themeColors.danger,
          },
          {
            label: "Absent Stu.",
            value: summary?.total_absent_students,
            color: themeColors.warning,
          },
        ].map((item, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "11px",
                color: themeColors.textMuted,
                margin: 0,
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                fontSize: "18px",
                fontWeight: 700,
                margin: "4px 0 0 0",
                color: item.color,
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            paddingBottom: "8px",
            borderBottom: `1px solid ${themeColors.border}`,
          }}
        >
          <h5
            style={{
              fontSize: "14px",
              fontWeight: 600,
              margin: 0,
              color: themeColors.textPrimary,
            }}
          >
            {displayedTitle}
          </h5>
          <span style={{ fontSize: "12px", color: themeColors.textMuted }}>
            {displayedTeachers?.length || 0} teachers
          </span>
        </div>

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {!shouldShowEmptyState ? (
            displayedTeachers.slice(0, 8).map((teacher, index) => {
              // Get classes for this teacher
              const teacherClasses = showTeachersWithAttendance
                ? teacher.attended_classes || []
                : teacher.not_attended_classes || [];

              // Format class names with "|" separator
              const classNamesString = teacherClasses
                .map((cls) => cls.class_name || `Class ${cls.class_id}`)
                .join(" | ");

              return (
                <div
                  key={teacher.teacher_id || index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "12px 0",
                    borderBottom: `1px solid ${themeColors.border}`,
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: showTeachersWithAttendance
                          ? getBgColor("success", 0.2)
                          : getBgColor("warning", 0.2),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: showTeachersWithAttendance
                          ? themeColors.success
                          : themeColors.warning,
                        fontWeight: 600,
                        fontSize: "12px",
                        flexShrink: 0,
                      }}
                    >
                      {teacher.teacher_name?.charAt(0) || "T"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: 600,
                          color: themeColors.textPrimary,
                        }}
                      >
                        {teacher.teacher_name}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            backgroundColor: getBgColor("info", 0.1),
                            color: themeColors.info,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            maxWidth: "100%",
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          {teacherClasses.length} classes: {classNamesString}
                        </span>
                        {showTeachersWithAttendance &&
                          teacher.has_attendance_for_all_classes && (
                            <span
                              style={{
                                fontSize: "11px",
                                backgroundColor: getBgColor("success", 0.1),
                                color: themeColors.success,
                                padding: "2px 6px",
                                borderRadius: "4px",
                                flexShrink: 0,
                              }}
                            >
                              All done ✓
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  {showTeachersWithAttendance && (
                    <button
                      onClick={() =>
                        console.log("View teacher details:", teacher)
                      }
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: themeColors.primary,
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "4px 8px",
                        flexShrink: 0,
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: themeColors.textMuted,
              }}
            >
              {showEmptyStateIcon ? (
                <i
                  className="bi bi-info-circle"
                  style={{
                    fontSize: "32px",
                    marginBottom: "12px",
                    color: themeColors.info,
                  }}
                ></i>
              ) : (
                <i
                  className="bi bi-check-circle"
                  style={{
                    fontSize: "32px",
                    marginBottom: "12px",
                    color: themeColors.success,
                  }}
                ></i>
              )}
              <p style={{ margin: 0, fontSize: "14px" }}>{emptyStateMessage}</p>
              <p
                style={{ margin: "8px 0 0 0", fontSize: "12px", opacity: 0.7 }}
              >
                {showTeachersWithAttendance
                  ? "Check back later when teachers start taking attendance."
                  : "Great job! All teachers have submitted attendance for today."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
          paddingTop: "12px",
          borderTop: `1px solid ${themeColors.border}`,
        }}
      >
        <div>
          <span style={{ fontSize: "12px", color: themeColors.textMuted }}>
            {summary?.classes_without_attendance_taken || 0} classes without
            attendance
          </span>
        </div>

        <button
          onClick={() => setAbsentStudentsModalOpen(true)}
          disabled={!absent_students?.length}
          style={{
            backgroundColor: absent_students?.length
              ? getBgColor("warning", 0.2)
              : getBgColor("border", 0.5),
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: absent_students?.length ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 500,
            color: absent_students?.length
              ? themeColors.warning
              : themeColors.textMuted,
          }}
        >
          <i className="bi bi-person-x"></i>
          View Absent Students ({absent_students?.length || 0})
        </button>
      </div>

      <AbsentStudentsModal
        showModal={absentStudentsModalOpen}
        handleClose={() => setAbsentStudentsModalOpen(false)}
        absent_students={absent_students}
        summary={summary}
        themeColors={themeColors}
        getBgColor={getBgColor}
      />
    </div>
  );
};

export default AttendanceSummary;
