import React from "react";

const AbsentStudentsModal = ({
  showModal,
  handleClose,
  absent_students,
  summary,
  themeColors,
  getBgColor,
}) => {
  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      handleClose();
    }
  };

  if (!showModal || !absent_students) return null;

  // Group students by class for better organization
  const studentsByClass = absent_students.reduce((acc, student) => {
    if (!acc[student.class_name]) {
      acc[student.class_name] = [];
    }
    acc[student.class_name].push(student);
    return acc;
  }, {});

  // Calculate class statistics
  const classStats = Object.entries(studentsByClass).map(
    ([className, students]) => ({
      className,
      studentCount: students.length,
    }),
  );

  return (
    <div>
      {/* Dark Background (Backdrop) */}
      {showModal && (
        <div
          className="modal-backdrop fade show"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
          }}
          onClick={handleBackdropClick}
        ></div>
      )}

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        style={{
          display: showModal ? "block" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleBackdropClick}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                maxHeight: "80vh",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: "20px",
                  borderBottom: `1px solid ${themeColors.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      margin: 0,
                      color: themeColors.textPrimary,
                    }}
                  >
                    Absent Students - {summary?.date}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: themeColors.textMuted,
                      margin: "4px 0 0 0",
                    }}
                  >
                    Total: {absent_students.length} students •{" "}
                    {Object.keys(studentsByClass).length} classes
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: themeColors.textMuted,
                  }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* Modal Body */}
              <div
                className="modal-body"
                style={{ flex: 1, overflowY: "auto", padding: "20px" }}
              >
                {/* Class-wise Statistics with Bars */}
                <div style={{ marginBottom: "20px" }}>
                  <h5
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      margin: "0 0 12px 0",
                      color: themeColors.textPrimary,
                    }}
                  >
                    Class-wise Absent Students
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    {classStats.map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            backgroundColor: getBgColor("primary", 0.1),
                            color: themeColors.primary,
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontWeight: 500,
                          }}
                        >
                          {stat.className} ({stat.studentCount})
                        </span>
                        {index < classStats.length - 1 && (
                          <span
                            style={{
                              color: themeColors.border,
                              fontSize: "12px",
                            }}
                          >
                            |
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary Cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: getBgColor("warning", 0.1),
                        padding: "12px",
                        borderRadius: "8px",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          color: themeColors.textMuted,
                          margin: 0,
                        }}
                      >
                        Total Absent
                      </p>
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          margin: "4px 0 0 0",
                          color: themeColors.warning,
                        }}
                      >
                        {absent_students.length}
                      </p>
                    </div>

                    <div
                      style={{
                        backgroundColor: getBgColor("info", 0.1),
                        padding: "12px",
                        borderRadius: "8px",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          color: themeColors.textMuted,
                          margin: 0,
                        }}
                      >
                        Classes Affected
                      </p>
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          margin: "4px 0 0 0",
                          color: themeColors.info,
                        }}
                      >
                        {Object.keys(studentsByClass).length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Students List - Grouped by Class */}
                <div style={{ marginBottom: "20px" }}>
                  <h5
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      margin: "0 0 12px 0",
                      color: themeColors.textPrimary,
                    }}
                  >
                    Absent Students List
                  </h5>

                  {Object.entries(studentsByClass).map(
                    ([className, students], classIndex) => (
                      <div key={classIndex} style={{ marginBottom: "24px" }}>
                        {/* Class Header */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 12px",
                            backgroundColor: getBgColor("primary", 0.05),
                            borderRadius: "6px",
                            marginBottom: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: themeColors.primary,
                              }}
                            ></div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: themeColors.textPrimary,
                              }}
                            >
                              {className}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              color: themeColors.textMuted,
                              backgroundColor: getBgColor("primary", 0.1),
                              padding: "2px 8px",
                              borderRadius: "12px",
                            }}
                          >
                            {students.length} student
                            {students.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Students in this class */}
                        <div style={{ marginLeft: "20px" }}>
                          {students.map((student, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px 12px",
                                borderBottom: `1px solid ${themeColors.border}`,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    backgroundColor: getBgColor("warning", 0.2),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: themeColors.warning,
                                    fontWeight: 600,
                                    fontSize: "11px",
                                  }}
                                >
                                  {student.student_name?.charAt(0) || "S"}
                                </div>
                                <div>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      color: themeColors.textPrimary,
                                    }}
                                  >
                                    {student.student_name}
                                  </p>
                                </div>
                              </div>
                              <span
                                style={{
                                  fontSize: "12px",
                                  backgroundColor: getBgColor("warning", 0.2),
                                  color: themeColors.warning,
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontWeight: 500,
                                }}
                              >
                                Absent
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {/* Note */}
                <div
                  style={{
                    backgroundColor: getBgColor("info", 0.05),
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: themeColors.textMuted,
                    borderLeft: `3px solid ${themeColors.info}`,
                    marginTop: "16px",
                  }}
                >
                  <i
                    className="bi bi-info-circle"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Showing only students marked as "Absent". Students without
                  attendance records are not included.
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "16px 20px",
                  borderTop: `1px solid ${themeColors.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "13px", color: themeColors.textMuted }}>
                  <i className="bi bi-clock" style={{ marginRight: "8px" }}></i>
                  Data as of {summary?.date}
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={handleClose}
                    style={{
                      backgroundColor: themeColors.primary,
                      border: "none",
                      padding: "8px 24px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "white",
                      fontWeight: 500,
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsentStudentsModal;
