import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Trans, useTranslation } from "react-i18next";

const TestimonialOne = () => {
  const { t } = useTranslation(["home"]);
  const { mainHeading, sectionTitle } = t("testimonialOne") || {};
  return (
    <section className="testimonial-section fix section-padding">
      <div className="pencil-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/client/pencil.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="girl-shape float-bob-y text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/quran-quran-svgrepo-com.svg"
          className=""
          style={{ width: "120px" }}
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="testimonial-wrapper-2">
          <div className="row g-4 align-items-center">
            <div
              className="col-lg-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="testimonial-image">
                <img
                  className="object-fit-cover"
                  src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/testimonial.png"
                  alt="image"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="testimonial-right">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    {sectionTitle}
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <Trans
                      i18nKey={mainHeading}
                      components={{ break: <br /> }}
                    />{" "}
                  </h2>
                </div>
                <div className="array-button">
                  <button className="array-prev array-prev-2">
                    <i className="fa-solid fa-arrow-up"></i>
                  </button>
                  <button className="array-next array-next-2">
                    <i className="fa-solid fa-arrow-down"></i>
                  </button>
                </div>
                <div className="swiper testimonial-slider-3">
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
                      nextEl: ".array-next-2",
                      prevEl: ".array-prev-2",
                    }}
                    className="swiper-wrapper"
                  >
                    <SwiperSlide>
                      <div className="swiper-slide">
                        <div className="testimonial-content mt-4 mt-md-0">
                          <div className="star">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star color-star"></i>
                          </div>
                          <p>
                            Nullam dignissim ante scelerisque the is euismod
                            fermentum odio sem semper the is erat a feugiat leo
                            urna eget eros. Duis Aenean a imperdiet risus.
                            Aliquam pellentesque.
                          </p>
                          <div className="client-info">
                            <img
                              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/client/01.png"
                              alt="img"
                            />
                            <div className="content">
                              <h5>Mohammad Khalid</h5>
                              <p>Managing Director & Headteacher</p>
                            </div>
                          </div>
                          <div className="icon text-end">
                            <img
                              className="w-50"
                              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/client/quote.png"
                              alt="img"
                            />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="swiper-slide">
                        <div className="testimonial-content mt-4 mt-md-0">
                          <div className="star">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star color-star"></i>
                          </div>
                          <p>
                            Nullam dignissim ante scelerisque the is euismod
                            fermentum odio sem semper the is erat a feugiat leo
                            urna eget eros. Duis Aenean a imperdiet risus.
                            Aliquam pellentesque.
                          </p>
                          <div className="client-info">
                            <img
                              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/client/01.png"
                              alt="img"
                            />
                            <div className="content">
                              <h5>Mohammad Khalid</h5>
                              <p>Managing Director & Headteacher</p>
                            </div>
                          </div>
                          <div className="icon text-end">
                            <img
                              className="w-50"
                              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/client/quote.png"
                              alt="img"
                            />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="swiper-slide">
                        <div className="testimonial-content mt-4 mt-md-0">
                          <div className="star">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star color-star"></i>
                          </div>
                          <p>
                            Nullam dignissim ante scelerisque the is euismod
                            fermentum odio sem semper the is erat a feugiat leo
                            urna eget eros. Duis Aenean a imperdiet risus.
                            Aliquam pellentesque.
                          </p>
                          <div className="client-info">
                            <img
                              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/client/01.png"
                              alt="img"
                            />
                            <div className="content">
                              <h5>Mohammad Khalid</h5>
                              <p>Managing Director & Headteacher</p>
                            </div>
                          </div>
                          <div className="icon text-end">
                            <img
                              className="w-50"
                              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/client/quote.png"
                              alt="img"
                            />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialOne;
