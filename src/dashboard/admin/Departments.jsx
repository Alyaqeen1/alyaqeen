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
import UpdateDepartmentModal from "../shared/UpdateDepartmentModal";

export default function Departments() {
  const [toggle, setToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [addDepartment] = useAddDepartmentMutation();
  const [removeDepartment] = useRemoveDepartmentMutation();
  const [dept_name, setDept_name] = useState("");
  const { data: departments, refetch, isLoading } = useGetDepartmentsQuery();

  const handleShow = (id) => {
    setSelectedDeptId(id);
    setShowModal(true);
  };
  useEffect(() => {
    refetch();
  }, []);

  const handleSubmit = async () => {
    const res = await addDepartment({ dept_name }).unwrap();
    if (res.insertedId) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Department added successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      setDept_name("");
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
        removeDepartment(id)
          .unwrap()
          .then((res) => {
            // You can optionally check res.status === 200
            if (res?.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Department deleted successfully",
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
              text:
                error.response?.data?.message || "Failed to delete student.",
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
        <h3>Department Management</h3>
        <button
          style={{ backgroundColor: "var(--border2)" }}
          className="btn text-white"
          onClick={() => setToggle(!toggle)}
        >
          Add Department
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
            <div className="col-md-8">
              <label className="form-label">Department Name *</label>
              <input
                style={{ borderColor: "var(--border2)" }}
                className="form-control bg-light"
                onChange={(e) => setDept_name(e.target.value)}
                type="text"
                name="department"
                required
              />
            </div>
            <div className="col-md-4">
              <button
                style={{ backgroundColor: "var(--border2)" }}
                className="btn text-white w-100"
                onClick={handleSubmit}
              >
                Add Department
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border border-black p-4 rounded-4 mt-4">
        <h4>Departments List</h4>
        <div className="table-responsive mt-3 ">
          <table
            className="table mb-0"
            style={{
              minWidth: 700,
            }}
          >
            <thead>
              <tr>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  #
                </th>
                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Department Name
                </th>

                <th
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {departments?.length > 0 ? (
                departments?.map((department, idx) => (
                  <tr key={department?._id}>
                    <td
                      className={` border h6 text-center align-middle text-nowrap`}
                    >
                      {idx + 1}
                    </td>
                    <td
                      className={` border h6 text-center align-middle text-nowrap`}
                    >
                      {department?.dept_name}
                    </td>

                    <td
                      className={`border d-flex gap-2 justify-content-center h6 text-center align-middle text-nowrap`}
                    >
                      <button
                        className="text-white py-1 px-2 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
                        onClick={() => handleDelete(department?._id)}
                      >
                        <FaTrashAlt></FaTrashAlt>
                      </button>
                      <button
                        onClick={() => handleShow(department?._id)}
                        className="text-white py-1 px-2 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
                      >
                        <FaPen></FaPen>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12}>
                    <h5>No Departments available.</h5>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <UpdateDepartmentModal
            deptId={selectedDeptId}
            showModal={showModal}
            handleClose={handleClose}
          ></UpdateDepartmentModal>
        </div>
      </div>
    </div>
  );
}
