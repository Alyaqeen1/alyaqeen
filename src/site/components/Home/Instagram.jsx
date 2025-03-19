import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import one from "../../assets/img/instagram/01.jpg";
import two from "../../assets/img/instagram/02.jpg";
import three from "../../assets/img/instagram/03.jpg";
import four from "../../assets/img/instagram/04.jpg";
import five from "../../assets/img/instagram/05.jpg";
import six from "../../assets/img/instagram/06.jpg";
import { Link } from "react-router";

const Instagram = () => {
  return (
    <div className="instagram-banner fix section-padding">
      <div className="instagram-wrapper">
        <h3
          className="text-center "
          data-aos-duration="800"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Follow Instagram
        </h3>
        <div className="swiper instagram-banner-slider">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            speed={1500}
            loop={true}
            roundLengths={true}
            modules={[Autoplay]}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              1399: {
                slidesPerView: 6,
              },
              1199: {
                slidesPerView: 5,
              },
              991: {
                slidesPerView: 4,
              },
              767: {
                slidesPerView: 3,
              },
              650: {
                slidesPerView: 2,
              },
            }}
            className="swiper-wrapper"
          >
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={one} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={two} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={three} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={four} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={five} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={six} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={one} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={two} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={three} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={four} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={five} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="instagram-banner-items">
                  <div className="banner-image">
                    <img src={six} alt="insta-img" />
                    <Link to="/" className="icon">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Instagram;
