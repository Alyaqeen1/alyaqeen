import React, { useState } from "react";
import {
  useGetFamilyQuery,
  useUpdateFamilyDataMutation,
} from "../../redux/features/families/familiesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { useGetStudentsQuery } from "../../redux/features/students/studentsApi";
import Select from "react-select";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";

export default function FamilyUpdateModal({
  familyId,
  handleClose,
  showModal,
  refetch: familiesRefetch,
  refetchFee,
}) {
  // const axiosPublic = useAxiosPublic();
  const [updateFamilyData] = useUpdateFamilyDataMutation();
  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };
  const [selectedStudents, setSelectedStudents] = useState([]);

  const {
    data: family,
    isLoading,
    refetch,
  } = useGetFamilyQuery(familyId, {
    skip: !familyId, // Prevent fetching until user is fully loaded
    refetchOnMountOrArgChange: true,
  });
  const { data: students, isLoading: studentLoading } = useGetStudentsQuery();

  const studentOptions = students
    ?.filter(
      (student) => !family?.children?.includes(student.uid || student._id)
    ) // exclude already-added
    .map((student) => ({
      label: student.name,
      value: student.uid || student._id,
    }));

  if (isLoading || studentLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const discount = form.discount.value;

    // Extract new student UIDs from selected options
    const selectedStudentUids = selectedStudents.map((s) => s.value);

    // Combine existing + new children UIDs, avoiding duplicates
    const existingChildren = family?.children || [];
    const mergedChildren = Array.from(
      new Set([...existingChildren, ...selectedStudentUids])
    );

    const updatedFamilyData = {
      name,
      discount,
      children: mergedChildren, // full list
      newlyAddedChildren: selectedStudentUids, // only new ones
    };

    try {
      // const { data } = await axiosPublic.put(
      //   `/families/${familyId}`,
      //   updatedFamilyData
      // );
      const result = await updateFamilyData({
        id: familyId,
        ...updatedFamilyData,
      });

      if ("error" in result) {
        toast.error("Update failed.");
        console.error(result.error);
      } else {
        toast.success("Family updated successfully!");
        handleClose();
        refetch();
        familiesRefetch();
        refetchFee();
      }

      // }
      // else {
      //   toast.error("No changes were made.");
      // }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update family.");
    }
  };

  return (
    <div>
      {/* Backdrop */}
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
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Update Family</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div
              className="modal-body p-4 "
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <form action="" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Family Name:</label>
                  <input
                    style={{ borderColor: "var(--border2)" }}
                    className="form-control"
                    type="text"
                    name="name"
                    defaultValue={family?.name}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Students:</label>
                  <Select
                    options={studentOptions}
                    value={selectedStudents}
                    onChange={setSelectedStudents}
                    placeholder="Search and select students..."
                    classNamePrefix="react-select"
                    isSearchable
                    isMulti
                    menuPortalTarget={document.body}
                    styles={{
                      container: (base) => ({
                        ...base,
                        width: "100%",
                        border: "1px solid black",
                        borderRadius: "5px",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>

                {/* <div className="mb-3">
                  <label className="form-label">Payment Mode:</label>
                  {family?.paymentMode && (
                    <select
                      className="form-control border-1 border-black"
                      name="payment_mode"
                      defaultValue={family?.paymentMode}
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="instant">Instant</option>
                      <option value="bank">Bank</option>
                      <option value="card/cash">Card/Cash</option>
                      <option value="in office">In Office</option>
                    </select>
                  )}
                </div> */}
                <div className="mb-3">
                  <label className="form-label">Discount:</label>
                  <input
                    defaultValue={family?.discount}
                    style={{ borderColor: "var(--border2)" }}
                    name="discount"
                    className="form-control"
                    type="number"
                  />
                </div>
                <div>
                  <button
                    // disabled={}
                    type="submit"
                    style={{ backgroundColor: "var(--border2)" }}
                    className="btn text-white"
                  >
                    Update Changes
                    {/* {localLoading ? "Adding..." : "Add"} */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
