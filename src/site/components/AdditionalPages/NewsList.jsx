import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useGetNewsQuery } from "../../../redux/features/news/newsAPI";
import LoadingSpinner from "../LoadingSpinner";
import one from "../../assets/img/news/post-1.jpg";

import four from "../../assets/img/news/pp3.jpg";
import five from "../../assets/img/news/pp4.jpg";
import six from "../../assets/img/news/pp5.jpg";

const NewsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const itemsPerPage = 5; // Change as needed
  const { data: news, isLoading, isError, isSuccess } = useGetNewsQuery();
  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    setSelectedCategory(news?.data[0]?.title.toString());
  }, [news]);

  const selectedNews =
    news?.data?.find((single) => single?.title === selectedCategory) || {};
  const allNewsItems = selectedNews?.news_and_events || [];
  // Get current items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNewsItems = allNewsItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Total pages
  const totalPages = Math.ceil(allNewsItems.length / itemsPerPage);

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (isError) {
    return <h2 className="text-center my-4">Error loading news</h2>;
  }
  const filteredNewsItems = currentNewsItems.filter((single) =>
    single?.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <section className="news-standard fix section-padding">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="news-standard-wrapper">
              {news?.data?.length > 0 && filteredNewsItems?.length > 0 ? (
                filteredNewsItems?.map((single) => (
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
                        <img src={one} alt="img" />
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
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="page-numbers"
                      disabled={currentPage === 1}
                    >
                      <i className="fa-solid fa-arrow-left-long"></i>
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i}>
                      <button
                        onClick={() => setCurrentPage(i + 1)}
                        className={`page-numbers`}
                        style={{
                          backgroundColor:
                            currentPage === i + 1 ? "var(--theme)" : "",
                        }}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className="page-numbers"
                      disabled={currentPage === totalPages}
                    >
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </button>
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
                    <input
                      onChange={(e) => setSearchText(e.target.value)}
                      type="text"
                      placeholder="Search here"
                    />
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
                          onClick={() => {
                            setSelectedCategory(single?.title);
                            setCurrentPage(1);
                          }}
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
                      <img src={four} alt="img" />
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
                      <img src={five} alt="img" />
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
                      <img src={six} alt="img" />
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
