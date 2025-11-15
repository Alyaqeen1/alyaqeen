import React, { useEffect, useState } from "react";
import {
  useGetStudentQuery,
  useUpdateAllStudentDataMutation,
  useUpdateStudentStatusMutation,
} from "../../redux/features/students/studentsApi";
import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";
import { FaTrashAlt, FaPlus, FaEdit } from "react-icons/fa";

// Multi Department Modal Component
const AddDepartmentModal = ({
  isOpen,
  onClose,
  onAdd,
  departments,
  classes,
  existingEnrollments = [],
}) => {
  const [deptId, setDeptId] = useState("");
  const [session, setSession] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [classId, setClassId] = useState("");

  const selectedDepartment = departments?.find((dept) => dept._id === deptId);

  const availableClasses = classes?.filter(
    (cls) =>
      cls.dept_id === deptId &&
      cls.session === session &&
      cls.session_time === sessionTime
  );

  const resetForm = () => {
    setDeptId("");
    setSession("");
    setSessionTime("");
    setClassId("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!deptId || !session || !sessionTime || !classId) {
      return toast.error("Please fill all fields");
    }

    // Check for duplicate enrollment
    const isDuplicate = existingEnrollments.some(
      (enrollment) =>
        enrollment.dept_id === deptId && enrollment.class_id === classId
    );

    if (isDuplicate) {
      return toast.error(
        "This department and class combination already exists"
      );
    }

    const newEnrollment = {
      dept_id: deptId,
      class_id: classId,
      session: session,
      session_time: sessionTime,
    };

    onAdd(newEnrollment);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Department/Class</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Department */}
                <div className="col-12">
                  <label className="form-label">Department</label>
                  <select
                    className="form-control"
                    value={deptId}
                    onChange={(e) => {
                      setDeptId(e.target.value);
                      setSession("");
                      setSessionTime("");
                      setClassId("");
                    }}
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

                {/* Session */}
                <div className="col-12">
                  <label className="form-label">Session</label>
                  <select
                    className="form-control"
                    value={session}
                    onChange={(e) => {
                      setSession(e.target.value);
                      setSessionTime("");
                      setClassId("");
                    }}
                    required
                    disabled={!deptId}
                  >
                    <option value="">Select Session</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>

                {/* Session Time */}
                <div className="col-12">
                  <label className="form-label">Session Time</label>
                  <select
                    className="form-control"
                    value={sessionTime}
                    onChange={(e) => {
                      setSessionTime(e.target.value);
                      setClassId("");
                    }}
                    required
                    disabled={!session}
                  >
                    <option value="">Select Time</option>
                    {session === "weekdays" && (
                      <>
                        <option value="S1">
                          Early - 4:30 PM – 6:00 PM (1½ hrs)
                        </option>
                        <option value="S2">
                          Late - 5:45 PM – 7:15 PM (1½ hrs)
                        </option>
                      </>
                    )}
                    {session === "weekend" && (
                      <>
                        <option value="WM">
                          Morning - 10:00 AM – 12:30 PM (2½ hrs)
                        </option>
                        <option value="WA">
                          Afternoon - 12:30 PM – 2:30 PM (2 hrs)
                        </option>
                      </>
                    )}
                  </select>
                </div>

                {/* Class */}
                <div className="col-12">
                  <label className="form-label">Class</label>
                  <select
                    className="form-control"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                    disabled={!sessionTime}
                  >
                    <option value="">Select Class</option>
                    {availableClasses?.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.class_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Department
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Edit Department Modal Component
const EditDepartmentModal = ({
  isOpen,
  onClose,
  onUpdate,
  departments,
  classes,
  existingEnrollments = [],
  enrollmentToEdit,
  enrollmentIndex,
}) => {
  const [deptId, setDeptId] = useState("");
  const [session, setSession] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [classId, setClassId] = useState("");

  // Initialize form with enrollment data when modal opens
  useEffect(() => {
    if (enrollmentToEdit) {
      setDeptId(enrollmentToEdit.dept_id || "");
      setSession(enrollmentToEdit.session || "");
      setSessionTime(enrollmentToEdit.session_time || "");
      setClassId(enrollmentToEdit.class_id || "");
    }
  }, [enrollmentToEdit]);

  const selectedDepartment = departments?.find((dept) => dept._id === deptId);

  const availableClasses = classes?.filter(
    (cls) =>
      cls.dept_id === deptId &&
      cls.session === session &&
      cls.session_time === sessionTime
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!deptId || !session || !sessionTime || !classId) {
      return toast.error("Please fill all fields");
    }

    // Check for duplicate enrollment (excluding current one being edited)
    const isDuplicate = existingEnrollments.some(
      (enrollment, index) =>
        index !== enrollmentIndex &&
        enrollment.dept_id === deptId &&
        enrollment.class_id === classId
    );

    if (isDuplicate) {
      return toast.error(
        "This department and class combination already exists"
      );
    }

    const updatedEnrollment = {
      dept_id: deptId,
      class_id: classId,
      session: session,
      session_time: sessionTime,
    };

    onUpdate(updatedEnrollment, enrollmentIndex);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Department/Class</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Department */}
                <div className="col-12">
                  <label className="form-label">Department</label>
                  <select
                    className="form-control"
                    value={deptId}
                    onChange={(e) => {
                      setDeptId(e.target.value);
                      setSession("");
                      setSessionTime("");
                      setClassId("");
                    }}
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

                {/* Session */}
                <div className="col-12">
                  <label className="form-label">Session</label>
                  <select
                    className="form-control"
                    value={session}
                    onChange={(e) => {
                      setSession(e.target.value);
                      setSessionTime("");
                      setClassId("");
                    }}
                    required
                    disabled={!deptId}
                  >
                    <option value="">Select Session</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>

                {/* Session Time */}
                <div className="col-12">
                  <label className="form-label">Session Time</label>
                  <select
                    className="form-control"
                    value={sessionTime}
                    onChange={(e) => {
                      setSessionTime(e.target.value);
                      setClassId("");
                    }}
                    required
                    disabled={!session}
                  >
                    <option value="">Select Time</option>
                    {session === "weekdays" && (
                      <>
                        <option value="S1">
                          Early - 4:30 PM – 6:00 PM (1½ hrs)
                        </option>
                        <option value="S2">
                          Late - 5:45 PM – 7:15 PM (1½ hrs)
                        </option>
                      </>
                    )}
                    {session === "weekend" && (
                      <>
                        <option value="WM">
                          Morning - 10:00 AM – 12:30 PM (2½ hrs)
                        </option>
                        <option value="WA">
                          Afternoon - 12:30 PM – 2:30 PM (2 hrs)
                        </option>
                      </>
                    )}
                  </select>
                </div>

                {/* Class */}
                <div className="col-12">
                  <label className="form-label">Class</label>
                  <select
                    className="form-control"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                    disabled={!sessionTime}
                  >
                    <option value="">Select Class</option>
                    {availableClasses?.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.class_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Department
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function UpdateStudent() {
  const { id } = useParams();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const [updateAllStudentData] = useUpdateAllStudentDataMutation();
  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();
  const {
    data: student,
    isLoading,
    refetch,
  } = useGetStudentQuery(id, {
    skip: !id, // avoid fetching if no ID)
  });
  const { user, updateUser, loading, setLoading } = useAuth();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [enrollmentToEdit, setEnrollmentToEdit] = useState(null);
  const [enrollmentEditIndex, setEnrollmentEditIndex] = useState(null);

  // Academic state - always use enrollments array
  const [enrollments, setEnrollments] = useState([]);
  // Monthly fee state - separate from calculated fee
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [isFeeOverridden, setIsFeeOverridden] = useState(false);

  const {
    name,
    email,
    dob,
    gender,
    school_year,
    language,
    status,
    emergency_number,
    address,
    post_code,
    family_name,
    activity,
    mother,
    father,
    academic,
    medical,
    startingDate,
    monthly_fee,
  } = student || {};
  const { doctorName, surgeryAddress, surgeryNumber, allergies, condition } =
    medical || {};
  const {
    name: fatherName,
    occupation: fatherOcc,
    number: fatherNumber,
  } = father || {};

  const { name: motherName, occupation, number: motherNumber } = mother || {};

  useEffect(() => {
    if (student?.academic) {
      // Handle both old single department and new multi-department structures
      if (
        student.academic.enrollments &&
        Array.isArray(student.academic.enrollments)
      ) {
        setEnrollments(student.academic.enrollments);
      } else if (student.academic.dept_id) {
        // Convert old structure to new array format
        setEnrollments([
          {
            dept_id: student.academic.dept_id,
            class_id: student.academic.class_id,
            session: student.academic.session,
            session_time: student.academic.time,
          },
        ]);
      } else {
        setEnrollments([]);
      }
    }

    // Set initial monthly fee from student data
    if (student?.monthly_fee) {
      setMonthlyFee(student.monthly_fee);
      // Check if fee is overridden (different from calculated)
      const calculatedFee = calculateMonthlyFee(
        student.academic?.enrollments ||
          (student.academic?.dept_id
            ? [
                {
                  dept_id: student.academic.dept_id,
                  class_id: student.academic.class_id,
                  session: student.academic.session,
                  session_time: student.academic.time,
                },
              ]
            : [])
      );
      setIsFeeOverridden(student.monthly_fee !== calculatedFee);
    }
  }, [student]);

  // Calculate monthly fee based on enrollments
  const calculateMonthlyFee = (enrollments) => {
    return enrollments.reduce((total, enrollment) => {
      const dept = departments?.find((d) => d._id === enrollment.dept_id);
      if (!dept) return total;

      const fee =
        enrollment.session === "weekend" ? dept.weekend_fee : dept.weekdays_fee;
      return total + (fee || 0);
    }, 0);
  };

  const calculatedFee = calculateMonthlyFee(enrollments);

  const handleAddEnrollment = (newEnrollment) => {
    const updatedEnrollments = [...enrollments, newEnrollment];
    setEnrollments(updatedEnrollments);

    // Auto-update fee if not overridden
    if (!isFeeOverridden) {
      setMonthlyFee(calculateMonthlyFee(updatedEnrollments));
    }
  };

  const handleEditEnrollment = (enrollment, index) => {
    setEnrollmentToEdit(enrollment);
    setEnrollmentEditIndex(index);
    setIsEditModalOpen(true);
  };

  const handleUpdateEnrollment = (updatedEnrollment, index) => {
    const updatedEnrollments = [...enrollments];
    updatedEnrollments[index] = updatedEnrollment;
    setEnrollments(updatedEnrollments);

    // Auto-update fee if not overridden
    if (!isFeeOverridden) {
      setMonthlyFee(calculateMonthlyFee(updatedEnrollments));
    }
  };

  const handleRemoveEnrollment = (index) => {
    const updatedEnrollments = enrollments.filter((_, i) => i !== index);
    setEnrollments(updatedEnrollments);

    // Auto-update fee if not overridden
    if (!isFeeOverridden) {
      setMonthlyFee(calculateMonthlyFee(updatedEnrollments));
    }
  };

  const handleFeeChange = (e) => {
    const newFee = Number(e.target.value);
    setMonthlyFee(newFee);

    // Check if the fee is being overridden
    const calculated = calculateMonthlyFee(enrollments);
    setIsFeeOverridden(newFee !== calculated);
  };

  const handleUseCalculatedFee = () => {
    setMonthlyFee(calculatedFee);
    setIsFeeOverridden(false);
    toast.success("Using calculated fee");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    // basic info
    const student_name = form.student_name.value;
    const student_dob = form.std_dob.value;
    const family_name = form.family_name.value.trim();
    const student_gender = form.std_gender.value;
    const school_year = form.school_year.value;
    const language = form.language.value;
    const emergency_number = form.emergency_number.value;
    const address = form.address.value.trim();
    const post_code = form.post_code.value.trim();

    // parent details
    const mother_name = form.mother_name.value;
    const mother_occupation = form.mother_occupation.value;
    const mother_number = form.mother_number.value;
    const father_name = form.father_name.value;
    const father_occupation = form.father_occupation.value;
    const father_number = form.father_number.value;

    // health details
    const doctor_name = form.doctor_name.value;
    const surgery_address = form.surgery_address.value;
    const surgery_number = form.surgery_number.value;
    const allergies = form.allergies.value;
    const medical_condition = form.medical_condition.value;
    const starting_date = form.starting_date.value;

    // Prepare academic structure with enrollments array
    const academicStructure = {
      enrollments: enrollments,
    };

    const studentData = {
      name: student_name,
      dob: student_dob,
      gender: student_gender,
      school_year: school_year,
      language,
      address,
      post_code,
      emergency_number: emergency_number,
      family_name: family_name,

      mother: {
        name: mother_name,
        occupation: mother_occupation,
        number: mother_number,
      },
      father: {
        name: father_name,
        occupation: father_occupation,
        number: father_number,
      },
      academic: academicStructure,
      medical: {
        doctorName: doctor_name,
        surgeryAddress: surgery_address,
        surgeryNumber: surgery_number,
        allergies: allergies,
        condition: medical_condition,
      },
      startingDate: starting_date,
      monthly_fee: monthlyFee, // Use the state value (could be calculated or overridden)
    };

    try {
      const data = await updateAllStudentData({ id, studentData }).unwrap();
      console.log(data);
      if (data?.modifiedCount) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Student updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (newStatus) => {
    if (newStatus === "approved") {
      // Get the current enrollments from the database (student data)
      const dbEnrollments = student?.academic?.enrollments || [];

      // Check if there are any enrollments with valid class_id in the database
      const hasValidEnrollmentsInDB = dbEnrollments.some(
        (enrollment) =>
          enrollment.class_id !== null && enrollment.class_id !== ""
      );

      if (!hasValidEnrollmentsInDB) {
        Swal.fire({
          icon: "warning",
          title: "Assign valid classes first!",
          text: "You must assign proper classes (not just departments) and save the changes before approving the student.",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    try {
      const data = await updateStudentStatus({
        id: id,
        status: newStatus,
      }).unwrap();

      if (data?.modifiedCount) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Student ${newStatus} successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update student status");
    }
  };
  if (isLoading || loading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Check if it's already a valid YYYY-MM-DD
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    if (isValidFormat) {
      const [yyyy, mm, dd] = dateString.split("-").map(Number);
      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        return dateString; // already in correct format
      }
    }

    // If not, attempt to fix (assuming format is YYYY-DD-MM)
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [year, day, month] = parts.map((part) => part.padStart(2, "0"));
      return `${year}-${month}-${day}`;
    }

    return "";
  };

  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center`}>Update Student</h3>

      {/* Add Department Modal */}
      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEnrollment}
        departments={departments}
        classes={classes}
        existingEnrollments={enrollments}
      />

      {/* Edit Department Modal */}
      <EditDepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEnrollmentToEdit(null);
          setEnrollmentEditIndex(null);
        }}
        onUpdate={handleUpdateEnrollment}
        departments={departments}
        classes={classes}
        existingEnrollments={enrollments}
        enrollmentToEdit={enrollmentToEdit}
        enrollmentIndex={enrollmentEditIndex}
      />

      <form onSubmit={handleFormSubmit} className="row g-3">
        {/* basic details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Basic Details
        </div>
        {/* full name */}
        <div className="col-md-4">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="student_name"
            style={{ borderColor: "var(--border2)" }}
            defaultValue={name}
            className="form-control bg-light"
          />
        </div>
        {/* dob */}
        <div className="col-md-4">
          <label className="form-label">Date of Birth</label>

          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            defaultValue={formatDate(dob)}
            type="date"
            name="std_dob"
          />
        </div>

        {/* gender */}
        {gender ? (
          <div className="col-md-4">
            <label className="form-label">Gender</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              name="std_gender"
              defaultValue={gender}
              className="form-control"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        ) : (
          <div className="col-md-4">
            <label className="form-label">Gender</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              name="std_gender"
              className="form-control"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        )}

        {/* school year */}
        {school_year ? (
          <div className="col-md-4">
            <label className="form-label">School Year</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              name="school_year"
              defaultValue={school_year}
              className="form-control"
            >
              <option value="">Select year</option>
              <option value="reception">Reception</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
              <option value="Year 5">Year 5</option>
              <option value="Year 6">Year 6</option>
              <option value="Year 7">Year 7</option>
              <option value="Year 8">Year 8</option>
              <option value="Year 9">Year 9</option>
              <option value="Year 10">Year 10</option>
              <option value="Year 11">Year 11</option>
              <option value="A level 1st Year">A level 1st Year</option>
              <option value="A level 2nd Year">A level 2nd Year</option>
              <option value="University">University</option>
            </select>
          </div>
        ) : (
          <div className="col-md-4">
            <label className="form-label">School Year</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              name="school_year"
              className="form-control"
            >
              <option value="">Select year</option>
              <option value="reception">Reception</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
              <option value="Year 5">Year 5</option>
              <option value="Year 6">Year 6</option>
              <option value="Year 7">Year 7</option>
              <option value="Year 8">Year 8</option>
              <option value="Year 9">Year 9</option>
              <option value="Year 10">Year 10</option>
              <option value="Year 11">Year 11</option>
              <option value="A level 1st Year">A level 1st Year</option>
              <option value="A level 2nd Year">A level 2nd Year</option>
              <option value="University">University</option>
            </select>
          </div>
        )}

        {/* language */}
        <div className="col-md-4">
          <label className="form-label">Mother Language</label>
          <input
            type="text"
            name="language"
            defaultValue={language}
            style={{ borderColor: "var(--border2)" }}
            id="name"
            placeholder=""
            className="form-control bg-light"
          />
        </div>
        {/* family name */}
        <div className="col-md-4">
          <label className="form-label">Family Name</label>
          <input
            type="text"
            defaultValue={family_name}
            style={{ borderColor: "var(--border2)" }}
            name="family_name"
            placeholder="e.g. Rahman / Khan"
            className="form-control bg-light"
            id="name"
          />
        </div>
        {/* contact */}
        <div className="col-md-4">
          <label className="form-label">Preferred Contact Number</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            defaultValue={emergency_number}
            name="emergency_number"
            id="number"
            placeholder=""
          />
        </div>
        {/* email */}
        <div className="col-md-4">
          <label className="form-label">
            Preferred Email*(not same as other one)
          </label>
          <input
            type="email"
            defaultValue={email}
            style={{ borderColor: "var(--border2)", cursor: "not-allowed" }}
            disabled
            className="form-control bg-light"
            name="student_email"
            id="name"
            placeholder=""
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Post Code</label>
          <input
            type="text"
            style={{ borderColor: "var(--border2)" }}
            defaultValue={post_code}
            className="form-control bg-light"
            name="post_code"
            id="post_code"
            required
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Home Address</label>
          <input
            type="text"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            defaultValue={address}
            name="address"
            id="address"
            placeholder=""
            required
          />
        </div>

        {/* parents details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Parent/Guardian Details
        </div>
        {/* mother name */}
        <div className="col-md-4">
          <label className="form-label">Mother Name</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            defaultValue={motherName}
            name="mother_name"
            id="name"
            placeholder=""
          />
        </div>
        {/* mother occupation */}
        <div className="col-md-4">
          <label className="form-label">Occupation:</label>

          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            defaultValue={occupation}
            name="mother_occupation"
            id="name"
            placeholder=""
          />
        </div>
        {/* mother number */}
        <div className="col-md-4">
          <label className="form-label">Contact Number:</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            name="mother_number"
            defaultValue={motherNumber}
            id="name"
            placeholder=""
          />
        </div>

        {/* father */}
        <div className="col-md-4">
          <label className="form-label">Father Name</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="father_name"
            defaultValue={fatherName}
            id="name"
            placeholder=""
          />
        </div>
        {/* father occupation */}
        <div className="col-md-4">
          <label className="form-label">Occupation</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="father_occupation"
            id="name"
            defaultValue={fatherOcc}
            placeholder=""
          />
        </div>
        {/*father contact number */}
        <div className="col-md-4">
          <label className="form-label">Contact Number</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            name="father_number"
            defaultValue={fatherNumber}
            id="name"
            placeholder=""
          />
        </div>

        {/* Academic Details - UPDATED WITH MODAL SYSTEM */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Academic Details
          <button
            type="button"
            className="btn btn-sm btn-light ms-3"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus className="me-1" /> Add Department
          </button>
        </div>

        {/* Current Enrollments Table */}
        <div className="col-12">
          {enrollments.length === 0 ? (
            <div className="alert alert-info">
              No departments/classes assigned yet. Click "Add Department" to
              assign classes.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Department</th>
                    <th>Session</th>
                    <th>Time</th>
                    <th>Class</th>
                    <th>Fee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment, index) => {
                    const dept = departments?.find(
                      (d) => d._id === enrollment.dept_id
                    );
                    const cls = classes?.find(
                      (c) => c._id === enrollment.class_id
                    );
                    const fee =
                      enrollment.session === "weekend"
                        ? dept?.weekend_fee
                        : dept?.weekdays_fee;

                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{dept?.dept_name || "N/A"}</td>
                        <td>{enrollment.session}</td>
                        <td>{enrollment.session_time}</td>
                        <td>{cls?.class_name || "N/A"}</td>
                        <td>£{fee || 0}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              type="button"
                              className="btn btn-sm btn-warning me-1"
                              onClick={() =>
                                handleEditEnrollment(enrollment, index)
                              }
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveEnrollment(index)}
                              title="Delete"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="text-end fw-bold">
                      Calculated Monthly Fee:
                    </td>
                    <td className="fw-bold">£{calculatedFee}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Health Information */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Health Information
        </div>
        {/* doctor name */}
        <div className="col-md-4">
          <label className="form-label">Surgery/Doctor name</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            defaultValue={doctorName}
            name="doctor_name"
            id="name"
            placeholder=""
          />
        </div>
        {/* address */}
        <div className="col-md-4">
          <label className="form-label">Surgery address</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="surgery_address"
            id="name"
            defaultValue={surgeryAddress}
            placeholder=""
          />
        </div>
        {/* surgery contact */}
        <div className="col-md-4">
          <label className="form-label">Surgery contact</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            defaultValue={surgeryNumber}
            name="surgery_number"
            id="name"
            placeholder=""
          />
        </div>
        {/* known allergy */}
        <div className="col-md-6">
          <label className="form-label">Known Allergies</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            defaultValue={allergies}
            name="allergies"
            id="name"
            placeholder=""
          />
        </div>
        {/* medical condition */}
        <div className="col-md-6">
          <label className="form-label">Any Other Medical Conditions</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            defaultValue={condition}
            name="medical_condition"
            id="name"
            placeholder=""
          />
        </div>
        {/* starting date */}
        <div className="col-md-6">
          <label className="form-label">Expected Starting Date</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            defaultValue={startingDate}
            className="form-control bg-light"
            type="date"
            name="starting_date"
          />
        </div>

        {/* Monthly Fee Section - UPDATED */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label mb-0">Monthly Fee</label>
            {isFeeOverridden && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={handleUseCalculatedFee}
              >
                Use Calculated Fee
              </button>
            )}
          </div>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control"
            type="number"
            value={monthlyFee}
            onChange={handleFeeChange}
            name="monthly_fee"
          />
          <small className="text-muted">
            {isFeeOverridden ? (
              <span className="text-warning">
                ⚠️ Manual override - Calculated fee: £{calculatedFee}
              </span>
            ) : (
              "Auto-calculated from departments"
            )}
          </small>
        </div>

        {/* Submit Button */}
        <div className="col-12 d-flex gap-2 align-items-center justify-content-evenly text-center py-3">
          {!["enrolled", "hold"].includes(status) && (
            <button
              type="button"
              style={{ backgroundColor: "var(--border2)" }}
              className="btn text-white"
              onClick={() => handleStatus("approved")}
            >
              Approve
            </button>
          )}

          <button
            type="submit"
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            Update
          </button>
          {!["enrolled", "hold"].includes(status) && (
            <button
              type="button"
              onClick={() => handleStatus("rejected")}
              style={{ backgroundColor: "var(--border2)" }}
              className="btn text-white"
            >
              Reject
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
