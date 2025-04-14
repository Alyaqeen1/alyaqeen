import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Trans, useTranslation } from "react-i18next";

const TestimonialTwo = () => {
  const { t } = useTranslation(["home"]);
  const {
    heading1,
    heading2,
    testimonial1: { review1, author1 },
    testimonial2: { review2, author2 },
    testimonial3: { review3, author3 },
    testimonial4: { review4, author4 },
    testimonial5: { review5, author5 },
    testimonial6: { review6, author6 },
    testimonial7: { review7, author7 },
    testimonial8: { review8, author8 },
    testimonial9: { review9, author9 },
  } = t("testimonialTwo") || {};
  return (
    <section className="testimonial-section fix section-padding">
      <div className="tree-shape float-bob-y">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/tree-shape.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="right-shape text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/testi-r-shape.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="bee-shape float-bob-y text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/testi-bee-shape.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="section-title text-center">
          <span data-aos-duration="800" data-aos="fade-up">
            {heading2}
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            <Trans i18nKey={heading1} components={{ break: <br /> }} />
          </h2>
        </div>
        <div className="swiper testimonial-slider">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            speed={1500}
            loop={true}
            roundLengths={true}
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              el: ".dot",
              clickable: true,
            }}
            breakpoints={{
              1199: {
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
                <div className="testimonial-items">
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/quote.png"
                      className="w-50"
                      alt="img"
                    />
                  </div>
                  <div className="testimonial-bg"></div>
                  <div className="testimonial-content">
                    <p>{review1}</p>
                    <h6>{author1}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-2">
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/quote-2.png"
                      className="w-50"
                      alt="img"
                    />
                  </div>
                  <div className="testimonial-bg bg-2"></div>
                  <div className="testimonial-content">
                    <p>{review2}</p>
                    <h6>{author2}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-3">
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/quote-3.png"
                      className="w-50"
                      alt="img"
                    />
                  </div>
                  <div className="testimonial-bg bg-3"></div>
                  <div className="testimonial-content">
                    <p>{review3}</p>
                    <h6>{author3}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items">
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/quote.png"
                      className="w-50"
                      alt="img"
                    />
                  </div>
                  <div className="testimonial-bg"></div>
                  <div className="testimonial-content">
                    <p>{review4}</p>
                    <h6>{author4}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-2">
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/quote-2.png"
                      className="w-50"
                      alt="img"
                    />
                  </div>
                  <div className="testimonial-bg bg-2"></div>
                  <div className="testimonial-content">
                    <p>{review5}</p>
                    <h6>{author5}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-3">
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/quote-3.png"
                      className="w-50"
                      alt="img"
                    />
                  </div>
                  <div className="testimonial-bg bg-3"></div>
                  <div className="testimonial-content">
                    <p>{review6}</p>
                    <h6>{author6}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items">
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/quote.png"
                      className="w-50"
                      alt="img"
                    />
                  </div>
                  <div className="testimonial-bg"></div>
                  <div className="testimonial-content">
                    <p>{review7}</p>
                    <h6>{author7}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-2">
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/quote-2.png"
                      className="w-50"
                      alt="img"
                    />
                  </div>
                  <div className="testimonial-bg bg-2"></div>
                  <div className="testimonial-content">
                    <p>{review8}</p>
                    <h6>{author8}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-3">
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/quote-3.png"
                      className="w-50"
                      alt="img"
                    />
                  </div>
                  <div className="testimonial-bg bg-3"></div>
                  <div className="testimonial-content">
                    <p>{review9}</p>
                    <h6>{author9}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <div className="swiper-dot text-center pt-5">
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialTwo;
