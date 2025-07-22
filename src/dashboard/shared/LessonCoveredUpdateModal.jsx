import React, { useEffect, useState } from "react";
import { useUpdateLessonCoveredMutation } from "../../redux/features/lessons_covered/lessons_coveredApi";
import Swal from "sweetalert2";

export default function LessonCoveredUpdateModal({
  student,
  handleClose,
  showModal,
}) {
  const [updateLessonCovered, { isLoading }] = useUpdateLessonCoveredMutation();

  const [beginningData, setBeginningData] = useState({});
  const [endingData, setEndingData] = useState({});

  useEffect(() => {
    if (student) {
      const beginning =
        student.entries.find((e) => e.time_of_month === "beginning") || {};
      const ending =
        student.entries.find((e) => e.time_of_month === "ending") || {};
      setBeginningData(beginning);
      setEndingData(ending);
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (beginningData._id) {
        const data = await updateLessonCovered({
          id: beginningData._id,
          data: beginningData,
        }).unwrap();
        if (data.modifiedCount) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Beginning of Month data updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
      if (endingData._id) {
        const data = await updateLessonCovered({
          id: endingData._id,
          data: endingData,
        }).unwrap();
        if (data.modifiedCount) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "End of Month data updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
      handleClose();
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Update failed. Please try again.",
        showConfirmButton: true,
      });
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  if (!showModal) return null;

  return (
    <div>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none", zIndex: 1050 }}
        onMouseDown={handleBackdropClick}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Edit Lessons - {student?.student_name}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                {/* Beginning of Month */}
                {Object.keys(beginningData).length > 0 &&
                  beginningData.constructor === Object && (
                    <>
                      {" "}
                      <h6>Beginning of Month</h6>
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-2">
                            <label
                              htmlFor="beginning-qaidahPages"
                              className="form-label"
                            >
                              Quran Qaidah Pages
                            </label>
                            <input
                              id="beginning-qaidahPages"
                              name="qaidahPages"
                              className="form-control"
                              value={beginningData.qaidahPages || ""}
                              onChange={(e) =>
                                setBeginningData({
                                  ...beginningData,
                                  qaidahPages: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="mb-2">
                            <label
                              htmlFor="beginning-duasSurahs"
                              className="form-label"
                            >
                              Duas / Surahs Done
                            </label>
                            <input
                              id="beginning-duasSurahs"
                              name="duasSurahs"
                              className="form-control"
                              value={beginningData.duasSurahs || ""}
                              onChange={(e) =>
                                setBeginningData({
                                  ...beginningData,
                                  duasSurahs: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="mb-2">
                            <label
                              htmlFor="beginning-islamicStudiesPages"
                              className="form-label"
                            >
                              Islamic Studies Pages Done
                            </label>
                            <input
                              id="beginning-islamicStudiesPages"
                              name="islamicStudiesPages"
                              className="form-control"
                              value={beginningData.islamicStudiesPages || ""}
                              onChange={(e) =>
                                setBeginningData({
                                  ...beginningData,
                                  islamicStudiesPages: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                {/* Ending of Month */}

                {Object.keys(endingData).length > 0 &&
                  endingData.constructor === Object && (
                    <>
                      {" "}
                      <h6>End of Month</h6>
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-2">
                            <label
                              htmlFor="ending-qaidahPages"
                              className="form-label"
                            >
                              Quran Qaidah Pages
                            </label>
                            <input
                              id="ending-qaidahPages"
                              name="qaidahPages"
                              className="form-control"
                              value={endingData.qaidahPages || ""}
                              onChange={(e) =>
                                setEndingData({
                                  ...endingData,
                                  qaidahPages: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="mb-2">
                            <label
                              htmlFor="ending-duasSurahs"
                              className="form-label"
                            >
                              Duas / Surahs Done
                            </label>
                            <input
                              id="ending-duasSurahs"
                              name="duasSurahs"
                              className="form-control"
                              value={endingData.duasSurahs || ""}
                              onChange={(e) =>
                                setEndingData({
                                  ...endingData,
                                  duasSurahs: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="mb-2">
                            <label
                              htmlFor="ending-islamicStudiesPages"
                              className="form-label"
                            >
                              Islamic Studies Pages Done
                            </label>
                            <input
                              id="ending-islamicStudiesPages"
                              name="islamicStudiesPages"
                              className="form-control"
                              value={endingData.islamicStudiesPages || ""}
                              onChange={(e) =>
                                setEndingData({
                                  ...endingData,
                                  islamicStudiesPages: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
