import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";

export default function Session() {
  const sessionsData = {
    weekdays: {
      title: "Weekdays Sessions",
      days: "Monday to Thursday",
      duration: "4 days a week",
      hoursPerDay: "1.5 hours each day",
      totalHours: "6 hours per week",
      sessions: [
        {
          time: "4:30 PM – 6:00 PM",
          label: "1st Session",
        },
        {
          time: "5:45 PM – 7:15 PM",
          label: "2nd Session",
        },
      ],
      details: [
        {
          duration: "45 minutes",
          subject: "Arabic Qaida/Quran",
        },
        {
          duration: "45 minutes",
          subject: "Islamic Studies or Duas & Surahs",
        },
      ],
      hifzNote:
        "For Hifdh Students: Attendance is required from 4:30 PM to 7:15 PM, Monday to Thursday",
    },
    weekends: {
      title: "Weekends Sessions",
      days: "Saturday and Sunday",
      sessions: [
        {
          label: "Morning Session",
          duration: "2.5 hours each day",
          totalHours: "5 hours per week",
          time: "10:00 AM – 12:30 PM",
        },
        {
          label: "Afternoon Session",
          duration: "2 hours each day",
          totalHours: "4 hours per week",
          time: "12:30 PM – 2:30 PM",
        },
      ],
      details: [
        {
          duration: "45/40 minutes",
          subject: "Arabic Qaida/Quran",
        },
        {
          duration: "45/40 minutes",
          subject: "Islamic Studies",
        },
        {
          duration: "45/40 minutes",
          subject: "Duas & Surahs",
        },
      ],
      note: "This structure ensures a balanced focus on Quranic recitation, Islamic education, and memorization of Duas and Surahs.",
    },
  };

  return (
    <div>
      <CmnBanner title="Sessions and Timings" />

      <div className="container py-5">
        {/* Introduction */}
        <div className="text-center mb-5">
          <p className="lead" style={{ color: "var(--text)" }}>
            Our onsite classes are held Monday to Thursday on weekdays and on
            Saturday and Sunday during the weekends.
          </p>
        </div>

        {/* Weekdays Sessions */}
        <div
          className="card mb-5 border-0 shadow-lg rounded-3 overflow-hidden"
          style={{
            backgroundColor: "var(--white)",
            borderLeft: "4px solid var(--theme)",
          }}
        >
          <div
            className="card-header border-0 py-4 px-4"
            style={{
              backgroundColor: "rgba(243, 159, 95, 0.08)",
            }}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div>
                <h2 className="mb-2 fw-bold" style={{ color: "var(--theme3)" }}>
                  {sessionsData.weekdays.title}
                </h2>
                <p className="mb-0" style={{ color: "var(--text)" }}>
                  <i className="bi bi-calendar-week me-2"></i>
                  {sessionsData.weekdays.days} •{" "}
                  {sessionsData.weekdays.duration}
                </p>
              </div>
              <div className="mt-3 mt-md-0">
                <span
                  className="badge px-4 py-2 fw-normal"
                  style={{
                    backgroundColor: "var(--theme)",
                    color: "var(--white)",
                    fontSize: "1rem",
                  }}
                >
                  <i className="bi bi-clock-history me-2"></i>
                  {sessionsData.weekdays.totalHours}
                </span>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            <div className="row g-4">
              {/* Duration Info */}
              <div className="col-lg-4">
                <div
                  className="p-4 rounded-3 h-100 d-flex flex-column justify-content-center"
                  style={{
                    backgroundColor: "var(--bg2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="text-center mb-3">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "var(--theme)",
                        color: "var(--white)",
                      }}
                    >
                      <i className="bi bi-stopwatch fs-4"></i>
                    </div>
                    <h5
                      className="fw-bold mb-3"
                      style={{ color: "var(--theme3)" }}
                    >
                      Duration Details
                    </h5>
                  </div>
                  <div className="text-center">
                    <p className="mb-2 fs-5" style={{ color: "var(--text)" }}>
                      <strong>{sessionsData.weekdays.hoursPerDay}</strong>
                    </p>
                    <p className="mb-0">
                      <span style={{ color: "var(--text)" }}>
                        Weekly Total:
                      </span>{" "}
                      <strong
                        className="fs-4"
                        style={{ color: "var(--theme)" }}
                      >
                        {sessionsData.weekdays.totalHours}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Timings */}
              <div className="col-lg-8">
                <h5 className="fw-bold mb-4" style={{ color: "var(--theme3)" }}>
                  <i
                    className="bi bi-clock me-2"
                    style={{ color: "var(--theme)" }}
                  ></i>
                  Available Timings:
                </h5>
                <div className="row g-3">
                  {sessionsData.weekdays.sessions.map((session, index) => (
                    <div key={index} className="col-md-6">
                      <div
                        className="p-4 h-100 rounded-3 position-relative"
                        style={{
                          border: "2px solid var(--theme)",
                          backgroundColor: "rgba(243, 159, 95, 0.03)",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "translateY(-5px)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "translateY(0)")
                        }
                      >
                        <div className="position-absolute top-0 start-50 translate-middle">
                          <span
                            className="badge px-3 py-2 fw-semibold"
                            style={{
                              backgroundColor: "var(--theme3)",
                              color: "var(--white)",
                              fontSize: "0.875rem",
                            }}
                          >
                            {session.label}
                          </span>
                        </div>
                        <div className="text-center pt-4">
                          <div className="mb-3">
                            <i
                              className="bi bi-alarm fs-1"
                              style={{ color: "var(--theme)" }}
                            ></i>
                          </div>
                          <h3
                            className="fw-bold mb-3"
                            style={{ color: "var(--theme3)" }}
                          >
                            {session.time}
                          </h3>
                          <div className="d-flex justify-content-center">
                            <div className="me-3">
                              <small
                                className="d-block"
                                style={{ color: "var(--text)" }}
                              >
                                Start
                              </small>
                              <strong style={{ color: "var(--theme)" }}>
                                {session.time.split("–")[0].trim()}
                              </strong>
                            </div>
                            <div>
                              <small
                                className="d-block"
                                style={{ color: "var(--text)" }}
                              >
                                End
                              </small>
                              <strong style={{ color: "var(--theme)" }}>
                                {session.time.split("–")[1].trim()}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="mt-5 pt-4 border-top">
              <h5 className="fw-bold mb-4" style={{ color: "var(--theme3)" }}>
                <i
                  className="bi bi-list-task me-2"
                  style={{ color: "var(--theme)" }}
                ></i>
                Session Breakdown:
              </h5>
              <div className="row g-4">
                {sessionsData.weekdays.details.map((detail, index) => (
                  <div key={index} className="col-md-6">
                    <div
                      className="d-flex align-items-center p-3 rounded-3 h-100"
                      style={{
                        backgroundColor: "var(--bg)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        className="flex-shrink-0 me-3 rounded-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: "70px",
                          height: "70px",
                          backgroundColor:
                            index === 0
                              ? "rgba(112, 166, 177, 0.1)"
                              : "rgba(16, 28, 66, 0.1)",
                          border: `2px solid ${
                            index === 0 ? "var(--theme2)" : "var(--theme3)"
                          }`,
                        }}
                      >
                        <span
                          className="fw-bold fs-5"
                          style={{
                            color:
                              index === 0 ? "var(--theme2)" : "var(--theme3)",
                          }}
                        >
                          {detail.duration.split(" ")[0]}
                        </span>
                      </div>
                      <div>
                        <div
                          className="badge mb-1 px-2 py-1"
                          style={{
                            backgroundColor:
                              index === 0 ? "var(--theme2)" : "var(--theme3)",
                            color: "var(--white)",
                          }}
                        >
                          {detail.duration}
                        </div>
                        <h6
                          className="mb-0 fw-semibold"
                          style={{ color: "var(--theme3)" }}
                        >
                          {detail.subject}
                        </h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hifdh Note */}
            <div className="mt-5 pt-4">
              <div
                className="p-4 rounded-3 position-relative"
                style={{
                  backgroundColor: "rgba(16, 28, 66, 0.05)",
                  borderLeft: "4px solid var(--theme3)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="position-absolute top-0 start-0 translate-middle-y ms-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "var(--theme)",
                      color: "var(--white)",
                    }}
                  >
                    <i className="bi bi-exclamation-circle"></i>
                  </div>
                </div>
                <div className="ps-5">
                  <h6
                    className="fw-bold mb-2"
                    style={{ color: "var(--theme3)" }}
                  >
                    Special Note for Hifdh Students
                  </h6>
                  <p className="mb-0" style={{ color: "var(--text)" }}>
                    <strong>{sessionsData.weekdays.hifzNote}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekends Sessions */}
        <div
          className="card mb-5 border-0 shadow-lg rounded-3 overflow-hidden"
          style={{
            backgroundColor: "var(--white)",
            borderLeft: "4px solid var(--theme2)",
          }}
        >
          <div
            className="card-header border-0 py-4 px-4"
            style={{
              backgroundColor: "rgba(112, 166, 177, 0.08)",
            }}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div>
                <h2 className="mb-2 fw-bold" style={{ color: "var(--theme3)" }}>
                  {sessionsData.weekends.title}
                </h2>
                <p className="mb-0" style={{ color: "var(--text)" }}>
                  <i className="bi bi-calendar2-weekend me-2"></i>
                  {sessionsData.weekends.days}
                </p>
              </div>
              <div className="mt-3 mt-md-0">
                <span
                  className="badge px-4 py-2 fw-normal"
                  style={{
                    backgroundColor: "var(--theme2)",
                    color: "var(--white)",
                    fontSize: "1rem",
                  }}
                >
                  <i className="bi bi-calendar2-heart me-2"></i>
                  Weekend Classes
                </span>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            {/* Session Options */}
            <div className="row g-4">
              {sessionsData.weekends.sessions.map((session, index) => (
                <div key={index} className="col-lg-6">
                  <div
                    className="p-4 h-100 rounded-3 position-relative"
                    style={{
                      border: "2px solid var(--theme2)",
                      backgroundColor: "rgba(112, 166, 177, 0.03)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-5px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <span
                        className="badge px-3 py-2 fw-semibold"
                        style={{
                          backgroundColor:
                            index === 0 ? "var(--theme)" : "var(--theme3)",
                          color: "var(--white)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {session.label}
                      </span>
                    </div>
                    <div className="text-center pt-4">
                      <div className="mb-3">
                        <i
                          className={`bi ${
                            index === 0 ? "bi-sunrise" : "bi-sun"
                          } fs-1`}
                          style={{ color: "var(--theme2)" }}
                        ></i>
                      </div>
                      <h4
                        className="fw-bold mb-3"
                        style={{ color: "var(--theme3)" }}
                      >
                        {session.time}
                      </h4>

                      <div className="mb-4">
                        <p className="mb-1" style={{ color: "var(--text)" }}>
                          <i className="bi bi-calendar-check me-2"></i>
                          {sessionsData.weekends.days}
                        </p>
                        <p className="mb-1" style={{ color: "var(--text)" }}>
                          <i className="bi bi-clock me-2"></i>
                          {session.duration}
                        </p>
                        <p className="mb-0">
                          <strong style={{ color: "var(--theme2)" }}>
                            Total: {session.totalHours} per week
                          </strong>
                        </p>
                      </div>

                      <div className="d-flex justify-content-center">
                        <div className="me-4">
                          <small
                            className="d-block"
                            style={{ color: "var(--text)" }}
                          >
                            Start
                          </small>
                          <strong style={{ color: "var(--theme2)" }}>
                            {session.time.split("–")[0].trim()}
                          </strong>
                        </div>
                        <div>
                          <small
                            className="d-block"
                            style={{ color: "var(--text)" }}
                          >
                            End
                          </small>
                          <strong style={{ color: "var(--theme2)" }}>
                            {session.time.split("–")[1].trim()}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Or Separator */}
            <div className="text-center my-4">
              <div className="d-flex align-items-center justify-content-center">
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "var(--border)",
                  }}
                ></div>
                <span
                  className="mx-3 fw-bold"
                  style={{ color: "var(--theme)" }}
                >
                  OR
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "var(--border)",
                  }}
                ></div>
              </div>
            </div>

            {/* Session Details */}
            <div className="mt-4 pt-4 border-top">
              <h5 className="fw-bold mb-4" style={{ color: "var(--theme3)" }}>
                <i
                  className="bi bi-list-task me-2"
                  style={{ color: "var(--theme2)" }}
                ></i>
                Each session includes:
              </h5>
              <div className="row g-4">
                {sessionsData.weekends.details.map((detail, index) => (
                  <div key={index} className="col-md-4">
                    <div
                      className="d-flex flex-column align-items-center text-center p-3 rounded-3 h-100"
                      style={{
                        backgroundColor: "var(--bg)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          backgroundColor:
                            index === 0
                              ? "rgba(243, 159, 95, 0.1)"
                              : index === 1
                              ? "rgba(112, 166, 177, 0.1)"
                              : "rgba(16, 28, 66, 0.1)",
                          border: `2px solid ${
                            index === 0
                              ? "var(--theme)"
                              : index === 1
                              ? "var(--theme2)"
                              : "var(--theme3)"
                          }`,
                        }}
                      >
                        <span
                          className="fw-bold"
                          style={{
                            color:
                              index === 0
                                ? "var(--theme)"
                                : index === 1
                                ? "var(--theme2)"
                                : "var(--theme3)",
                          }}
                        >
                          {detail.duration.split("/")[0]}
                        </span>
                      </div>
                      <div
                        className="badge mb-2 px-2 py-1"
                        style={{
                          backgroundColor:
                            index === 0
                              ? "var(--theme)"
                              : index === 1
                              ? "var(--theme2)"
                              : "var(--theme3)",
                          color: "var(--white)",
                        }}
                      >
                        {detail.duration}
                      </div>
                      <h6
                        className="mb-0 fw-semibold"
                        style={{ color: "var(--theme3)" }}
                      >
                        {detail.subject}
                      </h6>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekend Note */}
            <div className="mt-5 pt-4">
              <div
                className="p-4 rounded-3 text-center"
                style={{
                  backgroundColor: "rgba(243, 159, 95, 0.05)",
                  border: "1px solid var(--border)",
                }}
              >
                <i
                  className="bi bi-stars fs-4 mb-3"
                  style={{ color: "var(--theme)" }}
                ></i>
                <p className="mb-0 fst-italic" style={{ color: "var(--text)" }}>
                  "{sessionsData.weekends.note}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div
          className="p-4 rounded-3 mt-5"
          style={{
            backgroundColor: "var(--bg)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="row align-items-center">
            <div className="col-md-2 col-lg-1 text-center mb-3 mb-md-0">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "var(--theme)",
                  color: "var(--white)",
                }}
              >
                <i className="bi bi-info-lg fs-5"></i>
              </div>
            </div>
            <div className="col-md-10 col-lg-11">
              <h6 className="fw-bold mb-2" style={{ color: "var(--theme3)" }}>
                <i
                  className="bi bi-megaphone me-2"
                  style={{ color: "var(--theme)" }}
                ></i>
                Important Information
              </h6>
              <div className="row">
                <div className="col-lg-6 mb-2 mb-lg-0">
                  <p className="mb-2" style={{ color: "var(--text)" }}>
                    <i
                      className="bi bi-check-circle me-2"
                      style={{ color: "var(--theme2)" }}
                    ></i>
                    Please arrive 5-10 minutes before your scheduled session
                  </p>
                </div>
                <div className="col-lg-6">
                  <p className="mb-0" style={{ color: "var(--text)" }}>
                    <i
                      className="bi bi-calendar-x me-2"
                      style={{ color: "var(--theme)" }}
                    ></i>
                    Contact administration 24 hours in advance for changes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
