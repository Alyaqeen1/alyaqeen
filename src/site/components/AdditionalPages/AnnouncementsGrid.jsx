import { Link } from "react-router";
import one from "../../assets/img/news/04.jpg";
import two from "../../assets/img/news/05.jpg";
import three from "../../assets/img/news/06.jpg";
import four from "../../assets/img/news/08.jpg";
import five from "../../assets/img/news/09.jpg";
import six from "../../assets/img/news/10.jpg";
import { useGetAnnouncementsQuery } from "../../../redux/features/announcements/announcementsApi";
import LoadingSpinner from "../LoadingSpinner";
import { useState } from "react";

const AnnouncementsGrid = () => {
  const {
    data: announcements,
    isLoading,
    isError,
  } = useGetAnnouncementsQuery();

  const [expandedIds, setExpandedIds] = useState([]);

  const toggleReadMore = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isClamped = (text) => {
    return text?.length > 100; // Roughly 2 lines
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h2 className="text-center my-4">Error loading news</h2>;

  return (
    <section className="news-section-3 fix section-padding">
      <div className="container">
        <div className="row g-4">
          {announcements?.data?.length > 0 ? (
            announcements.data.map((announcement) => {
              const isExpanded = expandedIds.includes(announcement.id);
              const showReadMore = isClamped(announcement.description);

              return (
                <div
                  key={announcement?.id}
                  className="col-xl-4 col-lg-6 col-md-6 d-flex"
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="news-card-items mt-0 d-flex flex-column w-100">
                    <div className="news-image">
                      <div className="post">
                        <span>Activities</span>
                      </div>
                    </div>
                    <div className="news-content">
                      <ul>
                        <li>
                          <i className="fas fa-calendar-alt"></i>
                          {new Date(
                            announcement?.created_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </li>
                        <li>
                          <i className="far fa-user"></i>
                          By admin
                        </li>
                      </ul>
                      <h3>{announcement?.title}</h3>

                      <h6
                        className={`description ${
                          !isExpanded ? "clamp-2-lines" : ""
                        }`}
                      >
                        {announcement?.description}
                      </h6>

                      {showReadMore && (
                        <button
                          className="theme-btn-2 mt-3 d-flex align-items-center"
                          onClick={() => toggleReadMore(announcement.id)}
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                          <i className="fas fa-long-arrow-right ms-2"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h2 className="text-center my-4">No Announcements Available</h2>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsGrid;
