import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import one from "../../assets/img/section-top-shape.png";
import three from "../../assets/img/program/mask.png";
import four from "../../assets/img/program/pencil.png";
import five from "../../assets/img/program/mask-2.png";
import six from "../../assets/img/program/compass.png";

const FeeStructure = () => {
  const { t } = useTranslation(["home"]);
  const { mainHeading, sectionTitle, tableHeaders } = t("feeStructure") || {};
  const subjectList = t("feeStructure.subjects", { returnObjects: true });

  const { subject, weekdays, weekends } = tableHeaders || {};

  return (
    <section
      className="program-section-feb-24 section-padding section-bg-2 fix"
      id="programs"
    >
      <div className="top-shape">
        <img src={one} className="" alt="shape-img" />
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
            {sectionTitle}
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            <Trans i18nKey={mainHeading} components={{ break: <br /> }} />
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
                  <h3>{subject}</h3>
                </td>
                <td
                  width="35%"
                  // className="text-white bg-success font-weight-bold border h6 text-center align-middle"
                  className="text-white font-weight-bold border h6 text-center align-middle"
                  style={{
                    backgroundColor: "var(--theme)",
                  }}
                >
                  <h3>{weekdays}</h3>
                </td>
                <td
                  width="35%"
                  // className="text-white bg-success font-weight-bold border h6 text-center align-middle"

                  className="text-white font-weight-bold border h6 text-center align-middle"
                  style={{
                    backgroundColor: "var(--theme)",
                  }}
                >
                  <h3>{weekends}</h3>
                </td>
              </tr>
            </thead>

            {/* first row data */}
            <tbody>
              <tr>
                <td className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle">
                  <Link to={"/arabic-qaidah-quran-hifdh"}>
                    <h5>{subjectList[0]?.title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[0]?.weekdays?.perHour}
                        components={{ sm: <small /> }}
                      />
                      {/* £1.85<small>/hour</small> */}
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[0]?.weekdays?.perMonth}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {subjectList[0]?.weekdays?.days}
                    <br />
                    {subjectList[0]?.weekdays?.duration}
                  </strong>
                </td>

                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    {/* <h6 class="mb-0 w-100 border-right"><small>/</small></h6> */}
                    <div className="mb-0 w-100 border-left">
                      <Trans
                        i18nKey={subjectList[0]?.weekends?.perHour}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-left">
                      <Trans
                        i18nKey={subjectList[0]?.weekends?.perMonth}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {subjectList[0]?.weekends?.days}
                    <br />
                    {subjectList[0]?.weekends?.duration}
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
                    <h5>{subjectList[1]?.title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[1]?.weekdays?.perHour}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[1]?.weekdays?.perMonth}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {subjectList[1]?.weekdays?.days}
                    <br />
                    {subjectList[1]?.weekdays?.duration}
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={subjectList[1]?.weekends?.perHour}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={subjectList[1]?.weekends?.perMonth}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {subjectList[1]?.weekends?.days}
                    <br />
                    {subjectList[0]?.weekends?.duration}
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
                    <h5>{subjectList[2]?.title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[2]?.weekdays?.perHour}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[2]?.weekdays?.perMonth}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {subjectList[2]?.weekdays?.days}
                    <br />
                    {subjectList[2]?.weekdays?.duration}
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={subjectList[2]?.weekends?.perHour}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={subjectList[2]?.weekends?.perMonth}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {subjectList[2]?.weekends?.days}
                    <br />
                    {subjectList[2]?.weekends?.duration}
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
                    <h5>{subjectList[3]?.title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[3]?.weekdays?.perHour}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[3]?.weekdays?.perMonth}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {subjectList[3]?.weekdays?.days}
                    <br />
                    {subjectList[3]?.weekdays?.duration}
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={subjectList[3]?.weekends?.perHour}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={subjectList[3]?.weekends?.perMonth}
                        components={{ sm: <small /> }}
                      />
                    </div>
                  </div>
                  <strong>
                    {subjectList[3]?.weekends?.days}
                    <br />
                    {subjectList[3]?.weekends?.duration}
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
                    <h5>{subjectList[4]?.title}</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[4]?.weekdays?.perHour}
                        components={{ sm: <small /> }}
                      />
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      <Trans
                        i18nKey={subjectList[4]?.weekdays?.perMonth}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {subjectList[4]?.weekdays?.days}
                    <br />
                    {subjectList[4]?.weekdays?.duration}
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={subjectList[4]?.weekends?.perHour}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      <Trans
                        i18nKey={subjectList[4]?.weekends?.perMonth}
                        components={{ sm: <small /> }}
                      />{" "}
                    </div>
                  </div>
                  <strong>
                    {subjectList[4]?.weekends?.days}
                    <br />
                    {subjectList[4]?.weekends?.duration}
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
