import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegPlayCircle } from "react-icons/fa";

export default function SyllabusModal({
  handleClose,
  showModal,
  selectedData,
  selectedCategory,
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
            <div className="modal-header w-100">
              <div className="d-flex justify-content-between w-100">
                <h5
                  className="modal-title text-uppercase"
                  style={{ color: "var(--theme)" }}
                  id="exampleModalLabel"
                >
                  {selectedCategory}
                </h5>
                <p
                  className="fs-5 d-flex align-items-center"
                  style={{ color: "var(--theme)" }}
                >
                  <FaRegPlayCircle className="me-1" /> {selectedData?.length}{" "}
                  lessons
                </p>
              </div>
            </div>
            <div className="modal-body">
              {selectedData?.map((singleData) => (
                <li
                  key={singleData.id}
                  className="d-flex pb-2 align-items-center w-100"
                >
                  <i
                    style={{ color: "var(--theme)" }}
                    className="fa-solid fa-check me-2"
                  ></i>
                  <div className="d-flex justify-content-between w-100">
                    <p>{singleData?.name}</p>
                    <p className="text-capitalize">{singleData?.source}</p>
                  </div>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
