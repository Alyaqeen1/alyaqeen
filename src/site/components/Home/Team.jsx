import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import one from "../../assets/img/section-top-shape.png";
import two from "../../assets/img/team/love.png";
import three from "../../assets/img/team/frame.png";
import four from "../../assets/img/team/team-shape.png";
import five from "../../assets/img/team/01.jpg";
import six from "../../assets/img/team/02.jpg";
import seven from "../../assets/img/team/03.jpg";
import eight from "../../assets/img/team/04.jpg";
import { Link } from "react-router";

const Team = () => {
  return (
    <section className="team-section fix section-bg section-padding" id="team">
      <div className="top-shape">
        <img src={one} alt="shape-img" />
      </div>
      <div className="love-shape float-bob-x">
        <img src={two} alt="shape-img" />
      </div>
      <div className="frame-shape">
        <img src={three} alt="shape-img" />
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
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="team-items">
                  <div className="team-image">
                    <div className="shape-img">
                      <img src={four} alt="img" />
                    </div>
                    <img src={five} alt="team-img" />
                    <div className="social-profile">
                      <span className="plus-btn">
                        <i className="fas fa-share-alt"></i>
                      </span>
                      <ul>
                        <li>
                          <Link to="/">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="team-content">
                    <h3>
                      <Link to="team-details">Brooklyn Simmons</Link>
                    </h3>
                    <p>Instructors</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="team-items">
                  <div className="team-image">
                    <div className="shape-img">
                      <img src={four} alt="img" />
                    </div>
                    <img src={six} alt="team-img" />
                    <div className="social-profile">
                      <span className="plus-btn">
                        <i className="fas fa-share-alt"></i>
                      </span>
                      <ul>
                        <li>
                          <Link to="/">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="team-content">
                    <h3>
                      <Link to="team-details">Leslie Alexander</Link>
                    </h3>
                    <p>Instructors</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="team-items">
                  <div className="team-image">
                    <div className="shape-img">
                      <img src={four} alt="img" />
                    </div>
                    <img src={seven} alt="team-img" />
                    <div className="social-profile">
                      <span className="plus-btn">
                        <i className="fas fa-share-alt"></i>
                      </span>
                      <ul>
                        <li>
                          <Link to="/">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="team-content">
                    <h3>
                      <Link to="team-details">Ronald Richards</Link>
                    </h3>
                    <p>Instructors</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="team-items">
                  <div className="team-image">
                    <div className="shape-img">
                      <img src={four} alt="img" />
                    </div>
                    <img src={eight} alt="team-img" />
                    <div className="social-profile">
                      <span className="plus-btn">
                        <i className="fas fa-share-alt"></i>
                      </span>
                      <ul>
                        <li>
                          <Link to="/">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="team-content">
                    <h3>
                      <Link to="team-details">Kristin Watson</Link>
                    </h3>
                    <p>Instructors</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="team-items">
                  <div className="team-image">
                    <div className="shape-img">
                      <img src={four} alt="img" />
                    </div>
                    <img src={five} alt="team-img" />
                    <div className="social-profile">
                      <span className="plus-btn">
                        <i className="fas fa-share-alt"></i>
                      </span>
                      <ul>
                        <li>
                          <Link to="/">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="team-content">
                    <h3>
                      <Link to="team-details">Brooklyn Simmons</Link>
                    </h3>
                    <p>Instructors</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="team-items">
                  <div className="team-image">
                    <div className="shape-img">
                      <img src={four} alt="img" />
                    </div>
                    <img src={six} alt="team-img" />
                    <div className="social-profile">
                      <span className="plus-btn">
                        <i className="fas fa-share-alt"></i>
                      </span>
                      <ul>
                        <li>
                          <Link to="/">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="team-content">
                    <h3>
                      <Link to="team-details">Leslie Alexander</Link>
                    </h3>
                    <p>Instructors</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="team-items">
                  <div className="team-image">
                    <div className="shape-img">
                      <img src={four} alt="img" />
                    </div>
                    <img src={seven} alt="team-img" />
                    <div className="social-profile">
                      <span className="plus-btn">
                        <i className="fas fa-share-alt"></i>
                      </span>
                      <ul>
                        <li>
                          <Link to="/">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="team-content">
                    <h3>
                      <Link to="team-details">Ronald Richards</Link>
                    </h3>
                    <p>Instructors</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="team-items">
                  <div className="team-image">
                    <div className="shape-img">
                      <img src={four} alt="img" />
                    </div>
                    <img src={eight} alt="team-img" />
                    <div className="social-profile">
                      <span className="plus-btn">
                        <i className="fas fa-share-alt"></i>
                      </span>
                      <ul>
                        <li>
                          <Link to="/">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="/">
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="team-content">
                    <h3>
                      <Link to="team-details">Kristin Watson</Link>
                    </h3>
                    <p>Instructors</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Team;
