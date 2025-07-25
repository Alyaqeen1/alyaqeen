import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAddDepartmentMutation,
  useGetDepartmentsQuery,
  useRemoveDepartmentMutation,
} from "../../redux/features/departments/departmentsApi";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import {
  useAddClassMutation,
  useGetClassesQuery,
  useRemoveClassMutation,
} from "../../redux/features/classes/classesApi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import sessionMap from "../../utils/sessionMap";
import UpdateClassModal from "../shared/UpdateClassModal";
export default function Classes() {
  const [toggle, setToggle] = useState(false);
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [session_time, setSessionTime] = useState("");
  const [class_name, setClass_name] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [removeClass] = useRemoveClassMutation();
  const { data: departments, refetch, isLoading } = useGetDepartmentsQuery();
  const [addClass] = useAddClassMutation();
  const { data: classes } = useGetClassesQuery();
  const [openDeptId, setOpenDeptId] = useState(null);

  const toggleDept = (id) => {
    setOpenDeptId(openDeptId === id ? null : id);
  };

  const handleShow = (id) => {
    setSelectedClassId(id);
    setShowModal(true);
  };
  useEffect(() => {
    refetch();
  }, []);

  const handleSubmit = async () => {
    const res = await addClass({
      dept_id: department,
      session,
      session_time,
      class_name,
    }).unwrap();
    if (res.insertedId) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Class added successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      setDepartment("");
      setSession("");
      setSessionTime("");
      setClass_name("");
      setToggle(false);
      refetch();
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeClass(id)
          .unwrap()
          .then((res) => {
            // You can optionally check res.status === 200
            if (res?.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Class deleted successfully",
                icon: "success",
              });
              refetch();
            } else {
              Swal.fire({
                title: "Error",
                text: "Something went wrong.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: error.response?.data?.message || "Failed to delete class.",
              icon: "error",
            });
          });
      }
    });
  };
  const handleClose = () => setShowModal(false);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>Classes Management</h3>
        <button
          style={{ backgroundColor: "var(--border2)" }}
          className="btn text-white"
          onClick={() => setToggle(!toggle)}
        >
          Add Class
        </button>
      </div>
      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ originY: 0, willChange: "transform, opacity" }}
            className="row align-items-end border border-black shadow-sm p-3 mt-2 rounded-3"
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
                      Morning - 10:00 AM – 12:30 PM (1½ hrs)
                    </option>
                    <option value="WA">
                      Afternoon - 12:30 PM – 2:30 PM (1½ hrs)
                    </option>
                  </>
                ) : null}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Class Name *</label>
              <input
                style={{ borderColor: "var(--border2)" }}
                className="form-control bg-light"
                onChange={(e) => setClass_name(e.target.value)}
                type="text"
                name="class"
                required
              />
            </div>
            <div className="col-md-2 mt-2 text-end w-100">
              <button
                style={{ backgroundColor: "var(--border2)" }}
                className="btn text-white"
                onClick={handleSubmit}
              >
                Add Class
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border border-black p-4 rounded-4 mt-4">
        <h4>Classes List</h4>
        <div className="accordion-wrapper mt-4">
          {departments?.map((dept) => {
            const filteredClasses = classes?.filter(
              (cls) => cls.dept_id === dept._id
            );

            return (
              <div key={dept._id} className="mb-2 border rounded ">
                {/* Header */}
                <div
                  onClick={() => toggleDept(dept._id)}
                  className={`d-flex justify-content-between rounded align-items-center px-3 py-2 cursor-pointer ${
                    openDeptId === dept._id
                      ? "bg-secondary bg-opacity-10 text-white"
                      : "bg-white"
                  }`}
                  style={{
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    if (openDeptId !== dept._id)
                      e.currentTarget.style.backgroundColor = "#f1f1f1";
                  }}
                  onMouseLeave={(e) => {
                    if (openDeptId !== dept._id)
                      e.currentTarget.style.backgroundColor = "#fff";
                  }}
                >
                  <h5 className="mb-0">{dept.dept_name}</h5>
                  {openDeptId === dept._id ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {openDeptId === dept._id && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ transformOrigin: "top", overflow: "hidden" }}
                      className="px-3 py-2 bg-white"
                    >
                      {filteredClasses?.length > 0 ? (
                        <table className="table table-bordered mb-0">
                          <thead>
                            <tr>
                              <th>Class Name</th>
                              <th>Session</th>
                              <th>Session Time</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredClasses.map((cls, index) => (
                              <tr key={index}>
                                <td>{cls?.class_name}</td>
                                <td>{cls?.session}</td>
                                <td>{sessionMap[cls?.session_time]}</td>
                                <td>
                                  <button
                                    onClick={() => handleDelete(cls?._id)}
                                    className="btn btn-sm btn-danger me-2"
                                  >
                                    <FaTrashAlt />
                                  </button>
                                  <button
                                    onClick={() => handleShow(cls?._id)}
                                    className="btn btn-sm btn-primary"
                                  >
                                    <FaPen />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-muted m-0">
                          No class added for this department.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <UpdateClassModal
          classId={selectedClassId}
          showModal={showModal}
          handleClose={handleClose}
        />
      </div>
    </div>
  );
}
