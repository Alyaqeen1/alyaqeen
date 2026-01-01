import React, { useState, useEffect } from "react";
import {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSectionMutation,
} from "../../redux/features/website_settings/website_settingsApi";
import {
  FaEdit,
  FaTrash,
  FaStar,
  FaUserTie,
  FaGraduationCap,
} from "react-icons/fa";
import Swal from "sweetalert2";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import toast from "react-hot-toast";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function BestTeacherStudent() {
  const {
    data: websiteData,
    isLoading,
    refetch,
  } = useGetWebsiteSettingsQuery();
  const [updateSection] = useUpdateWebsiteSectionMutation();

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingTeacher, setUploadingTeacher] = useState(false);
  const [uploadingStudent, setUploadingStudent] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    designation: "",
    qualities: [],
    qualitiesInput: "",
    description: "",
    photo: null,
    photoUrl: "",
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    class: "",
    description: "",
    photo: null,
    photoUrl: "", // Added to store Cloudinary URL
  });

  useEffect(() => {
    if (websiteData?.bestTeacher) {
      setTeacherForm({
        name: websiteData.bestTeacher.name || "",
        designation: websiteData.bestTeacher.designation || "",
        description: websiteData.bestTeacher.description || "",
        qualities: websiteData.bestTeacher.qualities || [],
        qualitiesInput: (websiteData.bestTeacher.qualities || []).join(", "),
        photo: null,
        photoUrl: websiteData.bestTeacher.photo || "",
      });
    }

    if (websiteData?.bestStudent) {
      setStudentForm({
        name: websiteData.bestStudent.name || "",
        class: websiteData.bestStudent.class || "",
        description: websiteData.bestStudent.description || "",
        photo: null,
        photoUrl: websiteData.bestStudent.photo || "",
      });
    }
  }, [websiteData]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type for images
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, WebP)!");
      return;
    }

    // Set uploading state
    if (type === "teacher") {
      setUploadingTeacher(true);
    } else {
      setUploadingStudent(true);
    }
    setUploading(true);

    try {
      // Upload to Cloudinary
      const url = await uploadToCloudinary(file, "best-teachers-students");

      if (type === "teacher") {
        setTeacherForm((prev) => ({
          ...prev,
          photo: file,
          photoUrl: url,
        }));
      } else {
        setStudentForm((prev) => ({
          ...prev,
          photo: file,
          photoUrl: url,
        }));
      }

      toast.success("Photo uploaded successfully!");
    } catch (err) {
      toast.error("Upload failed! Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (type === "teacher") {
        setUploadingTeacher(false);
      } else {
        setUploadingStudent(false);
      }
    }
  };

  const handleTeacherUpdate = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !teacherForm.name ||
      !teacherForm.designation ||
      !teacherForm.description
    ) {
      Swal.fire({
        title: "Missing Information!",
        text: "Please fill in all required fields (Name, Designation, Description)",
        icon: "warning",
      });
      return;
    }

    if (localLoading) return;
    setLocalLoading(true);

    try {
      // Prepare teacher data for API
      const teacherData = {
        name: teacherForm.name,
        designation: teacherForm.designation,
        description: teacherForm.description,
        qualities: teacherForm.qualitiesInput
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean),
        photo: teacherForm.photoUrl,
      };

      await updateSection({
        section: "bestTeacher",
        data: teacherData,
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Best Teacher updated successfully",
        icon: "success",
        timer: 2000,
      });
      setShowTeacherModal(false);
      refetch();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update teacher",
        icon: "error",
      });
      console.error("Update error:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleStudentUpdate = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!studentForm.name || !studentForm.class || !studentForm.description) {
      Swal.fire({
        title: "Missing Information!",
        text: "Please fill in all required fields (Name, Class, Description)",
        icon: "warning",
      });
      return;
    }

    if (localLoading) return;
    setLocalLoading(true);

    try {
      // Prepare student data for API
      const studentData = {
        name: studentForm.name,
        class: studentForm.class,
        description: studentForm.description,
        photo: studentForm.photoUrl, // Use Cloudinary URL
      };

      await updateSection({
        section: "bestStudent",
        data: studentData,
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Best Student updated successfully",
        icon: "success",
        timer: 2000,
      });
      setShowStudentModal(false);
      refetch();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update student",
        icon: "error",
      });
      console.error("Update error:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowTeacherModal(false);
    setShowStudentModal(false);
    setUploadingTeacher(false);
    setUploadingStudent(false);
    setLocalLoading(false);
  };

  if (isLoading) {
    <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  return (
    <div className="py-4">
      <div className="row align-items-stretch">
        {/* Best Teacher Section */}
        <div className="col-lg-6 mb-4 d-flex">
          <div className="card shadow-sm border-0 w-100 d-flex flex-column">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">
                <FaUserTie className="me-2" />
                Best Teacher of the Month
              </h3>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setShowTeacherModal(true)}
                  disabled={uploading}
                >
                  <FaEdit className="me-1" /> Edit
                </button>
              </div>
            </div>
            <div className="card-body d-flex flex-column justify-content-center">
              {websiteData?.bestTeacher?.name ? (
                <div className="text-center">
                  <div className="teacher-photo mb-3">
                    {websiteData.bestTeacher.photo ? (
                      <img
                        src={websiteData.bestTeacher.photo}
                        alt={websiteData.bestTeacher.name}
                        className="rounded-circle border"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: "150px", height: "150px" }}
                      >
                        <FaUserTie size={60} className="text-white" />
                      </div>
                    )}
                  </div>
                  <h4>{websiteData.bestTeacher.name}</h4>
                  <p className="text-muted">
                    {websiteData.bestTeacher.designation}
                  </p>
                  {websiteData.bestTeacher.qualities?.length > 0 && (
                    <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                      {websiteData.bestTeacher.qualities.map((q, i) => (
                        <span key={i} className="badge bg-primary">
                          {q}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-3">{websiteData.bestTeacher.description}</p>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaUserTie size={50} className="text-muted mb-3" />
                  <p className="text-muted">
                    No best teacher set. Click Edit to add one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Best Student Section */}
        <div className="col-lg-6 mb-4 d-flex">
          <div className="card shadow-sm border-0 w-100 d-flex flex-column">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">
                <FaGraduationCap className="me-2" />
                Best Student of the Month
              </h3>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setShowStudentModal(true)}
                  disabled={uploading}
                >
                  <FaEdit className="me-1" /> Edit
                </button>
              </div>
            </div>
            <div className="card-body d-flex flex-column justify-content-center">
              {websiteData?.bestStudent?.name ? (
                <div className="text-center">
                  <div className="student-photo mb-3">
                    {websiteData.bestStudent.photo ? (
                      <img
                        src={websiteData.bestStudent.photo}
                        alt={websiteData.bestStudent.name}
                        className="rounded-circle border"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: "150px", height: "150px" }}
                      >
                        <FaGraduationCap size={60} className="text-white" />
                      </div>
                    )}
                  </div>
                  <h4>{websiteData.bestStudent.name}</h4>
                  <p className="text-muted">
                    Class: {websiteData.bestStudent.class}
                  </p>

                  <p className="mt-3">{websiteData.bestStudent.description}</p>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaGraduationCap size={50} className="text-muted mb-3" />
                  <p className="text-muted">
                    No best student set. Click Edit to add one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Modal */}
      {showTeacherModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Best Teacher</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                  disabled={uploadingTeacher || localLoading}
                ></button>
              </div>

              <form onSubmit={handleTeacherUpdate}>
                <div className="modal-body">
                  <div className="row align-items-stretch">
                    {/* ================= LEFT: PHOTO PREVIEW ================= */}
                    <div className="col-md-4 text-center">
                      <div
                        className="border rounded p-2 mb-3"
                        style={{ height: "220px" }}
                      >
                        {teacherForm.photoUrl ? (
                          <img
                            src={teacherForm.photoUrl}
                            alt="Teacher Preview"
                            className="img-fluid rounded"
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                            No Photo
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "teacher")}
                        disabled={uploadingTeacher || localLoading}
                      />

                      <div className="mt-2">
                        {uploadingTeacher ? (
                          <small className="text-warning">
                            Uploading photo...
                          </small>
                        ) : teacherForm.photoUrl ? (
                          <small className="text-success">✓ Photo ready</small>
                        ) : (
                          <small className="text-muted">
                            No photo selected
                          </small>
                        )}
                      </div>
                    </div>

                    {/* ================= RIGHT: FORM ================= */}
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label">Teacher Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={teacherForm.name}
                          onChange={(e) =>
                            setTeacherForm({
                              ...teacherForm,
                              name: e.target.value,
                            })
                          }
                          required
                          disabled={uploadingTeacher || localLoading}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Designation *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={teacherForm.designation}
                          onChange={(e) =>
                            setTeacherForm({
                              ...teacherForm,
                              designation: e.target.value,
                            })
                          }
                          required
                          disabled={uploadingTeacher || localLoading}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Qualities *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={teacherForm.qualitiesInput} // ✅ CORRECT
                          onChange={(e) =>
                            setTeacherForm({
                              ...teacherForm,
                              qualitiesInput: e.target.value,
                            })
                          }
                          placeholder="Friendly, Punctual, Experienced"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description *</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={teacherForm.description}
                          onChange={(e) =>
                            setTeacherForm({
                              ...teacherForm,
                              description: e.target.value,
                            })
                          }
                          required
                          disabled={uploadingTeacher || localLoading}
                          placeholder="Describe why this teacher is the best..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= FOOTER ================= */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                    disabled={uploadingTeacher || localLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploadingTeacher || localLoading}
                  >
                    {localLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Teacher"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {showStudentModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Best Student</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                  disabled={uploadingStudent || localLoading}
                ></button>
              </div>

              <form onSubmit={handleStudentUpdate}>
                <div className="modal-body">
                  <div className="row">
                    {/* ================= LEFT: PHOTO PREVIEW ================= */}
                    <div className="col-md-4 text-center">
                      <div
                        className="border rounded p-2 mb-3"
                        style={{ height: "220px" }}
                      >
                        {studentForm.photoUrl ? (
                          <img
                            src={studentForm.photoUrl}
                            alt="Student Preview"
                            className="img-fluid rounded"
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                            No Photo
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "student")}
                        disabled={uploadingStudent || localLoading}
                      />

                      <div className="mt-2">
                        {uploadingStudent ? (
                          <small className="text-warning">
                            Uploading photo...
                          </small>
                        ) : studentForm.photoUrl ? (
                          <small className="text-success">✓ Photo ready</small>
                        ) : (
                          <small className="text-muted">
                            No photo selected
                          </small>
                        )}
                      </div>
                    </div>

                    {/* ================= RIGHT: FORM ================= */}
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label">Student Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={studentForm.name}
                          onChange={(e) =>
                            setStudentForm({
                              ...studentForm,
                              name: e.target.value,
                            })
                          }
                          required
                          disabled={uploadingStudent || localLoading}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Class *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={studentForm.class}
                          onChange={(e) =>
                            setStudentForm({
                              ...studentForm,
                              class: e.target.value,
                            })
                          }
                          required
                          disabled={uploadingStudent || localLoading}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description *</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={studentForm.description}
                          onChange={(e) =>
                            setStudentForm({
                              ...studentForm,
                              description: e.target.value,
                            })
                          }
                          required
                          disabled={uploadingStudent || localLoading}
                          placeholder="Describe why this student is the best..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= FOOTER ================= */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                    disabled={uploadingStudent || localLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={uploadingStudent || localLoading}
                  >
                    {localLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Student"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
