import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import one from "../../assets/img/tree-shape.png";
import two from "../../assets/img/testi-r-shape.png";
import three from "../../assets/img/testi-bee-shape.png";
import four from "../../assets/img/quote.png";
import five from "../../assets/img/quote-2.png";
import six from "../../assets/img/quote-3.png";

const TestimonialTwo = () => {
  return (
    <section className="testimonial-section fix section-padding">
      <div className="tree-shape float-bob-y">
        <img src={one} alt="shape-img" />
      </div>
      <div className="right-shape">
        <img src={two} alt="shape-img" />
      </div>
      <div className="bee-shape float-bob-y">
        <img src={three} alt="shape-img" />
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
                    <img src={four} alt="img" />
                  </div>
                  <div className="testimonial-bg"></div>
                  <div className="testimonial-content">
                    <p>
                      Corquent per conubia nostra, per inceptos himenaeos.
                      Suspendisse gravida vitae nisi Class aptent taciti
                      sociosqu ad litora
                    </p>
                    <h6>Esther Howard</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-2">
                  <div className="icon">
                    <img src={five} alt="img" />
                  </div>
                  <div className="testimonial-bg bg-2"></div>
                  <div className="testimonial-content">
                    <p>
                      Corquent per conubia nostra, per inceptos himenaeos.
                      Suspendisse gravida vitae nisi Class aptent taciti
                      sociosqu ad litora
                    </p>
                    <h6>Wade Warren</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-3">
                  <div className="icon">
                    <img src={six} alt="img" />
                  </div>
                  <div className="testimonial-bg bg-3"></div>
                  <div className="testimonial-content">
                    <p>
                      Corquent per conubia nostra, per inceptos himenaeos.
                      Suspendisse gravida vitae nisi Class aptent taciti
                      sociosqu ad litora
                    </p>
                    <h6>Jenny Wilson</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items">
                  <div className="icon">
                    <img src={four} alt="img" />
                  </div>
                  <div className="testimonial-bg"></div>
                  <div className="testimonial-content">
                    <p>
                      Corquent per conubia nostra, per inceptos himenaeos.
                      Suspendisse gravida vitae nisi Class aptent taciti
                      sociosqu ad litora
                    </p>
                    <h6>Esther Howard</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-2">
                  <div className="icon">
                    <img src={five} alt="img" />
                  </div>
                  <div className="testimonial-bg bg-2"></div>
                  <div className="testimonial-content">
                    <p>
                      Corquent per conubia nostra, per inceptos himenaeos.
                      Suspendisse gravida vitae nisi Class aptent taciti
                      sociosqu ad litora
                    </p>
                    <h6>Wade Warren</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="swiper-slide">
                <div className="testimonial-items style-3">
                  <div className="icon">
                    <img src={six} alt="img" />
                  </div>
                  <div className="testimonial-bg bg-3"></div>
                  <div className="testimonial-content">
                    <p>
                      Corquent per conubia nostra, per inceptos himenaeos.
                      Suspendisse gravida vitae nisi Class aptent taciti
                      sociosqu ad litora
                    </p>
                    <h6>Jenny Wilson</h6>
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
