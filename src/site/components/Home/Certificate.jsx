import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

import { useState } from "react";

const certificate_list_data = [
  {
    id: "1",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/girl1.png",
    category_id: 1,
  },
  {
    id: "2",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/girl2.png",
    category_id: 1,
  },
  {
    id: "3",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/girl3.png",
    category_id: 1,
  },
  {
    id: "4",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/boy1.png",
    category_id: 1,
  },
  {
    id: "5",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/boy2.png",
    category_id: 1,
  },
  {
    id: "6",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/boy3.png",
    category_id: 1,
  },
  {
    id: "7",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/boy4.png",
    category_id: 2,
  },
  {
    id: "8",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/boy5.png",
    category_id: 2,
  },
  {
    id: "9",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/boy6.png",
    category_id: 2,
  },
  {
    id: "10",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/girl4.png",
    category_id: 2,
  },
  {
    id: "11",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/girl5.png",
    category_id: 2,
  },
  {
    id: "12",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/girl6.png",
    category_id: 2,
  },
  {
    id: "13",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/girl7.png",
    category_id: 3,
  },
  {
    id: "14",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/girl8.png",
    category_id: 3,
  },
  {
    id: "15",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/girl9.png",
    category_id: 3,
  },
  {
    id: "16",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/boy7.png",
    category_id: 3,
  },
  {
    id: "17",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/boy8.png",
    category_id: 3,
  },
  {
    id: "18",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certificates/boy9.png",
    category_id: 3,
  },
];

const Certificate = () => {
  const [selected_category_id, setSelected_category] = useState(1);
  return (
    <div className="certificate-section section-padding pt-0">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title mt-60">
            <div className="pricing-wrapper mt-10">
              <div className="section-title text-center mb-0 ">
                <a
                  className="theme-btn-feb-23"
                  style={{
                    backgroundColor:
                      selected_category_id === 1
                        ? "var(--theme2)"
                        : "var(--theme)",
                  }}
                  onClick={() => {
                    setSelected_category(1);
                  }}
                >
                  Category 1
                </a>

                <a
                  className="theme-btn-feb-23"
                  style={{
                    backgroundColor:
                      selected_category_id === 2
                        ? "var(--theme2)"
                        : "var(--theme)",
                  }}
                  onClick={() => {
                    setSelected_category(2);
                  }}
                >
                  Category 2
                </a>

                <a
                  className="theme-btn-feb-23"
                  style={{
                    backgroundColor:
                      selected_category_id === 3
                        ? "var(--theme2)"
                        : "var(--theme)",
                  }}
                  onClick={() => {
                    setSelected_category(3);
                  }}
                >
                  Category 3
                </a>
              </div>
            </div>
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
        <div className="swiper certificate-slider">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            speed={1500}
            loop={true}
            roundLengths={true}
            modules={[Autoplay, Navigation]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".array-next",
              prevEl: ".array-prev",
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
            {certificate_list_data
              .filter(
                (certificate, idx) =>
                  certificate.category_id === selected_category_id
              )
              .map((certificate, idx) => (
                <SwiperSlide key={certificate.id}>
                  <div className="swiper-slide">
                    <div className="certificate-image">
                      <img src={certificate.image_link} alt="img" />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
