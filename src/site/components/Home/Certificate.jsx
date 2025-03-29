import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

import { useState } from "react";

const certificate_list_data = [
  {
    id: "1",
    index: 1,
    name: "test_cat_1",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-1.jpg",
    category_id: 1,
    category_name: "best_all_rounder",
  },

  {
    id: "2",
    index: 2,
    name: "test_cat_2",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-2.jpg",

    category_id: 2,
    category_name: "best_all_batsman",
  },
  {
    id: "3",
    index: 3,

    name: "test_cat_2",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-3.jpg",
    category_id: 3,
    category_name: "best_all_bowler",
  },

  // p2

  {
    id: "4",
    index: 4,

    name: "test_cat_1",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-1.jpg",
    category_id: 1,
    category_name: "best_all_rounder",
  },

  {
    id: "5",
    index: 5,

    name: "test_cat_2",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-2.jpg",

    category_id: 2,
    category_name: "best_all_batsman",
  },
  {
    id: "6",
    index: 6,

    name: "test_cat_2",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-3.jpg",
    category_id: 3,
    category_name: "best_all_bowler",
  },

  // p3
  {
    id: "7",
    index: 7,

    name: "test_cat_1",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-1.jpg",
    category_id: 1,
    category_name: "best_all_rounder",
  },

  {
    id: "8",
    index: 8,
    name: "test_cat_2",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-2.jpg",

    category_id: 2,
    category_name: "best_all_batsman",
  },
  {
    id: "9",
    index: 9,

    name: "test_cat_2",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-3.jpg",
    category_id: 3,
    category_name: "best_all_bowler",
  },

  {
    id: "10",
    index: 10,
    name: "test_cat_2",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-1.jpg",

    category_id: 1,
    category_name: "best_all_batsman",
  },
  {
    id: "11",
    index: 11,

    name: "test_cat_2",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-2.jpg",
    category_id: 2,
    category_name: "best_all_bowler",
  },
  {
    id: "12",
    index: 12,

    name: "test_cat_2",
    navigation_link: "/about-founder",
    image_link:
      "https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/certifigate-3.jpg",
    category_id: 3,
    category_name: "best_all_bowler",
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
