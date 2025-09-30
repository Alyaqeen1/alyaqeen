import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useAddTeacherMutation } from "../../redux/features/teachers/teachersApi";
import { useNavigate } from "react-router";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AddTeacher() {
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const [dbsUrl, setDbsUrl] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [addTeacher] = useAddTeacherMutation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { setUser } = useAuth();

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
      setLocalLoading(false); // Reset local loading state after upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.full_name.value;
    const email = form.email.value.toLowerCase().trim();
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
    const password = form.password.value;
    const confirm_password = form.confirm_password.value;

    const teacherData = {
      name,
      email,
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
      status: "pending",
      activity: "active",
      teacher_photo: photoUrl,
      dbs_crb: dbsUrl,
      cv: cvUrl,
      highest_degree_certificate: certificateUrl,
      sord_code,
      emergency_number,
      account_holder_name,
      bank_account_number,
      dept_ids: [],
      class_ids: [],
      subject_ids: [],

      createdAt: new Date(),
    };

    if (localLoading) return; // Extra guard
    setLocalLoading(true); // ⬅️ Block double click

    // if (!photoUrl || !cvUrl || !dbsUrl || !certificateUrl) {
    //   setLocalLoading(false); // Reset loading state if files are missing
    //   return setError("Please wait until all files are uploaded.");
    // }

    // Password Validation
    if (password !== confirm_password) {
      setLocalLoading(false); // Reset loading state if passwords do not match
      return setError("Passwords do not match");
    }
    if (!/[A-Z]/.test(password)) {
      setLocalLoading(false); // Reset loading state if password does not meet criteria
      return setError("Must include an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      setLocalLoading(false); // Reset loading state if password does not meet criteria
      return setError("Must include a lowercase letter");
    }
    if (password.length < 6) {
      setLocalLoading(false); // Reset loading state if password does not meet criteria
      return setError("Password must be at least 6 characters");
    }

    try {
      // Create user with email and password
      const res = await axiosPublic.post("/create-student-user", {
        email,
        password,
        displayName: name,
        // photoURL: photoUrl,
      });

      const userData = {
        uid: res?.data?.uid,
        name,
        email,
        role: "teacher",
        createdAt: new Date(),
      };
      if (res?.data) {
        const data = await addTeacher(teacherData).unwrap();
        await axiosPublic.post("/users", userData);
        if (data.insertedId) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Teacher added successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/dashboard/pending-teachers");
          form.reset(); // Reset the form
        }
      }
    } catch (error) {
      setLocalLoading(false);
      return toast.error(error?.message);
    } finally {
      setLocalLoading(false);
    }
  };
  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center`}>Add New Teacher</h3>
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
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Email Address*</label>
          <input
            type="email"
            name="email"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Phone Number*</label>
          <input
            type="tel"
            name="number"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
          />
        </div>
        {/* dob */}
        <div className="col-md-4">
          <label className="form-label">Date of Birth*</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="date"
            name="dob"
            required
          />
        </div>
        {/* educational qualification */}
        <div className="col-md-4">
          <label className="form-label">Educational Qualification*</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="qualification"
            required
          />
        </div>
        {/* date of joining */}
        <div className="col-md-4">
          <label className="form-label">Date of Joining*</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="date"
            name="joining_date"
            required
          />
        </div>
        {/* address */}
        <div className="col-md-4">
          <label className="form-label">Address*</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="address"
            required
          />
        </div>
        {/* post code */}
        <div className="col-md-4">
          <label className="form-label">Post Code*</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="post_code"
            required
          />
        </div>

        {/* marital */}
        <div className="col-md-4">
          <label className="form-label">Marital Status*</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="marital_status"
            className="form-control"
            required
          >
            <option value="">Select marital status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
        </div>
        {/* gender */}
        <div className="col-md-4">
          <label className="form-label">Gender</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="gender"
            className="form-control"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* designation */}
        <div className="col-md-4">
          <label className="form-label">Designation*</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="designation"
            required
          />
        </div>
        {/* department */}
        <div className="col-md-4">
          <label className="form-label">Department*</label>
          <select
            // onChange={(e) => setDepartment(e.target.value)}
            name="department"
            // value={department}
            className="form-control selectDepartment"
            style={{ borderColor: "var(--border2)" }}
            required
          >
            <option value="">Select department</option>
            <option value="Qaidah, Quran & Islamic Studies">
              Qaidah, Quran & Islamic Studies
            </option>
            <option value="Primary Maths & English Tuition">
              Primary Maths & English Tuition
            </option>
            <option value="GCSE Maths English & Science Tuition">
              GCSE Maths English & Science Tuition
            </option>
            <option value="Hifz Memorisation">Hifz Memorisation</option>
            <option value="Arabic Language">Arabic Language</option>
          </select>
        </div>

        {/* experience */}
        <div className="col-md-4">
          <label className="form-label">Work Experience*</label>
          <input
            type="text"
            name="experience"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          />
        </div>
        {/* emergency contact number */}
        <div className="col-md-4">
          <label className="form-label">Emergency Contact Number*</label>
          <input
            type="tel"
            name="emergency_number"
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          />
        </div>

        {/* photo */}
        <div className="col-md-4">
          <label className="form-label">Photo*</label>
          <input
            type="file"
            name="teacher_photo"
            style={{ borderColor: "var(--border2)" }}
            accept="image/*"
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
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="sord_code"
            placeholder=""
            required
          />
        </div>

        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Credentials
        </div>
        <div className="col-md-6">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-group">
            <input
              id="password"
              style={{ borderColor: "var(--border2)" }}
              name="password"
              type={show ? "text" : "password"}
              className="form-control border border-secondary"
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="btn btn-outline-secondary"
              tabIndex={-1}
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="input-group">
            <input
              id="confirmPassword" // ✅ fix here
              style={{ borderColor: "var(--border2)" }}
              name="confirm_password"
              type={confirmShow ? "text" : "password"}
              className="form-control border border-secondary"
              required
            />
            <button
              type="button"
              onClick={() => setConfirmShow(!confirmShow)}
              className="btn btn-outline-secondary"
              tabIndex={-1}
            >
              {confirmShow ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error && <p className="text-danger text-center col-span-2">{error}</p>}

        {/* Submit Button */}
        <div className="col-12 text-center py-3">
          <button
            disabled={localLoading}
            type="submit"
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            {localLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
