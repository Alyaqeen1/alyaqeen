import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import one from "../../assets/img/certifigate-1.jpg";
import two from "../../assets/img/certifigate-2.jpg";
import three from "../../assets/img/certifigate-3.jpg";

const Certificate = () => {
  return (
    <div className="certificate-section section-padding pt-0">
      <div className="container">
        <div className="swiper certificate-slider">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            speed={1500}
            loop={true}
            roundLengths={true}
            modules={[Autoplay]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              991: {
                slidesPerView: 3,
              },
              767: {
                slidesPerView: 2,
              },
            }}
            className="swiper-wrapper"
          >
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="certificate-image">
                  <img src={one} alt="img" />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="certificate-image">
                  <img src={two} alt="img" />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="certificate-image">
                  <img src={three} alt="img" />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="certificate-image">
                  <img src={one} alt="img" />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="certificate-image">
                  <img src={two} alt="img" />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="certificate-image">
                  <img src={three} alt="img" />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
