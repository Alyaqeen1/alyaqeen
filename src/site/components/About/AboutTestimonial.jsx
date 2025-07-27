import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useGetReviewsQuery } from "../../../redux/features/reviews/reviewsApi";
import LoadingSpinner from "../LoadingSpinner";
import three from "../../assets/img/client/shape-1.png";
import four from "../../assets/img/client/shape-2.png";

const AboutTestimonial = () => {
  const { data: reviews, isLoading, isError } = useGetReviewsQuery();
  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isError) {
    return <h2 className="text-center my-4">Error loading Reviews</h2>;
  }
  return (
    <section className="testimonial-section-2 section-padding pt-0">
      <div className="container">
        <div className="testimonial-wrapper style-2 section-padding">
          <div className="shape-1">
            <img src={three} className="w-50" alt="shape-img" />
          </div>
          <div className="shape-2">
            <img src={four} className="w-50" alt="shape-img" />
          </div>
          <div className="testimonial-bg"></div>
          <div className="section-title text-center">
            <span data-aos-duration="800" data-aos="fade-up">
              Testimonials
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              What parents say
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
              {reviews?.length > 0 ? (
                reviews?.map((review) => (
                  <SwiperSlide key={review?.id}>
                    <div className="swiper-slide">
                      <div className="testimonial-box-items">
                        <p>{review?.description}</p>
                        <div className="client-info">
                          <div className="content">
                            <h5>{review?.name}</h5>
                            <p>{review?.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <>
                  <h2 className="text-center my-4">No Reviews Found</h2>
                </>
              )}
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
