import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useGetNewsQuery } from "../../../redux/features/news/newsAPI";
import LoadingSpinner from "../LoadingSpinner";

const NewsList = () => {
  const [selectedCategory, setSelectedCategory] = useState("voluptates");
  const { data: news, isLoading, isError, isSuccess } = useGetNewsQuery();

  const selectedNews =
    news?.data?.find((single) => single?.title === selectedCategory) || {};

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (isError) {
    return <h2 className="text-center my-4">Error loading news</h2>;
  }

  return (
    <section className="news-standard fix section-padding">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="news-standard-wrapper">
              {news?.data?.length > 0 ? (
                selectedNews?.news_and_events?.map((single) => (
                  <div key={single?.id} className="news-standard-items">
                    <div className="news-thumb">
                      {single?.media?.length > 0 ? (
                        single?.media[0]?.type === "video" ? (
                          <video controls style={{ width: "100%" }}>
                            <source
                              src={single?.media[0]?.url}
                              type="video/mp4"
                            />
                          </video>
                        ) : (
                          <img
                            style={{ height: "400px", objectFit: "cover" }}
                            src={single?.media[0]?.url}
                            alt="img"
                          />
                        )
                      ) : (
                        <img
                          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/post-1.jpg"
                          alt="img"
                        />
                      )}
                      <div className="post">
                        <span>{selectedCategory}</span>
                      </div>
                    </div>
                    <div className="news-content">
                      <ul>
                        <li>
                          <i className="fas fa-calendar-alt"></i>
                          {new Date(single?.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </li>
                        <li>
                          <i className="far fa-user"></i>
                          By admin
                        </li>
                      </ul>
                      <h3>
                        <Link
                          to={`/news-details/${selectedNews?.id}/${single?.id}`}
                        >
                          {single?.title}
                        </Link>
                      </h3>
                      <p>{single?.description}</p>
                      <Link
                        to={`/news-details/${selectedNews?.id}/${single?.id}`}
                        className="theme-btn mt-4"
                      >
                        Read More
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <h2 className="text-center my-4">No News Found</h2>
                </>
              )}

              <div className="page-nav-wrap pt-5 text-center">
                <ul>
                  <li>
                    <Link className="page-numbers" to="/">
                      <i className="fa-solid fa-arrow-left-long"></i>
                    </Link>
                  </li>
                  <li>
                    <Link className="page-numbers" to="/">
                      01
                    </Link>
                  </li>
                  <li>
                    <Link className="page-numbers" to="/">
                      02
                    </Link>
                  </li>
                  <li>
                    <Link className="page-numbers" to="/">
                      03
                    </Link>
                  </li>
                  <li>
                    <Link className="page-numbers" to="/">
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="main-sidebar">
              <div className="single-sidebar-widget">
                <div className="wid-title">
                  <h3>Search</h3>
                </div>
                <div className="search-widget">
                  <form action="#">
                    <input type="text" placeholder="Search here" />
                    <button type="submit">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </form>
                </div>
              </div>
              <div className="single-sidebar-widget">
                <div className="wid-title">
                  <h3>Categories</h3>
                </div>
                <div className="news-widget-categories">
                  <ul>
                    {isSuccess && news?.data?.length > 0 ? (
                      news?.data?.map((single) => (
                        <li
                          onClick={() => setSelectedCategory(single?.title)}
                          className={
                            selectedCategory === single?.title ? "active" : ""
                          }
                          key={single.id}
                        >
                          <Link onClick={(e) => e.preventDefault()}>
                            {single?.title}
                          </Link>
                          <span>({single?.news_and_events?.length})</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <h2 className="text-center my-4">No Category Found</h2>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              <div className="single-sidebar-widget">
                <div className="wid-title">
                  <h3>Recent Post</h3>
                </div>
                <div className="recent-post-area">
                  <div className="recent-items">
                    <div className="recent-thumb">
                      <img
                        src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/pp3.jpg"
                        alt="img"
                      />
                    </div>
                    <div className="recent-content">
                      <ul>
                        <li>
                          <i className="fa-solid fa-calendar-days"></i>
                          18 Dec, 2024
                        </li>
                      </ul>
                      <h6>
                        <Link to="news-details">
                          That Jerk Form Finance <br />
                          Really Me
                        </Link>
                      </h6>
                    </div>
                  </div>
                  <div className="recent-items">
                    <div className="recent-thumb">
                      <img
                        src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/pp4.jpg"
                        alt="img"
                      />
                    </div>
                    <div className="recent-content">
                      <ul>
                        <li>
                          <i className="fa-solid fa-calendar-days"></i>
                          18 Dec, 2024
                        </li>
                      </ul>
                      <h6>
                        <Link to="news-details">
                          How to keep Chidden Safe <br />
                          Online In Simple
                        </Link>
                      </h6>
                    </div>
                  </div>
                  <div className="recent-items">
                    <div className="recent-thumb">
                      <img
                        src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/pp5.jpg"
                        alt="img"
                      />
                    </div>
                    <div className="recent-content">
                      <ul>
                        <li>
                          <i className="fa-solid fa-calendar-days"></i>
                          18 Dec, 2024
                        </li>
                      </ul>
                      <h6>
                        <Link to="news-details">
                          Form Without Content <br />
                          Style Without
                        </Link>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="single-sidebar-widget">
                <div className="wid-title">
                  <h3>Tags</h3>
                </div>
                <div className="news-widget-categories">
                  <div className="tagcloud">
                    <Link to="news-standard">Time-Table</Link>
                    <Link to="news-details">Children</Link>
                    <Link to="news-details">Examination</Link>
                    <Link to="news-details">Class</Link>
                    <Link to="news-details">Sports</Link>
                    <Link to="news-details">Canteen</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsList;
