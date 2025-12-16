import Swal from "sweetalert2";
import React, { useState } from "react";
import {
  useGetPublicAnnouncementsQuery,
  useAddAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useSendEmailToParentsMutation,
  useSendEmailToTeachersMutation,
} from "../../redux/features/announcements/announcementsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import CreatePublicAnnouncementModal from "../shared/CreatePublickAnnouncementModal";

const PublicAnnouncement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [sendEmailToParents, { isLoading: isLoadingParentEmail }] =
    useSendEmailToParentsMutation();
  const [sendEmailToTeachers, { isLoading: isLoadingTeacherEmail }] =
    useSendEmailToTeachersMutation();

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

  // Inside your component

  const handleSendEmailToParents = async (announcementId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to send this announcement to parents?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, send it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-secondary",
      },
    });

    if (result.isConfirmed) {
      try {
        await sendEmailToParents(announcementId).unwrap();
        Swal.fire({
          icon: "success",
          title: "Sent!",
          text: "Announcement sent to parents successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to send email to parents.",
        });
      }
    }
  };

  const handleSendEmailToTeachers = async (announcementId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to send this announcement to teachers?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, send it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        confirmButton: "btn btn-warning",
        cancelButton: "btn btn-secondary",
      },
    });

    if (result.isConfirmed) {
      try {
        await sendEmailToTeachers(announcementId).unwrap();
        Swal.fire({
          icon: "success",
          title: "Sent!",
          text: "Announcement sent to teachers successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to send email to teachers.",
        });
      }
    }
  };

  if (isError) {
    return (
      <div className="container-fluid px-2 px-md-3 py-2 py-md-3">
        <div className="row">
          <div className="col-12">
            <div className="card border-danger shadow-lg">
              <div className="card-body text-center py-3 py-md-4">
                <i className="fas fa-exclamation-triangle text-danger fa-2x fa-lg-md mb-2 mb-md-3"></i>
                <h4 className="text-danger mb-2 mb-md-3 fs-5 fs-md-4">
                  Failed to Load Announcements
                </h4>
                <p className="text-muted mb-3 mb-md-4">
                  Please try refreshing the page
                </p>
                <button
                  className="btn btn-danger btn-sm btn-md-md"
                  onClick={() => refetch()}
                >
                  <i className="fas fa-redo me-1 me-md-2"></i>
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
    <div className="container-fluid px-1 px-sm-2 px-md-3 px-lg-4 py-1 py-sm-2 py-md-3 py-lg-4">
      <div className="row">
        <div className="col-12">
          {/* Header Card */}
          <div className="card border-0 shadow-lg rounded-3 rounded-md-4 overflow-hidden mb-3 mb-sm-4">
            <div className="card-header bg-gradient py-2 py-sm-3 py-md-4 px-2 px-sm-3 px-md-4">
              <div className="row align-items-center">
                <div className="col-md-8 mb-2 mb-sm-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 p-1 p-sm-2 p-md-3 rounded-2 rounded-md-3 me-2 me-sm-3 me-md-4">
                      <i className="fas fa-globe fa-sm fa-lg-md fa-xl-lg"></i>
                    </div>
                    <div className="w-100">
                      <h2 className="mb-0 mb-sm-1 fw-bold fs-5 fs-sm-4 fs-md-3">
                        Public Announcements
                      </h2>
                      <div className="d-flex flex-wrap align-items-center gap-1 gap-sm-2 gap-md-3 mt-1 mt-sm-2">
                        <span className="badge bg-white bg-opacity-20 text-black fs-7 fs-sm-6 fs-md-6">
                          <i className="fas fa-bullhorn me-1 me-md-2"></i>
                          {sortedAnnouncements.length} Announcement
                          {sortedAnnouncements.length !== 1 ? "s" : ""}
                        </span>
                        <span className="badge bg-success bg-opacity-20 text-white fs-7 fs-sm-6 fs-md-6">
                          <i className="fas fa-eye me-1 me-md-2"></i>
                          Visible to Everyone
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  {isAdmin && (
                    <div className="d-flex justify-content-start justify-content-md-end mt-2 mt-sm-0">
                      <button
                        className="btn btn-primary btn-xs btn-sm-sm btn-md-lg rounded-pill px-2 px-sm-3 px-md-4 shadow-sm fw-bold w-100 w-sm-auto"
                        onClick={handleCreateAnnouncement}
                      >
                        <i className="fas fa-plus me-1 me-md-2"></i>
                        <span className="d-none d-sm-inline d-md-none">
                          New
                        </span>
                        <span className="d-none d-md-inline">Create New</span>
                        <span className="d-sm-none">New</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Announcements List */}
          {sortedAnnouncements.length === 0 ? (
            <div className="card border-0 shadow-lg">
              <div className="card-body text-center py-3 py-md-4">
                <i className="fas fa-bullhorn text-muted fa-3x fa-lg-md mb-2 mb-md-3"></i>
                <h4 className="text-muted mb-2 mb-md-3 fs-5 fs-md-4">
                  No Public Announcements
                </h4>
                <p className="text-muted mb-3 mb-md-4">
                  Create your first public announcement to get started
                </p>
                {isAdmin && (
                  <button
                    className="btn btn-primary btn-sm btn-md-md"
                    onClick={handleCreateAnnouncement}
                  >
                    <i className="fas fa-plus me-1 me-md-2"></i>
                    Create First Announcement
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="row g-2 g-sm-3 g-md-4">
              {sortedAnnouncements.map((announcement, index) => (
                <div key={announcement._id} className="col-12">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-light py-2 py-sm-3 px-2 px-sm-3">
                      <div className="row align-items-center">
                        <div className="col-md-8 mb-2 mb-sm-0">
                          <div className="d-flex align-items-center">
                            <span className="badge bg-primary me-2 me-sm-3 fs-7 fs-sm-6">
                              #{sortedAnnouncements.length - index}
                            </span>
                            <div className="w-100">
                              <h5 className="mb-0 mb-sm-1 fw-bold text-dark fs-6 fs-sm-5">
                                {announcement.title || "Public Announcement"}
                              </h5>
                              <div className="d-flex flex-column flex-sm-row gap-1 gap-sm-2">
                                <small className="text-muted fs-7">
                                  <i className="far fa-calendar me-1"></i>
                                  Created:{" "}
                                  {new Date(
                                    announcement.createdAt
                                  ).toLocaleDateString()}
                                </small>
                                <small className="text-muted fs-7">
                                  <i className="fas fa-sync-alt me-1"></i>
                                  Updated: {announcement.lastUpdated}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          {isAdmin && (
                            <div className="d-flex flex-wrap justify-content-start justify-content-md-end gap-1 gap-sm-2 mt-2 mt-sm-0">
                              <button
                                className="btn btn-outline-primary btn-xxs btn-xs-sm btn-sm-md"
                                onClick={() =>
                                  handleEditAnnouncement(announcement)
                                }
                              >
                                <i className="fas fa-edit"></i>
                                <span className="d-none d-sm-inline ms-1">
                                  Edit
                                </span>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-xxs btn-xs-sm btn-sm-md"
                                onClick={() =>
                                  handleDeleteAnnouncement(announcement._id)
                                }
                                disabled={isDeleting}
                              >
                                <i className="fas fa-trash"></i>
                                <span className="d-none d-sm-inline ms-1">
                                  Delete
                                </span>
                              </button>
                              <button
                                className="btn btn-outline-success btn-xxs btn-xs-sm btn-sm-md"
                                onClick={() =>
                                  handleSendEmailToParents(announcement._id)
                                }
                                disabled={isLoadingParentEmail}
                              >
                                {isLoadingParentEmail ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-envelope"></i>
                                )}
                                <span className="d-none d-sm-inline ms-1">
                                  Parents
                                </span>
                              </button>

                              <button
                                className="btn btn-outline-secondary btn-xxs btn-xs-sm btn-sm-md"
                                onClick={() =>
                                  handleSendEmailToTeachers(announcement._id)
                                }
                                disabled={isLoadingTeacherEmail}
                              >
                                {isLoadingTeacherEmail ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-envelope"></i>
                                )}
                                <span className="d-none d-sm-inline ms-1">
                                  Teachers
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-2 p-sm-3 p-md-4">
                      <div
                        className="announcement-content"
                        style={{ fontSize: "0.9rem", lineHeight: "1.5" }}
                        dangerouslySetInnerHTML={{
                          __html: announcement.content,
                        }}
                      />
                    </div>

                    <div className="card-footer bg-white border-0 pt-0 px-2 px-sm-3">
                      <div className="row">
                        <div className="col-12">
                          <small className="text-muted fs-7">
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
