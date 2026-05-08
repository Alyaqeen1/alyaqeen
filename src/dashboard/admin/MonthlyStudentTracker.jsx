import React, { useState } from "react";

const MonthlyStudentModal = ({
  showModal,
  handleClose,
  students,
  title,
  type, // 'admissions' or 'departures'
  themeColors,
  getBgColor,
  monthName,
  year,
}) => {
  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      handleClose();
    }
  };

  if (!showModal) return null;

  // Group students by class for better organization
  const studentsByClass = students.reduce((acc, student) => {
    const className = student.class_name || "Not Assigned";
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(student);
    return acc;
  }, {});

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
                    {title} - {monthName} {year}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: themeColors.textMuted,
                      margin: "4px 0 0 0",
                    }}
                  >
                    Total: {students.length} students •{" "}
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
                {/* Summary Cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: getBgColor(
                        type === "admissions" ? "success" : "danger",
                        0.1,
                      ),
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
                      Weekdays
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        margin: "4px 0 0 0",
                        color:
                          type === "admissions"
                            ? themeColors.success
                            : themeColors.danger,
                      }}
                    >
                      {students.filter((s) => s.session === "weekdays").length}
                    </p>
                  </div>

                  <div
                    style={{
                      backgroundColor: getBgColor(
                        type === "admissions" ? "success" : "danger",
                        0.1,
                      ),
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
                      Weekend
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        margin: "4px 0 0 0",
                        color:
                          type === "admissions"
                            ? themeColors.success
                            : themeColors.danger,
                      }}
                    >
                      {students.filter((s) => s.session === "weekend").length}
                    </p>
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
                    Students List
                  </h5>

                  {Object.entries(studentsByClass).map(
                    ([className, classStudents], classIndex) => (
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
                            {classStudents.length} student
                            {classStudents.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Students in this class */}
                        <div style={{ marginLeft: "20px" }}>
                          {classStudents.map((student, index) => (
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
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    backgroundColor: getBgColor(
                                      type === "admissions"
                                        ? "success"
                                        : "danger",
                                      0.2,
                                    ),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color:
                                      type === "admissions"
                                        ? themeColors.success
                                        : themeColors.danger,
                                    fontWeight: 600,
                                    fontSize: "12px",
                                  }}
                                >
                                  {student.name?.charAt(0) || "S"}
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
                                    {student.name}
                                  </p>
                                  <p
                                    style={{
                                      margin: "2px 0 0 0",
                                      fontSize: "11px",
                                      color: themeColors.textMuted,
                                    }}
                                  >
                                    ID: {student.student_id} | Dept:{" "}
                                    {student.dept_name}
                                  </p>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "11px",
                                    backgroundColor:
                                      student.session === "weekdays"
                                        ? getBgColor("primary", 0.2)
                                        : getBgColor("success", 0.2),
                                    color:
                                      student.session === "weekdays"
                                        ? themeColors.primary
                                        : themeColors.success,
                                    padding: "2px 8px",
                                    borderRadius: "12px",
                                  }}
                                >
                                  {student.session === "weekdays"
                                    ? "Weekdays"
                                    : "Weekend"}
                                </span>
                                {type === "departures" &&
                                  student.deactivatedAt && (
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        backgroundColor: getBgColor(
                                          "info",
                                          0.2,
                                        ),
                                        color: themeColors.info,
                                        padding: "2px 8px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      Left:{" "}
                                      {new Date(
                                        student.deactivatedAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "16px 20px",
                  borderTop: `1px solid ${themeColors.border}`,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
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
  );
};

export default function MonthlyStudentTracker({
  themeColors,
  getBgColor,
  admissionsData,
  departuresData,
  selectedYear,
  selectedMonth,
}) {
  const [showAdmissionsModal, setShowAdmissionsModal] = useState(false);
  const [showDeparturesModal, setShowDeparturesModal] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const admissions = admissionsData?.students || [];
  const departures = departuresData?.students || [];

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          border: `1px solid ${themeColors.border}`,
        }}
      >
        <h4
          style={{
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "16px",
            color: themeColors.textPrimary,
          }}
        >
          Monthly Student Tracker - {monthNames[selectedMonth - 1]}{" "}
          {selectedYear}
        </h4>

        {/* Stats Cards */}
        <div className="row g-3">
          {/* Admissions Card - Clickable */}
          <div className="col-6">
            <div
              onClick={() => setShowAdmissionsModal(true)}
              style={{
                backgroundColor: getBgColor("success", 0.05),
                borderRadius: "8px",
                padding: "16px",
                borderLeft: `4px solid ${themeColors.success}`,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <small style={{ color: themeColors.textMuted }}>
                New Admissions
              </small>
              <h3 style={{ margin: "4px 0", color: themeColors.success }}>
                {admissions.length}
              </h3>
              <small>
                Weekdays: {admissionsData?.weekdays || 0} | Weekend:{" "}
                {admissionsData?.weekend || 0}
              </small>
            </div>
          </div>

          {/* Departures Card - Clickable */}
          <div className="col-6">
            <div
              onClick={() => setShowDeparturesModal(true)}
              style={{
                backgroundColor: getBgColor("danger", 0.05),
                borderRadius: "8px",
                padding: "16px",
                borderLeft: `4px solid ${themeColors.danger}`,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <small style={{ color: themeColors.textMuted }}>
                Students Left
              </small>
              <h3 style={{ margin: "4px 0", color: themeColors.danger }}>
                {departures.length}
              </h3>
              <small>
                Weekdays: {departuresData?.weekdays || 0} | Weekend:{" "}
                {departuresData?.weekend || 0}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Admissions Modal */}
      <MonthlyStudentModal
        showModal={showAdmissionsModal}
        handleClose={() => setShowAdmissionsModal(false)}
        students={admissions}
        title="New Admissions"
        type="admissions"
        themeColors={themeColors}
        getBgColor={getBgColor}
        monthName={monthNames[selectedMonth - 1]}
        year={selectedYear}
      />

      {/* Departures Modal */}
      <MonthlyStudentModal
        showModal={showDeparturesModal}
        handleClose={() => setShowDeparturesModal(false)}
        students={departures}
        title="Students Who Left"
        type="departures"
        themeColors={themeColors}
        getBgColor={getBgColor}
        monthName={monthNames[selectedMonth - 1]}
        year={selectedYear}
      />
    </>
  );
}
