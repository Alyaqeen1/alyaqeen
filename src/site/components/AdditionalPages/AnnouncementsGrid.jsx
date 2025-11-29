import LoadingSpinner from "../LoadingSpinner";
import { useGetAnnouncementByTypeQuery } from "../../../redux/features/announcements/announcementsApi";
import { Link } from "react-router";

const AnnouncementsGrid = () => {
  const {
    data: announcements,
    isLoading,
    isError,
    error,
  } = useGetAnnouncementByTypeQuery("public");

  // Strip HTML tags and truncate text for preview
  const stripHtmlAndTruncate = (html, maxLength = 150) => {
    if (!html) return "";

    // Strip HTML tags
    const plainText = html.replace(/<[^>]*>/g, "");

    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  // Format date safely - using updatedAt from your data
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    console.error("Error loading announcements:", error);
    return (
      <div className="text-center my-8">
        <h2 className="text-red-600 mb-2">Error loading Announcements</h2>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  // Use the array directly since your API returns an array, not a nested data property
  const announcementsData = announcements || [];

  return (
    <section className="news-section-3 fix section-padding">
      <div className="container">
        <div className="row g-4">
          {announcementsData.length > 0 ? (
            announcementsData.map((announcement) => {
              const displayText = stripHtmlAndTruncate(announcement.content);
              const hasContent =
                announcement.content &&
                announcement.content.replace(/<[^>]*>/g, "").length > 0;

              return (
                <div
                  key={announcement._id}
                  className="col-xl-4 col-lg-6 col-md-6 d-flex"
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="news-card-items mt-0 d-flex flex-column w-100 h-100">
                    <div className="news-content flex-grow-1 d-flex flex-column">
                      <ul className="mb-2">
                        <li>
                          <i className="fas fa-calendar-alt"></i>
                          {formatDate(announcement.updatedAt)}
                        </li>
                        <li>
                          <i className="far fa-user"></i>
                          By Admin
                        </li>
                      </ul>

                      <h3 className="mb-3 line-clamp-2">
                        {announcement.title || "No Title"}
                      </h3>

                      <div className="description flex-grow-1 mb-3">
                        <p
                          className="line-clamp-3 mb-0"
                          style={{
                            lineHeight: "1.6",
                            color: "#555",
                          }}
                        >
                          {displayText || "No content available."}
                        </p>
                      </div>

                      {hasContent && (
                        <div className="mt-auto">
                          <Link
                            to={`/announcement-details/${announcement._id}`}
                            className="theme-btn-2 d-flex align-items-center"
                          >
                            Read More
                            <i className="fas fa-long-arrow-right ms-2"></i>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center my-8">
              <h2 className="text-gray-600 mb-2">No Announcements Available</h2>
              <p className="text-gray-500">
                Check back later for new announcements.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsGrid;
