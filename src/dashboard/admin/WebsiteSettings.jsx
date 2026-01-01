import React, { useState, useRef, useEffect } from "react";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSectionMutation,
} from "../../redux/features/website_settings/website_settingsApi";
import Swal from "sweetalert2";
import {
  FaVideo,
  FaCalendarAlt,
  FaUpload,
  FaTrash,
  FaSpinner,
  FaFilePdf,
  FaImage,
} from "react-icons/fa";
import GalleryUploader from "./GalleryUploader";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function WebsiteSettings() {
  const {
    data: websiteData,
    isLoading,
    refetch,
  } = useGetWebsiteSettingsQuery();
  const [updateSection] = useUpdateWebsiteSectionMutation();

  // Home Video (upload to Cloudinary) states
  const [homeVideoFile, setHomeVideoFile] = useState(null);
  const [homeVideoPreview, setHomeVideoPreview] = useState("");
  const [homeVideoUploading, setHomeVideoUploading] = useState(false);
  const [videoLocalLoading, setVideoLocalLoading] = useState(false);
  const [gallery, setGallery] = useState([]);
  // Prayer Calendar (PDF/Image) states
  const [prayerCalendarFile, setPrayerCalendarFile] = useState(null);
  const [prayerCalendarPreview, setPrayerCalendarPreview] = useState("");
  const [prayerCalendarUploading, setPrayerCalendarUploading] = useState(false);
  const [calendarLocalLoading, setCalendarLocalLoading] = useState(false);

  const videoInputRef = useRef(null);
  const calendarInputRef = useRef(null);

  // Load existing data
  useEffect(() => {
    if (websiteData?.homeVideo?.url) {
      setHomeVideoPreview(websiteData.homeVideo.url);
    }

    if (websiteData?.prayerCalendar?.calendarFile) {
      setPrayerCalendarPreview(websiteData.prayerCalendar.calendarFile);
    }
  }, [websiteData]);

  const handleHomeVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate video file
      const validVideoTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/ogg",
        "video/x-msvideo",
      ];

      if (!validVideoTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File!",
          text: "Please upload a valid video file (MP4, WebM, MOV, AVI, OGG)",
          icon: "warning",
        });
        return;
      }

      // Validate file size (max 100MB for video)
      if (file.size > 100 * 1024 * 1024) {
        Swal.fire({
          title: "File Too Large!",
          text: "Please upload a video smaller than 100MB",
          icon: "warning",
        });
        return;
      }

      setHomeVideoFile(file);

      // Create preview for video
      const videoUrl = URL.createObjectURL(file);
      setHomeVideoPreview(videoUrl);
    }
  };

  const handlePrayerCalendarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (PDF or Image)
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File!",
          text: "Please upload a valid PDF or image file (PDF, JPG, PNG, GIF, WebP)",
          icon: "warning",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          title: "File Too Large!",
          text: "Please upload a file smaller than 10MB",
          icon: "warning",
        });
        return;
      }

      setPrayerCalendarFile(file);

      // Create preview for image files
      if (file.type.includes("image")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPrayerCalendarPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        // For PDFs, show file info instead of preview
        setPrayerCalendarPreview("pdf");
      }
    }
  };

  const uploadHomeVideo = async () => {
    if (!homeVideoFile && !homeVideoPreview) {
      Swal.fire({
        title: "Missing Video!",
        text: "Please select a video file first",
        icon: "warning",
      });
      return;
    }

    setVideoLocalLoading(true);

    try {
      let videoUrl = homeVideoPreview;

      // If new video selected, upload it to Cloudinary
      if (homeVideoFile) {
        setHomeVideoUploading(true);
        videoUrl = await uploadToCloudinary(homeVideoFile, "homepage-videos");
        console.log(videoUrl);
      }

      // Save to backend
      await updateSection({
        section: "homeVideo",
        data: { url: videoUrl },
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Homepage video updated successfully",
        icon: "success",
        timer: 2000,
      });

      refetch();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update homepage video",
        icon: "error",
      });
      console.error("Home video update error:", error);
    } finally {
      setHomeVideoUploading(false);
      setVideoLocalLoading(false);
    }
  };

  const uploadPrayerCalendar = async () => {
    if (!prayerCalendarFile && !prayerCalendarPreview) {
      Swal.fire({
        title: "Missing File!",
        text: "Please select a calendar file first",
        icon: "warning",
      });
      return;
    }

    setCalendarLocalLoading(true);

    try {
      let calendarFileUrl = prayerCalendarPreview;

      // If new file selected, upload it to Cloudinary
      if (prayerCalendarFile) {
        setPrayerCalendarUploading(true);

        try {
          calendarFileUrl = await uploadToCloudinary(
            prayerCalendarFile,
            "prayer-calendars"
          );
          console.log("✅ Uploaded URL:", calendarFileUrl);
        } catch (uploadError) {
          Swal.fire({
            title: "Upload Failed!",
            text: "Failed to upload file to Cloudinary. Please try again.",
            icon: "error",
          });
          throw uploadError; // Re-throw to be caught by outer try-catch
        } finally {
          setPrayerCalendarUploading(false);
        }
      }

      // FIX: Check if calendarFileUrl is defined before using .includes()
      if (!calendarFileUrl) {
        throw new Error("No URL returned from upload");
      }

      // Save to backend
      await updateSection({
        section: "prayerCalendar",
        data: { calendarFile: calendarFileUrl },
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Prayer calendar updated successfully",
        icon: "success",
        timer: 2000,
      });

      refetch();
    } catch (error) {
      console.error("❌ Calendar update error:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update prayer calendar",
        icon: "error",
      });
    } finally {
      setCalendarLocalLoading(false);
    }
  };

  // Check if current preview is from Cloudinary (has https URL)
  const isCloudinaryVideo =
    homeVideoPreview && homeVideoPreview.startsWith("http");
  const isCloudinaryCalendar =
    prayerCalendarPreview && prayerCalendarPreview.startsWith("http");

  // In your WebsiteSettings component, update these parts:

  // Load existing gallery data - FIX THIS
  useEffect(() => {
    if (websiteData?.homeVideo?.url) {
      setHomeVideoPreview(websiteData.homeVideo.url);
    }

    if (websiteData?.prayerCalendar?.calendarFile) {
      setPrayerCalendarPreview(websiteData.prayerCalendar.calendarFile);
    }

    // CORRECT: Load gallery as direct array
    if (websiteData?.gallery) {
      // websiteData.gallery IS the array directly
      setGallery(websiteData.gallery || []);
    }
  }, [websiteData]);

  // Handle gallery update - FIX THIS
  const handleGalleryUpdate = async (mediaArray) => {
    try {
      // Send gallery as direct array, not nested
      await updateSection({
        section: "gallery",
        data: mediaArray, // Direct array, not {media: mediaArray}
      }).unwrap();

      setGallery(mediaArray);

      // Show success message
      Swal.fire({
        title: "Success!",
        text: "Gallery updated successfully",
        icon: "success",
        timer: 1500,
      });

      // Optional: Refresh data
      refetch();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update gallery",
        icon: "error",
      });
      throw error;
    }
  };
  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  return (
    <div className="py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h3 className={`fs-3 fw-bold text-center`}>Website Media Settings</h3>
        </div>
      </div>

      <div className="row align-items-stretch">
        {/* Home Video (Cloudinary Upload) Section */}
        <div className="col-lg-6 mb-4 d-flex">
          <div className="card shadow-sm border-0 w-100 d-flex flex-column">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FaVideo className="me-2" />
                Homepage Video
              </h4>
            </div>
            <div className="card-body d-flex flex-column">
              {/* Video Preview */}
              <div className="mb-4">
                <label className="form-label fw-bold">Video Preview</label>
                <div
                  className="border rounded overflow-hidden bg-dark"
                  style={{ minHeight: "200px" }}
                >
                  {homeVideoPreview ? (
                    <div className="ratio ratio-16x9">
                      <video
                        src={homeVideoPreview}
                        controls
                        className="w-100 h-100"
                        style={{ objectFit: "contain" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <FaVideo size={50} className="mb-3" />
                      <p className="mb-0">No video uploaded yet</p>
                      <small>Supported: MP4, WebM, MOV, AVI, OGG</small>
                    </div>
                  )}
                </div>
                {isCloudinaryVideo && (
                  <small className="text-success mt-1 d-block">
                    ✓ Video is stored in Cloudinary
                  </small>
                )}
              </div>

              {/* File Info */}
              {homeVideoFile && (
                <div className="mb-3 p-3 bg-light rounded">
                  <h6 className="fw-bold">Selected Video</h6>
                  <div className="d-flex align-items-center">
                    <FaVideo className="text-primary me-2" />
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-semibold">{homeVideoFile.name}</p>
                      <small className="text-muted">
                        {(homeVideoFile.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                        {homeVideoFile.type}
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Controls */}
              <div className="mt-auto">
                <div className="mb-3">
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleHomeVideoChange}
                    accept="video/*"
                    className="form-control"
                    disabled={homeVideoUploading || videoLocalLoading}
                  />
                  <small className="text-muted">
                    Max file size: 100MB. Supported: MP4, WebM, MOV, AVI, OGG
                  </small>
                </div>

                <button
                  onClick={uploadHomeVideo}
                  disabled={
                    (!homeVideoFile && !homeVideoPreview) ||
                    homeVideoUploading ||
                    videoLocalLoading
                  }
                  className="btn btn-primary w-100"
                >
                  {homeVideoUploading || videoLocalLoading ? (
                    <>
                      <FaSpinner className="me-2 fa-spin" />
                      {homeVideoUploading ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <FaUpload className="me-2" />
                      {homeVideoPreview ? "Update Video" : "Upload Video"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Calendar Section */}
        <div className="col-lg-6 mb-4 d-flex">
          <div className="card shadow-sm border-0 w-100 d-flex flex-column">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Prayer Calendar
              </h4>
            </div>
            <div className="card-body d-flex flex-column">
              {/* Calendar Preview */}
              <div className="mb-4">
                <label className="form-label fw-bold">Calendar Preview</label>
                <div
                  className="border rounded overflow-hidden bg-light"
                  style={{ minHeight: "200px" }}
                >
                  {prayerCalendarPreview ? (
                    prayerCalendarPreview === "pdf" ||
                    prayerCalendarPreview.includes("pdf") ? (
                      <div className="text-center py-5">
                        <FaFilePdf size={60} className="text-danger mb-3" />
                        <p className="mt-3">PDF Calendar File</p>
                        {prayerCalendarFile && (
                          <small className="text-muted">
                            {prayerCalendarFile.name} •{" "}
                            {(prayerCalendarFile.size / (1024 * 1024)).toFixed(
                              2
                            )}
                            MB
                          </small>
                        )}
                        {isCloudinaryCalendar && (
                          <div className="mt-2">
                            <a
                              href={prayerCalendarPreview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              View PDF
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <img
                          src={prayerCalendarPreview}
                          alt="Calendar preview"
                          className="img-fluid w-100"
                          style={{ maxHeight: "300px", objectFit: "contain" }}
                        />
                        {isCloudinaryCalendar && (
                          <div className="text-center p-2">
                            <a
                              href={prayerCalendarPreview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-success"
                            >
                              View Full Image
                            </a>
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <FaCalendarAlt size={50} className="mb-3" />
                      <p className="mb-0">No calendar uploaded yet</p>
                      <small>Supported: PDF, JPG, PNG, GIF, WebP</small>
                    </div>
                  )}
                </div>
                {isCloudinaryCalendar && (
                  <small className="text-success mt-1 d-block">
                    ✓ Calendar is stored in Cloudinary
                  </small>
                )}
              </div>

              {/* File Info */}
              {prayerCalendarFile && prayerCalendarPreview !== "pdf" && (
                <div className="mb-3 p-3 bg-light rounded">
                  <h6 className="fw-bold">Selected File</h6>
                  <div className="d-flex align-items-center">
                    {prayerCalendarFile.type === "application/pdf" ? (
                      <FaFilePdf className="text-danger me-2" />
                    ) : (
                      <FaImage className="text-success me-2" />
                    )}
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-semibold">
                        {prayerCalendarFile.name}
                      </p>
                      <small className="text-muted">
                        {(prayerCalendarFile.size / (1024 * 1024)).toFixed(2)}{" "}
                        MB • {prayerCalendarFile.type}
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Controls */}
              <div className="mt-auto">
                <div className="mb-3">
                  <input
                    type="file"
                    ref={calendarInputRef}
                    onChange={handlePrayerCalendarChange}
                    accept=".pdf,image/*"
                    className="form-control"
                    disabled={prayerCalendarUploading || calendarLocalLoading}
                  />
                  <small className="text-muted">
                    Max file size: 10MB. Recommended: PDF or high-quality image
                  </small>
                </div>

                <button
                  onClick={uploadPrayerCalendar}
                  disabled={
                    (!prayerCalendarFile && !prayerCalendarPreview) ||
                    prayerCalendarUploading ||
                    calendarLocalLoading
                  }
                  className="btn btn-success w-100"
                >
                  {prayerCalendarUploading || calendarLocalLoading ? (
                    <>
                      <FaSpinner className="me-2 fa-spin" />
                      {prayerCalendarUploading ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <FaUpload className="me-2" />
                      {prayerCalendarPreview
                        ? "Update Calendar"
                        : "Upload Calendar"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="col-12 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">
                <FaImage className="me-2" />
                Media Gallery
              </h4>
            </div>
            <div className="card-body">
              <GalleryUploader
                onGalleryUpdate={handleGalleryUpdate}
                // No need to pass existingGallery - component fetches it
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
