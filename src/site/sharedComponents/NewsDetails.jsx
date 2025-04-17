import three from "../assets/img/news/comment.png";
import four from "../assets/img/news/comment-2.png";

import { Link, useParams } from "react-router";

import { useEffect } from "react";
import { useGetNewsQuery } from "../../redux/features/news/newsAPI";
import LoadingSpinner from "../components/LoadingSpinner";

const NewsDetails = () => {
  const { categoryId, newsId } = useParams();

  const {
    data: news,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetNewsQuery();

  useEffect(() => {
    refetch(); // Force refetch when component mounts
  }, [refetch]);

  const singleCategory = news?.data?.find(
    (category) => category.id === parseInt(categoryId)
  );

  const singleNews = singleCategory?.news_and_events?.find(
    (single) => single?.id === parseInt(newsId)
  );
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (isError) {
    return <h2 className="text-center my-4">Error loading news</h2>;
  }

  return (
    <section className="news-details fix section-padding">
      <div className="container">
        <div className="news-details-area">
          <div className="row g-5">
            <div className="col-12">
              <div className="blog-post-details">
                <div className="single-blog-post">
                  <div className="post-featured-thumb bg-cover">
                    {singleNews?.media?.length > 0 ? (
                      singleNews?.media[0]?.type === "video" ? (
                        <video
                          controls
                          style={{ width: "100%", height: "100%" }}
                        >
                          <source
                            src={singleNews?.media[0]?.url}
                            type="video/mp4"
                          />
                        </video>
                      ) : (
                        <img
                          style={{
                            width: "100%",
                            height: "450px",
                            objectFit: "cover",
                          }}
                          src={singleNews?.media[0]?.url}
                          alt="img"
                        />
                      )
                    ) : (
                      <img
                        style={{
                          width: "100%",
                          height: "450px",
                          objectFit: "cover",
                        }}
                        src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/post-1.jpg"
                        alt="img"
                      />
                    )}
                  </div>
                  <div className="post-content">
                    <ul className="post-list d-flex align-items-center">
                      <li>
                        <i className="fa-regular fa-user"></i>
                        By Admin
                      </li>
                      <li>
                        <i className="fa-solid fa-calendar-days"></i>
                        {new Date(singleNews?.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </li>
                      <li>
                        <i className="fa-solid fa-tag"></i>
                        {singleCategory?.title}
                      </li>
                    </ul>
                    <h3>{singleNews?.title} </h3>
                    <p className="mb-3">
                      Consectetur adipisicing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore of magna aliqua. Ut enim ad
                      minim veniam, made of owl the quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea dolor commodo
                      consequat. Duis aute irure and dolor in reprehenderit.
                    </p>
                    <p className="mb-3">
                      The is ipsum dolor sit amet consectetur adipiscing elit.
                      Fusce eleifend porta arcu In hac habitasse the is platea
                      augue thelorem turpoi dictumst. In lacus libero faucibus
                      at malesuada sagittis placerat eros sed istincidunt augue
                      ac ante rutrum sed the is sodales augue consequat.
                    </p>
                    <p>
                      Nulla facilisi. Vestibulum tristique sem in eros eleifend
                      imperdiet. Donec quis convallis neque. In id lacus
                      pulvinar lacus, eget vulputate lectus. Ut viverra bibendum
                      lorem, at tempus nibh mattis in. Sed a massa eget lacus
                      consequat auctor.
                    </p>
                    <div className="hilight-text mt-4 mb-4">
                      <p>{singleNews?.description}</p>
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.71428 20.0711H0.5V5.64258H14.9286V20.4531L9.97665 30.3568H3.38041L8.16149 20.7947L8.5233 20.0711H7.71428Z"
                          stroke="#F39F5F"
                        />
                        <path
                          d="M28.2846 20.0711H21.0703V5.64258H35.4989V20.4531L30.547 30.3568H23.9507L28.7318 20.7947L29.0936 20.0711H28.2846Z"
                          stroke="#F39F5F"
                        />
                      </svg>
                    </div>
                    <p className="mt-4 mb-5">
                      Lorem ipsum dolor sit amet consectetur adipiscing elit Ut
                      et massa mi. Aliquam in hendrerit urna. Pellentesque sit
                      amet sapien fringilla, mattis ligula consectetur, ultrices
                      mauris. Maecenas vitae mattis tellus. Nullam quis
                      imperdiet augue. Vestibulum auctor ornare leo, non
                      suscipit magna interdum eu. Curabitur pellentesque nibh
                      nibh, at maximus ante fermentum sit amet. Pellentesque
                      commodo lacus at sodales sodales. Quisque sagittis orci ut
                      diam condimentum, vel euismod erat placerat. In iaculis
                      arcu eros.
                    </p>
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="details-image">
                          {singleNews?.media?.length > 0 &&
                          singleNews?.media[1] ? (
                            singleNews?.media[1]?.type === "video" ? (
                              <video
                                controls
                                style={{
                                  width: "100%",
                                }}
                              >
                                <source
                                  src={singleNews?.media[1]?.url}
                                  type="video/mp4"
                                />
                              </video>
                            ) : (
                              <img src={singleNews?.media[1]?.url} alt="img" />
                            )
                          ) : (
                            <img
                              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/post-5.jpg"
                              alt="img"
                            />
                          )}

                          {/* <img src={one} alt="img" /> */}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="details-image">
                          {singleNews?.media?.length > 0 &&
                          singleNews?.media[2] ? (
                            singleNews?.media[2]?.type === "video" ? (
                              <video
                                controls
                                style={{
                                  width: "100%",
                                  // height: "100%",
                                }}
                              >
                                <source
                                  src={singleNews?.media[2]?.url}
                                  type="video/mp4"
                                />
                              </video>
                            ) : (
                              <img src={singleNews?.media[2]?.url} alt="img" />
                            )
                          ) : (
                            <img
                              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/post-6.jpg"
                              alt="img"
                            />
                          )}
                          {/* <img src={two} alt="img" /> */}
                        </div>
                      </div>
                    </div>

                    <p className="pt-5">
                      Consectetur adipisicing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore of magna aliqua. Ut enim ad
                      minim veniam, made of owl the quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea dolor commodo
                      consequat. Duis aute irure and dolor in
                      reprehenderit.Consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore of magna aliqua. Ut
                      enim ad minim veniam, made of owl the quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea dolor
                      commodo consequat. Duis aute irure and dolor in
                      reprehenderit.
                    </p>
                  </div>
                </div>
                <div className="row tag-share-wrap mt-4 mb-5">
                  <div className="col-lg-8 col-12">
                    <div className="tagcloud">
                      <Link to="news-details">Class</Link>
                      <Link to="news-details">Sports</Link>
                      <Link to="news-details">Canteen</Link>
                    </div>
                  </div>
                  <div className="col-lg-4 col-12 mt-3 mt-lg-0 text-lg-end">
                    <div className="social-share">
                      <span className="me-3">Share:</span>
                      <Link to="/">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                      <Link to="/">
                        <i className="fab fa-twitter"></i>
                      </Link>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="comments-area">
                  <div className="comments-heading">
                    <h3>02 Comments</h3>
                  </div>
                  <div className="blog-single-comment d-flex gap-4 pt-4 pb-5">
                    <div className="image">
                      <img src={three} alt="image" />
                    </div>
                    <div className="content">
                      <div className="head d-flex flex-wrap gap-2 align-items-center justify-content-between">
                        <div className="con">
                          <h5>
                            <Link to="news-details">Albert Flores</Link>
                          </h5>
                          <span>March 20, 2024 at 2:37 pm</span>
                        </div>
                        <div className="star">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <p className="mt-30 mb-4">
                        Neque porro est qui dolorem ipsum quia quaed inventor
                        veritatis et quasi architecto var sed efficitur turpis
                        gilla sed sit amet finibus eros. Lorem Ipsum is simply
                        dummy
                      </p>
                      <Link to="news-details" className="reply">
                        Reply
                      </Link>
                    </div>
                  </div>
                  <div className="blog-single-comment d-flex gap-4 pt-5 pb-5">
                    <div className="image">
                      <img src={four} alt="image" />
                    </div>
                    <div className="content">
                      <div className="head d-flex flex-wrap gap-2 align-items-center justify-content-between">
                        <div className="con">
                          <h5>
                            <Link to="news-details">Alex Flores</Link>
                          </h5>
                          <span>March 20, 2024 at 2:37 pm</span>
                        </div>
                        <div className="star">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <p className="mt-30 mb-4">
                        Neque porro est qui dolorem ipsum quia quaed inventor
                        veritatis et quasi architecto var sed efficitur turpis
                        gilla sed sit amet finibus eros. Lorem Ipsum is simply
                        dummy
                      </p>
                      <Link to="news-details" className="reply">
                        Reply
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="comment-form-wrap pt-5">
                  <h3>Leave a comments</h3>
                  <form action="#" id="contact-form" method="POST">
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <span>Your Name*</span>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Your Name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <span>Your Email*</span>
                          <input
                            type="text"
                            name="email"
                            id="email2"
                            placeholder="Your Email"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-clt">
                          <span>Message*</span>
                          <textarea
                            name="message"
                            id="message"
                            placeholder="Write Message"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <button type="submit" className="theme-btn ">
                          post comment
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsDetails;
