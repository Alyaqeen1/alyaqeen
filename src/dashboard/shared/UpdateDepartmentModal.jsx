import { FaCheck } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import {
  useGetDepartmentQuery,
  useUpdateDepartmentMutation,
} from "../../redux/features/departments/departmentsApi";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
export default function UpdateDepartmentModal({
  deptId,
  handleClose,
  showModal,
}) {
  const { data: department } = useGetDepartmentQuery(deptId, {
    skip: !deptId,
  });
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [dept_name, setDept_name] = useState("");
  const [weekdays_fee, setWeekdays_fee] = useState("");
  const [weekend_fee, setWeekend_fee] = useState("");
  useEffect(() => {
    if (department) {
      setDept_name(department.dept_name || "");
      setWeekdays_fee(department.weekdays_fee || "");
      setWeekend_fee(department.weekend_fee || "");
    }
  }, [department]);
  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  const handleSubmit = async () => {
    const updateData = { id: deptId };
    const weekdays_fee_num = Number(weekdays_fee);
    const weekend_fee_num = Number(weekend_fee);

    if (dept_name && dept_name !== department?.dept_name) {
      updateData.dept_name = dept_name;
    }
    if (weekdays_fee && weekdays_fee !== department?.weekdays_fee) {
      updateData.weekdays_fee = weekdays_fee_num;
    }
    if (weekend_fee && weekend_fee !== department?.weekend_fee) {
      updateData.weekend_fee = weekend_fee_num;
    }

    const res = await updateDepartment(updateData).unwrap();
    // rest of your code

    if (res.modifiedCount) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Department updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      setDept_name("");
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
                <h4>Edit {department?.dept_name}</h4>
                <p>Update Department</p>
              </div>
              <div className="row align-items-end shadow-sm mt-2 rounded-3">
                <div className="col-lg-4">
                  <label className="form-label">Department Name *</label>
                  <input
                    style={{ borderColor: "var(--border2)" }}
                    className="form-control bg-light"
                    // defaultValue={
                    //   deptId === department?._id ? department?.dept_name : ""
                    // }
                    value={dept_name}
                    onChange={(e) => setDept_name(e.target.value)}
                    type="text"
                    name="department"
                    required
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label">Weekdays Monthly Fee *</label>
                  <input
                    style={{ borderColor: "var(--border2)" }}
                    className="form-control bg-light"
                    value={weekdays_fee}
                    onChange={(e) => setWeekdays_fee(e.target.value)}
                    type="number"
                    name="weekdays_fee"
                    required
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label">Weekend Monthly Fee *</label>
                  <input
                    style={{ borderColor: "var(--border2)" }}
                    className="form-control bg-light"
                    // defaultValue={
                    //   deptId === department?._id ? department?.weekend_fee : 0
                    // }
                    value={weekend_fee}
                    onChange={(e) => setWeekend_fee(e.target.value)}
                    type="number"
                    name="weekend_fee"
                    required
                  />
                </div>
                <div className="col-lg-3 mt-2">
                  <button
                    style={{ backgroundColor: "var(--border2)" }}
                    className="btn text-white w-100"
                    onClick={handleSubmit}
                  >
                    Update Department
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
