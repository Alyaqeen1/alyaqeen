import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import one from "../../assets/img/client/pencil.png";
import two from "../../assets/img/home/quran-quran-svgrepo-com.svg";
import three from "../../assets/img/home/testimonial.png";
import four from "../../assets/img/client/01.png";
import five from "../../assets/img/client/quote.png";

const TestimonialOne = () => {
  return (
    <section className="testimonial-section fix section-padding">
      <div className="pencil-shape">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="girl-shape float-bob-y text-end">
        <img
          src={two}
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
                  style={
                    {
                      // clipPath:
                      //   "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      // height: "500px",
                    }
                  }
                  className="object-fit-cover"
                  src={three}
                  alt="image"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="testimonial-right">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    Testimonials
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Parent&apos;s words are the <br /> key to happy kids
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
                            <img src={four} alt="img" />
                            <div className="content">
                              <h5>Mohammad Khalid</h5>
                              <p>Managing Director & Headteacher</p>
                            </div>
                          </div>
                          <div className="icon">
                            <img src={five} alt="img" />
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
                            <img src={four} alt="img" />
                            <div className="content">
                              <h5>Mohammad Khalid</h5>
                              <p>Managing Director & Headteacher</p>
                            </div>
                          </div>
                          <div className="icon">
                            <img src={five} alt="img" />
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
                            <img src={four} alt="img" />
                            <div className="content">
                              <h5>Mohammad Khalid</h5>
                              <p>Managing Director & Headteacher</p>
                            </div>
                          </div>
                          <div className="icon">
                            <img src={five} alt="img" />
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
