import React, { useState, useMemo, useEffect } from "react";
import {
  useGetFamilyQuery,
  useUpdateFamilyDataMutation,
} from "../../redux/features/families/familiesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { useGetStudentByActivityQuery } from "../../redux/features/students/studentsApi";
import Select from "react-select";
import toast from "react-hot-toast";

export default function FamilyUpdateModal({
  familyId,
  handleClose,
  showModal,
  refetch: familiesRefetch,
  refetchFee,
}) {
  const [updateFamilyData] = useUpdateFamilyDataMutation();

  // Fetch family data
  const {
    data: family,
    isLoading: familyLoading,
    refetch,
  } = useGetFamilyQuery(familyId, { skip: !familyId });

  // Fetch active students
  const { data: students = [], isLoading: studentLoading } =
    useGetStudentByActivityQuery({
      activity: "active",
    });

  // Prepare student options
  const studentOptions = useMemo(() => {
    return students?.map((student) => ({
      label: student.name,
      value: student.uid,
    }));
  }, [students]);

  // Track selected student UIDs
  const [selectedStudentUids, setSelectedStudentUids] = useState([]);

  // Initialize selected students when modal opens or data changes
  useEffect(() => {
    if (showModal && family?.children) {
      setSelectedStudentUids(family?.children);
    } else if (!showModal) {
      setSelectedStudentUids([]); // Reset when modal closes
    }
  }, [showModal, family]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      const result = await updateFamilyData({
        id: familyId,
        name: form.name.value,
        discount: form.discount.value,
        children: selectedStudentUids,
      });

      if (result.error) {
        // Extract error data from RTK Query response
        const errorData = result.error.data;

        if (errorData?.conflictedStudents) {
          // Show the first conflict as the main message
          const firstConflict = errorData.conflictedStudents[0];
          toast.error(
            `${firstConflict.name} is already in ${
              firstConflict.currentFamily || "another"
            } family. Please remove them first.`,
            { duration: 5000 }
          );
        } else {
          toast.error(
            errorData?.message || errorData?.error || "Failed to update family"
          );
        }
        return;
      }

      toast.success("Family updated successfully!");
      handleClose();
      refetch();
      familiesRefetch();
      refetchFee();
    } catch (error) {
      console.error("Update family error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Family</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              {/* Show loader inside modal body */}
              {familyLoading || studentLoading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <LoadingSpinnerDash />
                </div>
              ) : !family ? (
                <div className="text-center text-danger py-4">
                  No family data found
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Family Name:</label>
                    <input
                      className="form-control"
                      name="name"
                      defaultValue={family.name}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Students:</label>
                    <Select
                      isMulti
                      options={studentOptions}
                      value={selectedStudentUids
                        ?.map((uid) => {
                          const student = students?.find((s) => s.uid === uid);
                          if (!student) {
                            console.warn(
                              `Student with uid "${uid}" not found in students list`
                            );
                            return null;
                          }
                          return { label: student.name, value: uid };
                        })
                        ?.filter(Boolean)}
                      onChange={(selectedOptions) =>
                        setSelectedStudentUids(
                          selectedOptions.map((opt) => opt.value)
                        )
                      }
                      placeholder="Select students..."
                      isSearchable
                      classNamePrefix="react-select"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Discount (%):</label>
                    <input
                      className="form-control"
                      name="discount"
                      type="text"
                      defaultValue={
                        family?.discount != null ? family.discount : ""
                      }
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ backgroundColor: "var(--border2)" }}
                    >
                      Update Family
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
