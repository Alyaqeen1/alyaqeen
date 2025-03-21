import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import one from "../../assets/img/tree-shape.png";
import two from "../../assets/img/testi-r-shape.png";
import three from "../../assets/img/testi-bee-shape.png";
import four from "../../assets/img/team/team-shape.png";
import five from "../../assets/img/team/01.jpg";
import six from "../../assets/img/team/02.jpg";
import seven from "../../assets/img/team/03.jpg";
import eight from "../../assets/img/team/04.jpg";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

const AboutTeam = () => {
  const [staffData, setStaffData] = useState([]);
  useEffect(() => {
    axios("/staff.json")
      .then((res) => setStaffData(res.data))
      .catch((error) => console.error("Error fetching staff data:", error));
  }, []);

  console.log(staffData);
  return (
    <section className="team-section-3 fix  section-padding pt-1 mt-60">
      <div className="tree-shape float-bob-x">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="right-shape text-end">
        <img src={two} className="w-50" alt="shape-img" />
      </div>
      <div className="bee-shape float-bob-y text-end">
        <img src={three} className="w-50" alt="shape-img" />
      </div>
      <div className="container">
        <div className="section-title-area">
          <div className="section-title mt-60">
            <span data-aos-duration="800" data-aos="fade-up">
              Our Experts
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              Our Expert Instructors
            </h2>
          </div>
          <div
            className="array-button "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <button className="array-prev bor-1">
              <i className="fal fa-arrow-left"></i>
            </button>
            <button className="array-next">
              <i className="fal fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="swiper team-slider">
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
              delay: 3000,
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
            {" "}
            {staffData.map((state_member) => (
              <>
                <SwiperSlide key={state_member.id}>
                  <div className="swiper-slide">
                    <div className="team-items">
                      <div className="team-image">
                        <div className="shape-img">
                          <img src={four} alt="img" />
                        </div>
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
                          <Link to={`/staff-details/${state_member.id}`}>
                            {state_member.name}
                          </Link>
                        </h3>

                        <p>{state_member.post_of_staff}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;
