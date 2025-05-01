import { Link } from "react-router";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import one from "../assets/img/about/kaaba-svgrepo-com.svg";
import two from "../assets/img/section-top-shape-2.png";
import three from "../assets/img/client/shape-2.png";
import four from "../assets/img/about/academy.png";
import five from "../assets/img/about/radius-shape.png";
import six from "../assets/img/about/circle.png";
import eight from "../assets/img/about/icon-5.svg";
import nine from "../assets/img/about/icon-6.svg";
import ten from "../assets/img/team/team01.jpeg";

const AboutMain = ({
  image,
  title,
  subtitle,
  mainPara,
  para2,
  para3,
  para4,
  para5,
}) => {
  const [read_more_btn, setRead_more_btn] = useState(false);
  const { t } = useTranslation(["common"]);
  const {
    sportTitle,
    sportDescription,
    learnTitle,
    learnDescription,
    read,
    more,
    less,
  } = t("aboutMain");
  const { name, post, call } = t("director");
  return (
    <section className="about-activities-section-2 style-2 section-padding">
      <div className="zebra-shape float-bob-y w-25 text-end">
        <img src={one} style={{ width: "35%" }} alt="shape-img" />
      </div>
      <div className="bottom-shape">
        <img src={two} alt="shape-img" />
      </div>
      <div className="sun-shape">
        <img src={three} className="w-50" alt="shape-img" />
      </div>
      <div className="container">
        <div className="about-activities-wrapper style-2">
          <div className="row g-4">
            <div
              className="col-lg-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="activities-image-items">
                <img src={image || four} alt="img" />
                <div className="radius-shape">
                  <img src={five} className="w-50" alt="shape-img" />
                </div>
                <div className="circle-shape text-end">
                  <img src={six} className="w-50" alt="shape-img" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="activities-content">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    {subtitle}
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    {title}
                  </h2>
                </div>
                <p
                  className="mt-3 mt-md-0 mb-3"
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  {mainPara}
                </p>
                {read_more_btn ? (
                  <>
                    <p
                      className="mb-3 mt-3 mt-md-0"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      {para2}
                    </p>

                    {/*para 3 of about us page begins here*/}
                    <p
                      className="mb-3 mt-3 mt-md-0"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      {para3}
                    </p>
                    {/*para 4 of about us page begins here*/}
                    <p
                      className="mb-3 mt-3 mt-md-0"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      {para4}
                    </p>

                    <p
                      className="mb-3 mt-3 mt-md-0"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      {para5}
                    </p>
                  </>
                ) : (
                  <></>
                )}
                <div
                  className="read-more-wrapper-div"
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <button
                    // href="/about"
                    onClick={() => {
                      setRead_more_btn(!read_more_btn);
                    }}
                    className="theme-btn"
                  >
                    {read} {read_more_btn ? less : more}{" "}
                    <i className="fa-solid fa-arrow-right-long"></i>
                  </button>
                </div>

                <div className="row g-4 mt-4">
                  <div
                    className="col-xl-6 col-lg-8 col-md-6 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="icon-items">
                      <div className="icon">
                        <img src={eight} alt="img" />
                      </div>
                      <div className="content">
                        <h5>{sportTitle}</h5>
                        <p>
                          <Trans
                            i18nKey={sportDescription}
                            components={{ break: <br /> }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xl-6 col-lg-8 col-md-6 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <div className="icon-items">
                      <div className="icon">
                        <img src={nine} alt="img" />
                      </div>
                      <div className="content">
                        <h5>{learnTitle}</h5>
                        <p>
                          <Trans
                            i18nKey={learnDescription}
                            components={{ break: <br /> }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about-author">
                  <div
                    className="author-image "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <img
                      src={ten}
                      className="rounded-circle object-fit-cover"
                      style={{ width: "60px", height: "60px" }}
                      alt="author-img"
                    />

                    <div className="content">
                      <h6>{name}</h6>
                      <p>{post}</p>
                    </div>
                  </div>
                  <div
                    className="author-icon "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <div className="icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="content">
                      <span>{call}</span>
                      <h5>
                        <Link to="tel:+07869636849">+07869636849</Link>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMain;
