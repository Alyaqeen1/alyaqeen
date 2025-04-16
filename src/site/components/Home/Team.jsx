import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Team = () => {
  const { t } = useTranslation(["home"]);

  const [staffData, setStaffData] = useState([]);
  const swiperRef = useRef(null);
  const sliderContainerRef = useRef(null);
  useEffect(() => {
    axios("/staff.json")
      .then((res) => setStaffData(res.data))
      .catch((error) => console.error("Error fetching staff data:", error));
  }, []);

  const { heading, teamName1 } = t("staff");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          swiperRef.current?.swiper?.autoplay.start();
        } else {
          swiperRef.current?.swiper?.autoplay.stop();
        }
      },
      { threshold: 0.5 } // Adjust the threshold as needed
    );

    if (sliderContainerRef.current) {
      observer.observe(sliderContainerRef.current);
    }

    return () => {
      if (sliderContainerRef.current) {
        observer.unobserve(sliderContainerRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sliderContainerRef}
      className="team-section fix section-bg section-padding"
      id="team"
    >
      <div className="top-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/section-top-shape.png"
          alt="shape-img"
        />
      </div>
      <div className="love-shape float-bob-x">
        <img
          className="w-50"
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/team/love.png"
          alt="shape-img"
        />
      </div>
      <div className="frame-shape text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/team/frame.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="section-title-area">
          <div className="section-title mt-60">
            <span data-aos-duration="800" data-aos="fade-up">
              {heading}
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              {heading}
            </h2>
          </div>
          <div
            className="array-button "
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
        <div className="swiper team-slider">
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            slidesPerGroup={1}
            freeMode={true}
            speed={1500}
            loop={true}
            spaceBetween={30}
            roundLengths={true}
            modules={[Autoplay, Navigation]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".array-next",
              prevEl: ".array-prev",
            }}
            breakpoints={{
              1299: {
                slidesPerView: 4,
              },
              1199: {
                slidesPerView: 3,
              },
              575: {
                slidesPerView: 2,
              },
            }}
            className="swiper-wrapper"
          >
            {staffData.map((state_member) => (
              <SwiperSlide key={state_member.id}>
                <div className="swiper-slide">
                  <div className="team-items">
                    <div className="team-image">
                      {/* <div className="shape-img">
                        <img
                          src={state_member.image_link}
                          alt="img"
                          style={{}}
                        />
                      </div> */}
                      <img src={state_member.image_link} alt="team-img" />
                      <div className="social-profile">
                        <span
                          className="plus-btn"
                          style={{ borderColor: "var(--theme)" }}
                        >
                          <i
                            className="fas fa-share-alt"
                            style={{ color: "var(--theme)" }}
                          ></i>
                        </span>
                        <ul>
                          <li>
                            <Link href={state_member.fb_link}>
                              <i className="fab fa-facebook-f"></i>
                            </Link>
                          </li>
                          <li>
                            <Link href={state_member.instagram_link}>
                              <i className="fa-brands fa-instagram"></i>
                            </Link>
                          </li>
                          <li>
                            <Link href={state_member.linkedin_link}>
                              <i className="fab fa-linkedin-in"></i>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="team-content">
                      <h3>
                        <Link to={`/staff-details/${state_member?.id}`}>
                          {t(state_member?.name)}
                        </Link>
                      </h3>

                      <p>
                        {/*Instructors*/}
                        {t(state_member?.post_of_staff)}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Team;
