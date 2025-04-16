import React from "react";
import { useTranslation } from "react-i18next";

import { Link } from "react-router";

export default function AdditionalServices() {
  const { t } = useTranslation(["home"]);
  const { mainHeading, sectionTitle, allServicesButtonText } =
    t("services") || {};
  const servicesList = t("services.servicesList", { returnObjects: true });
  return (
    <section
      className="program-section section-padding section-bg-2 fix"
      id="programs"
    >
      <div className="mask-shape float-bob-x">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/mask.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="pencil-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/pencil.png"
          className="w-50"
        />
      </div>
      <div className="mask-shape-2 text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/mask-2.png"
          className="w-50"
          alt="shape-img"
        />
      </div>

      <div className="compass-shape text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/compass.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="section-title-area">
          <div className="section-title">
            <span data-aos-duration="800" data-aos="fade-up">
              {sectionTitle}
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              {mainHeading}
            </h2>
          </div>
          <div
            className="array-button"
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <button className="array-prev">
              <i className="fal fa-arrow-left"></i>
            </button>
            <button className="array-next">
              <i className="fal fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div
            className="col-xl-4 col-lg-6 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="program-box-items">
              <div className="program-bg"></div>
              <div className="program-image">
                <img
                  style={{
                    width: "300px",
                    height: "300px",
                    borderRadius: "150px",
                  }}
                  src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/online-learing.png"
                  alt="img"
                />
              </div>
              <div className="program-content text-center">
                <h4>
                  <Link to="/service/online-learning">
                    {servicesList[0]?.title}
                  </Link>
                </h4>{" "}
                <p>{servicesList[0]?.description}</p>
                <Link to="/service/online-learning" className="arrow-icon">
                  <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="col-xl-4 col-lg-6 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="program-box-items">
              <div className="program-bg bg-2"></div>
              <div className="program-image">
                <img
                  style={{
                    width: "300px",
                    height: "300px",
                    borderRadius: "150px",
                  }}
                  src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/nikaah_bg.jpg"
                  alt="img"
                />
              </div>
              <div className="program-content text-center">
                <h4>
                  <Link to="/service/nikah-service">
                    {servicesList[1]?.title}
                  </Link>
                </h4>
                <p>{servicesList[0]?.description}</p>
                <Link
                  to="/service/nikah-service"
                  className="arrow-icon color-2"
                >
                  <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="col-xl-4 col-lg-6 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <div className="program-box-items">
              <div className="program-bg bg-3"></div>
              <div className="program-image">
                <img
                  style={{
                    width: "300px",
                    height: "300px",
                    borderRadius: "150px",
                  }}
                  src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/sports-club.jpg"
                  alt="img"
                />
              </div>
              <div className="program-content text-center style-2">
                <h4>
                  <Link to="/service/sports">{servicesList[2]?.title}</Link>
                </h4>
                {/* <span>(1-2 years)</span> */}
                <p>{servicesList[2]?.description}</p>
                <Link to="/service/sports" className="arrow-icon">
                  <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pricing-wrapper mt-10">
          <div className="section-title text-center mb-0 ">
            <Link to={"/all-services"} className="theme-btn">
              {allServicesButtonText}{" "}
              <i className="fa-solid fa-arrow-right-long"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
