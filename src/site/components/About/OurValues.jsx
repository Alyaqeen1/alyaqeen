import { Trans, useTranslation } from "react-i18next";
import one from "../../assets/img/value/shape-1.png";
import two from "../../assets/img/value/shape-2.png";
import three from "../../assets/img/value/icon-1.svg";
import four from "../../assets/img/value/icon-2.svg";
import five from "../../assets/img/about/about-girl.png";
import six from "../../assets/img/cta/cta-shape-2.png";
import seven from "../../assets/img/value/icon-3.svg";
import eight from "../../assets/img/value/icon-4.svg";

const OurValues = () => {
  const { t } = useTranslation(["about"]);
  const { mainHeading, sectionTitle } = t("ourValue") || {};
  return (
    <section className="feature-value-section fix section-padding section-bg-2">
      <div className="shape-1">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="shape-2 float-bob-x">
        <img src={two} className="w-50" alt="shape-img" />
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
                  <img src={three} alt="img" />
                </div>
                <div className="content">
                  <h5>Teacher Training and Progress </h5>
                  <p>
                    Regular training in Islamic pedagogy, child psychology, and
                    modern methods helps our teachers grow alongside their
                    students.
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
                  <img src={four} alt="img" />
                </div>
                <div className="content">
                  <h5>Nanny Selection 24/7</h5>
                  <p>
                    Carefully vetted support staff ensure your child’s safety
                    and well-being at all times.
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
                <img src={five} alt="img" />
                <div className="value-shape">
                  <img
                    src={six}
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
                  <h5>Advanced Curriculum</h5>
                  <p>
                    Balanced learning in Qur’an, Arabic, Islamic Studies, and UK
                    core subjects to nurture faith and academic growth.
                  </p>
                </div>
                <div className="icon color-3">
                  <img src={seven} alt="img" />
                </div>
              </div>
              <div
                className="value-icon-items style-2 "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="content">
                  <h5>Enrichment Programs</h5>
                  <p>
                    Tailored support and programs for students who excel in Deen
                    and Dunya.
                  </p>
                </div>
                <div className="icon color-2 color-4">
                  <img src={eight} alt="img" />
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
