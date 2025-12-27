import React, { useState } from "react";
import { FaPlay, FaExpand, FaTimes, FaVideo, FaImage } from "react-icons/fa";
import "../../../simpleGallery.css"; // We'll create this CSS file
const SimpleGallery = ({ gallery = [] }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const openLightbox = (item) => {
    setSelectedMedia(item);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    document.body.style.overflow = "auto";
  };

  // If no gallery items
  if (!gallery || gallery.length === 0) {
    return (
      <div className="text-center py-5">
        <FaImage size={50} className="text-muted mb-3" />
        <h4 className="text-muted">Gallery Coming Soon</h4>
        <p>Check back later for photos and videos!</p>
      </div>
    );
  }

  return (
    <div className="simple-gallery">
      <h2 className="text-center mb-4">Our Gallery</h2>

      {/* Simple grid - adjusts based on item count */}
      <div className={`gallery-grid grid-${Math.min(gallery.length, 4)}`}>
        {gallery.map((item, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => openLightbox(item)}
          >
            <div className="gallery-card">
              {item.type === "image" ? (
                <div className="image-container">
                  <img
                    src={item.url}
                    alt={`Gallery ${index + 1}`}
                    className="gallery-image"
                  />
                  <div className="image-overlay">
                    <FaExpand size={20} />
                  </div>
                </div>
              ) : (
                <div className="video-container">
                  <video src={item.url} className="gallery-video" />
                  <div className="video-overlay">
                    <div className="play-icon">
                      <FaPlay size={24} />
                    </div>
                    <p className="mt-2 mb-0">Click to play</p>
                  </div>
                </div>
              )}

              <div className="type-indicator">
                <span
                  className={`badge ${
                    item.type === "image" ? "bg-success" : "bg-primary"
                  }`}
                >
                  {item.type === "image" ? "Photo" : "Video"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedMedia && (
        <div className="lightbox" onClick={closeLightbox}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              <FaTimes />
            </button>

            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.url}
                alt="Full size"
                className="lightbox-image"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="lightbox-video"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleGallery;
