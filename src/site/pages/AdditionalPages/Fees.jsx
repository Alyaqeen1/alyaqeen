import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";

export default function Fees() {
  const weekdayClasses = [
    {
      subject: "Arabic Qaidah & Quran",
      days: "Monday to Thursday",
      time: "4:30 - 5:45pm or 5:45 - 7:15pm",
      perHour: "£1.85",
      monthly: "£40",
    },

    {
      subject: "In Centre one-to-one Qaidah/Quran Tuition",
      days: "Monday & Tuesday or Wednesday & Thursday",
      time: "7:00 - 8:00pm",
      perHour: "£10.00",
      monthly: "£80",
    },
    {
      subject: "Hifz (Memorisation)",
      days: "Monday - Thursday",
      time: "4:30 - 7:15pm",
      perHour: "£1.85",
      monthly: "£90",
    },
  ];

  const weekendClasses = [
    {
      subject: "Arabic Qaidah & Quran",
      days: "Saturday & Sunday",
      time: "10:00am - 12:30pm or 12:30 - 2:00pm",
      perHour: "£1.70",
      monthly: "£50",
    },
    {
      subject: "Primary Maths & English Tuition",
      days: "Saturday & Sunday",
      time: "10:00am - 12:00pm",
      perHour: "£4.44",
      monthly: "£80",
    },
    {
      subject: "GCSE Maths, English & Science Tuition",
      days: "Saturday & Sunday",
      time: "10:00am - 12:00pm / 10:00am - 1:00pm",
      perHour: "£5.00",
      monthly: "£100",
    },
    {
      subject: "In Centre one-to-one Qaidah/Quran Tuition",
      days: "Saturday & Sunday",
      time: "8:00 - 9:00pm or 9:00 - 10:00am",
      perHour: "£12.50",
      monthly: "£100",
    },
    {
      subject: "Hifz (Memorisation)",
      days: "Saturday & Sunday",
      time: "10:00am - 1:00pm or 12:00 - 2:30pm",
      perHour: "£2.00",
      monthly: "£60",
    },
    {
      subject: "Arabic Language",
      days: "Saturday",
      time: "9 - 10:30am / 10:30 - 11:30am",
      perHour: "£3.33",
      monthly: "£50",
    },
    {
      subject: "Urdu/Bangla Language",
      days: "Saturday & Sunday",
      time: "11:00am - 1:00pm",
      perHour: "£2.50",
      monthly: "£50",
    },
  ];

  const timetableData = {
    weekdays: [
      {
        subject: "Arabic Qaidah & Quran",
        days: "Monday to Thursday",
        time: "4:30 - 5:45pm or 5:45 - 7:15pm",
      },
      {
        subject: "In Centre one-to-one Qaidah/Quran Tuition",
        days: "Monday & Tuesday or Wednesday & Thursday",
        time: "7:00 - 8:00pm",
      },
      {
        subject: "Hifz (Memorisation)",
        days: "Monday to Thursday",
        time: "4:30 - 7:15pm",
      },
    ],
    weekends: [
      {
        subject: "Arabic Qaidah & Quran",
        days: "Saturday & Sunday",
        time: "10:00am - 12:30pm or 12:30 - 2:00pm",
      },
      {
        subject: "Primary Maths & English Tuition",
        days: "Saturday & Sunday",
        time: "10:00am - 12:00pm",
      },
      {
        subject: "GCSE Maths, English & Science Tuition",
        days: "Saturday & Sunday",
        time: "	10:00am - 12:00pm / 10:00am - 1:00pm",
      },
      {
        subject: "In Centre one-to-one Qaidah/Quran Tuition",
        days: "Saturday & Sunday",
        time: "8:00 - 9:00pm or 9:00 - 10:00am",
      },
      {
        subject: "Hifz (Memorisation)",
        days: "Saturday & Sunday",
        time: "10:00am - 1:00pm or 12:00 - 2:30pm",
      },
      {
        subject: "Arabic Language",
        days: "Saturday",
        time: "	9 - 10:30am / 10:30 - 11:30am",
      },
      {
        subject: "Urdu/Bangla Language",
        days: "Saturday & Sunday",
        time: "11:00am - 1:00pm",
      },
    ],
  };

  return (
    <div>
      <CmnBanner title="Fee Structure" />

      <div className="container py-5">
        {/* Title */}
        <div className="text-center mb-5">
          <div
            className="badge px-4 py-2 fs-5 fw-normal"
            style={{
              backgroundColor: "var(--theme)",
              color: "var(--white)",
            }}
          >
            2025-2026
          </div>
        </div>

        {/* All in One Fee Structure */}
        <div className="mb-5">
          <div
            className="p-4 rounded-3 mb-4"
            style={{
              backgroundColor: "var(--bg2)",
              borderLeft: "4px solid var(--theme2)",
            }}
          >
            <h2 className="fw-bold mb-4" style={{ color: "var(--theme3)" }}>
              <i
                className="bi bi-currency-pound me-2"
                style={{ color: "var(--theme)" }}
              ></i>
              All in One Fee
            </h2>

            {/* Weekday Classes Fee Table */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold" style={{ color: "var(--theme3)" }}>
                  <i
                    className="bi bi-calendar-week me-2"
                    style={{ color: "var(--theme)" }}
                  ></i>
                  Weekday Classes
                </h3>
                <span
                  className="badge px-3 py-2"
                  style={{
                    backgroundColor: "var(--theme)",
                    color: "var(--white)",
                  }}
                >
                  4 Days per week
                </span>
              </div>

              <div className="table-responsive">
                <table
                  className="table table-hover"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "rgba(243, 159, 95, 0.1)" }}>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme)",
                          width: "25%",
                        }}
                      >
                        Subject
                      </th>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme)",
                          width: "20%",
                        }}
                      >
                        Days
                      </th>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme)",
                          width: "20%",
                        }}
                      >
                        Time
                      </th>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme)",
                          width: "15%",
                        }}
                      >
                        Per Hour
                      </th>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme)",
                          width: "20%",
                        }}
                      >
                        Monthly Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekdayClasses.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0
                              ? "var(--white)"
                              : "rgba(243, 159, 95, 0.02)",
                        }}
                      >
                        <td
                          className="text-nowrap"
                          style={{ color: "var(--theme3)", fontWeight: "500" }}
                        >
                          <strong>{item.subject}</strong>
                        </td>
                        <td
                          className="text-nowrap"
                          style={{ color: "var(--text)" }}
                        >
                          {item.days}
                        </td>
                        <td
                          className="text-nowrap"
                          style={{ color: "var(--text)" }}
                        >
                          {item.time}
                        </td>
                        <td className="text-nowrap">
                          <span
                            className="badge px-3 py-1"
                            style={{
                              backgroundColor: "var(--theme2)",
                              color: "var(--white)",
                            }}
                          >
                            {item.perHour}
                          </span>
                        </td>
                        <td className="text-nowrap">
                          <span
                            className="badge px-3 py-2 fw-bold"
                            style={{
                              backgroundColor: "var(--theme)",
                              color: "var(--white)",
                            }}
                          >
                            {item.monthly}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weekend Classes Fee Table */}
            <div className="mt-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold" style={{ color: "var(--theme3)" }}>
                  <i
                    className="bi bi-calendar2-weekend me-2"
                    style={{ color: "var(--theme2)" }}
                  ></i>
                  Weekend Classes
                </h3>
                <span
                  className="badge px-3 py-2"
                  style={{
                    backgroundColor: "var(--theme2)",
                    color: "var(--white)",
                  }}
                >
                  2 Days per week
                </span>
              </div>

              <div className="table-responsive">
                <table
                  className="table table-hover"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "rgba(112, 166, 177, 0.1)" }}>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme2)",
                          width: "25%",
                        }}
                      >
                        Subject
                      </th>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme2)",
                          width: "20%",
                        }}
                      >
                        Days
                      </th>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme2)",
                          width: "20%",
                        }}
                      >
                        Time
                      </th>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme2)",
                          width: "15%",
                        }}
                      >
                        Per Hour
                      </th>
                      <th
                        style={{
                          color: "var(--theme3)",
                          borderBottom: "2px solid var(--theme2)",
                          width: "20%",
                        }}
                      >
                        Monthly Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekendClasses.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0
                              ? "var(--white)"
                              : "rgba(112, 166, 177, 0.02)",
                        }}
                      >
                        <td
                          className="text-nowrap"
                          style={{ color: "var(--theme3)", fontWeight: "500" }}
                        >
                          <strong>{item.subject}</strong>
                        </td>
                        <td
                          className="text-nowrap"
                          style={{ color: "var(--text)" }}
                        >
                          {item.days}
                        </td>
                        <td
                          className="text-nowrap"
                          style={{ color: "var(--text)" }}
                        >
                          {item.time}
                        </td>
                        <td className="text-nowrap">
                          <span
                            className="badge px-3 py-1"
                            style={{
                              backgroundColor: "var(--theme)",
                              color: "var(--white)",
                            }}
                          >
                            {item.perHour}
                          </span>
                        </td>
                        <td className="text-nowrap">
                          <span
                            className="badge px-3 py-2 fw-bold"
                            style={{
                              backgroundColor: "var(--theme2)",
                              color: "var(--white)",
                            }}
                          >
                            {item.monthly}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* All in One Timetable Section */}
        <div className="mb-5">
          <div
            className="p-4 rounded-3 mb-4"
            style={{
              backgroundColor: "var(--bg)",
              borderLeft: "4px solid var(--theme)",
            }}
          >
            <h2 className="fw-bold mb-3" style={{ color: "var(--theme3)" }}>
              <i
                className="bi bi-calendar-week me-2"
                style={{ color: "var(--theme)" }}
              ></i>
              All in One Timetable
            </h2>

            <div className="row g-4">
              {/* Weekdays Classes */}
              <div className="col-lg-6">
                <div
                  className="p-4 rounded-3 h-100"
                  style={{
                    backgroundColor: "var(--white)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--box-shadow)",
                  }}
                >
                  <h4
                    className="fw-bold mb-4 text-center"
                    style={{ color: "var(--theme3)" }}
                  >
                    <i
                      className="bi bi-calendar-check me-2"
                      style={{ color: "var(--theme)" }}
                    ></i>
                    Weekday Classes
                  </h4>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr
                          style={{ backgroundColor: "rgba(243, 159, 95, 0.1)" }}
                        >
                          <th
                            style={{
                              color: "var(--theme3)",
                              borderBottom: "2px solid var(--theme)",
                            }}
                          >
                            Subject
                          </th>
                          <th
                            style={{
                              color: "var(--theme3)",
                              borderBottom: "2px solid var(--theme)",
                            }}
                          >
                            Days
                          </th>
                          <th
                            style={{
                              color: "var(--theme3)",
                              borderBottom: "2px solid var(--theme)",
                            }}
                          >
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetableData.weekdays.map((item, index) => (
                          <tr key={index}>
                            <td
                              className="text-nowrap"
                              style={{
                                color: "var(--theme3)",
                                fontWeight: "500",
                              }}
                            >
                              <strong>{item.subject}</strong>
                            </td>
                            <td
                              className="text-nowrap"
                              style={{ color: "var(--text)" }}
                            >
                              {item.days}
                            </td>
                            <td
                              className="text-nowrap"
                              style={{ color: "var(--text)" }}
                            >
                              {item.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Weekend Classes */}
              <div className="col-lg-6">
                <div
                  className="p-4 rounded-3 h-100"
                  style={{
                    backgroundColor: "var(--white)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--box-shadow)",
                  }}
                >
                  <h4
                    className="fw-bold mb-4 text-center"
                    style={{ color: "var(--theme3)" }}
                  >
                    <i
                      className="bi bi-calendar2-weekend me-2"
                      style={{ color: "var(--theme2)" }}
                    ></i>
                    Weekend Classes
                  </h4>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "rgba(112, 166, 177, 0.1)",
                          }}
                        >
                          <th
                            style={{
                              color: "var(--theme3)",
                              borderBottom: "2px solid var(--theme2)",
                            }}
                          >
                            Subject
                          </th>
                          <th
                            style={{
                              color: "var(--theme3)",
                              borderBottom: "2px solid var(--theme2)",
                            }}
                          >
                            Days
                          </th>
                          <th
                            style={{
                              color: "var(--theme3)",
                              borderBottom: "2px solid var(--theme2)",
                            }}
                          >
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetableData.weekends.map((item, index) => (
                          <tr key={index}>
                            <td
                              className="text-nowrap"
                              style={{
                                color: "var(--theme3)",
                                fontWeight: "500",
                              }}
                            >
                              <strong>{item.subject}</strong>
                            </td>
                            <td
                              className="text-nowrap"
                              style={{ color: "var(--text)" }}
                            >
                              {item.days}
                            </td>
                            <td
                              className="text-nowrap"
                              style={{ color: "var(--text)" }}
                            >
                              {item.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download PDF and Notes Section */}
        <div className="row g-4">
          <div className="col-lg-6">
            <div
              className="p-4 rounded-3 h-100"
              style={{
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "var(--theme)",
                    color: "var(--white)",
                  }}
                >
                  <i className="bi bi-download fs-4"></i>
                </div>
                <div>
                  <h5
                    className="fw-bold mb-1"
                    style={{ color: "var(--theme3)" }}
                  >
                    Download Fee Structure
                  </h5>
                  <p className="mb-0" style={{ color: "var(--text)" }}>
                    Get the complete fee structure as PDF
                  </p>
                </div>
              </div>
              <button
                className="btn w-100 py-3 fw-bold"
                style={{
                  backgroundColor: "var(--theme)",
                  color: "var(--white)",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--theme2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--theme)")
                }
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                DOWNLOAD PDF
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div
              className="p-4 rounded-3 h-100"
              style={{
                backgroundColor: "var(--bg2)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "var(--theme2)",
                    color: "var(--white)",
                  }}
                >
                  <i className="bi bi-info-circle fs-4"></i>
                </div>
                <div>
                  <h5
                    className="fw-bold mb-1"
                    style={{ color: "var(--theme3)" }}
                  >
                    Important Notes
                  </h5>
                </div>
              </div>
              <ul className="list-unstyled mb-0">
                <li className="mb-2 d-flex align-items-start">
                  <i
                    className="bi bi-check-circle me-2 mt-1"
                    style={{ color: "var(--theme2)" }}
                  ></i>
                  <span style={{ color: "var(--text)" }}>
                    All fees are monthly and payable in advance
                  </span>
                </li>
                <li className="mb-2 d-flex align-items-start">
                  <i
                    className="bi bi-check-circle me-2 mt-1"
                    style={{ color: "var(--theme2)" }}
                  ></i>
                  <span style={{ color: "var(--text)" }}>
                    Sibling discounts available upon request
                  </span>
                </li>
                <li className="mb-2 d-flex align-items-start">
                  <i
                    className="bi bi-check-circle me-2 mt-1"
                    style={{ color: "var(--theme2)" }}
                  ></i>
                  <span style={{ color: "var(--text)" }}>
                    One-time registration fee: £20 (non-refundable)
                  </span>
                </li>
                <li className="d-flex align-items-start">
                  <i
                    className="bi bi-check-circle me-2 mt-1"
                    style={{ color: "var(--theme2)" }}
                  ></i>
                  <span style={{ color: "var(--text)" }}>
                    Contact administration for payment plans
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
