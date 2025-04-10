import React, { useEffect, useState } from "react";
import axios from "axios";

const PrayerComp = () => {
  const [times, setTimes] = useState([]);
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });
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
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/prayerTimes.json");
      setTimes(data);
    };
    fetchData();
  }, []);

  console.log(times[selectedMonth]);
  return (
    <section
      className="program-section-feb-24 section-padding section-bg-2 fix bg-white"
      id="programs"
    >
      <div className="top-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/section-top-shape.png"
          className="w-75"
          alt="shape-img"
        />
      </div>

      <div className="mask-shape float-bob-x">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/mask.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="pencil-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/pencil.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="mask-shape-2 text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/mask-2.png"
          className="w-50"
          alt="shape-img"
        />
      </div>

      <div className="compass-shape text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/compass.png"
          className="w-50"
          alt="shape-img"
        />
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
                  {times[selectedMonth]?.length > 0 ? (
                    times[selectedMonth]?.map((day) => (
                      <tr key={day?.date}>
                        <td className="bg-white border h6 text-center align-middle text-nowrap">
                          {day?.date}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.fajr?.start}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.fajr?.jamat}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.sunrise}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.zuhr?.start}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.zuhr?.jamat}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.asr?.start}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.asr?.jamat}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.maghrib?.start}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.maghrib?.jamat}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.isha?.start}
                        </td>
                        <td className="bg-white border h6 text-center align-middle">
                          {day?.isha?.start}
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
            <div>
              <h3>Jumuah Information</h3>
              <div className="my-4">
                <h5>Summer Jumu'ah Timetable:</h5>
                <p>1st Jama'ah at 1:40pm</p>
                <p>2nd Jama'ah at 2:30pm</p>
              </div>
              <div>
                <h5>Winter Jumu'ah Timetable:</h5>
                <p>1st Jama'ah at 1:00pm</p>
                <p>2nd Jama'ah at 1:45pm</p>
              </div>
              <h5 className="mt-4">
                Please note Friday Khutbah/Sermon starts 30 minutes before
                congregation.
              </h5>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="table-responsive">
              <table
                className="table mb-0"
                // style="min-width:700px;"

                style={{
                  minWidth: 700,

                  // backgroundColor: "#E7CAD0",
                  // "background-color:rgba(5, 69, 35, 0.7);"

                  //   style="background-color:rgba(193, 193, 193, 0.7);"
                }}
              >
                <thead>
                  <tr>
                    <td
                      colSpan={5}
                      // className="border bg-danger text-white border-left-0 border-right-0 h6 text-center font-weight-bold"
                      className="border text-white border-left-0 border-right-0 h6 text-center font-weight-bold"
                      style={{
                        backgroundColor: "var(--theme)",
                      }}
                    >
                      Weekend Classes
                    </td>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="font-danger bg-white font-weight-bold border h6 text-center align-middle">
                      Name
                    </td>
                    <td className="font-danger bg-white font-weight-bold border h6 text-center align-middle">
                      Year Group
                    </td>
                    <td className="font-danger bg-white font-weight-bold border h6 text-center align-middle">
                      Days
                    </td>
                    <td className="font-danger bg-white font-weight-bold border h6 text-center align-middle">
                      Time
                    </td>
                    <td className="font-danger bg-white font-weight-bold border h6 text-center align-middle">
                      Fee Per Month
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      Qaidah/Quran
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6 to 15 Years Old
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      Saturday & Sunday
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      10:00 to 1:00pm
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      £40
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      Hifdh (Memorisation)
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6 to 15 Years Old
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      Saturday & Sunday
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      10:00 to 2:00pm
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      £60
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> */}
      {/*     </div>
            </div>
        </div>*/}
    </section>
  );
};

export default PrayerComp;
