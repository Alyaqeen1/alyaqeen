import React, { useState, useMemo, useEffect } from "react";
import {
  useGetFamilyQuery,
  useMigrateFamilyDataMutation,
  useUpdateFamilyDataMutation,
} from "../../redux/features/families/familiesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { useGetStudentByActivityQuery } from "../../redux/features/students/studentsApi";
import Select from "react-select";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Add with other imports
export default function FamilyUpdateModal({
  familyId,
  handleClose,
  showModal,
  refetch: familiesRefetch,
  refetchFee,
}) {
  const [updateFamilyData] = useUpdateFamilyDataMutation();
  const [migrateFamily, { isLoading: isMigrating }] =
    useMigrateFamilyDataMutation(); // Add this

  // Add these state variables
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Remove updatingEmail and updatingPassword states
  const {
    data: family,
    isLoading: familyLoading,
    refetch,
  } = useGetFamilyQuery(familyId, { skip: !familyId });

  // Fetch active students for dropdown options
  const { data: activeStudents = [], isLoading: studentLoading } =
    useGetStudentByActivityQuery({
      activity: "active",
    });

  // Fetch inactive students for pre-filled values
  const { data: inactiveStudents = [] } = useGetStudentByActivityQuery({
    activity: "inactive",
  });

  // Combine all students for finding pre-filled values
  const allStudents = useMemo(() => {
    return [...activeStudents, ...inactiveStudents];
  }, [activeStudents, inactiveStudents]);

  // Prepare student options (only active students for dropdown)
  const studentOptions = useMemo(() => {
    return activeStudents?.map((student) => ({
      label: student.name,
      value: student.uid,
    }));
  }, [activeStudents]);

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

  // Create custom formatOptionLabel to show inactive status
  const formatOptionLabel = ({ value, label }) => {
    const student = allStudents.find((s) => s.uid === value);
    const isInactive = student?.activity === "inactive";

    return (
      <div>
        {label}
        {isInactive && (
          <span
            style={{ color: "#6c757d", fontSize: "0.8em", marginLeft: "8px" }}
          >
            (Inactive)
          </span>
        )}
      </div>
    );
  };

  // Get current selected values for the Select component
  const selectedValues = useMemo(() => {
    return selectedStudentUids
      ?.map((uid) => {
        const student = allStudents.find((s) => s.uid === uid);
        if (!student) {
          console.warn(`Student with uid "${uid}" not found`);
          return null;
        }
        return {
          label: student.name,
          value: uid,
          isInactive: student.activity === "inactive",
        };
      })
      ?.filter(Boolean);
  }, [selectedStudentUids, allStudents]);
  // Set initial email when family data loads
  useEffect(() => {
    if (family?.email) {
      setNewEmail(family.email);
    }
  }, [family]);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Single handler for both email and password update
  // Single handler for email and password update
  const handleMigrateFamily = async () => {
    // Validate email
    if (!newEmail) {
      toast.error("Email is required");
      return;
    }

    if (!isValidEmail(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if any changes
    if (newEmail === family?.email && !newPassword) {
      toast.error("No changes to update");
      return;
    }

    // Validate password only if provided
    if (newPassword && newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const result = await migrateFamily({
        familyId: familyId,
        email: newEmail,
        password: newPassword || undefined, // Only send if provided
      }).unwrap();

      console.log("Migration result:", result);
      toast.success("Family credentials updated successfully!");

      // Clear password field
      setNewPassword("");

      // Refresh family data
      refetch();
    } catch (error) {
      console.error("Migration error:", error);
      toast.error(error.data?.error || "Failed to update credentials");
    }
  };
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
            { duration: 5000 },
          );
        } else {
          toast.error(
            errorData?.message || errorData?.error || "Failed to update family",
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
                      value={selectedValues}
                      onChange={(selectedOptions) =>
                        setSelectedStudentUids(
                          selectedOptions.map((opt) => opt.value),
                        )
                      }
                      formatOptionLabel={formatOptionLabel}
                      placeholder="Select students..."
                      isSearchable
                      classNamePrefix="react-select"
                      // Optional: Add styles to differentiate inactive students
                      styles={{
                        multiValueLabel: (base, state) => {
                          const isInactive = state.data.isInactive;
                          return {
                            ...base,
                            backgroundColor: isInactive
                              ? "#f8f9fa"
                              : base.backgroundColor,
                            color: isInactive ? "#6c757d" : base.color,
                            fontStyle: isInactive ? "italic" : "normal",
                          };
                        },
                      }}
                    />
                    <div className="form-text">
                      Inactive students are shown but cannot be selected from
                      dropdown
                    </div>
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

              {/* DIVIDER - Email Section */}
              <hr className="my-3" style={{ borderTop: "2px dashed #ccc" }} />

              <label className="form-label">Email Address:</label>
              <input
                type="email"
                className="form-control"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="family@example.com"
              />
              <div className="form-text">Current email: {family?.email}</div>

              <label className="form-label">New Password:</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength="6"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="form-text mb-3">
                Password must be at least 6 characters.
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ backgroundColor: "var(--border2)" }}
                  onClick={handleMigrateFamily}
                  disabled={isMigrating}
                >
                  {isMigrating ? "Updating..." : "Update Email & Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
