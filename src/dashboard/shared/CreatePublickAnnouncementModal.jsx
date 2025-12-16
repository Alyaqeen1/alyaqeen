import React, { useState, useRef, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";
import {
  useAddAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "../../redux/features/announcements/announcementsApi";

const CreatePublicAnnouncementModal = ({ show, onClose, announcement }) => {
  const editor = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [addAnnouncement, { isLoading: isAdding }] =
    useAddAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] =
    useUpdateAnnouncementMutation();

  const isSaving = isAdding || isUpdating;

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || "");
      setContent(announcement.content || "");
      setIsEditing(true);
    } else {
      setTitle("");
      setContent("");
      setIsEditing(false);
    }
  }, [announcement, show]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Jodit Config
  const config = useMemo(
    () => ({
      readonly: false,
      minHeight: screenWidth < 768 ? 700 : 400,
      toolbar: true,
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
      height: 300,
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
      disablePlugins: ["paste", "stat"],
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
    }),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const announcementData = {
        type: "public",
        title: title.trim(),
        content: content,
        lastUpdated: currentDate,
      };

      if (isEditing && announcement?._id) {
        await updateAnnouncement({
          id: announcement._id,
          ...announcementData,
        }).unwrap();
      } else {
        await addAnnouncement(announcementData).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Failed to save announcement:", error);
    }
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title text-white fw-bold">
              <i className="fas fa-bullhorn me-2"></i>
              {isEditing
                ? "Edit Public Announcement"
                : "Create Public Announcement"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={isSaving}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Title Input */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter announcement title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Content Editor */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Announcement Content *
                </label>
                <div className="border rounded-3 p-2 bg-white">
                  <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    onBlur={handleContentChange}
                  />
                </div>
              </div>

              {/* Preview Note */}
              <div className="alert alert-warning">
                <i className="fas fa-eye me-2"></i>
                This announcement will be visible to all website visitors and
                displayed on the home page.
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                <i className="fas fa-times me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving || !title.trim() || !content.trim()}
              >
                {isSaving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    {isEditing ? "Update Announcement" : "Create Announcement"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePublicAnnouncementModal;
