import React, { useState, useRef, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";
import {
  useGetAnnouncementByTypeQuery,
  useAddAnnouncementMutation,
} from "../../redux/features/announcements/announcementsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

const TeacherAnnouncement = () => {
  const editor = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [displayContent, setDisplayContent] = useState("");

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
      setDisplayContent(announcement.content);
      setEditorContent(announcement.content);
    }
  }, [announcement]);

  // Mock admin check - replace with your actual auth logic
  const isAdmin = true;
  const isMobile = window.innerWidth < 768;

  // Memoize config to prevent unnecessary re-renders
  const config = useMemo(
    () => ({
      readonly: !isEditing,
      toolbar: isEditing,
      minHeight: isMobile ? 700 : 400,
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
      // Add these for better stability
      disablePlugins: ["paste", "stat"],
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
    }),
    [isEditing]
  );

  // Use a ref to track editor content changes without causing re-renders
  const contentRef = useRef("");

  const handleSave = async () => {
    try {
      const currentDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Use the ref value to ensure we get the latest content
      const contentToSave = contentRef.current || editorContent;

      await addAnnouncement({
        type: "teacher",
        content: contentToSave,
        lastUpdated: currentDate,
      }).unwrap();

      setDisplayContent(contentToSave);
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Failed to save announcement:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset editor content to current display content
    setEditorContent(displayContent);
    contentRef.current = displayContent;
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Ensure editor has current content
    setEditorContent(displayContent);
    contentRef.current = displayContent;
  };

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  if (isError) {
    return (
      <div className="container-fluid px-3 px-md-4 py-3 py-md-4">
        <div className="row">
          <div className="col-12">
            <div className="card border-danger shadow-lg">
              <div className="card-body text-center py-4 py-md-5">
                <i className="fas fa-exclamation-triangle text-danger fa-2x fa-3x-md mb-3"></i>
                <h4 className="text-danger mb-3">
                  Failed to Load Announcement
                </h4>
                <p className="text-muted mb-4">
                  Please try refreshing the page
                </p>
                <button
                  className="btn btn-danger btn-md btn-lg-md"
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
    <div class="announcement-header bg-primary text-white p-3 p-md-4 rounded-3 mb-3 mb-md-4">
      <h2 class="mb-2 mb-md-3 fw-bold fs-4 fs-md-2">📚 Islamic Studies Extra Work Sheets</h2>
      <div class="alert alert-light border-0 mb-0 p-2 p-md-3">
        <h5 class="mb-1 mb-md-2 fs-5 fs-md-4">🕌 Assalamualaikum Warahmatullahi Wabarakatuh</h5>
      </div>
    </div>

    <div class="row g-3 g-md-4">
      <div class="col-lg-6">
        <div class="card border-warning shadow-sm h-100">
          <div class="card-header bg-warning text-dark p-2 p-md-3">
            <h5 class="mb-0 fw-bold fs-5 fs-md-4">📝 Profile Information Update</h5>
          </div>
          <div class="card-body p-2 p-md-3">
            <p class="mb-0">All teachers are requested to review and update your profile information. If any details are incorrect, please correct them promptly. Once updated, you won't need to bring your latest proof of address or other documents.</p>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="card border-info shadow-sm h-100">
          <div class="card-header bg-info text-white p-2 p-md-3">
            <h5 class="mb-0 fw-bold fs-5 fs-md-4">📂 Islamic Studies Resources</h5>
          </div>
          <div class="card-body p-2 p-md-3">
            <p class="mb-0">A dedicated folder will be placed next to the printer in the downstairs hall containing all Islamic studies books. You may take extra worksheets relevant to your lessons and make copies according to your class size.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-success border-0 shadow-sm mt-3 mt-md-4 p-2 p-md-3">
      <div class="d-flex align-items-center">
        <i class="fas fa-hands-helping fa-lg fa-2x-md me-2 me-md-3 text-success"></i>
        <div>
          <h5 class="mb-1 fw-bold fs-5 fs-md-4">Jazakumullah Khairan</h5>
          <p class="mb-0">for your cooperation and dedication to our students' education.</p>
        </div>
      </div>
    </div>
  `;

  const finalDisplayContent =
    displayContent || announcement?.content || defaultContent;
  const lastUpdated = announcement?.lastUpdated || "21 November 2025";

  return (
    <div className="container-fluid px-2 px-md-3 px-lg-4 py-2 py-md-3 py-lg-4">
      <div className="row">
        <div className="col-12">
          {/* Main Card */}
          <div className="card border-0 shadow-lg rounded-3 rounded-md-4 overflow-hidden">
            {/* Header with Gradient */}
            <div className="card-header bg-gradient-primary text-white py-3 py-md-4 px-3 px-md-4">
              <div className="row align-items-center">
                <div className="col-md-8 mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 p-2 p-md-3 rounded-2 rounded-md-3 me-3 me-md-4">
                      <i className="fas fa-bullhorn fa-lg fa-2x-md"></i>
                    </div>
                    <div className="w-100">
                      <h2 className="mb-1 fw-bold fs-4 fs-md-3 fs-lg-2">
                        Teacher Announcement Board
                      </h2>
                      <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 mt-2">
                        <span className="badge bg-white bg-opacity-20 text-black fs-7 fs-md-6">
                          <i className="far fa-calendar-alt me-1 me-md-2"></i>
                          Updated: <strong>{lastUpdated}</strong>
                        </span>
                        <span className="badge bg-success bg-opacity-20 text-white fs-7 fs-md-6">
                          <i className="fas fa-users me-1 me-md-2"></i>
                          All Teachers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  {isAdmin && (
                    <div className="d-flex justify-content-start justify-content-md-end">
                      {!isEditing ? (
                        <button
                          className="btn btn-light btn-sm btn-md-lg rounded-pill px-3 px-md-4 shadow-sm fw-bold w-100 w-md-auto"
                          onClick={handleEdit}
                          disabled={isSaving}
                        >
                          <i className="fas fa-edit me-1 me-md-2"></i>
                          <span className="d-none d-md-inline">Edit</span>
                          <span className="d-md-none">Edit Announcement</span>
                        </button>
                      ) : (
                        <div className="d-flex flex-column flex-md-row gap-2 w-100 justify-content-center justify-content-md-end">
                          <button
                            className="btn btn-success btn-sm btn-md-lg rounded-pill px-3 px-md-4 shadow-sm fw-bold"
                            onClick={handleSave}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-1 me-md-2"
                                  role="status"
                                ></span>
                                <span className="d-none d-md-inline">
                                  Saving...
                                </span>
                                <span className="d-md-none">Saving</span>
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-1 me-md-2"></i>
                                <span className="d-none d-md-inline">
                                  Save Changes
                                </span>
                                <span className="d-md-none">Save</span>
                              </>
                            )}
                          </button>

                          <button
                            className="btn btn-outline text-black btn-sm btn-md-lg rounded-pill px-3 px-md-4 shadow-sm fw-bold"
                            onClick={handleCancel}
                            disabled={isSaving}
                          >
                            <i className="fas fa-times me-1 me-md-2"></i>
                            <span className="d-none d-md-inline">Cancel</span>
                            <span className="d-md-none">Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="card-body p-3 p-md-4 p-lg-5 bg-light">
              {isEditing ? (
                <div className="border rounded-3 rounded-md-4 shadow-sm p-2 p-md-3 bg-white">
                  <JoditEditor
                    key={isEditing ? "editing" : "viewing"} // Force re-render when mode changes
                    ref={editor}
                    value={editorContent}
                    config={config}
                    onBlur={(newContent) => {
                      // Only update on blur, not on every change
                      setEditorContent(newContent);
                      contentRef.current = newContent;
                    }}
                  />
                </div>
              ) : (
                <div
                  className="announcement-content"
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    overflowX: "hidden",
                  }}
                  dangerouslySetInnerHTML={{ __html: finalDisplayContent }}
                />
              )}
            </div>

            {/* Footer */}
            {!isEditing && isAdmin && (
              <div className="card-footer bg-dark text-white py-2 py-md-3 px-3 px-md-4">
                <div className="row align-items-center">
                  <div className="col-md-8 mb-2 mb-md-0">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-shield-alt fa-md fa-lg-md me-2 me-md-3 text-warning"></i>
                      <div>
                        <h6 className="mb-0 fw-bold fs-6">
                          Administrator Access
                        </h6>
                        <small className="text-white-50 fs-7">
                          Only authorized administrators can edit this
                          announcement
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <small className="text-white-50 fs-7">
                      <i className="fas fa-clock me-1 me-md-2"></i>
                      Real-time updates • Secure access
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {!isEditing && (
            <div className="row mt-3 mt-md-4 g-2 g-md-3">
              <div className="col-6 col-md-4">
                <div className="card border-info shadow-sm h-100 text-center">
                  <div className="card-body p-2 p-md-3 p-lg-4">
                    <i className="fas fa-eye fa-lg fa-2x-md text-info mb-2 mb-md-3"></i>
                    <h6 className="fw-bold text-dark fs-6 mb-1">Visibility</h6>
                    <small className="text-muted fs-7 mb-0">
                      Visible to all teaching staff
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4">
                <div className="card border-warning shadow-sm h-100 text-center">
                  <div className="card-body p-2 p-md-3 p-lg-4">
                    <i className="fas fa-sync-alt fa-lg fa-2x-md text-warning mb-2 mb-md-3"></i>
                    <h6 className="fw-bold text-dark fs-6 mb-1">Updates</h6>
                    <small className="text-muted fs-7 mb-0">
                      Real-time announcement updates
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 mt-2 mt-md-0">
                <div className="card border-success shadow-sm h-100 text-center">
                  <div className="card-body p-2 p-md-3 p-lg-4">
                    <i className="fas fa-bell fa-lg fa-2x-md text-success mb-2 mb-md-3"></i>
                    <h6 className="fw-bold text-dark fs-6 mb-1">
                      Notifications
                    </h6>
                    <small className="text-muted fs-7 mb-0">
                      Instant notification system
                    </small>
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
