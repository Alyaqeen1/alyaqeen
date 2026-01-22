import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useGetBlogsQuery } from "../../../redux/features/blogs/blogsApi";
import LoadingSpinner from "../LoadingSpinner";
import one from "../../assets/img/news/post-1.jpg";
import four from "../../assets/img/news/pp3.jpg";
import five from "../../assets/img/news/pp4.jpg";
import six from "../../assets/img/news/pp5.jpg";

const NewsList = () => {
  const { data: blogs, isLoading, isError, isSuccess } = useGetBlogsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemsPerPage = 5;

  // Get unique categories from blogs
  const categories = [
    "All",
    ...new Set(blogs?.map((blog) => blog.category).filter(Boolean)),
  ];

  // Filter blogs based on selected category and search text
  const filteredBlogs =
    blogs?.filter((blog) => {
      const matchesCategory =
        selectedCategory === "All" || blog.category === selectedCategory;
      const matchesSearch =
        searchText === "" ||
        blog.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchText.toLowerCase());

      return matchesCategory && matchesSearch;
    }) || [];

  // Get current items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  // Total pages
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  // Reset to first page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchText]);

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (isError) {
    return <h2 className="text-center my-4">Error loading blogs</h2>;
  }

  // Get recent blogs (latest 3)
  const recentBlogs = blogs
    ? [...blogs]
        .sort(
          (a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
        )
        .slice(0, 3)
    : [];

  return (
    <section className="news-standard fix section-padding">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="news-standard-wrapper">
              {currentBlogs.length > 0 ? (
                currentBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="news-standard-items bg-white rounded-3 shadow-sm border mb-4 overflow-hidden"
                  >
                    <div className="news-thumb position-relative">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-100"
                          style={{ height: "350px", objectFit: "cover" }}
                        />
                      ) : (
                        <img
                          src={one}
                          alt="Blog"
                          className="w-100"
                          style={{ height: "350px", objectFit: "cover" }}
                        />
                      )}
                      <div className="position-absolute top-0 start-0 m-3">
                        <span
                          style={{ backgroundColor: "var(--theme)" }}
                          className="badge px-3 py-2 fs-6"
                        >
                          {blog.category || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                    <div className="news-content p-4">
                      <div className="d-flex align-items-center text-muted mb-3">
                        <span className="d-flex align-items-center">
                          <i className="fas fa-calendar-alt me-2"></i>
                          {new Date(
                            blog.date || blog.createdAt,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="mx-3">•</span>
                        <span className="d-flex align-items-center">
                          <i className="far fa-user me-2"></i>
                          {blog.adminName || "Admin"}
                        </span>
                      </div>

                      <h3 className="mb-3">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="text-decoration-none text-dark"
                        >
                          {blog.title}
                        </Link>
                      </h3>

                      <div
                        className="mb-3 text-muted"
                        style={{
                          maxHeight: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {blog.excerpt ||
                          (blog.content && blog.content.length > 200
                            ? blog.content.substring(0, 200) + "..."
                            : blog.content)}
                      </div>

                      <Link
                        to={`/blog/${blog.slug}`}
                        className="theme-btn  px-4 py-2"
                      >
                        Read More
                        <i className="fa-solid fa-arrow-right-long ms-2"></i>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <h2 className="mb-3">No blogs found</h2>
                  <p className="text-muted">
                    {searchText
                      ? `No results for "${searchText}"`
                      : "No blogs available"}
                  </p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="pt-5">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          <i className="fa-solid fa-chevron-left"></i>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li
                          key={i}
                          className={`page-item ${
                            currentPage === i + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="main-sidebar">
              {/* Search Widget */}
              <div className="single-sidebar-widget mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Search</h5>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search blogs..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                      {searchText && (
                        <button
                          className="btn btn-outline-secondary border-start-0"
                          type="button"
                          onClick={() => setSearchText("")}
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Widget */}
              <div className="single-sidebar-widget mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Categories</h5>
                    <div className="list-group  gap-2 list-group-flush">
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={`list-group-item list-group-item-action d-flex justify-content-between 
                            rounded  align-items-center border-0 py-2 ${
                              selectedCategory === category ? "active" : ""
                            }`}
                          onClick={() => setSelectedCategory(category)}
                          style={{
                            backgroundColor:
                              selectedCategory === category
                                ? "var(--theme)"
                                : "",
                            color: selectedCategory === category ? "white" : "",
                          }}
                        >
                          <span>{category}</span>
                          <span
                            className={`badge ${
                              selectedCategory === category
                                ? "bg-light text-dark"
                                : "bg-secondary"
                            }`}
                          >
                            {category === "All"
                              ? blogs?.length || 0
                              : blogs?.filter((b) => b.category === category)
                                  .length || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Posts Widget */}
              <div className="single-sidebar-widget mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Recent Posts</h5>
                    <div className="d-flex flex-column gap-3">
                      {recentBlogs.map((blog, index) => (
                        <div className="d-flex gap-3" key={blog._id}>
                          <div className="flex-shrink-0">
                            {blog.image ? (
                              <img
                                src={blog.image}
                                alt={blog.title}
                                className="rounded"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <img
                                src={[four, five, six][index] || four}
                                alt={blog.title}
                                className="rounded"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <small className="text-muted d-block mb-1">
                              <i className="fa-solid fa-calendar-days me-1"></i>
                              {new Date(
                                blog.date || blog.createdAt,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </small>
                            <h6 className="mb-0">
                              <Link
                                to={`/blog/${blog.slug}`}
                                className="text-decoration-none text-dark"
                              >
                                {blog.title?.substring(0, 50)}
                                {blog.title?.length > 50 ? "..." : ""}
                              </Link>
                            </h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Stats */}
              <div className="single-sidebar-widget">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Blog Stats</h5>
                    <div className="row text-center">
                      <div className="col-4 border-end">
                        <div
                          style={{ color: "var(--theme)" }}
                          className="display-6 fw-bold "
                        >
                          {blogs?.length || 0}
                        </div>
                        <small className="text-muted">Total Blogs</small>
                      </div>
                      <div className="col-4 border-end">
                        <div className="display-6 fw-bold text-success">
                          {categories.length}
                        </div>
                        <small className="text-muted">Categories</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold">
                          {blogs && blogs.length > 0
                            ? new Date(
                                [...blogs].sort(
                                  (a, b) =>
                                    new Date(b.date || b.createdAt) -
                                    new Date(a.date || a.createdAt),
                                )[0].date ||
                                  [...blogs].sort(
                                    (a, b) =>
                                      new Date(b.date || b.createdAt) -
                                      new Date(a.date || a.createdAt),
                                  )[0].createdAt,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </div>
                        <small className="text-muted">Latest Post</small>
                      </div>
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

export default NewsList;
