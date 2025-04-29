import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import one from "../../assets/img/cta/plane.png";
import two from "../../assets/img/cta/pencil.png";
import five from "../../assets/img/cta/cta-bg.jpg";
import six from "../../assets/img/cta/cta-new-image.png";

const CTA = () => {
  const { t } = useTranslation(["home"]);
  const { mainHeading, sectionTitle, applyBtn } = t("cta") || {};
  return (
    <section
      className="cta-section fix section-padding bg-cover"
      style={{
        backgroundImage: `url(${five})`,
      }}
    >
      <div className="plane-shape">
        <img src={one} className="w-50" alt="img" />
      </div>
      <div className="pencil-shape text-end">
        <img src={two} className="w-50" alt="img" />
      </div>
      <div className="container">
        <div className="cta-wrapper">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6">
              <div className="section-title">
                <span
                  className="text-white "
                  data-aos-duration="800"
                  data-aos="fade-up"
                >
                  {sectionTitle}
                </span>
                <h2
                  className="text-white "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Trans i18nKey={mainHeading} components={{ break: <br /> }} />
                </h2>
              </div>
              <div
                className="cta-button mt-4 mt-md-0 "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <Link to="/apply-now" className="theme-btn bg-white">
                  {applyBtn} <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
            <div
              className="col-lg-5 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="cta-image">
                <img
                  className="w-100"
                  // style={{ height: "400px" }}
                  src={six}
                  alt="cta-img"
                />

                <div
                  // style={{ bottom: "20%", right: "10%" }}
                  className="cta-shape text-start"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
