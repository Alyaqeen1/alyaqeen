import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  useGetClassQuery,
  useUpdateClassMutation,
} from "../../redux/features/classes/classesApi";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
export default function UpdateClassModal({ classId, handleClose, showModal }) {
  const { data: classData } = useGetClassQuery(classId, {
    skip: !classId,
  });
  const { data: departments } = useGetDepartmentsQuery();
  const [updateClass, { isLoading }] = useUpdateClassMutation();
  //   const [dept_name, setDept_name] = useState("");
  const [department, setDepartment] = useState(classData?.dept_id);
  const [session, setSession] = useState(classData?.session);
  const [session_time, setSessionTime] = useState(classData?.session_time);
  const [class_name, setClass_name] = useState(classData?.class_name);
  useEffect(() => {
    if (classData) {
      setDepartment(classData.dept_id);
      setSession(classData.session);
      setSessionTime(classData.session_time);
      setClass_name(classData.class_name);
    }
  }, [classData]);

  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent form refresh
    const res = await updateClass({
      id: classId,
      dept_id: department,
      session,
      session_time,
      class_name,
    }).unwrap();

    if (res.modifiedCount) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Class updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    }
  };

  if (!showModal) return null;
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
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center">
                <h4>Edit {classData?.class_name}</h4>
                <p>Update Class</p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="row align-items-end shadow-sm mt-2 rounded-3"
              >
                <div className="col-md-6">
                  <label className="form-label">Departments*</label>
                  <select
                    style={{ borderColor: "var(--border2)" }}
                    name="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select department</option>
                    {departments?.map((department) => (
                      <option value={department?._id}>
                        {department?.dept_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Session *</label>
                  <select
                    style={{ borderColor: "var(--border2)" }}
                    name="session"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select department</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Session Time *</label>
                  <select
                    name="std_time"
                    className="form-control font-light selectClassTime"
                    value={session_time}
                    style={{ borderColor: "var(--border2)" }}
                    onChange={(e) => setSessionTime(e.target.value)}
                    required
                  >
                    <option value="">Select Session Time</option>
                    {department && session === "weekdays" ? (
                      <>
                        <option value="S1">
                          Early - 4:30 PM – 6:00 PM (1½ hrs)
                        </option>
                        <option value="S2">
                          Late - 5:45 PM – 7:15 PM (1½ hrs)
                        </option>
                      </>
                    ) : department && session === "weekend" ? (
                      <>
                        <option value="WM">
                          Morning - 10:00 AM – 12:30 PM (2½ hrs)
                        </option>
                        <option value="WA">
                          Afternoon - 12:30 PM – 2:30 PM (2½ hrs)
                        </option>
                      </>
                    ) : null}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Class Name *</label>
                  {classData?.class_name && (
                    <input
                      style={{ borderColor: "var(--border2)" }}
                      className="form-control bg-light"
                      value={class_name}
                      onChange={(e) => setClass_name(e.target.value)}
                      type="text"
                      name="class"
                      required
                    />
                  )}
                </div>
                <div className="col-md-3 mt-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: "var(--border2)" }}
                    className="btn text-white w-100"
                  >
                    {isLoading ? "Updating" : "Update Class"}
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
