import React, { useState, useRef, useEffect } from "react";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import { useGetWebsiteSectionQuery } from "../../redux/features/website_settings/website_settingsApi";
import {
  FaUpload,
  FaTrash,
  FaImage,
  FaVideo,
  FaSpinner,
  FaPlay,
} from "react-icons/fa";
import Swal from "sweetalert2";

const GalleryUploader = ({ onGalleryUpdate }) => {
  const [files, setFiles] = useState([]); // Only for new files before upload
  const [uploading, setUploading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch gallery data directly from API
  const {
    data: galleryData,
    isLoading: isGalleryLoading,
    refetch,
  } = useGetWebsiteSectionQuery("gallery");

  // Get gallery array from response - BACKEND HANDLES IDs
  const gallery = Array.isArray(galleryData?.data)
    ? galleryData.data
    : Array.isArray(galleryData)
    ? galleryData
    : [];

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isSupported = isImage || isVideo;
      const isSizeValid = file.size <= 100 * 1024 * 1024;

      return isSupported && isSizeValid;
    });

    const filesWithPreview = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
      name: file.name,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...filesWithPreview]);
  };

  // Upload files to Cloudinary
  const uploadAndSave = async () => {
    if (files.length === 0) {
      Swal.fire({
        title: "No Files!",
        text: "Please select files to upload",
        icon: "warning",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadedItems = [];

      // Upload each file to Cloudinary
      for (const fileData of files) {
        const folder =
          fileData.type === "image" ? "gallery-images" : "gallery-videos";
        const url = await uploadToCloudinary(fileData.file, folder);

        // NO ID NEEDED - Backend will add it!
        uploadedItems.push({
          url,
          type: fileData.type,
          // NO ID HERE - Backend handles it!
        });
      }

      // Combine existing gallery with new items
      const updatedGallery = [...gallery, ...uploadedItems];

      // Send to parent component - Backend will add IDs
      await onGalleryUpdate(updatedGallery);

      // Clear files after successful upload
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clean up object URLs
      files.forEach((fileData) => {
        if (fileData.preview) URL.revokeObjectURL(fileData.preview);
      });

      // Refetch to get updated data with IDs
      refetch();

      Swal.fire({
        title: "Success!",
        text: `${uploadedItems.length} item(s) added to gallery`,
        icon: "success",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to upload files",
        icon: "error",
      });
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Remove item from gallery - Use ID from backend
  const removeFromGallery = async (itemId) => {
    const itemToRemove = gallery.find((item) => item.id === itemId);

    const confirmed = await Swal.fire({
      title: "Remove this item?",
      text: "Are you sure you want to remove this item from the gallery?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (confirmed.isConfirmed) {
      // Filter out the item with this ID
      const updatedGallery = gallery.filter((item) => item.id !== itemId);

      // Update via parent component
      await onGalleryUpdate(updatedGallery);

      // Refetch to get updated data
      refetch();

      Swal.fire({
        title: "Removed!",
        text: "Item removed from gallery",
        icon: "success",
        timer: 1500,
      });
    }
  };

  // Remove file before upload
  const removeFile = (index) => {
    const fileToRemove = files[index];

    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Clean up
  useEffect(() => {
    return () => {
      files.forEach((fileData) => {
        if (fileData.preview) URL.revokeObjectURL(fileData.preview);
      });
    };
  }, [files]);

  // Loading state
  if (isGalleryLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <FaSpinner className="fa-spin me-2" />
        Loading gallery...
      </div>
    );
  }

  return (
    <div className="simple-gallery-upload">
      {/* Upload Section */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <FaUpload className="me-2" />
            Upload New Photos/Videos
          </h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              multiple
              className="form-control"
              disabled={uploading}
            />
            <small className="text-muted">
              Select multiple images/videos (max 100MB each)
            </small>
          </div>

          {/* Selected Files Preview */}
          {files.length > 0 && (
            <div className="mb-3">
              <h6>Selected Files ({files.length}):</h6>
              <div className="row g-2">
                {files.map((fileData, index) => (
                  <div key={index} className="col-6 col-md-4 col-lg-3">
                    <div className="position-relative border rounded p-1">
                      {/* Media Preview */}
                      {fileData.type === "image" ? (
                        <img
                          src={fileData.preview}
                          alt={fileData.name}
                          className="img-fluid rounded"
                          style={{
                            height: "120px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div className="position-relative">
                          <div
                            className="bg-dark rounded d-flex align-items-center justify-content-center"
                            style={{
                              height: "120px",
                              width: "100%",
                            }}
                          >
                            <FaVideo className="text-white" size={40} />
                          </div>
                          <div className="position-absolute top-0 start-0 m-1">
                            <span className="badge bg-danger">VIDEO</span>
                          </div>
                        </div>
                      )}

                      {/* File Info */}
                      <div className="mt-1">
                        <small
                          className="d-block text-truncate"
                          title={fileData.name}
                        >
                          <strong>
                            {fileData.type === "image" ? (
                              <FaImage className="text-success me-1" />
                            ) : (
                              <FaVideo className="text-primary me-1" />
                            )}
                            {fileData.name.length > 20
                              ? `${fileData.name.substring(0, 17)}...`
                              : fileData.name}
                          </strong>
                        </small>
                        <small className="text-muted">
                          {formatFileSize(fileData.size)}
                        </small>
                      </div>

                      {/* Remove Button */}
                      <button
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                        onClick={() => removeFile(index)}
                        style={{ padding: "2px 6px", zIndex: 2 }}
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={uploadAndSave}
            disabled={files.length === 0 || uploading}
          >
            {uploading ? (
              <>
                <FaSpinner className="fa-spin me-2" />
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="me-2" />
                Upload to Gallery
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Gallery - FROM API DATA */}
      <div className="card">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Current Gallery ({gallery.length} items)</h5>
          {gallery.length > 0 && (
            <small className="text-white-50">
              <FaVideo className="me-1" /> = Video, <FaImage className="me-1" />{" "}
              = Photo
            </small>
          )}
        </div>
        <div className="card-body">
          {gallery.length === 0 ? (
            <p className="text-muted text-center py-3">
              No items in gallery yet. Upload some photos or videos!
            </p>
          ) : (
            <div className="row g-3">
              {gallery.map((item) => (
                <div key={item.id} className="col-6 col-md-4 col-lg-3">
                  <div className="position-relative border rounded p-2">
                    {/* Media Preview */}
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt="Gallery item"
                        className="img-fluid rounded"
                        style={{
                          height: "150px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="position-relative">
                        <div
                          className="bg-dark rounded d-flex align-items-center justify-content-center"
                          style={{
                            height: "150px",
                            width: "100%",
                          }}
                        >
                          <FaPlay className="text-white" size={30} />
                        </div>
                        <div className="position-absolute top-0 start-0 m-1">
                          <span className="badge bg-primary">VIDEO</span>
                        </div>
                      </div>
                    )}

                    {/* File Info */}
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="d-flex align-items-center">
                          {item.type === "image" ? (
                            <FaImage className="text-success me-1" />
                          ) : (
                            <FaVideo className="text-primary me-1" />
                          )}
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "100px" }}
                          >
                            {item.name || "Gallery item"}
                          </span>
                        </small>
                        <small
                          className={`badge ${
                            item.type === "image" ? "bg-success" : "bg-primary"
                          }`}
                        >
                          {item.type === "image" ? "Photo" : "Video"}
                        </small>
                      </div>
                    </div>

                    {/* Delete Button - Uses ID from backend */}
                    <button
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                      onClick={() => removeFromGallery(item.id)}
                      style={{ padding: "4px 8px" }}
                      title="Remove this item"
                    >
                      <FaTrash size={12} />
                    </button>

                    {/* Quick View Link */}
                    <div className="text-center mt-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm w-100"
                      >
                        {item.type === "image" ? (
                          <>
                            <FaImage className="me-1" />
                            View Image
                          </>
                        ) : (
                          <>
                            <FaPlay className="me-1" />
                            Play Video
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryUploader;
