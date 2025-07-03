import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  useGetSubjectQuery,
  useUpdateSubjectMutation,
} from "../../redux/features/subjects/subjectsApi";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";

export default function UpdateSubjectModal({
  subjectId,
  handleClose,
  showModal,
}) {
  const { data: subject } = useGetSubjectQuery(subjectId, {
    skip: !subjectId,
  });

  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();
  const [updateSubject, { isLoading }] = useUpdateSubjectMutation();

  const [dept_id, setDept_id] = useState("");
  const [class_id, setClass_id] = useState("");
  const [subject_name, setSubject_name] = useState("");

  useEffect(() => {
    if (subject) {
      setDept_id(subject.dept_id || "");
      setClass_id(subject.class_id || "");
      setSubject_name(subject.subject_name || "");
    }
  }, [subject]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal")) {
      handleClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await updateSubject({
      id: subjectId,
      dept_id,
      class_id,
      subject_name,
    }).unwrap();

    if (res?.modifiedCount) {
      Swal.fire({
        icon: "success",
        title: "Subject updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      handleClose();
    }
  };

  if (!showModal) return null;

  return (
    <div>
      {showModal && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none", zIndex: 1050 }}
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Edit Subject</h4>
              </div>

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Department</label>
                  <select
                    className="form-control"
                    style={{ borderColor: "var(--border2)" }}
                    value={dept_id}
                    onChange={(e) => setDept_id(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments?.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.dept_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Class</label>
                  <select
                    className="form-control"
                    style={{ borderColor: "var(--border2)" }}
                    value={class_id}
                    onChange={(e) => setClass_id(e.target.value)}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes
                      ?.filter((cls) => cls.dept_id === dept_id)
                      .map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.class_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Subject Name</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderColor: "var(--border2)" }}
                    value={subject_name}
                    onChange={(e) => setSubject_name(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-12 text-end mt-3">
                  <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "var(--border2)" }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Subject"}
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
