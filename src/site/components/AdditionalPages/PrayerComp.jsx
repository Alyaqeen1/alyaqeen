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
        <div className="table-responsive mb-3">
          <table
            className="table mb-0"
            style={{
              minWidth: 700,
            }}
          >
            <thead>
              <tr>
                <td
                  colSpan={6}
                  // className="border bg-danger text-white border-left-0 border-right-0 h6 text-center font-weight-bold"
                  className="border text-white border-left-0 border-right-0 h6 text-center font-weight-bold"
                  style={{
                    backgroundColor: "var(--theme)",
                  }}
                >
                  Weekdays Classes
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
                  Session 1
                </td>
                <td className="font-danger bg-white font-weight-bold border h6 text-center align-middle">
                  Session 2
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
                  Monday - Thursday
                </td>
                <td className="bg-white border h6 text-center align-middle">
                  4:30 to 6:00pm
                </td>
                <td className="bg-white border h6 text-center align-middle">
                  5:45 to 7:15pm
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
                  Monday - Thursday
                </td>
                <td className="bg-white border h6 text-center align-middle">
                  4:30 to 6:00pm
                </td>
                <td className="bg-white border h6 text-center align-middle">
                  5:45 to 7:15pm
                </td>
                <td className="bg-white border h6 text-center align-middle">
                  £60
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="table-responsive">
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
        </div>
      </div>
      {/*     </div>
            </div>
        </div>*/}
    </section>
  );
};

export default PrayerComp;
