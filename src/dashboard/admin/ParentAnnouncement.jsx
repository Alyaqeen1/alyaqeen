import React, { useState, useRef, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";
import {
  useGetAnnouncementByTypeQuery,
  useAddAnnouncementMutation,
} from "../../redux/features/announcements/announcementsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

const ParentAnnouncement = () => {
  const editor = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [displayContent, setDisplayContent] = useState("");

  // Fetch parent announcement
  const {
    data: announcement,
    isLoading,
    isError,
    refetch,
  } = useGetAnnouncementByTypeQuery("parent");

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

  // Memoize config to prevent unnecessary re-renders
  const config = useMemo(
    () => ({
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
      // Add these for better stability
      disablePlugins: ["paste", "stat"],
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
    }),
    [isEditing]
  );

  // Use a ref to track editor content changes without causing re-renders
  const contentRef = useRef("");

  const handleEditorChange = (newContent) => {
    contentRef.current = newContent;
    setEditorContent(newContent);
  };

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
        type: "parent",
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
    <div class="announcement-header bg-success text-white p-4 rounded-3 mb-4">
      <h2 class="mb-3 fw-bold">👨‍👩‍👧‍👦 Parent Communication Portal</h2>
      <div class="alert alert-light border-0 mb-0">
        <h5 class="mb-2">🕌 Assalamualaikum Dear Parents & Guardians</h5>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card border-primary shadow-sm h-100">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0 fw-bold">📅 Upcoming Events</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <h6 class="text-primary fw-bold">🎉 Annual School Function</h6>
              <p class="mb-2"><strong>Date:</strong> December 15, 2024</p>
              <p class="mb-0"><strong>Time:</strong> 10:00 AM - 2:00 PM</p>
            </div>
            <div class="mb-3">
              <h6 class="text-primary fw-bold">📚 Parent-Teacher Meeting</h6>
              <p class="mb-2"><strong>Date:</strong> December 20, 2024</p>
              <p class="mb-0"><strong>Venue:</strong> School Main Hall</p>
            </div>
            <div>
              <h6 class="text-primary fw-bold">🏆 Quran Competition</h6>
              <p class="mb-0"><strong>Date:</strong> January 5, 2025</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="card border-warning shadow-sm h-100">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0 fw-bold">💡 Important Reminders</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <h6 class="text-warning fw-bold">📖 Homework Schedule</h6>
              <p class="mb-2">Please ensure students complete their daily Quran revision and Islamic studies homework.</p>
            </div>
            <div class="mb-3">
              <h6 class="text-warning fw-bold">👕 School Uniform</h6>
              <p class="mb-2">Students must wear proper school uniform with hijab for girls.</p>
            </div>
            <div>
              <h6 class="text-warning fw-bold">⏰ Punctuality</h6>
              <p class="mb-0">Classes start promptly at 9:00 AM. Please ensure timely arrival.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-success border-0 shadow-sm mt-4">
      <div class="d-flex align-items-center">
        <i class="fas fa-hands-helping fa-2x me-3 text-success"></i>
        <div>
          <h5 class="mb-1 fw-bold">Partnership in Education</h5>
          <p class="mb-0">We appreciate your continuous support and partnership in your child's Islamic education journey.</p>
        </div>
      </div>
    </div>
  `;

  const finalDisplayContent =
    displayContent || announcement?.content || defaultContent;
  const lastUpdated = announcement?.lastUpdated || "21 November 2025";

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          {/* Main Card */}
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header with Success Gradient */}
            <div className="card-header bg-gradient-success py-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 p-3 rounded-3 me-4">
                      <i className="fas fa-home fa-2x"></i>
                    </div>
                    <div>
                      <h2 className="mb-1 fw-bold">
                        Parent Announcement Center
                      </h2>
                      <div className="d-flex flex-wrap align-items-center gap-3">
                        <span className="badge bg-white bg-opacity-20 text-black fs-6">
                          <i className="far fa-calendar-alt me-2"></i>
                          Last Updated: <strong>{lastUpdated}</strong>
                        </span>
                        <span className="badge bg-warning bg-opacity-20 text-white fs-6">
                          <i className="fas fa-family me-2"></i>
                          All Parents & Guardians
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
                            className="btn btn-warning btn-lg rounded-pill px-4 shadow-sm fw-bold"
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
                            className="btn btn-outline btn-lg rounded-pill px-4 shadow-sm fw-bold"
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
                    key={isEditing ? "editing" : "viewing"} // Force re-render when mode changes
                    ref={editor}
                    value={editorContent}
                    config={config}
                    onBlur={(newContent) => {
                      // Only update on blur, not on every change
                      setEditorContent(newContent);
                      contentRef.current = newContent;
                    }}
                    // Remove onChange to prevent constant re-renders
                  />
                </div>
              ) : (
                <div
                  className="announcement-content"
                  style={{ fontSize: "1.1rem", lineHeight: "1.7" }}
                  dangerouslySetInnerHTML={{ __html: finalDisplayContent }}
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
                      <i className="fas fa-users me-2"></i>
                      Parent Portal • Family Access
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links Section */}
          {!isEditing && (
            <div className="row mt-4 g-3">
              <div className="col-md-3">
                <div className="card border-primary shadow-sm h-100 text-center">
                  <div className="card-body p-4">
                    <i className="fas fa-calendar-check fa-2x text-primary mb-3"></i>
                    <h6 className="fw-bold">Event Calendar</h6>
                    <small className="text-muted">
                      View school events and dates
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-success shadow-sm h-100 text-center">
                  <div className="card-body p-4">
                    <i className="fas fa-chart-line fa-2x text-success mb-3"></i>
                    <h6 className="fw-bold">Progress Reports</h6>
                    <small className="text-muted">
                      Check student performance
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-warning shadow-sm h-100 text-center">
                  <div className="card-body p-4">
                    <i className="fas fa-file-invoice-dollar fa-2x text-warning mb-3"></i>
                    <h6 className="fw-bold">Fee Portal</h6>
                    <small className="text-muted">Online fee payment</small>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-info shadow-sm h-100 text-center">
                  <div className="card-body p-4">
                    <i className="fas fa-headset fa-2x text-info mb-3"></i>
                    <h6 className="fw-bold">Support</h6>
                    <small className="text-muted">Get help and support</small>
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

export default ParentAnnouncement;
