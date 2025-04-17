import React from "react";

export default function ProductModal({
  selectedProduct,
  handleClose,
  showModal,
}) {
  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };
  return (
    <div>
      {/* Dark Background (Backdrop) */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        style={{
          display: showModal ? "block" : "none",
          zIndex: 1050,
        }}
        onMouseDown={handleBackdropClick} // Detect click outside
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            {selectedProduct?.media?.length > 0 ? (
              selectedProduct?.media[0]?.type === "video" ? (
                <video
                  controls
                  style={{ height: "300px", width: "100%", padding: "10px" }}
                >
                  <source
                    src={selectedProduct?.media[0]?.url}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <img
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    padding: "10px",
                  }}
                  className="rounded-4"
                  src={selectedProduct?.media[0]?.url}
                  alt="img"
                />
              )
            ) : (
              <img
                style={{ height: "300px", width: "100%", padding: "10px" }}
                src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/post-1.jpg"
                alt="img"
              />
            )}
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center">
                <h3>{selectedProduct?.title}</h3>
                <h4>Price: £{selectedProduct?.price}</h4>
              </div>
              <p className="my-3">{selectedProduct?.description}</p>
              <button className="theme-btn">Order Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
