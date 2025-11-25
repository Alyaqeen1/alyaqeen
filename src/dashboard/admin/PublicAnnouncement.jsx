import Swal from "sweetalert2";
import React, { useState } from "react";
import {
  useGetPublicAnnouncementsQuery,
  useAddAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "../../redux/features/announcements/announcementsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import CreatePublicAnnouncementModal from "../shared/CreatePublickAnnouncementModal";

const PublicAnnouncement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Fetch all public announcements
  const {
    data: announcements = [],
    isLoading,
    isError,
    refetch,
  } = useGetPublicAnnouncementsQuery();

  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();

  // Mock admin check - replace with your actual auth logic
  const isAdmin = true;

  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setShowCreateModal(true);
  };

  const handleEditAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowCreateModal(true);
  };

  const handleDeleteAnnouncement = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteAnnouncement(id).unwrap();

        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "Announcement has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch();
      } catch (error) {
        console.error("Failed to delete announcement:", error);

        // Show error message
        Swal.fire({
          title: "Error!",
          text: "Failed to delete announcement. Please try again.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setSelectedAnnouncement(null);
    refetch();
  };

  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  if (isError) {
    return (
      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-12">
            <div className="card border-danger shadow-lg">
              <div className="card-body text-center py-5">
                <i className="fas fa-exclamation-triangle text-danger fa-3x mb-3"></i>
                <h4 className="text-danger mb-3">
                  Failed to Load Announcements
                </h4>
                <p className="text-muted mb-4">
                  Please try refreshing the page
                </p>
                <button
                  className="btn btn-danger btn-lg"
                  onClick={() => refetch()}
                >
                  <i className="fas fa-redo me-2"></i>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          {/* Header Card */}
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-gradient py-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 p-3 rounded-3 me-4">
                      <i className="fas fa-globe fa-2x "></i>
                    </div>
                    <div>
                      <h2 className="mb-1 fw-bold">Public Announcements</h2>
                      <div className="d-flex flex-wrap align-items-center gap-3">
                        <span className="badge bg-white bg-opacity-20 text-black fs-6">
                          <i className="fas fa-bullhorn me-2"></i>
                          {sortedAnnouncements.length} Announcement
                          {sortedAnnouncements.length !== 1 ? "s" : ""}
                        </span>
                        <span className="badge bg-success bg-opacity-20 text-white fs-6">
                          <i className="fas fa-eye me-2"></i>
                          Visible to Everyone
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 text-md-end">
                  {isAdmin && (
                    <button
                      className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm fw-bold"
                      onClick={handleCreateAnnouncement}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Create New
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Announcements List */}
          {sortedAnnouncements.length === 0 ? (
            <div className="card border-0 shadow-lg">
              <div className="card-body text-center py-5">
                <i className="fas fa-bullhorn text-muted fa-4x mb-3"></i>
                <h4 className="text-muted mb-3">No Public Announcements</h4>
                <p className="text-muted mb-4">
                  Create your first public announcement to get started
                </p>
                {isAdmin && (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleCreateAnnouncement}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Create First Announcement
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {sortedAnnouncements.map((announcement, index) => (
                <div key={announcement._id} className="col-12">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-light py-3">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <div className="d-flex align-items-center">
                            <span className="badge bg-primary me-3 fs-6">
                              #{sortedAnnouncements.length - index}
                            </span>
                            <div>
                              <h5 className="mb-1 fw-bold text-dark">
                                {announcement.title || "Public Announcement"}
                              </h5>
                              <div className="d-flex flex-wrap gap-2">
                                <small className="text-muted">
                                  <i className="far fa-calendar me-1"></i>
                                  Created:{" "}
                                  {new Date(
                                    announcement.createdAt
                                  ).toLocaleDateString()}
                                </small>
                                <small className="text-muted">
                                  <i className="fas fa-sync-alt me-1"></i>
                                  Updated: {announcement.lastUpdated}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 text-md-end">
                          {isAdmin && (
                            <div className="btn-group">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  handleEditAnnouncement(announcement)
                                }
                              >
                                <i className="fas fa-edit me-1"></i>
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  handleDeleteAnnouncement(announcement._id)
                                }
                                disabled={isDeleting}
                              >
                                <i className="fas fa-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <div
                        className="announcement-content"
                        style={{ fontSize: "1rem", lineHeight: "1.6" }}
                        dangerouslySetInnerHTML={{
                          __html: announcement.content,
                        }}
                      />
                    </div>

                    <div className="card-footer bg-white border-0 pt-0">
                      <div className="row">
                        <div className="col-12">
                          <small className="text-muted">
                            <i className="fas fa-info-circle me-1"></i>
                            This announcement is visible to all website visitors
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create/Edit Modal */}
          {showCreateModal && (
            <CreatePublicAnnouncementModal
              show={showCreateModal}
              onClose={handleModalClose}
              announcement={selectedAnnouncement}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicAnnouncement;
