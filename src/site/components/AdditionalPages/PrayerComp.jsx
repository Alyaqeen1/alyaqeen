import React, { useEffect, useState } from "react";
import axios from "axios";
import one from "../../assets/img/section-top-shape.png";
import three from "../../assets/img/program/mask.png";
import four from "../../assets/img/program/pencil.png";
import five from "../../assets/img/program/mask-2.png";
import six from "../../assets/img/program/compass.png";
import { useGetPrayerTimesQuery } from "../../../redux/features/prayer_times/prayer_timesApi";
import LoadingSpinner from "../LoadingSpinner";

const PrayerComp = () => {
  // const [times, setTimes] = useState([]);
  const date = new Date();
  const { data: times, isLoading, isError } = useGetPrayerTimesQuery();
  // console.log(data);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDate = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    day: "2-digit",
  }).format(date);
  const currentMonthName = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    month: "long",
  }).format(date);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthName); // Default view
  const months = [
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
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data } = await axios.get("/prayerTimes.json");
  //     setTimes(data);
  //   };
  //   fetchData();
  // }, []);
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (isError || !times || times.length === 0) {
    return <p>Prayer times data could not be loaded.</p>;
  }

  return (
    <section
      className="program-section-feb-24 section-padding section-bg-2 fix bg-white"
      id="programs"
    >
      <div className="top-shape">
        <img src={one} className="w-75" alt="shape-img" />
      </div>

      <div className="mask-shape float-bob-x">
        <img src={three} className="w-50" alt="shape-img" />
      </div>
      <div className="pencil-shape">
        <img src={four} className="w-50" alt="shape-img" />
      </div>
      <div className="mask-shape-2 text-end">
        <img src={five} className="w-50" alt="shape-img" />
      </div>

      <div className="compass-shape text-end">
        <img src={six} className="w-50" alt="shape-img" />
      </div>
      <div className="container">
        <div className="section-title text-center mt-60">
          <span data-aos-duration="800" data-aos="fade-up">
            {/*Our Programs*/}
            {/*Classes &amp; Fee Structure*/} Time Table
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            Time Table
          </h2>
        </div>
        <div className="row">
          <div className="col-lg-2 d-flex flex-wrap flex-lg-column gap-2 month-button-group pb-3 pb-lg-0">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`month-btn theme-btn border ${
                  selectedMonth === month ? "" : "bg-white"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
          <div className="col-lg-10">
            <h3 className="mb-3">{selectedMonth} 2025</h3>
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
                      rowSpan={2}
                      className="font-danger bg-white fw-bolder border h6 text-center align-middle"
                    >
                      Date
                    </th>
                    <th
                      colSpan={2}
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--theme)" }}
                    >
                      FAJR
                    </th>
                    <th
                      rowSpan={2}
                      className="font-danger bg-white fw-bolder border h6 text-center align-middle"
                    >
                      Sunrise
                    </th>
                    <th
                      colSpan={2}
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--theme)" }}
                    >
                      ZUHR
                    </th>
                    <th
                      colSpan={2}
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--theme)" }}
                    >
                      ASR
                    </th>
                    <th
                      colSpan={2}
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--theme)" }}
                    >
                      MAGHRIB
                    </th>
                    <th
                      colSpan={2}
                      className="font-danger text-white fw-bolder border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--theme)" }}
                    >
                      ISHA
                    </th>
                  </tr>
                  <tr>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Start
                    </th>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Jamat
                    </th>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Start
                    </th>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Jamat
                    </th>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Start
                    </th>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Jamat
                    </th>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Start
                    </th>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Jamat
                    </th>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Start
                    </th>
                    <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                      Jamat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {times?.[0]?.[selectedMonth]?.length > 0 ? (
                    times[0][selectedMonth].map((day) => (
                      <tr key={day?.date}>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.date}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.fajr?.start}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.fajr?.jamat}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.sunrise}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.zuhr?.start}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.zuhr?.jamat}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.asr?.start}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.asr?.jamat}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.maghrib?.start}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.maghrib?.jamat}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.isha?.start}
                        </td>
                        <td
                          className={`${
                            currentDate == day?.date &&
                            currentMonthName === selectedMonth
                              ? "bg-body-secondary"
                              : "bg-white"
                          } border h6 text-center align-middle text-nowrap`}
                        >
                          {day?.isha?.jamat}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12}>
                        <h5>No prayer times available for this month.</h5>
                      </td>
                    </tr>
                  )}
                  {}
                </tbody>
              </table>
            </div>
            <hr />
            <div
              style={{ backgroundColor: "var(--theme)" }}
              className="p-4 text-white rounded-4"
            >
              <div className="d-flex justify-content-between">
                <div className="mt-5">
                  <h5>Summer Jumu'ah Timetable:</h5>
                  <p>1st Jama'ah at 1:30 PM</p>
                  <p>2nd Jama'ah at 2:00 PM</p>
                  <p>3rd Jama'ah at 2:30 PM</p>
                </div>
                <h3>Jumuah Information</h3>
                <div className="mt-5">
                  <h5>Winter Jumu'ah Timetable:</h5>
                  <p>1st Jama'ah at 12:45 PM</p>
                  <p>2nd Jama'ah at 1:15 PM</p>
                  <p>2nd Jama'ah at 1:45 PM</p>
                </div>
              </div>
              <h5 className="mt-4 text-center">
                Please note: Friday Khutbah starts 5 minutes before
                congregation.
              </h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrayerComp;
