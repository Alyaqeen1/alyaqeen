import React, { useEffect, useState } from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import ukImg from "../../assets/img/home/uk_svg_repo.svg";
import uaeImg from "../../assets/img/home/uae__svg_repo.svg";

export default function LanguageModal() {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    // Show modal when the component mounts (page reloads)
    setShowModal(true);
  }, []);

  // Toggle modal visibility
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  return (
    <div>
      {/* Dark Background (Backdrop) */}
      {/* <button onClick={handleShow}>hello</button> */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        // style={{ backgroundColor: "#ffffe0" }}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        style={{
          display: showModal ? "block" : "none",
          zIndex: 1050,
        }}
        onMouseDown={handleBackdropClick} // Detect click outside
      >
        <div
          className="modal-dialog modal-dialog-scrollable modal-dialog-centered"
          // style={{ backgroundColor: "#ffffe0" }}
        >
          <div
            className="modal-content w-75 mx-auto rounded-4"
            style={{ backgroundColor: "#ffffe0" }}
          >
            <div className="d-flex justify-content-center align-items-center py-3">
              <h3 className="fw-light">
                Please Select <span className="fw-bold me-1">Language.</span>
              </h3>
              <button
                type="button"
                className="btn-close text-black rounded-circle p-2"
                onClick={handleClose}
                aria-label="Close"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "red";
                  e.currentTarget.style.opacity = "50%";
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              />
            </div>
            <div className="modal-body d-flex justify-content-around">
              <div
                className="d-flex flex-column justify-content-center align-content-center text-center"
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector("img").style.transform =
                    "scale(1.2)";
                  e.currentTarget.querySelector("p").style.color = "red";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector("img").style.transform =
                    "scale(1)";
                  e.currentTarget.querySelector("p").style.color = "black";
                }}
              >
                <img
                  src={ukImg}
                  onClick={handleClose}
                  style={{
                    width: "100px",
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
                <p>English</p>
              </div>
              <div
                className="d-flex flex-column justify-content-center align-content-center text-center"
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector("img").style.transform =
                    "scale(1.2)";
                  e.currentTarget.querySelector("p").style.color = "red";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector("img").style.transform =
                    "scale(1)";
                  e.currentTarget.querySelector("p").style.color = "black";
                }}
              >
                <img
                  src={uaeImg}
                  onClick={handleClose}
                  style={{
                    width: "100px",
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
                <p>العربية</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
