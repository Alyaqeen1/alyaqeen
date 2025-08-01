import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Trans, useTranslation } from "react-i18next";
import { useGetReviewsQuery } from "../../../redux/features/reviews/reviewsApi";
import AwesomeStarsRating from "react-awesome-stars-rating";
import LoadingSpinner from "../LoadingSpinner";
import one from "../../assets/img/client/pencil.png";
import two from "../../assets/img/home/quran-quran-svgrepo-com.svg";
import three from "../../assets/img/home/image8.png";
import four from "../../assets/img/client/01.png";
import five from "../../assets/img/client/quote.png";

// const renderStars = (rating) => {
//   const stars = [];

//   for (let i = 1; i <= 5; i++) {
//     if (rating >= i) {
//       stars.push(<i key={i} className="fas fa-star color-star"></i>); // full star
//     } else if (rating >= i - 0.5) {
//       stars.push(<i key={i} className="fas fa-star-half-alt color-star"></i>); // half star
//     } else {
//       stars.push(<i key={i} className="far fa-star"></i>); // empty star
//     }
//   }

//   return stars;
// };

const TestimonialOne = () => {
  const { t } = useTranslation(["home"]);
  const { mainHeading, sectionTitle } = t("testimonialOne") || {};
  const { data: reviews, isLoading, isError } = useGetReviewsQuery();
  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  // if (isError) {
  //   return <h2 className="text-center my-4">Error loading Reviews</h2>;
  // }

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
                  className="object-fit-cover rounded-5"
                  src={three}
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
                    {reviews?.length > 0 ? (
                      reviews?.map((review) => (
                        <SwiperSlide key={review?.id}>
                          <div className="swiper-slide">
                            <div className="testimonial-content mt-4 mt-md-0">
                              <AwesomeStarsRating
                                value={review?.rating}
                                // onChange={handleChange}
                                isEdit={false}
                                half={true} // Optional: for half-star ratings
                                size={24} // Optional: size of the stars
                                className="my-custom-rating" // Optional: for extra styling
                              />

                              <p>{review?.description}</p>
                              <div className="client-info">
                                <div className="content">
                                  <h5>{review?.name}</h5>
                                  <p>{review?.email}</p>
                                </div>
                              </div>
                              <div className="icon text-end">
                                <img className="w-50" src={five} alt="img" />
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
                    {isError && (
                      <h2 className="text-center my-4">
                        Error loading Reviews
                      </h2>
                    )}
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
