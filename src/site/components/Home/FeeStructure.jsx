import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";

const FeeStructure = () => {
  const { t } = useTranslation(["home"]);
  const {
    heading1,
    heading2,
    title1,
    title2,
    title3,
    subject1,
    subject2,
    subject3,
    subject4,
    subject5,
  } = t("feeStructure") || {};
  const {
    sub1Title,
    weekdays1: { dayPerHour1, dayPerMonth1, dayDays1, dayDuration1 },
    weekends1: { endPerHour1, endPerMonth1, endDays1, endDuration1 },
  } = subject1 || {};
  const {
    sub2Title,
    weekdays2: { dayPerHour2, dayPerMonth2, dayDays2, dayDuration2 },
    weekends2: { endPerHour2, endPerMonth2, endDays2, endDuration2 },
  } = subject2 || {};
  const {
    sub3Title,
    weekdays3: { dayPerHour3, dayPerMonth3, dayDays3, dayDuration3 },
    weekends3: { endPerHour3, endPerMonth3, endDays3, endDuration3 },
  } = subject3 || {};
  const {
    sub4Title,
    weekdays4: { dayPerHour4, dayPerMonth4, dayDays4, dayDuration4 },
    weekends4: { endPerHour4, endPerMonth4, endDays4, endDuration4 },
  } = subject4 || {};
  const {
    sub5Title,
    weekdays5: { dayPerHour5, dayPerMonth5, dayDays5, dayDuration5 },
    weekends5: { endPerHour5, endPerMonth5, endDays5, endDuration5 },
  } = subject5 || {};

  return (
    <section
      className="program-section-feb-24 section-padding section-bg-2 fix"
      id="programs"
    >
      <div className="top-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/section-top-shape.png"
          className=""
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
            {heading2}
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            <Trans i18nKey={heading1} components={{ break: <br /> }} />
          </h2>
        </div>
        <div className="row table-responsive">
          <table
            className="table mb-3"
            // style="min-width:700px;"

            style={{
              minWidth: 700,
            }}
          >
            <thead>
              <tr>
                <td
                  width="30%"
                  // className="text-white bg-success font-weight-bold border h6 text-center align-middle"

                  className={`text-white font-weight-bold border h6 text-center align-middle`}
                  style={{
                    backgroundColor: "var(--theme)",
                  }}

                  // className={`text-white $var(--theme) font-weight-bold border h6 text-center align-middle`}
                >
                  <h3>{title1}</h3>
                </td>
                <td
                  width="35%"
                  // className="text-white bg-success font-weight-bold border h6 text-center align-middle"
                  className="text-white font-weight-bold border h6 text-center align-middle"
                  style={{
                    backgroundColor: "var(--theme)",
                  }}
                >
                  <h3>{title2}</h3>
                </td>
                <td
                  width="35%"
                  // className="text-white bg-success font-weight-bold border h6 text-center align-middle"

                  className="text-white font-weight-bold border h6 text-center align-middle"
                  style={{
                    backgroundColor: "var(--theme)",
                  }}
                >
                  <h3>{title3}</h3>
                </td>
              </tr>
            </thead>

            {/* first row data */}
            <tbody>
              <tr>
                <td className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle">
                  <Link to={"/arabic-qaidah-quran-hifdh"}>
                    <h5>{sub1Title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerHour1}
                        components={{ sm: <small /> }}
                      />
                      {/* £1.85<small>/hour</small> */}
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerMonth1}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {dayDays1}
                    <br />
                    {dayDuration1}
                  </strong>
                </td>

                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    {/* <h6 class="mb-0 w-100 border-right"><small>/</small></h6> */}
                    <div className="mb-0 w-100 border-left">
                      <Trans
                        i18nKey={endPerHour1}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-left">
                      <Trans
                        i18nKey={endPerMonth1}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {endDays1}
                    <br />
                    {endDuration1}
                  </strong>
                </td>
              </tr>

              {/* 2nd row data  */}
              <tr>
                <td
                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                  // className="p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/maths-english-science"}
                    // className="text-danger font-14"
                    className="font-14"
                  >
                    <h5>{sub2Title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerHour2}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerMonth2}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {dayDays2}
                    <br />
                    {dayDuration2}
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={endPerHour2}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={endPerMonth2}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {endDays2}
                    <br />
                    {endDuration2}
                  </strong>
                </td>
              </tr>

              {/* 3rd row data */}
              <tr>
                <td
                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                  // className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/maths-english-science"}
                    // to="https://alyaqeen.co.uk/maths-english-and-science-tuition-primary"
                    // className="text-danger font-14"

                    className="font-14"
                  >
                    <h5>{sub3Title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerHour3}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerMonth3}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {dayDays3}
                    <br />
                    {dayDuration3}
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={endPerHour3}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={endPerMonth3}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {endDays3}
                    <br />
                    {endDuration3}
                  </strong>
                </td>
              </tr>

              {/* 4th row data */}
              <tr>
                <td
                  // className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"

                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/arabic-qaidah-quran-hifdh"}
                    // to="https://alyaqeen.co.uk/arabic-qaidah-quran-hifdh"
                    className="font-14"
                    // className="text-danger font-14"
                  >
                    <h5>{sub4Title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerHour4}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerMonth4}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {dayDays4}
                    <br />
                    {dayDuration4}
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={endPerHour4}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={endPerMonth4}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {endDays4}
                    <br />
                    {endDuration4}
                  </strong>
                </td>
              </tr>

              {/* 5th row data  */}
              <tr>
                <td
                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                  // className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/arabic-language"}
                    // to="https://alyaqeen.co.uk/arabic-language"
                    className="font-14"
                    // className="text-danger font-14"
                  >
                    <h5>{sub5Title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerHour5}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={dayPerMonth5}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {dayDays5}
                    <br />
                    {dayDuration5}
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={endPerHour5}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={endPerMonth5}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {endDays5}
                    <br />
                    {endDuration5}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    /* </div>
     </div>
 </section>*/
  );
};

export default FeeStructure;
