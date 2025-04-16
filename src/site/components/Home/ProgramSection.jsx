import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";

const ProgramSection = () => {
  const { t } = useTranslation(["home"]);
  const {
    mainHeading,
    sectionTitle,
    details: {
      ageLabel,
      weeklyLabel,
      timeLabel,
      ageRange,
      daysPerWeek,
      hoursPerWeek,
      // programList,
    },
  } = t("programs") || {};
  const programList = t("programs.programList", { returnObjects: true });

  return (
    <section
      className="program-section section-padding section-bg-2 fix"
      id="programs"
    >
      <div className="top-shape">
        <img
          className="w-75"
          style={{ marginTop: "-8px" }}
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/section-top-shape.png"
          alt="shape-img"
        />
      </div>
      <div className="bottom-shape">
        <img
          className="w-75"
          style={{ marginBottom: "-8px" }}
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/section-bottom-shape.png"
          alt="shape-img"
        />
      </div>
      <div className="mask-shape float-bob-x">
        <img
          className="w-50"
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/mask.png"
          alt="shape-img"
        />
      </div>
      <div className="pencil-shape">
        <img
          className="w-50"
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/pencil.png"
          alt="shape-img"
        />
      </div>
      <div className="mask-shape-2">
        <img
          className="w-50"
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/mask-2.png"
          alt="shape-img"
        />
      </div>
      <div className="compass-shape">
        <img
          className="w-50"
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/compass.png"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="section-title text-center mt-60">
          <span data-aos-duration="800" data-aos="fade-up">
            {sectionTitle}
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            {/* We meet kids at their level <br /> regardless of their age */}
            <Trans i18nKey={mainHeading} components={{ break: <br /> }} />
          </h2>
        </div>
        <div className="row">
          <div
            className="col-xl-4 col-lg-6 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="classes-items-feb-12 w-full">
              <Link to="/arabic-qaidah-quran-hifdh">
                <div
                  className="clases-bg style-2"
                  style={{
                    backgroundColor: "var(--bg3)",
                    borderRadius: "60px",
                  }}
                ></div>
                <div className="clases-image">
                  <img
                    style={{
                      borderRadius: "70px",
                      minHeight: "220px",
                      objectFit: "cover",
                    }}
                    // className="rounded-5"
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/course2.jpeg"
                    alt="img"
                  />
                </div>
                <div className="clases-content">
                  <h4 style={{ color: "var(--white)" }}>
                    {programList[0]?.title}
                  </h4>
                  <p
                    style={{
                      color: "var(--white)",
                      borderColor: "var(--white)",
                    }}
                  >
                    {programList[0]?.description}
                  </p>
                  <ul
                    style={{ color: "var(--white)" }}
                    className="clases-schedule"
                  >
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>{ageLabel}</span>{" "}
                      <br />
                      {ageRange}
                    </li>
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>
                        {weeklyLabel}
                      </span>{" "}
                      <br />
                      {daysPerWeek}
                    </li>
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>{timeLabel}</span>{" "}
                      <br />
                      {hoursPerWeek}
                    </li>
                  </ul>
                </div>
              </Link>
            </div>
          </div>

          <div
            className="col-xl-4 col-lg-6 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="classes-items-feb-12 w-full">
              <Link to="/maths-english-science">
                <div
                  className="clases-bg style-2"
                  style={{
                    backgroundColor: "var(--theme)",
                    borderRadius: "60px",
                  }}
                ></div>
                <div className="clases-image">
                  <img
                    style={{
                      borderRadius: "70px",
                      minHeight: "220px",
                      objectFit: "cover",
                    }}
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/course4.png"
                    alt="img"
                  />
                </div>
                <div className="clases-content">
                  <h4 style={{ color: "var(--white)" }}>
                    {programList[1]?.title}
                  </h4>
                  <p
                    style={{
                      color: "var(--white)",
                      borderColor: "var(--white)",
                    }}
                  >
                    {programList[1]?.description}
                  </p>
                  <ul
                    style={{ color: "var(--white)" }}
                    className="clases-schedule"
                  >
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>{ageLabel}</span>{" "}
                      <br />
                      {ageRange}
                    </li>
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>
                        {weeklyLabel}
                      </span>{" "}
                      <br />
                      {daysPerWeek}
                    </li>
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>{timeLabel}</span>{" "}
                      <br />
                      {hoursPerWeek}
                    </li>
                  </ul>
                </div>
              </Link>
            </div>
          </div>

          <div
            className="col-xl-4 col-lg-6 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="classes-items-feb-12 w-full">
              <Link to="/arabic-language">
                <div
                  className="clases-bg style-2"
                  style={{
                    backgroundColor: "var(--white)",
                    borderRadius: "60px",
                  }}
                ></div>
                <div className="clases-image">
                  <img
                    style={{
                      borderRadius: "70px",
                      minHeight: "220px",
                      objectFit: "cover",
                    }}
                    // className="rounded-5"
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/image4.jpg"
                    alt="img"
                  />
                </div>
                <div className="clases-content">
                  <h4>{programList[2]?.title}</h4>
                  <p>{programList[2]?.description}</p>
                  <ul className="clases-schedule">
                    <li>
                      <span>{ageLabel}</span> <br />
                      {ageRange}
                    </li>
                    <li>
                      <span>{weeklyLabel}</span> <br />
                      {daysPerWeek}
                    </li>
                    <li>
                      <span>{timeLabel}</span> <br />
                      {hoursPerWeek}
                    </li>
                  </ul>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
