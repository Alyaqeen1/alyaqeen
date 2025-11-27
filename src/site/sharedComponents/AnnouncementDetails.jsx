import { useParams } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGetAnnouncementQuery } from "../../redux/features/announcements/announcementsApi";

const AnnouncementDetails = () => {
  const { announcementId } = useParams();

  const {
    data: announcement,
    isLoading,
    isError,
    error,
  } = useGetAnnouncementQuery(announcementId);

  // Format date safely
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

  // Function to create HTML content from the content field
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    console.error("Error loading announcement:", error);
    return (
      <div className="text-center my-8">
        <h2 className="text-red-600 mb-2">Error loading Announcement</h2>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="text-center my-8">
        <h2 className="text-gray-600 mb-2">Announcement not found</h2>
        <p className="text-gray-500">
          The announcement you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <section className="news-details fix section-padding">
      <div className="container">
        <div className="news-details-area">
          <div className="row g-5">
            <div className="col-12">
              <div className="blog-post-details">
                <div className="single-blog-post">
                  {/* Announcement Header */}
                  <div className="post-header mb-4">
                    <ul className="post-list d-flex align-items-center flex-wrap gap-3">
                      <li>
                        <i className="fa-regular fa-user"></i>
                        By Admin
                      </li>
                      <li>
                        <i className="fa-solid fa-calendar-days"></i>
                        {formatDate(
                          announcement.updatedAt || announcement.createdAt
                        )}
                      </li>
                      <li>
                        <i className="fa-solid fa-tag"></i>
                        {announcement.type || "Announcement"}
                      </li>
                    </ul>

                    <h1 className="mb-4">{announcement.title}</h1>
                  </div>

                  {/* Announcement Content */}
                  <div className="post-content">
                    <div
                      className="announcement-content"
                      dangerouslySetInnerHTML={createMarkup(
                        announcement.content
                      )}
                      style={{
                        lineHeight: "1.8",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    />

                    {/* Important Notice Box */}
                    <div className="important-notice mt-5 p-4 bg-light rounded border-start border-4 border-warning">
                      <h5 className="mb-3">
                        <i className="fas fa-exclamation-circle me-2 text-warning"></i>
                        Important Notice
                      </h5>
                      <p className="mb-0">
                        Please read this announcement carefully and take
                        appropriate action as needed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="row tag-share-wrap mt-4 mb-5">
                  <div className="col-lg-8 col-12">
                    <div className="tagcloud">
                      <span className="tag-label me-2 fw-bold">Category:</span>
                      <span className="badge bg-primary">
                        {announcement.type || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-4 col-12 mt-3 mt-lg-0 text-lg-end">
                    <div className="social-share">
                      <span className="me-3 fw-bold">Share:</span>
                      <button className="btn btn-outline-primary btn-sm me-2">
                        <i className="fab fa-facebook-f"></i>
                      </button>
                      <button className="btn btn-outline-info btn-sm me-2">
                        <i className="fab fa-twitter"></i>
                      </button>
                      <button className="btn btn-outline-primary btn-sm">
                        <i className="fab fa-linkedin-in"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="contact-info mt-5 p-4 bg-light rounded">
                  <h4 className="mb-3">
                    <i className="fas fa-info-circle me-2 text-primary"></i>
                    For More Information
                  </h4>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-2">
                        <i className="fas fa-phone me-2 text-muted"></i>
                        Contact: +07869636849
                      </p>
                      <p className="mb-2">
                        <i className="fas fa-envelope me-2 text-muted"></i>
                        Email: contact@alyaqeen.co.uk
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <i className="fas fa-clock me-2 text-muted"></i>
                        Office Hours: Mon-Fri, 9:00 AM - 5:00 PM
                      </p>
                      <p className="mb-0">
                        <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                        116 Church Road, Yardley, Birmingham, B25 8UX
                      </p>
                    </div>
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

export default AnnouncementDetails;
