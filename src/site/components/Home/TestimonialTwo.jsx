import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

const TestimonialTwo = () => {
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
            testimonials
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            Parent&apos;s words are the key <br /> to happy kids
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
                    <p>
                      I appreciate the flexibility of Alyaqeen Academy. My child
                      can learn at their own pace, which is very effective.
                    </p>
                    <h6>Ahmed Ali Al Mansoori</h6>
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
                    <p>
                      I am impressed with the quality of education provided. My
                      child is more engaged and motivated to learn.
                    </p>
                    <h6>Fatima Mohammed Al Hashmi</h6>
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
                    <p>
                      Alyaqeen Academy offers a friendly environment, and the
                      support team is always helpful. Highly recommended!
                    </p>
                    <h6>Khalid Abdullah Al Zaabi</h6>
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
                    <p>
                      Alyaqeen Academy is a game-changer for my child's
                      education. The content is engaging and well-structured.
                    </p>
                    <h6>Mariam Salem Al Mehairi</h6>
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
                    <p>
                      Alyaqeen Academy has exceeded my expectations. It’s a
                      perfect blend of technology and education for my child.
                    </p>
                    <h6>Omar Saif Al Nuaimi</h6>
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
                    <p>
                      Alyaqeen Academy has made learning fun and interactive for
                      my child. I can see their confidence growing every day.
                    </p>
                    <h6>Layla Yousuf Al Ketbi</h6>
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
                    <p>
                      The progress reports are detailed and easy to understand.
                      It helps me stay updated on my child's performance.
                    </p>
                    <h6>Yousef Ibrahim Al Shamsi</h6>
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
                    <p>
                      This LMS has transformed my child's learning experience!
                      Highly recommended! Best Platform for my child.
                    </p>
                    <h6>Ahmed Saeed Al-Mansoori</h6>
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
                    <p>
                      An amazing platform! My son now enjoys studying, and his
                      grades have improved significantly. Highly recommend!
                    </p>
                    <h6>Saeed Mohammed Al-Dhaheri</h6>
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
