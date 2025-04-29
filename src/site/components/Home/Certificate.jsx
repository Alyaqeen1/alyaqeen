import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import one from "../../assets/img/certificates/girl1.png";
import two from "../../assets/img/certificates/girl2.png";
import three from "../../assets/img/certificates/girl3.png";
import four from "../../assets/img/certificates/boy1.png";
import five from "../../assets/img/certificates/boy2.png";
import six from "../../assets/img/certificates/boy3.png";
import seven from "../../assets/img/certificates/boy4.png";
import eight from "../../assets/img/certificates/boy5.png";
import nine from "../../assets/img/certificates/boy6.png";
import ten from "../../assets/img/certificates/girl4.png";
import eleven from "../../assets/img/certificates/girl5.png";
import twelve from "../../assets/img/certificates/girl6.png";
import thirteen from "../../assets/img/certificates/girl7.png";
import fourteen from "../../assets/img/certificates/girl8.png";
import fifteen from "../../assets/img/certificates/girl9.png";
import sixteen from "../../assets/img/certificates/boy7.png";
import seventeen from "../../assets/img/certificates/boy8.png";
import eighteen from "../../assets/img/certificates/boy9.png";

const certificate_list_data = [
  {
    id: "1",
    image_link: one,
    category_id: 1,
  },
  {
    id: "2",
    image_link: two,
    category_id: 1,
  },
  {
    id: "3",
    image_link: three,
    category_id: 1,
  },
  {
    id: "4",
    image_link: four,
    category_id: 1,
  },
  {
    id: "5",
    image_link: five,
    category_id: 1,
  },
  {
    id: "6",
    image_link: six,
    category_id: 1,
  },
  {
    id: "7",
    image_link: seven,
    category_id: 2,
  },
  {
    id: "8",
    image_link: eight,
    category_id: 2,
  },
  {
    id: "9",
    image_link: nine,
    category_id: 2,
  },
  {
    id: "10",
    image_link: ten,
    category_id: 2,
  },
  {
    id: "11",
    image_link: eleven,
    category_id: 2,
  },
  {
    id: "12",
    image_link: twelve,
    category_id: 2,
  },
  {
    id: "13",
    image_link: thirteen,
    category_id: 3,
  },
  {
    id: "14",
    image_link: fourteen,
    category_id: 3,
  },
  {
    id: "15",
    image_link: fifteen,
    category_id: 3,
  },
  {
    id: "16",
    image_link: sixteen,
    category_id: 3,
  },
  {
    id: "17",
    image_link: seventeen,
    category_id: 3,
  },
  {
    id: "18",
    image_link: eighteen,
    category_id: 3,
  },
];

const Certificate = () => {
  const { t } = useTranslation(["home"]);
  const { category1, category2, category3 } = t("certificate");
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
                  {category1}
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
                  {category2}
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
                  {category3}
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
