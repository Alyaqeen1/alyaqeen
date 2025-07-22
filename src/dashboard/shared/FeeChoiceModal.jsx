import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useUpdateFamilyFeeChoiceMutation } from "../../redux/features/families/familiesApi";

export default function FeeChoiceModal({ refetch }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [updateFamilyFeeChoice] = useUpdateFamilyFeeChoiceMutation();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  useEffect(() => {
    // Show modal when component mounts (for example, after approval)
    if (!selectedChoice) {
      setShowModal(true);
    }
  }, [selectedChoice]);

  const handleClose = () => setShowModal(false);

  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal-backdrop")) {
      handleClose();
    }
  };

  const handleSave = async () => {
    if (!selectedChoice) {
      toast.error("Please select a payment option.");

      return;
    }

    try {
      // const response = await axiosPublic.patch(
      //   `/families/update-fee-choice/${user?.email}`,
      //   {
      //     feeChoice: selectedChoice,
      //   }
      // );
      const response = await updateFamilyFeeChoice({
        email: user?.email,
        feeChoice: selectedChoice,
      }).unwrap();

      if (response?.modifiedCount) {
        toast.success("Fee choice updated successfully!");
        refetch();
      } else {
        toast.error("Failed to save fee choice. Please try again.");
      }

      handleClose();
    } catch (error) {
      console.error("Error saving fee choice:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="modal-backdrop fade show"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
          }}
          onClick={handleBackdropClick}
        />
      )}

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        aria-modal={showModal}
        role="dialog"
        style={{
          display: showModal ? "block" : "none",
          zIndex: 1050,
        }}
        aria-labelledby="feeChoiceModalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content p-4 rounded-4 shadow-lg mx-3 mx-md-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title" id="feeChoiceModalLabel">
                Select Your Tuition Fee Payment Option
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              />
            </div>

            <div className="modal-body">
              {/* <p>Please choose one of the following payment policies:</p> */}
              <p className="text-muted">
                If any of your children were admitted{" "}
                <strong>after the 10th of the month</strong>, you must choose
                how you'd like to be charged for the{" "}
                <strong>first month</strong>. Please select one of the options
                below:
              </p>

              <div className="d-flex flex-column gap-3">
                {/* Option 1 */}
                <button
                  type="button"
                  style={{
                    border: "1px solid",
                    borderColor: "var(--border2)",
                    cursor: "pointer",
                    backgroundColor:
                      selectedChoice === "proRated"
                        ? "var(--border2)"
                        : "transparent",
                    color:
                      selectedChoice === "proRated"
                        ? "white"
                        : "var(--border2)",
                  }}
                  className={`text-start p-3 rounded-3`}
                  onClick={() => setSelectedChoice("proRated")}
                  //   style={{  }}
                >
                  <strong>Pro-Rated Fee (After 10th of the Month)</strong>
                  <br />
                  If your child is admitted{" "}
                  <strong>after the 10th of the month</strong>, you can pay a{" "}
                  <strong>pro-rated fee</strong> for the remaining days of the
                  current month. Full monthly fees will begin from the next
                  month.
                </button>

                {/* Option 2 */}
                <button
                  type="button"
                  onClick={() => setSelectedChoice("fullMonth")}
                  style={{
                    border: "1px solid",
                    borderColor: "var(--border2)",
                    cursor: "pointer",
                    backgroundColor:
                      selectedChoice === "fullMonth"
                        ? "var(--border2)"
                        : "transparent",
                    color:
                      selectedChoice === "fullMonth"
                        ? "white"
                        : "var(--border2)",
                  }}
                  className={`text-start p-3 rounded-3`}
                >
                  <strong>Full Month Fee</strong>
                  <br />
                  Pay the{" "}
                  <strong>
                    full monthly fee within 7 days of admission
                  </strong>{" "}
                  to be enrolled for the <strong>entire current month</strong>.
                  The next fee will be due on the{" "}
                  <strong>same date next month</strong> (based on your admission
                  date).
                </button>
              </div>
            </div>

            <div className="modal-footer border-0 pt-3 justify-content-center">
              <button
                type="button"
                style={{
                  backgroundColor: "var(--border2)",
                  color: "white",
                }}
                className="px-4 py-2"
                onClick={handleSave}
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
