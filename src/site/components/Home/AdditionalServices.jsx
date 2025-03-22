import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

import three from "../../assets/img/program/mask.png";
import four from "../../assets/img/program/pencil.png";
import five from "../../assets/img/program/mask-2.png";
import six from "../../assets/img/program/compass.png";
import { Link } from "react-router";
import axios from "axios";

export default function AdditionalServices() {
  const [services, setServices] = useState([]);
  useEffect(() => {
    axios("/services.json")
      .then((res) => setServices(res.data))
      .catch((error) => console.error("Error fetching staff data:", error));
  }, []);
  return (
    <section
      className="program-section section-padding section-bg-2 fix"
      id="programs"
    >
      <div className="mask-shape float-bob-x">
        <img src={three} className="w-50" alt="shape-img" />
      </div>
      <div className="pencil-shape">
        <img src={four} className="w-50" />
      </div>
      <div className="mask-shape-2 text-end">
        <img src={five} className="w-50" alt="shape-img" />
      </div>

      <div className="compass-shape text-end">
        <img src={six} className="w-50" alt="shape-img" />
      </div>
      <div className="container">
        <div className="section-title-area">
          <div className="section-title">
            <span data-aos-duration="800" data-aos="fade-up">
              Additional Services
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              Alyaqeen Academy more Services
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
        <div className="swiper team-slider-2">
          <Swiper
            slidesPerView={1}
            slidesPerGroup={1}
            freeMode={true}
            speed={1500}
            loop={true}
            spaceBetween={30}
            roundLengths={true}
            modules={[Autoplay, Navigation]}
            autoplay={{
              // delay: 2000,//original
              delay: 2000, //original
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".array-next",
              prevEl: ".array-prev",
            }}
            breakpoints={{
              1199: {
                slidesPerView: 3,
              },
              767: {
                slidesPerView: 2,
              },
            }}
            className="swiper-wrapper"
          >
            {services.map((one_Service, index) => (
              <SwiperSlide key={one_Service?.id}>
                <div className="swiper-slide">
                  <div
                    // className="col-xl-4 col-lg-6 col-md-6"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="program-box-items">
                      <div
                        // className="program-bg"
                        className={`program-bg ${
                          index === 0 || index === 3
                            ? "bg-1"
                            : index === 1 || index === 4
                            ? "bg-2"
                            : "bg-3"
                        }`}
                      ></div>
                      <div className="program-image">
                        <img
                          src={one_Service.image_link}
                          alt="img"
                          style={{
                            width: "290px",
                            height: "270px",
                            borderRadius: "150px",
                          }}
                        />
                      </div>
                      <div
                        // className="program-content text-center"
                        className={`program-content text-center ${
                          index === 0
                            ? ""
                            : index === 1 || index === 4 || index === 3
                            ? ""
                            : "style-2"
                        }`}
                      >
                        <h4>
                          <Link to={`/services/${one_Service.category}`}>
                            {one_Service.name}
                          </Link>
                        </h4>
                        <span>(4-5 years)</span>
                        <p>{one_Service.description.substring(0, 65)}...</p>
                        <Link
                          to={`/services/${one_Service.category}`}
                          className={`arrow-icon ${
                            index === 0
                              ? ""
                              : index === 1 || index === 4
                              ? "color-2"
                              : ""
                          }`}
                        >
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="pricing-wrapper mt-10">
          <div className="section-title text-center mb-0 ">
            <Link to={"/our-team"} className="theme-btn">
              All Services <i className="fa-solid fa-arrow-right-long"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
