import React, { useState, useRef, useEffect, useCallback } from "react";
import JoditEditor from "jodit-react";
import {
  useGetAnnouncementByTypeQuery,
  useAddAnnouncementMutation,
} from "../../redux/features/announcements/announcementsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

const TeacherAnnouncement = () => {
  const editor = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [localContent, setLocalContent] = useState("");

  // Fetch teacher announcement
  const {
    data: announcement,
    isLoading,
    isError,
    refetch,
  } = useGetAnnouncementByTypeQuery("teacher");

  // Mutation for adding/updating announcement
  const [addAnnouncement, { isLoading: isSaving }] =
    useAddAnnouncementMutation();

  // Initialize content when data loads
  useEffect(() => {
    if (announcement?.content) {
      setContent(announcement.content);
      setLocalContent(announcement.content);
    }
  }, [announcement]);

  // Mock admin check - replace with your actual auth logic
  const isAdmin = true;

  const config = {
    readonly: !isEditing,
    toolbar: isEditing,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "align",
      "|",
      "link",
      "|",
      "undo",
      "redo",
    ],
    height: 400,
    theme: "default",
    enter: "p",
    enterBlock: "p",
    defaultMode: "1",
    useSearch: false,
    spellcheck: false,
    cleanHTML: {
      fillEmptyParagraph: false,
      removeEmptyElements: false,
      replaceOldTags: false,
    },
    allowResizeX: false,
    allowResizeY: false,
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarAdaptive: false,
  };

  const handleEditorChange = useCallback((newContent) => {
    setLocalContent(newContent);
  }, []);

  const handleSave = async () => {
    try {
      const currentDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      await addAnnouncement({
        type: "teacher",
        content: localContent,
        lastUpdated: currentDate,
      }).unwrap();

      setContent(localContent);
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Failed to save announcement:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalContent(content);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setLocalContent(content);
  };

  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
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
                  Failed to Load Announcement
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

  const defaultContent = `
    <div class="announcement-header bg-primary text-white p-4 rounded-3 mb-4">
      <h2 class="mb-3 fw-bold">📚 Islamic Studies Extra Work Sheets</h2>
      <div class="alert alert-light border-0 mb-0">
        <h5 class="mb-2">🕌 Assalamualaikum Warahmatullahi Wabarakatuh</h5>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card border-warning shadow-sm h-100">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0 fw-bold">📝 Profile Information Update</h5>
          </div>
          <div class="card-body">
            <p class="mb-0">All teachers are requested to review and update your profile information. If any details are incorrect, please correct them promptly. Once updated, you won't need to bring your latest proof of address or other documents.</p>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="card border-info shadow-sm h-100">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0 fw-bold">📂 Islamic Studies Resources</h5>
          </div>
          <div class="card-body">
            <p class="mb-0">A dedicated folder will be placed next to the printer in the downstairs hall containing all Islamic studies books. You may take extra worksheets relevant to your lessons and make copies according to your class size.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-success border-0 shadow-sm mt-4">
      <div class="d-flex align-items-center">
        <i class="fas fa-hands-helping fa-2x me-3 text-success"></i>
        <div>
          <h5 class="mb-1 fw-bold">Jazakumullah Khairan</h5>
          <p class="mb-0">for your cooperation and dedication to our students' education.</p>
        </div>
      </div>
    </div>
  `;

  const displayContent = content || announcement?.content || defaultContent;
  const lastUpdated = announcement?.lastUpdated || "21 November 2025";

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          {/* Main Card */}
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header with Gradient */}
            <div className="card-header bg-gradient-primary text-white py-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 p-3 rounded-3 me-4">
                      <i className="fas fa-bullhorn fa-2x text-black"></i>
                    </div>
                    <div>
                      <h2 className="mb-1 fw-bold">
                        Teacher Announcement Board
                      </h2>
                      <div className="d-flex flex-wrap align-items-center gap-3">
                        <span className="badge bg-white bg-opacity-20 text-black fs-6">
                          <i className="far fa-calendar-alt me-2"></i>
                          Last Updated: <strong>{lastUpdated}</strong>
                        </span>
                        <span className="badge bg-success bg-opacity-20 text-white fs-6">
                          <i className="fas fa-users me-2"></i>
                          All Teachers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 text-md-end">
                  {isAdmin && (
                    <div>
                      {!isEditing ? (
                        <button
                          className="btn btn-light btn-lg rounded-pill px-4 shadow-sm fw-bold"
                          onClick={handleEdit}
                          disabled={isSaving}
                        >
                          <i className="fas fa-edit me-2"></i>
                          Edit Announcement
                        </button>
                      ) : (
                        <div className="btn-group">
                          <button
                            className="btn btn-success btn-lg rounded-pill px-4 shadow-sm fw-bold"
                            onClick={handleSave}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                ></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-2"></i>
                                Save Changes
                              </>
                            )}
                          </button>

                          <button
                            className="btn btn-outline text-black btn-lg rounded-pill px-4 shadow-sm fw-bold"
                            onClick={handleCancel}
                            disabled={isSaving}
                          >
                            <i className="fas fa-times me-2"></i>
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="card-body p-5 bg-light">
              {isEditing ? (
                <div className="border rounded-4 shadow-sm p-3 bg-white">
                  <JoditEditor
                    ref={editor}
                    value={localContent}
                    config={config}
                    onChange={handleEditorChange}
                  />
                </div>
              ) : (
                <div
                  className="announcement-content"
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.7",
                  }}
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
              )}
            </div>

            {/* Footer */}
            {!isEditing && isAdmin && (
              <div className="card-footer bg-dark text-white py-3">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-shield-alt fa-lg me-3 text-warning"></i>
                      <div>
                        <h6 className="mb-0 fw-bold">Administrator Access</h6>
                        <small className="text-white-50">
                          Only authorized administrators can edit this
                          announcement
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <small className="text-white-50">
                      <i className="fas fa-clock me-2"></i>
                      Real-time updates • Secure access
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {!isEditing && (
            <div className="row mt-4 g-3">
              <div className="col-md-4">
                <div className="card border-info shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <i className="fas fa-eye fa-2x text-info mb-3"></i>
                    <h4 className="fw-bold text-dark">Visibility</h4>
                    <p className="text-muted mb-0">
                      Visible to all teaching staff members
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-warning shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <i className="fas fa-sync-alt fa-2x text-warning mb-3"></i>
                    <h4 className="fw-bold text-dark">Updates</h4>
                    <p className="text-muted mb-0">
                      Real-time announcement updates
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-success shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <i className="fas fa-bell fa-2x text-success mb-3"></i>
                    <h4 className="fw-bold text-dark">Notifications</h4>
                    <p className="text-muted mb-0">
                      Instant notification system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAnnouncement;
