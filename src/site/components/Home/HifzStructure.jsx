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

  /* Renders a cell with 2 groups side-by-side using CSS grid.
     Grid guarantees fixed 2-column layout — no wrapping, no collapsing.
     Padding is applied per-cell so it survives narrow screens. */
  const renderCell = (data) => {
    const hasTwoOptions = !!data?.perHour2;

    const renderPrice = (hourKey, monthKey) => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          className="fw-light"
          style={{
            padding: "2px 4px",
            fontSize: "inherit",
            lineHeight: "1.4",
          }}
        >
          <Trans i18nKey={hourKey} components={{ sm: <small /> }} />
        </div>

        <div
          className="fw-light"
          style={{
            padding: "2px 4px",
            fontSize: "inherit",
            lineHeight: "1.4",
          }}
        >
          <Trans i18nKey={monthKey} components={{ sm: <small /> }} />
        </div>
      </div>
    );

    return (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: hasTwoOptions ? "1fr 1fr" : "1fr",
            width: "100%",
            alignItems: "start",
          }}
        >
          <div
            style={{
              padding: "4px 8px",
              borderRight: hasTwoOptions ? "1px solid #dee2e6" : "none",
            }}
          >
            {renderPrice(data?.perHour, data?.perMonth)}
          </div>

          {hasTwoOptions && (
            <div style={{ padding: "4px 8px" }}>
              {renderPrice(data?.perHour2, data?.perMonth2)}
            </div>
          )}
        </div>

        <div
          className="mt-2"
          style={{
            fontWeight: 700,
            lineHeight: "1.5",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          <div>{data?.days}</div>
          <div>{data?.duration}</div>
        </div>
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
          <table
            className="table mb-3 hifz-structure-table"
            style={{ minWidth: 700 }}
          >
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

                      <td className="text-center p-1 border mb-0">
                        {renderCell(item?.weekdays)}
                      </td>

                      <td className="text-center p-1 border mb-0">
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

                    <td className="text-center p-1 border mb-0">
                      {renderCell(item?.weekdays)}
                    </td>

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
