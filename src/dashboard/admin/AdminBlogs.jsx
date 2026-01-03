import React, { useState, useEffect } from "react";
import {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "../../redux/features/blogs/blogsApi";
import { FaEdit, FaTrash, FaPlus, FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import toast from "react-hot-toast";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function AdminBlogs() {
  // RTK Query hooks
  const { data: blogsData, isLoading, refetch } = useGetBlogsQuery();
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Simplified form states
  const [blogForm, setBlogForm] = useState({
    title: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    content: "",
    excerpt: "",
    image: null,
    imageUrl: "",
  });

  // Reset form
  const resetForm = () => {
    setBlogForm({
      title: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      content: "",
      excerpt: "",
      image: null,
      imageUrl: "",
    });
  };

  // Handle file upload for blog image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      toast.error("Please upload a valid image file!");
      return;
    }

    setUploadingImage(true);

    try {
      const url = await uploadToCloudinary(file, "blogs");

      setBlogForm((prev) => ({
        ...prev,
        image: file,
        imageUrl: url,
      }));

      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Upload failed! Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle create blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!blogForm.title || !blogForm.content || !blogForm.category) {
      Swal.fire({
        title: "Missing Information!",
        text: "Please fill in all required fields (Title, Content, Category)",
        icon: "warning",
      });
      return;
    }

    if (localLoading) return;
    setLocalLoading(true);

    try {
      // Prepare blog data
      const blogData = {
        title: blogForm.title,
        category: blogForm.category,
        date: blogForm.date,
        content: blogForm.content,
        excerpt: blogForm.excerpt || blogForm.content.substring(0, 150) + "...",
        image: blogForm.imageUrl,
        slug: blogForm.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        createdAt: new Date().toISOString(),
      };

      await createBlog(blogData).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Blog created successfully",
        icon: "success",
        timer: 2000,
      });

      setShowCreateModal(false);
      resetForm();
      refetch();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to create blog",
        icon: "error",
      });
      console.error("Create error:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle edit blog
  const handleEditBlog = async (e) => {
    e.preventDefault();

    if (!selectedBlog) return;

    // Validate required fields
    if (!blogForm.title || !blogForm.content || !blogForm.category) {
      Swal.fire({
        title: "Missing Information!",
        text: "Please fill in all required fields",
        icon: "warning",
      });
      return;
    }

    if (localLoading) return;
    setLocalLoading(true);

    try {
      // Prepare blog data
      const blogData = {
        id: selectedBlog._id,
        title: blogForm.title,
        category: blogForm.category,
        date: blogForm.date,
        content: blogForm.content,
        excerpt: blogForm.excerpt,
        image: blogForm.imageUrl,
        updatedAt: new Date().toISOString(),
      };

      await updateBlog(blogData).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Blog updated successfully",
        icon: "success",
        timer: 2000,
      });

      setShowEditModal(false);
      setSelectedBlog(null);
      resetForm();
      refetch();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update blog",
        icon: "error",
      });
      console.error("Update error:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle delete blog
  const handleDeleteBlog = async (blogId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(blogId).unwrap();
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete blog.", "error");
      }
    }
  };

  // Open edit modal with blog data
  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setBlogForm({
      title: blog.title || "",
      category: blog.category || "",
      date: blog.date || new Date().toISOString().split("T")[0],
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      image: null,
      imageUrl: blog.image || "",
    });
    setShowEditModal(true);
  };

  // Close all modals
  const handleModalClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedBlog(null);
    resetForm();
  };

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  return (
    <div className="py-4">
      {/* Header with Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Blog Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="me-2" />
          Create New Blog
        </button>
      </div>

      {/* Blogs Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0">All Blogs</h5>
        </div>
        <div className="card-body">
          {blogsData?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogsData.map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="rounded"
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded bg-secondary d-flex align-items-center justify-content-center"
                            style={{ width: "80px", height: "60px" }}
                          >
                            <span className="text-white">No Image</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{blog.title}</strong>
                        <br />
                        <small className="text-muted">
                          {blog.excerpt?.substring(0, 60)}...
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {blog.category}
                        </span>
                      </td>
                      <td>
                        <FaCalendarAlt className="me-1" />
                        {new Date(blog.date).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditModal(blog)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteBlog(blog._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">
                No blogs found. Create your first blog!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Blog Modal - Simplified */}
      {showCreateModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Blog</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                  disabled={uploadingImage || localLoading}
                ></button>
              </div>

              <form onSubmit={handleCreateBlog}>
                <div className="modal-body">
                  <div className="row">
                    {/* Left Column - Image Upload */}
                    <div className="col-md-5">
                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          Blog Image *
                        </label>
                        <div
                          className="border rounded p-3 mb-3 text-center"
                          style={{ minHeight: "200px" }}
                        >
                          {blogForm.imageUrl ? (
                            <img
                              src={blogForm.imageUrl}
                              alt="Blog Preview"
                              className="img-fluid rounded"
                              style={{
                                maxHeight: "180px",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                              <div className="mb-2">Image Preview</div>
                              <small>Upload an image for your blog</small>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage || localLoading}
                        />
                        <div className="mt-2">
                          {uploadingImage ? (
                            <small className="text-warning">
                              <span className="spinner-border spinner-border-sm me-1"></span>
                              Uploading...
                            </small>
                          ) : blogForm.imageUrl ? (
                            <small className="text-success">
                              ✓ Image ready
                            </small>
                          ) : (
                            <small className="text-muted">
                              No image selected
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="col-md-7">
                      {/* Title */}
                      <div className="mb-3">
                        <label className="form-label">Blog Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={blogForm.title}
                          onChange={(e) =>
                            setBlogForm({
                              ...blogForm,
                              title: e.target.value,
                            })
                          }
                          required
                          disabled={localLoading}
                          placeholder="Enter blog title"
                        />
                      </div>

                      {/* Category and Date */}
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Category *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={blogForm.category}
                            onChange={(e) =>
                              setBlogForm({
                                ...blogForm,
                                category: e.target.value,
                              })
                            }
                            required
                            disabled={localLoading}
                            placeholder="e.g., Cooking, Technology"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={blogForm.date}
                            onChange={(e) =>
                              setBlogForm({
                                ...blogForm,
                                date: e.target.value,
                              })
                            }
                            disabled={localLoading}
                          />
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div className="mb-3">
                        <label className="form-label">Excerpt (Optional)</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={blogForm.excerpt}
                          onChange={(e) =>
                            setBlogForm({
                              ...blogForm,
                              excerpt: e.target.value,
                            })
                          }
                          disabled={localLoading}
                          placeholder="Brief summary of the blog"
                        ></textarea>
                      </div>

                      {/* Content */}
                      <div className="mb-3">
                        <label className="form-label">Blog Content *</label>
                        <textarea
                          className="form-control"
                          rows="6"
                          value={blogForm.content}
                          onChange={(e) =>
                            setBlogForm({
                              ...blogForm,
                              content: e.target.value,
                            })
                          }
                          required
                          disabled={localLoading}
                          placeholder="Write your blog content here..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                    disabled={uploadingImage || localLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploadingImage || localLoading}
                  >
                    {localLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Blog"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal - Simplified */}
      {showEditModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Blog</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                  disabled={uploadingImage || localLoading}
                ></button>
              </div>

              <form onSubmit={handleEditBlog}>
                <div className="modal-body">
                  <div className="row">
                    {/* Left Column - Image Upload */}
                    <div className="col-md-5">
                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          Blog Image *
                        </label>
                        <div
                          className="border rounded p-3 mb-3 text-center"
                          style={{ minHeight: "200px" }}
                        >
                          {blogForm.imageUrl ? (
                            <img
                              src={blogForm.imageUrl}
                              alt="Blog Preview"
                              className="img-fluid rounded"
                              style={{
                                maxHeight: "180px",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                              <div className="mb-2">Image Preview</div>
                              <small>Upload an image for your blog</small>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage || localLoading}
                        />
                        <div className="mt-2">
                          {uploadingImage ? (
                            <small className="text-warning">
                              <span className="spinner-border spinner-border-sm me-1"></span>
                              Uploading...
                            </small>
                          ) : blogForm.imageUrl ? (
                            <small className="text-success">
                              ✓ Image ready
                            </small>
                          ) : (
                            <small className="text-muted">
                              No image selected
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="col-md-7">
                      {/* Title */}
                      <div className="mb-3">
                        <label className="form-label">Blog Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={blogForm.title}
                          onChange={(e) =>
                            setBlogForm({
                              ...blogForm,
                              title: e.target.value,
                            })
                          }
                          required
                          disabled={localLoading}
                        />
                      </div>

                      {/* Category and Date */}
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Category *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={blogForm.category}
                            onChange={(e) =>
                              setBlogForm({
                                ...blogForm,
                                category: e.target.value,
                              })
                            }
                            required
                            disabled={localLoading}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={blogForm.date}
                            onChange={(e) =>
                              setBlogForm({
                                ...blogForm,
                                date: e.target.value,
                              })
                            }
                            disabled={localLoading}
                          />
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div className="mb-3">
                        <label className="form-label">Excerpt</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={blogForm.excerpt}
                          onChange={(e) =>
                            setBlogForm({
                              ...blogForm,
                              excerpt: e.target.value,
                            })
                          }
                          disabled={localLoading}
                        ></textarea>
                      </div>

                      {/* Content */}
                      <div className="mb-3">
                        <label className="form-label">Blog Content *</label>
                        <textarea
                          className="form-control"
                          rows="6"
                          value={blogForm.content}
                          onChange={(e) =>
                            setBlogForm({
                              ...blogForm,
                              content: e.target.value,
                            })
                          }
                          required
                          disabled={localLoading}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                    disabled={uploadingImage || localLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploadingImage || localLoading}
                  >
                    {localLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Blog"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
