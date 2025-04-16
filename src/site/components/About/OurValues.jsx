import { Trans, useTranslation } from "react-i18next";

const OurValues = () => {
  const { t } = useTranslation(["about"]);
  const { mainHeading, sectionTitle } = t("ourValue") || {};
  return (
    <section className="feature-value-section fix section-padding section-bg-2">
      <div className="shape-1">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/value/shape-1.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="shape-2 float-bob-x">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/value/shape-2.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="section-title text-center">
          <span data-aos-duration="800" data-aos="fade-up">
            {sectionTitle}
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            <Trans i18nKey={mainHeading} components={{ break: <br /> }} />
          </h2>
        </div>
        <div className="row">
          <div className="col-xl-4 col-lg-6">
            <div className="feature-value-items">
              <div
                className="value-icon-items "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="icon">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/value/icon-1.svg"
                    alt="img"
                  />
                </div>
                <div className="content">
                  <h5>Teacher Training and Progress </h5>
                  <p>
                    Adipiscing elit Praesent luctus laoreet iaculis Curabitur
                    rutrum lectus augue, ut pulvinar.
                  </p>
                </div>
              </div>
              <div
                className="value-icon-items "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="icon color-2">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/value/icon-2.svg"
                    alt="img"
                  />
                </div>
                <div className="content">
                  <h5>Nanny Selection 24/7</h5>
                  <p>
                    Adipiscing elit Praesent luctus laoreet iaculis Curabitur
                    rutrum lectus augue, ut pulvinar.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-4 col-lg-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="feature-value-items">
              <div className="feature-value-image">
                <img
                  src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/about-girl.png"
                  alt="img"
                />
                <div className="value-shape">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/cta/cta-shape-2.png"
                    className=""
                    style={{ width: "85%" }}
                    alt="shape-img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6">
            <div className="feature-value-items">
              <div
                className="value-icon-items style-2 "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="content">
                  <h5>Advanced Placement Courses</h5>
                  <p>
                    Adipiscing elit Praesent luctus laoreet iaculis Curabitur
                    rutrum lectus augue, ut pulvinar.
                  </p>
                </div>
                <div className="icon color-3">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/value/icon-3.svg"
                    alt="img"
                  />
                </div>
              </div>
              <div
                className="value-icon-items style-2 "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="content">
                  <h5>Self-contained gifted programs</h5>
                  <p>
                    Adipiscing elit Praesent luctus laoreet iaculis Curabitur
                    rutrum lectus augue, ut pulvinar.
                  </p>
                </div>
                <div className="icon color-2 color-4">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/value/icon-4.svg"
                    alt="img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
