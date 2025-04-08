import React from "react";

const PrayerComp = () => {
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
          <div className="col-lg-2">
            <button className="w-100 mb-2 theme-btn bg-white border">
              January
            </button>
            <button className="w-100 theme-btn mb-2 bg-white border">
              February
            </button>
            <button className="w-100 theme-btn mb-2 bg-white border">
              March
            </button>
            <button className="theme-btn w-100">April</button>
          </div>
          <div className="col-lg-10">
            <h3 className="mb-3">April 2025</h3>
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
                  {/* 1 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      1
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:06 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:41 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:41 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:47 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:02 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 2 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      2
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 3 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      3
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 4 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      4
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 5 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      5
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 6 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      6
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 7 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      7
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 8 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      8
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 9 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      9
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 10 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      10
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 11 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      11
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 12 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      12
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 13 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      13
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 14 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      14
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 15 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      15
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 16 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      16
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 17 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      17
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 18 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      18
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 19 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      19
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 20 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      20
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 21 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      21
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 22 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      22
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 23 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      23
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 24 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      24
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 25 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      25
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 26 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      26
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 27 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      27
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 28 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      28
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 29 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      29
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                  {/* 30 */}
                  <tr>
                    <td className="bg-white border h6 text-center align-middle">
                      30
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:03 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:30 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:38 AM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:16 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      1:30 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      5:42 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      6:00 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:43 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      7:48 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:03 PM
                    </td>
                    <td className="bg-white border h6 text-center align-middle">
                      9:30 PM
                    </td>
                  </tr>
                </tbody>
              </table>
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
