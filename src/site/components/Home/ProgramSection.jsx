import { Link } from "react-router";

const ProgramSection = () => {
  return (
    <section
      className="program-section section-padding section-bg-2 fix"
      id="programs"
    >
      <div className="top-shape">
        <img
          className="w-50"
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/section-top-shape.png"
          alt="shape-img"
        />
      </div>
      <div className="bottom-shape">
        <img
          className="w-50"
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
            Our Programs
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            We meet kids at their level <br /> regardless of their age
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
                    style={{ borderRadius: "70px" }}
                    // className="rounded-5"
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/photo-5.jpg"
                    alt="img"
                  />
                </div>
                <div className="clases-content">
                  <h4 style={{ color: "var(--white)" }}>
                    Arabic Qaidah, Quran & Hifdh
                  </h4>
                  <p
                    style={{
                      color: "var(--white)",
                      borderColor: "var(--white)",
                    }}
                  >
                    Allah swt the most says in the Quran : “and recite the Quran
                    (aloud) in a s...
                  </p>
                  <ul
                    style={{ color: "var(--white)" }}
                    className="clases-schedule"
                  >
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>age</span> <br />
                      5-15 years
                    </li>
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>weekly</span>{" "}
                      <br />
                      2-4 Days
                    </li>
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>time</span> <br />
                      4-6 hrs
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
                    style={{ borderRadius: "70px" }}
                    // className="rounded-5"
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/photo-13.jpg"
                    alt="img"
                  />
                </div>
                <div className="clases-content">
                  <h4 style={{ color: "var(--white)" }}>
                    Maths, English & Science
                  </h4>
                  <p
                    style={{
                      color: "var(--white)",
                      borderColor: "var(--white)",
                    }}
                  >
                    At Alyaqeen academy we have a set of dedicated tutors. Our
                    tutors try to en...
                  </p>
                  <ul
                    style={{ color: "var(--white)" }}
                    className="clases-schedule"
                  >
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>age</span> <br />
                      5-15 years
                    </li>
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>weekly</span>{" "}
                      <br />
                      2-4 Days
                    </li>
                    <li style={{ color: "var(--white)" }}>
                      <span style={{ color: "var(--white)" }}>time</span> <br />
                      4-6 hrs
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
                    style={{ borderRadius: "70px" }}
                    // className="rounded-5"
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/photo-5.jpg"
                    alt="img"
                  />
                </div>
                <div className="clases-content">
                  <h4>Arabic Language</h4>
                  <p>
                    Islam is just not religion that Muslims follow, but it is a
                    way of life.
                  </p>
                  <ul className="clases-schedule">
                    <li>
                      <span>age</span> <br />
                      5-15 years
                    </li>
                    <li>
                      <span>weekly</span> <br />
                      2-4 Days
                    </li>
                    <li>
                      <span>time</span> <br />
                      4-6 hrs
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
