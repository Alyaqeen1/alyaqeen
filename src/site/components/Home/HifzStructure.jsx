import React from "react";
import { Trans, useTranslation } from "react-i18next";
import one from "../../assets/img/section-top-shape.png";
import three from "../../assets/img/program/mask.png";
import four from "../../assets/img/program/pencil.png";
import five from "../../assets/img/program/mask-2.png";
import six from "../../assets/img/program/compass.png";

const HifzStructure = () => {
  const { t } = useTranslation(["home"]);
  const { mainHeading, sectionTitle, tableHeaders, classTimings } =
    t("hifzStructure") || {};
  const programmeList =
    t("hifzStructure.programmes", { returnObjects: true }) || [];

  const { programme, daysPerWeek, monthlyFee } = tableHeaders || {};

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

        {/* ─── TIMINGS INFO CARD ─────────────────────────── */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-10">
            <div className="row g-3">
              <div className="col-md-6">
                <div
                  className="h-100 p-3 rounded-3"
                  style={{
                    backgroundColor: "#fff",
                    borderLeft: "4px solid var(--theme)",
                  }}
                >
                  <h5 className="mb-2" style={{ color: "var(--theme)" }}>
                    📚 {classTimings?.weekdayLabel}
                  </h5>
                  <p className="mb-1 fw-bold">{classTimings?.weekdayDays}</p>
                  <p className="mb-0 text-muted">
                    🕓 {classTimings?.weekdayTime}
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div
                  className="h-100 p-3 rounded-3"
                  style={{
                    backgroundColor: "#fff",
                    borderLeft: "4px solid var(--theme)",
                  }}
                >
                  <h5 className="mb-2" style={{ color: "var(--theme)" }}>
                    📚 {classTimings?.weekendLabel}
                  </h5>
                  <p className="mb-1 fw-bold">{classTimings?.weekendDays}</p>
                  <p className="mb-0 text-muted">
                    🕐 {classTimings?.weekendTime}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center mt-3 mb-0 small text-muted">
              {classTimings?.note}
            </p>
          </div>
        </div>

        {/* ─── FEE TABLE ─────────────────────────────────── */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="table-responsive">
              <table className="table mb-3" style={{ minWidth: 500 }}>
                <thead>
                  <tr>
                    <td
                      className="text-white font-weight-bold border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--theme)" }}
                    >
                      <h3>{programme}</h3>
                    </td>
                    <td
                      className="text-white font-weight-bold border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--theme)" }}
                    >
                      <h3>{daysPerWeek}</h3>
                    </td>
                    <td
                      className="text-white font-weight-bold border h6 text-center align-middle"
                      style={{ backgroundColor: "var(--theme)" }}
                    >
                      <h3>{monthlyFee}</h3>
                    </td>
                  </tr>
                </thead>

                <tbody>
                  {programmeList.map((item, index) => (
                    <tr key={index}>
                      <td className="text-white p-2 bg-brown font-weight-bold border h6 text-center align-middle">
                        <h5 className="mb-0">{item?.title}</h5>
                      </td>

                      <td className="text-center p-2 border align-middle">
                        <strong>{item?.days}</strong>
                      </td>

                      <td className="text-center p-2 border align-middle">
                        <Trans
                          i18nKey={item?.perMonth}
                          components={{ sm: <small /> }}
                        />
                        <br />
                        <small className="text-muted">
                          <Trans
                            i18nKey={item?.perHour}
                            components={{ sm: <small /> }}
                          />
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HifzStructure;
