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
  const isMobile = window.innerWidth < 768;

  // Memoize config to prevent unnecessary re-renders
  const config = useMemo(
    () => ({
      readonly: !isEditing,
      toolbar: isEditing,
      minHeight: isMobile ? 700 : 400, // Reduced mobile height
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
    <div class="announcement-header bg-success text-white p-3 p-md-4 rounded-3 mb-3 mb-md-4">
      <h2 class="mb-2 mb-md-3 fw-bold fs-4 fs-md-2">👨‍👩‍👧‍👦 Parent Communication Portal</h2>
      <div class="alert alert-light border-0 mb-0 p-2 p-md-3">
        <h5 class="mb-1 mb-md-2 fs-5 fs-md-4">🕌 Assalamualaikum Dear Parents & Guardians</h5>
      </div>
    </div>

    <div class="row g-3 g-md-4">
      <div class="col-lg-6">
        <div class="card border-primary shadow-sm h-100">
          <div class="card-header bg-primary text-white p-2 p-md-3">
            <h5 class="mb-0 fw-bold fs-5 fs-md-4">📅 Upcoming Events</h5>
          </div>
          <div class="card-body p-2 p-md-3">
            <div class="mb-2 mb-md-3">
              <h6 class="text-primary fw-bold fs-6">🎉 Annual School Function</h6>
              <p class="mb-1 mb-md-2"><strong>Date:</strong> December 15, 2024</p>
              <p class="mb-0"><strong>Time:</strong> 10:00 AM - 2:00 PM</p>
            </div>
            <div class="mb-2 mb-md-3">
              <h6 class="text-primary fw-bold fs-6">📚 Parent-Teacher Meeting</h6>
              <p class="mb-1 mb-md-2"><strong>Date:</strong> December 20, 2024</p>
              <p class="mb-0"><strong>Venue:</strong> School Main Hall</p>
            </div>
            <div>
              <h6 class="text-primary fw-bold fs-6">🏆 Quran Competition</h6>
              <p class="mb-0"><strong>Date:</strong> January 5, 2025</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="card border-warning shadow-sm h-100">
          <div class="card-header bg-warning text-dark p-2 p-md-3">
            <h5 class="mb-0 fw-bold fs-5 fs-md-4">💡 Important Reminders</h5>
          </div>
          <div class="card-body p-2 p-md-3">
            <div class="mb-2 mb-md-3">
              <h6 class="text-warning fw-bold fs-6">📖 Homework Schedule</h6>
              <p class="mb-2">Please ensure students complete their daily Quran revision and Islamic studies homework.</p>
            </div>
            <div class="mb-2 mb-md-3">
              <h6 class="text-warning fw-bold fs-6">👕 School Uniform</h6>
              <p class="mb-2">Students must wear proper school uniform with hijab for girls.</p>
            </div>
            <div>
              <h6 class="text-warning fw-bold fs-6">⏰ Punctuality</h6>
              <p class="mb-0">Classes start promptly at 9:00 AM. Please ensure timely arrival.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-success border-0 shadow-sm mt-3 mt-md-4 p-2 p-md-3">
      <div class="d-flex align-items-center">
        <i class="fas fa-hands-helping fa-lg fa-2x-md me-2 me-md-3 text-success"></i>
        <div>
          <h5 class="mb-1 fw-bold fs-5 fs-md-4">Partnership in Education</h5>
          <p class="mb-0">We appreciate your continuous support and partnership in your child's Islamic education journey.</p>
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
            {/* Header with Success Gradient */}
            <div className="card-header bg-gradient-success py-3 py-md-4 px-3 px-md-4">
              <div className="row align-items-center">
                <div className="col-md-8 mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 p-2 p-md-3 rounded-2 rounded-md-3 me-3 me-md-4">
                      <i className="fas fa-home fa-lg fa-2x-md"></i>
                    </div>
                    <div className="w-100">
                      <h2 className="mb-1 fw-bold fs-4 fs-md-3 fs-lg-2">
                        Parent Announcement Center
                      </h2>
                      <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 mt-2">
                        <span className="badge bg-white bg-opacity-20 text-black fs-7 fs-md-6">
                          <i className="far fa-calendar-alt me-1 me-md-2"></i>
                          Updated: <strong>{lastUpdated}</strong>
                        </span>
                        <span className="badge bg-warning bg-opacity-20 text-white fs-7 fs-md-6">
                          <i className="fas fa-family me-1 me-md-2"></i>
                          Parents & Guardians
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
                            className="btn btn-warning btn-sm btn-md-lg rounded-pill px-3 px-md-4 shadow-sm fw-bold"
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
                    // Remove onChange to prevent constant re-renders
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
                      <i className="fas fa-users me-1 me-md-2"></i>
                      Parent Portal • Family Access
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links Section */}
          {!isEditing && (
            <div className="row mt-3 mt-md-4 g-2 g-md-3">
              <div className="col-6 col-md-3">
                <div className="card border-primary shadow-sm h-100 text-center">
                  <div className="card-body p-2 p-md-3 p-lg-4">
                    <i className="fas fa-calendar-check fa-lg fa-2x-md text-primary mb-2 mb-md-3"></i>
                    <h6 className="fw-bold fs-6 mb-1">Event Calendar</h6>
                    <small className="text-muted fs-7">
                      View school events
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card border-success shadow-sm h-100 text-center">
                  <div className="card-body p-2 p-md-3 p-lg-4">
                    <i className="fas fa-chart-line fa-lg fa-2x-md text-success mb-2 mb-md-3"></i>
                    <h6 className="fw-bold fs-6 mb-1">Progress Reports</h6>
                    <small className="text-muted fs-7">Check performance</small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3 mt-2 mt-md-0">
                <div className="card border-warning shadow-sm h-100 text-center">
                  <div className="card-body p-2 p-md-3 p-lg-4">
                    <i className="fas fa-file-invoice-dollar fa-lg fa-2x-md text-warning mb-2 mb-md-3"></i>
                    <h6 className="fw-bold fs-6 mb-1">Fee Portal</h6>
                    <small className="text-muted fs-7">Online payment</small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3 mt-2 mt-md-0">
                <div className="card border-info shadow-sm h-100 text-center">
                  <div className="card-body p-2 p-md-3 p-lg-4">
                    <i className="fas fa-headset fa-lg fa-2x-md text-info mb-2 mb-md-3"></i>
                    <h6 className="fw-bold fs-6 mb-1">Support</h6>
                    <small className="text-muted fs-7">
                      Get help and support
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

export default ParentAnnouncement;
