import React, { useState, useMemo, useEffect } from "react";
import {
  useGetFamilyQuery,
  useUpdateFamilyDataMutation,
} from "../../redux/features/families/familiesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { useGetStudentsQuery } from "../../redux/features/students/studentsApi";
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
    isLoading,
    refetch,
  } = useGetFamilyQuery(familyId, {
    skip: !familyId,
  });

  // Fetch all students
  const { data: students = [], isLoading: studentLoading } =
    useGetStudentsQuery();

  // Prepare student options
  const studentOptions = useMemo(() => {
    return students
      ?.filter((s) => s.activity === "active")
      ?.map((student) => ({
        label: student.name,
        value: student.uid,
      }));
  }, [students]);

  // Track selected student UIDs
  const [selectedStudentUids, setSelectedStudentUids] = useState([]);

  // Initialize selected students when data loads
  useEffect(() => {
    if (showModal && family?.children) {
      setSelectedStudentUids(family?.children);
    } else if (!showModal) {
      setSelectedStudentUids([]); // reset when modal closes
    }
  }, [showModal, family]);

  if (isLoading || studentLoading) return <LoadingSpinnerDash />;
  if (!family) return <div>No family data found</div>;

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

      if (result.error) throw result.error;

      toast.success("Family updated successfully!");
      handleClose();
      refetch();
      familiesRefetch();
      refetchFee();
    } catch (error) {
      toast.error("Failed to update family");
      console.error(error);
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
                    value={
                      selectedStudentUids
                        ?.map((uid) => {
                          const student = students?.find((s) => s.uid === uid);
                          if (!student) {
                            console.warn(
                              `Student with uid "${uid}" not found in students list`
                            );
                            return null; // skip unknown student
                          }
                          return { label: student.name, value: uid };
                        })
                        ?.filter(Boolean) // remove any null values from above
                    }
                    onChange={(selectedOptions) => {
                      setSelectedStudentUids(
                        selectedOptions.map((opt) => opt.value)
                      );
                    }}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
