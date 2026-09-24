import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import one from "../../assets/img/section-top-shape.png";
import three from "../../assets/img/program/mask.png";
import four from "../../assets/img/program/pencil.png";
import five from "../../assets/img/program/mask-2.png";
import six from "../../assets/img/program/compass.png";

const HifzStructure = () => {
  const { t } = useTranslation(["home"]);
  const { mainHeading, sectionTitle, tableHeaders } = t("hifzStructure") || {};
  const programmeList =
    t("hifzStructure.programmes", { returnObjects: true }) || [];

  const { programme, weekdays, weekends } = tableHeaders || {};

  /* Renders a cell with 2 side-by-side groups:
       [price1  duration1]  │  [price2  duration2]
     Single divider only between the two groups. */
  const renderCell = (data) => {
    const hasTwoOptions = !!data?.perHour2;

    return (
      <>
        <div className="d-flex justify-content-around">
          {/* GROUP 1 */}
          <div className="mb-0 w-50 fw-light px-1">
            <div className="d-flex justify-content-around">
              <div className="mb-0 w-50">
                <Trans i18nKey={data?.perHour} components={{ sm: <small /> }} />
              </div>
              <div className="mb-0 w-50">
                <Trans
                  i18nKey={data?.perMonth}
                  components={{ sm: <small /> }}
                />
              </div>
            </div>
          </div>

          {/* DIVIDER + GROUP 2 */}
          {hasTwoOptions && (
            <div
              className="mb-0 w-50 fw-light px-1"
              style={{ borderLeft: "1px solid #dee2e6" }}
            >
              <div className="d-flex justify-content-around">
                <div className="mb-0 w-50">
                  <Trans
                    i18nKey={data?.perHour2}
                    components={{ sm: <small /> }}
                  />
                </div>
                <div className="mb-0 w-50">
                  <Trans
                    i18nKey={data?.perMonth2}
                    components={{ sm: <small /> }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <strong className="d-block mt-2">
          {data?.days}
          <br />
          {data?.duration}
        </strong>
      </>
    );
  };

  return (
    <section
      className="program-section-feb-24 section-padding section-bg-2 fix"
      id="hifz-programme"
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
          <table className="table mb-3" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <td
                  width="30%"
                  className="text-white font-weight-bold border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--theme)" }}
                >
                  <h3>{programme}</h3>
                </td>
                <td
                  width="35%"
                  className="text-white font-weight-bold border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--theme)" }}
                >
                  <h3>{weekdays}</h3>
                </td>
                <td
                  width="35%"
                  className="text-white font-weight-bold border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--theme)" }}
                >
                  <h3>{weekends}</h3>
                </td>
              </tr>
            </thead>

            <tbody>
              {programmeList.map((item, index) => {
                const isIntensive = item?.variant === "intensive";

                /* ---------- INTENSIVE ROW ---------- */
                if (isIntensive) {
                  return (
                    <tr key={index}>
                      <td
                        className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                        style={{ borderLeft: "4px solid #ffc107" }}
                      >
                        <h5>{item?.title}</h5>
                        {item?.subtitle && (
                          <small
                            className="d-block"
                            style={{ color: "var(--theme)" }}
                          >
                            {item.subtitle}
                          </small>
                        )}
                      </td>

                      {/* Weekdays column — 3-day Intensive (Fri–Sat–Sun) */}
                      <td
                        className="text-center p-1 border mb-0"
                        // style={{ backgroundColor: "#fff8e1" }}
                      >
                        {renderCell(item?.weekdays)}
                      </td>

                      {/* Weekends column — Sat + Sun intensive */}
                      <td
                        className="text-center p-1 border mb-0"
                        // style={{ backgroundColor: "#fff8e1" }}
                      >
                        {renderCell(item?.weekends)}
                      </td>
                    </tr>
                  );
                }

                /* ---------- STANDARD ROW ---------- */
                return (
                  <tr key={index}>
                    <td className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle">
                      {item?.link ? (
                        <Link to={item.link} className="font-14">
                          <h5>{item?.title}</h5>
                        </Link>
                      ) : (
                        <h5>{item?.title}</h5>
                      )}
                    </td>

                    {/* Weekdays */}
                    <td className="text-center p-1 border mb-0">
                      {renderCell(item?.weekdays)}
                    </td>

                    {/* Weekends */}
                    <td className="text-center p-1 border mb-0">
                      {renderCell(item?.weekends)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default HifzStructure;
