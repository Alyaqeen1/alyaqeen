import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

export default function AddStudent() {
  const axiosPublic = useAxiosPublic();
  const { setLoading } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    const student_class = form.student_class.value;

    // --- Health Info ---
    const doctor_name = form.doctor_name.value.trim();
    const surgery_address = form.surgery_address.value.trim();
    const surgery_number = form.surgery_number.value.trim();
    const allergies = form.allergies.value.trim();
    const medical_condition = form.medical_condition.value.trim();
    const starting_date = form.starting_date.value;

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // --- Validation ---
    if (password !== confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match");
    }
    if (!/[A-Z]/.test(password)) {
      setLoading(false);
      return setError("Password must contain an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      setLoading(false);
      return setError("Password must contain a lowercase letter");
    }
    if (password.length < 6) {
      setLoading(false);
      return setError("Password must be at least 6 characters long");
    }

    try {
      // 🔁 1. Check if parent already exists
      const { data: existingParent } = await axiosPublic.get(
        `/families/${parent_email}`
      );
      let parentUid;
      const studentUid = crypto.randomUUID();

      if (existingParent) {
        parentUid = existingParent.uid;
      } else {
        // 🔧 Create Firebase user for parent
        const parentRes = await axiosPublic.post("/create-student-user", {
          email: parent_email,
          password,
          displayName: family_name,
        });

        parentUid = parentRes?.data?.uid;

        const newFamily = {
          uid: parentUid,
          name: family_name,
          familyId: `${family_name}-${parent_email}`,
          email: parent_email,
          phone: father_number,
          fatherName: father_name,
          children: [studentUid], // will push child after
          createdAt: new Date(),
        };

        const parentData = {
          uid: parentUid,
          name: family_name,
          email: parent_email,
          role: "parent",
          createdAt: new Date(),
        };

        await axiosPublic.post("/families", newFamily);
        await axiosPublic.post("/users", parentData);
      }

      // ✅ 2. Generate student UID

      // ✅ 3. Prepare studentData
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
          department: std_department,
          time: std_time,
          session: std_session,
          class: student_class,
        },
        medical: {
          doctorName: doctor_name,
          surgeryAddress: surgery_address,
          surgeryNumber: surgery_number,
          allergies,
          condition: medical_condition,
        },
        startingDate: starting_date,
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
        await axiosPublic.patch(`/families/${parent_email}/add-child`, {
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
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
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
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          >
            <option value="">Select department</option>
            <option value="Arabic, Quran & Islamic Education">
              Arabic, Quran & Islamic Education
            </option>
            <option value="Maths, English & Science Tuition">
              Maths, English & Science Tuition
            </option>
            <option value="Arabic Language">Arabic Language</option>
            <option value="Urdu/Banla Language">Urdu/Banla Language</option>
            <option value="Online Learning">Online Learning</option>
          </select>
        </div>

        {/* session */}
        <div className="col-md-6">
          <label className="form-label">Session</label>
          <select
            name="std_session"
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
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            required
          >
            <option value="">Select Session Time</option>
            <option value="Early - 4:30 PM – 6:00 PM (1½ hrs)">
              Early - 4:30 PM – 6:00 PM (1½ hrs)
            </option>
            <option value="Late - 5:45 PM – 7:15 PM (1½ hrs)">
              Late - 5:45 PM – 7:15 PM (1½ hrs)
            </option>
            <option value="Morning - 10:00 AM – 12:30 PM (1½ hrs)">
              Morning - 10:00 AM – 12:30 PM (1½ hrs)
            </option>
            <option value="Afternoon - 12:30 PM – 2:30 PM (1½ hrs)">
              Afternoon - 12:30 PM – 2:30 PM (1½ hrs)
            </option>
          </select>
        </div>

        {/* class */}
        <div className="col-md-6">
          <label className="form-label">Class</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="student_class"
            placeholder=""
            required
          />
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
          <label className="form-label">Password</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="password"
            id="name"
            placeholder=""
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Confirm Password</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            name="confirmPassword"
            id="name"
            placeholder=""
            required
          />
        </div>
        <div className="col-md-12">
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
            type="submit"
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
