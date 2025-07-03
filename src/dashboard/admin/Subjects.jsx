import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { FaChevronDown, FaChevronUp, FaPen, FaTrashAlt } from "react-icons/fa";
import {
  useAddDepartmentMutation,
  useGetDepartmentsQuery,
} from "../../redux/features/departments/departmentsApi";
import {
  useAddSubjectMutation,
  useGetSubjectsQuery,
  useRemoveSubjectMutation,
} from "../../redux/features/subjects/subjectsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";
import UpdateSubjectModal from "../shared/UpdateSubjectModal";

export default function Subjects() {
  const [toggle, setToggle] = useState(false);
  const [dept_id, setDept_id] = useState("");
  const [class_id, setClass_id] = useState("");
  const [subject_name, setSubject_name] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [openDeptId, setOpenDeptId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [addSubject] = useAddSubjectMutation();
  const [removeSubject] = useRemoveSubjectMutation();

  const { data: departments, refetch: refetchDepartments } =
    useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();
  const {
    data: subjects,
    refetch: refetchSubjects,
    refetch,
  } = useGetSubjectsQuery();

  const toggleDept = (id) => {
    setOpenDeptId(openDeptId === id ? null : id);
  };
  const handleShow = (id) => {
    setSelectedSubjectId(id);
    setShowModal(true);
  };
  useEffect(() => {
    refetch();
  }, []);
  const handleSubmit = async () => {
    const res = await addSubject({
      dept_id,
      class_id,
      subject_name,
    }).unwrap();

    if (res?.insertedId) {
      Swal.fire({
        icon: "success",
        title: "Subject added successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      setDept_id("");
      setClass_id("");
      setSubject_name("");
      setToggle(false);
      refetchSubjects();
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the subject.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeSubject(id)
          .unwrap()
          .then((res) => {
            if (res?.deletedCount) {
              Swal.fire("Deleted!", "Subject deleted.", "success");
              refetchSubjects();
            }
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete subject.", "error");
          });
      }
    });
  };

  useEffect(() => {
    refetchDepartments();
    refetchSubjects();
  }, []);
  const handleClose = () => setShowModal(false);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>Subjects Management</h3>
        <button
          className="btn text-white"
          style={{ backgroundColor: "var(--border2)" }}
          onClick={() => setToggle(!toggle)}
        >
          Add Subject
        </button>
      </div>

      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.4 }}
            className="row align-items-end border border-black shadow-sm p-3 mt-2 rounded-3"
            style={{ originY: 0 }}
          >
            <div className="col-md-4">
              <label className="form-label">Department *</label>
              <select
                className="form-control"
                value={dept_id}
                style={{ borderColor: "var(--border2)" }}
                onChange={(e) => setDept_id(e.target.value)}
                required
              >
                <option value="">Select department</option>
                {departments?.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.dept_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Class *</label>
              <select
                className="form-control"
                style={{ borderColor: "var(--border2)" }}
                value={class_id}
                onChange={(e) => setClass_id(e.target.value)}
                required
              >
                <option value="">Select class</option>
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
              <label className="form-label">Subject Name *</label>
              <input
                type="text"
                style={{ borderColor: "var(--border2)" }}
                className="form-control bg-light"
                value={subject_name}
                onChange={(e) => setSubject_name(e.target.value)}
                required
              />
            </div>

            <div className="col-md-2 mt-3 text-end w-100">
              <button
                className="btn text-white"
                style={{ backgroundColor: "var(--border2)" }}
                onClick={handleSubmit}
              >
                Add Subject
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border border-black p-4 rounded-4 mt-4">
        <h4>Departments, Classes & Subjects</h4>
        <div className="accordion-wrapper mt-4">
          {departments?.map((dept) => {
            const deptClasses = classes?.filter(
              (cls) => cls.dept_id === dept._id
            );

            return (
              <div key={dept._id} className="mb-2 border rounded">
                <div
                  className={`d-flex justify-content-between align-items-center px-3 py-2 cursor-pointer ${
                    openDeptId === dept._id
                      ? "bg-secondary bg-opacity-10 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => toggleDept(dept._id)}
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

                <AnimatePresence initial={false}>
                  {openDeptId === dept._id && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-3 py-2 bg-white"
                      style={{ transformOrigin: "top" }}
                    >
                      {deptClasses?.length > 0 ? (
                        deptClasses.map((cls) => {
                          const relatedSubjects = subjects?.filter(
                            (sub) => sub.class_id === cls._id
                          );

                          return (
                            <div key={cls._id} className="mb-3">
                              {/* <h6 className="fw-bold mb-2">
                                Class: {cls.class_name}
                              </h6> */}
                              {relatedSubjects?.length > 0 ? (
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Subject Name</th>
                                      <th>Class Name</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {relatedSubjects.map((sub, idx) => (
                                      <tr key={idx}>
                                        <td>{sub.subject_name}</td>
                                        <td>{cls.class_name}</td>
                                        <td>
                                          <button
                                            className="btn btn-sm btn-danger me-2"
                                            onClick={() =>
                                              handleDelete(sub._id)
                                            }
                                          >
                                            <FaTrashAlt />
                                          </button>
                                          <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleShow(sub?._id)}
                                          >
                                            <FaPen />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="text-muted">
                                  No subjects added for this class.
                                </p>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-muted">
                          No classes in this department.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <UpdateSubjectModal
            subjectId={selectedSubjectId}
            showModal={showModal}
            handleClose={handleClose}
          />
        </div>
      </div>
    </div>
  );
}
