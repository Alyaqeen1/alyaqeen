import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import {
  useAddTeacherMutation,
  useGetTeacherByIdQuery,
  useGetTeacherWithDetailsQuery,
  useUpdateTeacherMutation,
  useUpdateTeacherStatusMutation,
} from "../../redux/features/teachers/teachersApi";
import { useNavigate, useParams } from "react-router";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Select from "react-select";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";
import { useGetSubjectsQuery } from "../../redux/features/subjects/subjectsApi";

export default function UpdateTeacher() {
  const [error, setError] = useState("");
  const { id } = useParams();
  const [dept_id, setDept_id] = useState("");
  //   const [localLoading, setLocalLoading] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const [dbsUrl, setDbsUrl] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const [updateTeacherStatus, { isLoading: updateLoading }] =
    useUpdateTeacherStatusMutation();
  const [updateTeacher, { isLoading: localLoading }] =
    useUpdateTeacherMutation();
  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();
  const { data: subjects } = useGetSubjectsQuery();
  const navigate = useNavigate();

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const {
    data: teacher,
    isLoading,
    isError,
    refetch,
  } = useGetTeacherWithDetailsQuery(id, {
    skip: !id, // avoid fetching if no ID
  });
  useEffect(() => {
    if (teacher && departments && classes && subjects) {
      // ✅ Populate selectedDepartments using dept_ids (array) instead of teacher.department (string)
      setSelectedDepartments(
        departments?.filter((d) => teacher?.dept_ids?.includes(d._id))
      );

      setSelectedClasses(
        classes?.filter((cls) => teacher?.class_ids?.includes(cls._id))
      );

      setSelectedSubjects(
        subjects?.filter((sub) => teacher?.subject_ids?.includes(sub._id))
      );
    }
  }, [teacher, departments, classes, subjects]);

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

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (example for PDFs)
    if (type === "cv" && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error("Please upload a PDF or Word file!");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "teachers");
      if (type === "photo") setPhotoUrl(url);
      else if (type === "cv") setCvUrl(url);
      else if (type === "dbs") setDbsUrl(url);
      else if (type === "certificate") setCertificateUrl(url);
      toast.success(`${type.toUpperCase()} uploaded!`);
    } catch (err) {
      toast.error("Upload failed!");
      console.error(err);
    } finally {
      setUploading(false);
      // setLocalLoading(false); // Reset local loading state after upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.full_name.value;
    const email = form.email.value;
    const number = form.number.value;
    const dob = form.dob.value;
    const joining_date = form.joining_date.value;
    const qualification = form.qualification.value;
    const address = form.address.value;
    const post_code = form.post_code.value;
    const marital_status = form.marital_status.value;
    const gender = form.gender.value;
    const department = form.department.value;
    const experience = form.experience.value;
    const designation = form.designation.value;
    const emergency_number = form.emergency_number.value;
    const account_holder_name = form.account_holder_name.value;
    const bank_account_number = form.bank_account_number.value;
    const sord_code = form.sord_code.value;

    const teacherData = {
      name,
      number,
      dob,
      joining_date,
      qualification,
      address,
      post_code,
      marital_status,
      gender,
      department,
      experience,
      designation,
      assigned_groups: [],
      teacher_photo: photoUrl || teacher?.teacher_photo,
      dbs_crb: dbsUrl || teacher?.dbs_crb,
      cv: cvUrl || teacher?.cv,
      highest_degree_certificate:
        certificateUrl || teacher?.highest_degree_certificate,

      sord_code,
      emergency_number,
      account_holder_name,
      bank_account_number,
      createdAt: new Date(),
      dept_ids: selectedDepartments.map((d) => d._id),
      class_ids: selectedClasses?.map((c) => c._id),
      subject_ids: selectedSubjects?.map((s) => s._id),
    };

    if (localLoading) return; // Extra guard

    try {
      const data = await updateTeacher({ id, teacherData }).unwrap();
      if (data.modifiedCount) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Teacher updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/pending-teachers");
        form.reset(); // Reset the form
      }
    } catch (error) {
      console.log(error);
      return toast.error(error?.message);
    }
  };

  const departmentOptions = departments?.map((d) => ({
    value: d._id,
    label: d.dept_name,
  }));

  const selectedDeptIds = selectedDepartments.map((d) => d._id);
  const filteredClasses = classes?.filter((cls) =>
    selectedDeptIds.includes(cls.dept_id)
  );

  const classOptions = filteredClasses?.map((c) => ({
    value: c._id,
    label: c.class_name,
  }));

  const selectedClassIds = selectedClasses.map((cls) => cls._id);
  const filteredSubjects = subjects?.filter((subj) =>
    selectedClassIds.includes(subj.class_id)
  );

  const subjectOptions = filteredSubjects?.map((s) => ({
    value: s._id,
    label: s.subject_name,
  }));

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
      const data = await updateTeacherStatus({
        id,
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

  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }
  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center`}>Update Teacher</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        {/* basic details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Basic Details
        </div>
        {/* full name */}
        <div className="col-md-4">
          <label className="form-label">Full Name*</label>
          <input
            type="text"
            name="full_name"
            id="name"
            defaultValue={name}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Email Address*</label>
          <input
            type="email"
            name="email"
            disabled
            defaultValue={email}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Phone Number*</label>
          <input
            type="tel"
            defaultValue={number}
            name="number"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
        {/* dob */}
        <div className="col-md-4">
          <label className="form-label">Date of Birth*</label>
          <input
            defaultValue={dob}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="date"
            name="dob"
          />
        </div>
        {/* educational qualification */}
        <div className="col-md-4">
          <label className="form-label">Educational Qualification*</label>
          <input
            defaultValue={qualification}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="qualification"
          />
        </div>
        {/* date of joining */}
        <div className="col-md-4">
          <label className="form-label">Date of Joining*</label>
          <input
            defaultValue={joining_date}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="date"
            name="joining_date"
          />
        </div>
        {/* address */}
        <div className="col-md-4">
          <label className="form-label">Address*</label>
          <input
            defaultValue={address}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="address"
          />
        </div>
        {/* post code */}
        <div className="col-md-4">
          <label className="form-label">Post Code*</label>
          <input
            defaultValue={post_code}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="post_code"
          />
        </div>

        {/* marital */}
        <div className="col-md-4">
          <label className="form-label">Marital Status*</label>
          {marital_status && (
            <select
              defaultValue={marital_status}
              style={{ borderColor: "var(--border2)" }}
              name="marital_status"
              className="form-control"
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          )}
        </div>
        {/* gender */}
        <div className="col-md-4">
          <label className="form-label">Gender</label>
          {gender && (
            <select
              defaultValue={gender}
              style={{ borderColor: "var(--border2)" }}
              name="gender"
              className="form-control"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          )}
        </div>

        {/* post code */}
        <div className="col-md-4">
          <label className="form-label">Designation*</label>
          <input
            defaultValue={designation}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="designation"
          />
        </div>
        {/* post code */}
        <div className="col-md-4">
          <label className="form-label">Department*</label>
          <input
            defaultValue={department}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="department"
          />
        </div>

        {/* experience */}
        <div className="col-md-4">
          <label className="form-label">Work Experience*</label>
          <input
            type="text"
            defaultValue={experience}
            name="experience"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
        {/* emergency contact number */}
        <div className="col-md-4">
          <label className="form-label">Emergency Contact Number*</label>
          <input
            defaultValue={emergency_number}
            type="tel"
            name="emergency_number"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>

        {/* photo */}
        <div className="col-md-4">
          <label className="form-label">Photo*</label>
          <input
            type="file"
            name="teacher_photo"
            style={{ borderColor: "var(--border2)" }}
            disabled={uploading} // Disable during upload
            onChange={(e) => handleFileChange(e, "photo")}
            className="form-control bg-light"
          />{" "}
        </div>
        {/* dbs */}
        <div className="col-md-4">
          <label className="form-label">DBS(CRB)*</label>
          <input
            type="file"
            name="dbs_crb"
            style={{ borderColor: "var(--border2)" }}
            onChange={(e) => handleFileChange(e, "dbs")}
            disabled={uploading} // Disable during upload
            className="form-control bg-light"
          />{" "}
        </div>
        {/* cv */}
        <div className="col-md-4">
          <label className="form-label">CV*</label>
          <input
            type="file"
            name="cv"
            style={{ borderColor: "var(--border2)" }}
            onChange={(e) => handleFileChange(e, "cv")}
            disabled={uploading} // Disable during upload
            className="form-control bg-light"
          />{" "}
        </div>
        {/* highest degree certificate */}
        <div className="col-md-4">
          <label className="form-label">Highest Degree Certificate*</label>
          <input
            type="file"
            name="highest_degree_certificate"
            style={{ borderColor: "var(--border2)" }}
            onChange={(e) => handleFileChange(e, "certificate")}
            disabled={uploading} // Disable during upload
            className="form-control bg-light"
          />{" "}
        </div>

        {/* Bank Account Details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Bank Account Details
        </div>
        {/* mother name */}
        <div className="col-md-4">
          <label className="form-label">Account Holder Name*</label>
          <input
            defaultValue={account_holder_name}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="account_holder_name"
            id="name"
            placeholder=""
          />
        </div>
        {/*Bank Account Number* */}
        <div className="col-md-4">
          <label className="form-label">Bank Account Number*</label>

          <input
            defaultValue={bank_account_number}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="bank_account_number"
            placeholder=""
          />
        </div>
        {/* Sord Code* */}
        <div className="col-md-4">
          <label className="form-label">Sord Code*</label>
          <input
            defaultValue={sord_code}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="sord_code"
            placeholder=""
          />
        </div>
        {/* Bank Account Details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Assign Groups
        </div>
        {/* Department */}
        <div className="col-md-4">
          <label className="form-label">Departments</label>
          <Select
            isMulti
            value={selectedDepartments.map((dept) => ({
              label: dept.dept_name,
              value: dept._id,
            }))}
            onChange={(opts) => {
              const selected = opts.map((opt) =>
                departments.find((d) => d._id === opt.value)
              );
              setSelectedDepartments(selected);
              setSelectedClasses([]);
              setSelectedSubjects([]);
            }}
            options={departmentOptions}
            placeholder="Select Departments"
            isSearchable
          />
        </div>

        {/* Classes based on department */}
        <div className="col-md-4">
          <label className="form-label">Classes</label>
          <Select
            isMulti
            options={classOptions}
            value={selectedClasses?.map((c) => ({
              label: c.class_name,
              value: c._id,
            }))}
            onChange={(opts) => {
              const selected = opts?.map((opt) =>
                filteredClasses?.find((c) => c._id === opt.value)
              );
              setSelectedClasses(selected);
              setSelectedSubjects([]); // reset subjects when classes change
            }}
            placeholder="Select Classes"
            isSearchable
          />
        </div>

        {/* Subjects based on selected classes */}
        <div className="col-md-4">
          <label className="form-label">Subjects</label>
          <Select
            isMulti
            options={subjectOptions}
            value={selectedSubjects?.map((s) => ({
              label: s.subject_name,
              value: s._id,
            }))}
            onChange={(opts) =>
              setSelectedSubjects(
                opts?.map((opt) =>
                  filteredSubjects?.find((s) => s._id === opt.value)
                )
              )
            }
            placeholder="Select Subjects"
            isSearchable
          />
        </div>

        {error && <p className="text-danger text-center col-span-2">{error}</p>}

        {/* Submit Button */}
        <div className="col-12 text-center py-3 d-flex gap-2 align-items-center justify-content-evenly">
          <button
            type="button"
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
            disabled={updateLoading}
            onClick={() => handleStatus("approved")}
          >
            Approve
          </button>
          <button
            disabled={localLoading}
            type="submit"
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            {localLoading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            disabled={updateLoading}
            onClick={() => handleStatus("rejected")}
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            Reject
          </button>
        </div>
      </form>
    </div>
  );
}
