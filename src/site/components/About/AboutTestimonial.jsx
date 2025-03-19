import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import three from "../../assets/img/client/shape-1.png";
import four from "../../assets/img/client/shape-2.png";
import five from "../../assets/img/client/01.png";

const AboutTestimonial = () => {
  return (
    <section className="testimonial-section-2 section-padding pt-0">
      <div className="container">
        <div className="testimonial-wrapper style-2 section-padding">
          <div className="shape-1">
            <img src={three} alt="shape-img" />
          </div>
          <div className="shape-2">
            <img src={four} alt="shape-img" />
          </div>
          <div className="testimonial-bg"></div>
          <div className="section-title text-center">
            <span data-aos-duration="800" data-aos="fade-up">
              Testimonials
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              What clients say
            </h2>
          </div>
          <div className="swiper testimonial-slider-2">
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
                delay: 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                nextEl: ".array-next",
                prevEl: ".array-prev",
              }}
              className="swiper-wrapper"
            >
              <SwiperSlide>
                <div className="swiper-slide">
                  <div className="testimonial-box-items">
                    <p>
                      Nunc vulputate tempor leo quis accumsan Sed vel mauris
                      bibendum dignissim nisl a dapibus tortor Fusce sagittis
                      est fringilla auctor eros vitae aliquam mauris Ut et elit
                      consectetur porta felis ac interdum dolor Maecenas neque
                      mi ullamcorper id sapien ac elementum
                    </p>
                    <div className="client-info">
                      <img src={five} alt="img" />
                      <div className="content">
                        <h5>Ronald Richards</h5>
                        <p>Co, Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="swiper-slide">
                  <div className="testimonial-box-items">
                    <p>
                      Nunc vulputate tempor leo quis accumsan Sed vel mauris
                      bibendum dignissim nisl a dapibus tortor Fusce sagittis
                      est fringilla auctor eros vitae aliquam mauris Ut et elit
                      consectetur porta felis ac interdum dolor Maecenas neque
                      mi ullamcorper id sapien ac elementum
                    </p>
                    <div className="client-info">
                      <img src={five} alt="img" />
                      <div className="content">
                        <h5>Ronald Richards</h5>
                        <p>Co, Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="swiper-slide">
                  <div className="testimonial-box-items">
                    <p>
                      Nunc vulputate tempor leo quis accumsan Sed vel mauris
                      bibendum dignissim nisl a dapibus tortor Fusce sagittis
                      est fringilla auctor eros vitae aliquam mauris Ut et elit
                      consectetur porta felis ac interdum dolor Maecenas neque
                      mi ullamcorper id sapien ac elementum
                    </p>
                    <div className="client-info">
                      <img src={five} alt="img" />
                      <div className="content">
                        <h5>Ronald Richards</h5>
                        <p>Co, Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="swiper-slide">
                  <div className="testimonial-box-items">
                    <p>
                      Nunc vulputate tempor leo quis accumsan Sed vel mauris
                      bibendum dignissim nisl a dapibus tortor Fusce sagittis
                      est fringilla auctor eros vitae aliquam mauris Ut et elit
                      consectetur porta felis ac interdum dolor Maecenas neque
                      mi ullamcorper id sapien ac elementum
                    </p>
                    <div className="client-info">
                      <img src={five} alt="img" />
                      <div className="content">
                        <h5>Ronald Richards</h5>
                        <p>Co, Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="swiper-slide">
                  <div className="testimonial-box-items">
                    <p>
                      Nunc vulputate tempor leo quis accumsan Sed vel mauris
                      bibendum dignissim nisl a dapibus tortor Fusce sagittis
                      est fringilla auctor eros vitae aliquam mauris Ut et elit
                      consectetur porta felis ac interdum dolor Maecenas neque
                      mi ullamcorper id sapien ac elementum
                    </p>
                    <div className="client-info">
                      <img src={five} alt="img" />
                      <div className="content">
                        <h5>Ronald Richards</h5>
                        <p>Co, Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="swiper-slide">
                  <div className="testimonial-box-items">
                    <p>
                      Nunc vulputate tempor leo quis accumsan Sed vel mauris
                      bibendum dignissim nisl a dapibus tortor Fusce sagittis
                      est fringilla auctor eros vitae aliquam mauris Ut et elit
                      consectetur porta felis ac interdum dolor Maecenas neque
                      mi ullamcorper id sapien ac elementum
                    </p>
                    <div className="client-info">
                      <img src={five} alt="img" />
                      <div className="content">
                        <h5>Ronald Richards</h5>
                        <p>Co, Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="array-button">
            <button className="array-prev">
              <i className="fal fa-arrow-left"></i>
            </button>
            <button className="array-next">
              <i className="fal fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTestimonial;
