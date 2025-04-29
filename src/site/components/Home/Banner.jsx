import { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalVideo from "react-modal-video";
import { Link } from "react-router";
import one from "../../assets/img/hero/bottom.png";
import two from "../../assets/img/hero/parasuit.png";
import three from "../../assets/img/hero/left.png";
import four from "../../assets/img/hero/book.png";
import five from "../../assets/img/hero/pencil.png";
import six from "../../assets/img/hero/bee.png";
import seven from "../../assets/img/hero/right.png";
import eight from "../../assets/img/hero/star.png";
import nine from "../../assets/img/home/image8.png";
import ten from "../../assets/img/hero/hero-shape.png";

const Banner = () => {
  const [isOpen, setOpen] = useState(false);
  const { t, i18n } = useTranslation(["home"]);
  // const { i18n } = useTranslation();
  const {
    mainHeading: { part1, part2, part3 },
    subHeading,
    description,
    buttons: { apply, timetable, playVideo },
  } = t("banner") || {};
  // const description = t("description");
  return (
    <>
      <section
        style={{
          textAlign: i18n.language === "ar" ? "right" : "left",
        }}
        className="hero-section hero-1 fix"
      >
        <div className="bottom-shape">
          <img
            src={one}
            className="w-75"
            alt="shape-img"
            //   className="shape-image"
          />
        </div>
        <div className="parasuit-shape float-bob-y">
          <img src={two} alt="shape-img" className="w-75" />
        </div>
        <div className="left-shape">
          <img src={three} alt="shape-img" className="w-50" />
        </div>
        <div className="book-shape float-bob-x">
          <img src={four} alt="shape-img" className="w-75" />
        </div>
        <div className="pencil-shape text-end">
          <img src={five} alt="shape-img" className="w-50" />
        </div>
        <div className="bee-shape float-bob-y text-end">
          <img src={six} alt="shape-img" className="w-50" />
        </div>
        <div className="right-shape text-end">
          <img src={seven} alt="shape-img" className="w-50 " />
        </div>
        <div className="star-shape">
          <img src={eight} alt="shape-img" className="w-50" />
        </div>
        <div className="container">
          <div className="row g-4 align-items-center pt-5">
            <div className="col-lg-6">
              <div className="hero-content">
                <h5 data-aos-duration="800" data-aos="fade-up">
                  {subHeading}
                </h5>
                <h2
                  data-aos-duration={800}
                  data-aos="fade-up"
                  data-aos-delay={10}
                  // className="fs-1"
                >
                  {part1}
                  <br /> <span>{part2}</span> {part3}
                </h2>
                <p
                  data-aos-duration={800}
                  data-aos="fade-up"
                  data-aos-delay={10}
                >
                  {description}
                </p>
                <div className="hero-button">
                  <Link
                    to="/apply-now"
                    className="theme-btn "
                    data-aos-duration={800}
                    data-aos="fade-up"
                    data-aos-delay={100}
                  >
                    {apply} <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                  <span
                    className="button-text "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay={400}
                  >
                    <a
                      className="video-btn ripple video-popup"
                      onClick={() => setOpen(true)}
                    >
                      <i className="fa-solid fa-play"></i>
                    </a>
                    <span className="ms-4 d-line">{playVideo}</span>
                  </span>
                </div>
                <div className="hero-button-feb3 mt-4 text-start">
                  <Link
                    className="theme-btn-feb-4"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="600"
                    to="/prayer-timetable"
                    // className="theme-btn"
                  >
                    {timetable}
                    {/*<i className="fa-solid fa-arrow-right-long"></i>*/}
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="hero-image"
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <img
                  src={nine}
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.2))",
                  }}
                  alt="hero-img"
                  className="rounded-5"
                />
                <div className="hero-shape">
                  <img src={ten} alt="shape-img" className="w-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 0 }}
        isOpen={isOpen}
        videoId="bEnHsAApltc"
        // videoId="Cn4G2lZ_g2I"
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default Banner;
