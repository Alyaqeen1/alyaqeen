import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const Instagram = () => {
  const { t } = useTranslation(["home"]);
  const { follow } = t("instagram") || {};
  return (
    <div className="instagram-banner fix section-padding">
      <div className="instagram-wrapper">
        <h3
          className="text-center "
          data-aos-duration="800"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {follow}
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/01.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/02.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/03.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/04.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/05.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/06.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/01.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/02.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/03.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/04.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/05.jpg"
                      alt="insta-img"
                    />
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
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/instagram/06.jpg"
                      alt="insta-img"
                    />
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
