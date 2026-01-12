import { Link, useParams } from "react-router";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGetBlogQuery } from "../../redux/features/blogs/blogsApi";
import one from "../assets/img/news/post-5.jpg"; // Fallback image

const NewsDetails = () => {
  const { newsId } = useParams();

  const {
    data: blog,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetBlogQuery(newsId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (isError) {
    return <h2 className="text-center my-4">Error loading blog</h2>;
  }

  if (!blog) {
    return <h2 className="text-center my-4">Blog not found</h2>;
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="news-details fix section-padding">
      <div className="container">
        <div className="news-details-area">
          <div className="row g-5">
            <div className="col-12">
              <div className="blog-post-details">
                <div className="single-blog-post">
                  {/* Main Image */}
                  <div className="post-featured-thumb bg-cover">
                    <img
                      style={{
                        width: "100%",
                        height: "450px",
                        objectFit: "cover",
                      }}
                      src={blog.image || one}
                      alt={blog.title}
                      onError={(e) => {
                        e.target.src = one; // Fallback if image fails to load
                      }}
                    />
                  </div>

                  <div className="post-content">
                    {/* Post Meta Information */}
                    <ul className="post-list d-flex align-items-center mb-4">
                      <li>
                        <i className="fa-regular fa-user"></i>
                        By Admin
                      </li>
                      <li>
                        <i className="fa-solid fa-calendar-days"></i>
                        {formatDate(blog.date || blog.createdAt)}
                      </li>
                      {blog.category && (
                        <li>
                          <i className="fa-solid fa-folder"></i>
                          {blog.category}
                        </li>
                      )}
                    </ul>

                    {/* Blog Title */}
                    <h1 className="mb-4">{blog.title}</h1>

                    {/* Blog Content - with proper text wrapping */}
                    {blog.content && (
                      <div className="blog-content">
                        <div
                          style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {blog.content}
                        </div>
                      </div>
                    )}

                    {/* Tags Section - Simple */}
                    {blog.category && (
                      <div className="tag-share-wrap mt-5 mb-4">
                        <div className="tagcloud">
                          <span className="me-2">Category:</span>
                          <Link>{blog.category}</Link>
                        </div>
                      </div>
                    )}

                    {/* Simple Share Buttons */}
                    <div className="social-share mt-4">
                      <span className="me-3">Share:</span>
                      <Link to="/" className="me-2">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                      <Link to="/" className="me-2">
                        <i className="fab fa-twitter"></i>
                      </Link>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </div>

                    {/* Back to Blog List Button */}
                    <div className="mt-5 pt-4 border-top">
                      <Link to="/news" className="theme-btn">
                        <i className="fa-solid fa-arrow-left-long me-2"></i>
                        Back to Blogs
                      </Link>
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

export default NewsDetails;
