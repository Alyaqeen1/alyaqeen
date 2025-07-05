import { FaCheck } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";
import {
  useGetTeacherByIdQuery,
  useGetTeacherWithDetailsQuery,
  useUpdateTeacherStatusMutation,
} from "../../redux/features/teachers/teachersApi";
export default function TeacherModal({ teacherId, handleClose, showModal }) {
  //   const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const {
    data: teacher,
    isLoading,
    isError,
    refetch,
  } = useGetTeacherWithDetailsQuery(teacherId, {
    skip: !teacherId, // avoid fetching if no ID
  });

  const [updateTeacherStatus] = useUpdateTeacherStatusMutation();
  //   console.log(teacher, isError);

  const {
    name,
    email,
    number,
    dob,
    qualification,
    address,
    post_code,
    marital_status,
    gender,
    department,
    experience,
    designation,
    departments_info,
    classes_info,
    subjects_info,
    teacher_photo,
    dbs_crb,
    cv,
    highest_degree_certificate,
    sord_code,
    emergency_number,
    account_holder_name,
    bank_account_number,
    status,
    joining_date,
  } = teacher || {};

  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };
  const handleStatus = async (newStatus) => {
    if (
      newStatus === "approved" &&
      (departments_info?.length === 0 ||
        subjects_info?.length === 0 ||
        classes_info?.length === 0)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Assign a Group first!",
        text: "You must assign a group before approving the teacher.",
      });
      return;
    }

    try {
      // const { data } = await axiosPublic.patch(`/students/${studentId}`, {
      //   status: newStatus,
      // });
      const data = await updateTeacherStatus({
        id: teacherId,
        status: newStatus,
      }).unwrap();

      if (data?.modifiedCount) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Teacher ${newStatus} successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (err) {
      // }
      console.error("Failed to update status:", err);
    }
  };

  if (!showModal) return null;
  if (isLoading) return <LoadingSpinnerDash></LoadingSpinnerDash>;
  if (isError || !teacher) return <div>Failed to load Teacher data</div>;
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
                <div className="d-flex gap-2 align-items-center">
                  <img
                    style={{ width: "50px" }}
                    className="rounded-5"
                    src={teacher_photo}
                    alt=""
                  />
                  <h3 className="text-xl font-bold mb-2">{name && name}</h3>
                </div>
                <button
                  type="button"
                  className={`btn  ${status === "pending" && "btn-warning"} ${
                    status === "approved" && "btn-success"
                  } ${status === "rejected" && "btn-danger"}`}
                >
                  {status}
                </button>
              </div>
              <div className="d-flex justify-content-center gap-2">
                <div className="flex-grow-1">
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>DOB:</strong> {dob}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {number}
                  </p>
                  <p>
                    <strong>Educational Qualification:</strong> {qualification}
                  </p>
                  <p>
                    <strong>Gender:</strong> {gender}
                  </p>
                  <p>
                    <strong>designation:</strong> {designation}
                  </p>
                  <p>
                    <strong>Experience:</strong> {experience}
                  </p>
                  <p>
                    <strong>Marital Status:</strong> {marital_status}
                  </p>

                  <p>
                    <strong>Assigned:</strong>
                  </p>
                  {departments_info?.length > 0
                    ? departments_info?.map((dept, index) => {
                        // Filter subjects and classes that belong to this department
                        const deptSubjects =
                          subjects_info?.filter(
                            (sub) => sub.dept_id === dept._id
                          ) || [];
                        const deptClasses =
                          classes_info?.filter(
                            (cls) => cls.dept_id === dept._id
                          ) || [];

                        return (
                          <div key={dept._id} className="mb-3 ms-2">
                            <p>
                              <strong>{index + 1}. Department:</strong>{" "}
                              {dept.dept_name}
                            </p>

                            {deptSubjects.length > 0 && (
                              <ul>
                                {deptSubjects.map((subj) => (
                                  <li key={subj._id}>
                                    <strong>Subject:</strong>{" "}
                                    {subj.subject_name}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {deptClasses.length > 0 && (
                              <ul>
                                {deptClasses.map((cls) => (
                                  <li key={cls._id}>
                                    <strong>Class:</strong> {cls.class_name}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })
                    : "Not provided Yet"}
                </div>
                <div className="border-start border-2 ps-2 flex-grow-1">
                  <p>
                    <strong>Address:</strong> {address}
                  </p>
                  <p>
                    <strong>Post Code:</strong> {post_code}
                  </p>

                  <p>
                    <strong>Department:</strong> {department}
                  </p>

                  <p>
                    <strong>Account Holder Name:</strong> {account_holder_name}
                  </p>
                  <p>
                    <strong>Bank Account Number:</strong> {bank_account_number}
                  </p>
                  <p>
                    <strong>Sord Code:</strong> {sord_code}
                  </p>
                  <p>
                    <strong>Emergency Number:</strong> {emergency_number}
                  </p>
                  <p>
                    <strong>Joining Date:</strong> {joining_date}
                  </p>
                  <p>
                    <strong>
                      <a target="_blank" href={teacher_photo}>
                        Teacher's Photo
                      </a>
                    </strong>
                  </p>
                  <p>
                    <strong>
                      <a target="_blank" href={dbs_crb}>
                        Teacher's DBS(CRB)
                      </a>
                    </strong>
                  </p>
                  <p>
                    <strong>
                      <a target="_blank" href={cv}>
                        Teacher's CV
                      </a>
                    </strong>
                  </p>
                  <p>
                    <strong>
                      <a target="_blank" href={highest_degree_certificate}>
                        Highest Degree Certificate
                      </a>
                    </strong>
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <button
                  onClick={() => handleStatus("approved")}
                  className="text-success fs-5 py-1 px-2 rounded-2"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  <FaCheck></FaCheck>
                </button>
                <button
                  onClick={() => handleStatus("rejected")}
                  className="text-danger py-1 px-2 rounded-2"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  <ImCross />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
