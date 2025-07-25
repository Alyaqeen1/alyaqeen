import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import SignatureCanvas from "react-signature-canvas";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import feeStructure from "../../utils/feeStructure";

const image_hosting_key = import.meta.env.VITE_Image_Hosting_Key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
export default function AddStudent() {
  const [show, setShow] = useState(false);
  const [department, setDepartment] = useState(false);
  const [session, setSession] = useState(false);
  const [session_time, setSessionTime] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [signature, setSignature] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const { setLoading } = useAuth();
  const [error, setError] = useState("");
  const { data: departments, isLoading } = useGetDepartmentsQuery();
  const selectedDepartment = departments?.find(
    (dept) => dept?._id === department
  );
  const sigRef = useRef();

  const clearSignature = () => sigRef.current.clear();
  const compressImage = async (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Resize to a smaller canvas size (e.g., 300x100)
        canvas.width = 300;
        canvas.height = 100;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL("image/png", 0.7); // 0.7 quality
        resolve(compressedDataUrl);
      };
    });
  };

  const saveSignature = async () => {
    let dataUrl = sigRef.current.toDataURL("image/png");

    // Compress it
    dataUrl = await compressImage(dataUrl);

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "signature.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosPublic.post(image_hosting_api, formData);
      const url = res.data?.data?.display_url;
      setSignature(url);
      toast.success("Signature uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const navigate = useNavigate();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setLocalLoading(true); // ⬅️ Block double click

    const form = e.target;

    // --- Basic Info ---
    const student_name = form.student_name.value.trim();
    const student_email = form.student_email.value.trim();
    const student_dob = form.std_dob.value;
    const student_age = form.student_age.value.trim();
    const family_name = form.family_name.value.trim();
    const student_gender = form.std_gender.value;
    const school_year = form.school_year.value;
    const language = form.language.value;
    const emergency_number = form.emergency_number.value.trim();

    // --- Parent Info ---
    const mother_name = form.mother_name.value.trim();
    const mother_occupation = form.mother_occupation.value.trim();
    const mother_number = form.mother_number.value.trim();
    const father_name = form.father_name.value.trim();
    const father_occupation = form.father_occupation.value.trim();
    const father_number = form.father_number.value.trim();
    const parent_email = form.parent_email.value.trim();

    // --- Academic Info ---
    const std_department = form.std_department.value;
    const std_time = form.std_time.value;
    const std_session = form.std_session.value;
    const student_class = null;

    // --- Health Info ---
    const doctor_name = form.doctor_name.value.trim();
    const surgery_address = form.surgery_address.value.trim();
    const surgery_number = form.surgery_number.value.trim();
    const allergies = form.allergies.value.trim();
    const medical_condition = form.medical_condition.value.trim();
    const starting_date = form.starting_date.value;

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    // const monthly_fee = feeStructure?.monthlyFees?.[departmentName]?.[session];
    const monthly_fee =
      session === "weekend"
        ? selectedDepartment?.weekend_fee
        : selectedDepartment?.weekdays_fee;
    const today = new Date().setHours(0, 0, 0, 0); // current date at midnight
    const selectedDate = new Date(starting_date).setHours(0, 0, 0, 0); // user date at midnight

    if (selectedDate < today) {
      setLocalLoading(false); // ✅ Unblock double click
      setLoading(false);
      return setError("Starting date cannot be in the past");
    }

    // --- Validation ---
    if (password !== confirmPassword) {
      setLocalLoading(false); // ✅ Unblock double click

      setLoading(false);
      return setError("Passwords do not match");
    }
    if (!/[A-Z]/.test(password)) {
      setLocalLoading(false); // ✅ Unblock double click

      setLoading(false);
      return setError("Password must contain an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      setLocalLoading(false); // ✅ Unblock double click

      setLoading(false);
      return setError("Password must contain a lowercase letter");
    }
    if (password.length < 6) {
      setLocalLoading(false); // ✅ Unblock double click

      setLoading(false);
      return setError("Password must be at least 6 characters long");
    }

    try {
      if (!signature) {
        setLocalLoading(false); // ✅ Unblock double click
        setLoading(false);
        return setError("Please save signature first");
      }
      // 🔁 1. Check if parent already exists
      const { data: existingParent } = await axiosPublic.get(
        `/families/by-email/${student_email}`
      );
      let parentUid;
      const studentUid = crypto.randomUUID();

      if (existingParent) {
        parentUid = existingParent.uid;
      } else {
        // 🔧 Create Firebase user for parent
        const parentRes = await axiosPublic.post("/create-student-user", {
          email: student_email,
          password,
          displayName: family_name,
        });

        parentUid = parentRes?.data?.uid;

        const newFamily = {
          uid: parentUid,
          name: family_name,
          familyId: `${family_name}-${student_email}`,
          email: student_email,
          feeChoice: null,
          phone: father_number,
          fatherName: father_name,
          children: [studentUid], // will push child after
          createdAt: new Date(),
        };

        const parentData = {
          uid: parentUid,
          name: family_name,
          email: student_email,
          role: "parent",
          createdAt: new Date(),
        };

        await axiosPublic.post("/families", newFamily);
        await axiosPublic.post("/users", parentData);
      }

      // ✅ 2. Generate student UID

      if (monthly_fee) {
        // ✅ 2. Prepare student data
        const studentData = {
          uid: studentUid,
          name: student_name,
          email: student_email,
          dob: student_dob,
          parentUid,
          student_age,
          gender: student_gender,
          school_year,
          status: "under review",
          activity: "active",
          language,
          parent_email,
          emergency_number,
          family_name,
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
          academic: {
            dept_id: std_department,
            time: std_time,
            session: std_session,
            class_id: student_class,
          },
          medical: {
            doctorName: doctor_name,
            surgeryAddress: surgery_address,
            surgeryNumber: surgery_number,
            allergies,
            condition: medical_condition,
          },
          startingDate: starting_date,
          signature,
          monthly_fee,
          createdAt: new Date(),
        };
        const notification = {
          type: "admission",
          message: `${student_name} has joined.`,
          isRead: false,
          createdAt: new Date(),
          link: "/dashboard/online-admissions",
        };

        // ✅ 4. Save student and notification
        await axiosPublic.post("/students", studentData);
        await axiosPublic.post("/notifications", notification);

        // ✅ 5. If parent existed, add student UID
        if (existingParent) {
          await axiosPublic.patch(`/families/${student_email}/add-child`, {
            studentUid,
          });
        }
        // --- 5. Success Notification ---
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Student added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        form.reset();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center`}>Add New Student</h3>
      {/* <p className="text-center mb-3">
        Manage all students here—approve, track, and ensure the right
        connections are made.
      </p> */}
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
            className="form-control bg-light"
          />
        </div>
        {/* dob */}
        <div className="col-md-4">
          <label className="form-label">Date of Birth</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="date"
            name="std_dob"
            required
          />
        </div>
        {/* age */}
        <div className="col-md-4">
          <label className="form-label">Age</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="student_age"
            className="form-control"
            required
          >
            <option value="">Select age</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
          </select>
        </div>

        {/* gender */}
        <div className="col-md-4">
          <label className="form-label">Gender</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="std_gender"
            className="form-control"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* school year */}
        <div className="col-md-4">
          <label className="form-label">School Year</label>
          <select
            style={{ borderColor: "var(--border2)" }}
            name="school_year"
            className="form-control"
            required
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

        {/* language */}
        <div className="col-md-4">
          <label className="form-label">Mother Language</label>
          <input
            type="text"
            name="language"
            style={{ borderColor: "var(--border2)" }}
            id="name"
            placeholder=""
            className="form-control bg-light"
            required
          />
        </div>
        {/* family name */}
        <div className="col-md-4">
          <label className="form-label">Family Name</label>
          <input
            type="text"
            style={{ borderColor: "var(--border2)" }}
            name="family_name"
            placeholder="e.g. Rahman / Khan"
            className="form-control bg-light"
            id="name"
            required
          />
        </div>
        {/* contact */}
        <div className="col-md-4">
          <label className="form-label">Preferred Contact Number</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            name="emergency_number"
            id="number"
            placeholder=""
            required
          />
        </div>
        {/* email */}
        <div className="col-md-4">
          <label className="form-label">
            Preferred Email*(not same as other one)
          </label>
          <input
            type="email"
            style={{ borderColor: "var(--border2)" }}
            // disabled
            className="form-control bg-light"
            name="student_email"
            id="name"
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
            id="name"
            placeholder=""
            required
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
            id="name"
            placeholder=""
            required
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
            placeholder=""
            required
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
            id="name"
            placeholder=""
            required
          />
        </div>
        {/* parent email */}
        <div className="col-md-12">
          <label className="form-label">One of the other parents email*</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            // style={{ backgroundColor: "var(--theme2)" }}
            type="email"
            name="parent_email"
            id="name"
            placeholder=""
            required
          />
        </div>
        {/* Academic Details */}
        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Academic Details
        </div>
        <div className="col-md-6">
          <label className="form-label">Departments</label>
          <select
            name="std_department"
            onChange={(e) => setDepartment(e.target.value)}
            value={department}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          >
            <option value="">Select department</option>
            {departments?.map((dept) => (
              <option key={dept?._id} value={dept?._id}>
                {dept?.dept_name}
              </option>
            ))}

            {/* <option value="Qaidah, Quran & Islamic Studies">
              Qaidah, Quran & Islamic Studies
            </option>
            <option value="Primary Maths & English Tuition">
              Primary Maths & English Tuition
            </option>
            <option value="GCSE Maths English & Science Tuition">
              GCSE Maths English & Science Tuition
            </option>
            <option value="Hifz Memorisation">Hifz Memorisation</option>
            <option value="Arabic Language">Arabic Language</option> */}
          </select>
        </div>

        {/* session */}
        <div className="col-md-6">
          <label className="form-label">Session</label>
          <select
            name="std_session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          >
            <option value="">Select Session</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekend">Weekend</option>
          </select>
        </div>

        {/* time */}
        <div className="col-md-6">
          <label className="form-label">Session Time</label>
          <select
            name="std_time"
            value={session_time}
            onChange={(e) => setSessionTime(e.target.value)}
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          >
            <option value="">Select Session Time</option>
            {department && session === "weekdays" ? (
              <>
                <option value="S1">Early - 4:30 PM – 6:00 PM (1½ hrs)</option>
                <option value="S2">Late - 5:45 PM – 7:15 PM (1½ hrs)</option>
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

        {/* class */}
        <div className="col-md-6">
          <label className="form-label">Class</label>
          <select
            disabled
            className="form-control bg-light"
            style={{
              backgroundColor: "var(--theme2)",
              cursor: "not-allowed",
              borderColor: "var(--border2)",
            }}
            name="student_class"
          >
            <option value="">Class Can be selected from the update form</option>
          </select>
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
            name="doctor_name"
            id="name"
            placeholder=""
            required
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
            placeholder=""
            required
          />
        </div>
        {/* surgery contact */}
        <div className="col-md-4">
          <label className="form-label">Surgery contact</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="tel"
            name="surgery_number"
            id="name"
            placeholder=""
            required
          />
        </div>
        {/* known allergy */}
        <div className="col-md-6">
          <label className="form-label">Known Allergies</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="allergies"
            id="name"
            placeholder=""
            required
          />
        </div>
        {/* medical condition */}
        <div className="col-md-6">
          <label className="form-label">Any Other Medical Conditions</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="medical_condition"
            id="name"
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
              name="confirmPassword"
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

        <div
          style={{ backgroundColor: "var(--border2)" }}
          className="text-white rounded-3 p-2 fs-5"
        >
          Signatures
        </div>
        {/* Parents Signature */}
        <div className="col-lg-6 ">
          <div className="form-clt">
            <span>Parents Signature*</span>
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                // width: 550,
                height: 150,
                className: "w-100",
                style: {
                  border: "1px solid var(--border2)", // or use a fixed color like "#333"
                  borderRadius: "5px", // optional
                },
              }}
              ref={sigRef}
            />
            <div className="mt-2 d-flex gap-2">
              <button
                type="button"
                style={{ backgroundColor: "var(--border2)" }}
                className="btn text-white"
                onClick={clearSignature}
                // className="theme-btn px-2 py-1 bg-red-500 text-white rounded"
              >
                Clear
              </button>
              <button
                type="button"
                style={{ backgroundColor: "var(--border2)" }}
                className="btn text-white"
                onClick={saveSignature}
                // className="theme-btn px-2 py-1 bg-red-500 text-white rounded"
              >
                Save & Submit
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6" style={{ marginTop: "50px" }}>
          <label className="form-label">Expected Starting Date</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="date"
            name="starting_date"
            required
          />
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
