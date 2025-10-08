import React, { useEffect, useState } from "react";
import {
  useGetStudentQuery,
  useUpdateAllStudentDataMutation,
} from "../../redux/features/students/studentsApi";
import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function UpdateChild() {
  const { id } = useParams();
  const [updateAllStudentData] = useUpdateAllStudentDataMutation();
  const {
    data: student,
    isLoading,
    refetch,
  } = useGetStudentQuery(id, {
    skip: !id,
  });
  const { user, updateUser, loading, setLoading } = useAuth();

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

  // Gradient styles matching the educational card
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const cardGradients = {
    primary: {
      background: "linear-gradient(135deg, #7c8fee, #8a67b0)",
      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
    },
    secondary: {
      background: "linear-gradient(135deg, #f5a9fb, #f77a8c)",
      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
    },
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
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
      medical: {
        doctorName: doctor_name,
        surgeryAddress: surgery_address,
        surgeryNumber: surgery_number,
        allergies: allergies,
        condition: medical_condition,
      },
    };

    try {
      const data = await updateAllStudentData({ id, studentData }).unwrap();
      if (data.modifiedCount) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Child information updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (error) {
      toast.error("Failed to update child information");
      console.error("Update error:", error);
    }
  };

  if (isLoading || loading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    if (isValidFormat) {
      const [yyyy, mm, dd] = dateString.split("-").map(Number);
      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        return dateString;
      }
    }
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [year, day, month] = parts.map((part) => part.padStart(2, "0"));
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  return (
    <div
      className="rounded-4 border-0 shadow overflow-hidden"
      style={{ background: "white" }}
    >
      {/* Header with Gradient */}
      <div style={gradientStyle} className="text-white p-4">
        <div className="d-flex align-items-center flex-wrap gap-4">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle border"
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3) !important",
            }}
          >
            <span style={{ fontSize: "2rem" }}>👤</span>
          </div>

          <div className="flex-grow-1">
            <h1
              className="mb-1 fw-bold text-white"
              style={{
                fontSize: "1.8rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              Update {student?.name}'s Information
            </h1>
            <p
              className="mb-0 opacity-90"
              style={{ textShadow: "0 1px 1px rgba(0,0,0,0.1)" }}
            >
              Keep your child's details up to date
            </p>
          </div>

          <div className="d-flex flex-column gap-2">
            <span
              className="px-3 py-1 rounded-pill text-uppercase fw-bold"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontSize: "0.8rem",
                letterSpacing: "0.5px",
                textShadow: "0 1px 1px rgba(0,0,0,0.2)",
              }}
            >
              {student?.status}
            </span>
            <span
              className="px-3 py-1 rounded-pill text-uppercase fw-bold text-white"
              style={{
                background: "#ff6b6b",
                fontSize: "0.8rem",
                letterSpacing: "0.5px",
                textShadow: "0 1px 1px rgba(0,0,0,0.2)",
              }}
            >
              {student?.activity}
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4">
        <form onSubmit={handleFormSubmit} className="row g-4">
          {/* Basic Details Section */}
          <div className="col-12">
            <div
              className="rounded-4 p-4 mb-4"
              style={{ background: "#f8f9fa" }}
            >
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  👤
                </div>
                <div>
                  <h4 className="fw-bold mb-1 text-dark">Basic Details</h4>
                  <p className="text-muted mb-0">
                    Child's personal information
                  </p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="student_name"
                    style={{ borderColor: "#667eea" }}
                    defaultValue={name}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Date of Birth
                  </label>
                  <input
                    style={{ borderColor: "#667eea" }}
                    className="form-control"
                    defaultValue={formatDate(dob)}
                    type="date"
                    name="std_dob"
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">Gender</label>
                  <select
                    style={{ borderColor: "#667eea" }}
                    name="std_gender"
                    defaultValue={gender}
                    className="form-control"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">School Year</label>
                  <select
                    style={{ borderColor: "#667eea" }}
                    name="school_year"
                    defaultValue={school_year}
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

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Mother Language
                  </label>
                  <input
                    type="text"
                    name="language"
                    defaultValue={language}
                    style={{ borderColor: "#667eea" }}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">Family Name</label>
                  <input
                    type="text"
                    defaultValue={family_name}
                    style={{ borderColor: "#667eea" }}
                    name="family_name"
                    placeholder="e.g. Rahman / Khan"
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Emergency Contact
                  </label>
                  <input
                    style={{ borderColor: "#667eea" }}
                    className="form-control"
                    type="tel"
                    defaultValue={emergency_number}
                    name="emergency_number"
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Email (Contact Admin For A Change)
                  </label>
                  <input
                    type="email"
                    defaultValue={email}
                    style={{ borderColor: "#667eea", cursor: "not-allowed" }}
                    disabled
                    className="form-control"
                    name="student_email"
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">Post Code</label>
                  <input
                    type="text"
                    style={{ borderColor: "#667eea" }}
                    defaultValue={post_code}
                    className="form-control"
                    name="post_code"
                    required
                  />
                </div>

                <div className="col-lg-12 col-md-6">
                  <label className="form-label fw-semibold">Home Address</label>
                  <input
                    type="text"
                    style={{ borderColor: "#667eea" }}
                    className="form-control"
                    defaultValue={address}
                    name="address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Parent Details Section */}
          <div className="col-12">
            <div
              className="rounded-4 p-4 mb-4"
              style={{ background: "#f8f9fa" }}
            >
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "linear-gradient(135deg, #f093fb, #f5576c)",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  👨‍👩‍👧‍👦
                </div>
                <div>
                  <h4 className="fw-bold mb-1 text-dark">
                    Parent/Guardian Details
                  </h4>
                  <p className="text-muted mb-0">
                    Contact information for parents
                  </p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Mother's Name
                  </label>
                  <input
                    style={{ borderColor: "#f5576c" }}
                    className="form-control"
                    type="text"
                    defaultValue={motherName}
                    name="mother_name"
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Mother's Occupation
                  </label>
                  <input
                    style={{ borderColor: "#f5576c" }}
                    className="form-control"
                    type="text"
                    defaultValue={occupation}
                    name="mother_occupation"
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Mother's Contact
                  </label>
                  <input
                    style={{ borderColor: "#f5576c" }}
                    className="form-control"
                    type="tel"
                    name="mother_number"
                    defaultValue={motherNumber}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Father's Name
                  </label>
                  <input
                    style={{ borderColor: "#f5576c" }}
                    className="form-control"
                    type="text"
                    name="father_name"
                    defaultValue={fatherName}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Father's Occupation
                  </label>
                  <input
                    style={{ borderColor: "#f5576c" }}
                    className="form-control"
                    type="text"
                    name="father_occupation"
                    defaultValue={fatherOcc}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Father's Contact
                  </label>
                  <input
                    style={{ borderColor: "#f5576c" }}
                    className="form-control"
                    type="tel"
                    name="father_number"
                    defaultValue={fatherNumber}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Health Information Section */}
          <div className="col-12">
            <div
              className="rounded-4 p-4 mb-4"
              style={{ background: "#f8f9fa" }}
            >
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  🏥
                </div>
                <div>
                  <h4 className="fw-bold mb-1 text-dark">Health Information</h4>
                  <p className="text-muted mb-0">
                    Medical details for emergency
                  </p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Doctor/Surgery Name
                  </label>
                  <input
                    style={{ borderColor: "#38f9d7" }}
                    className="form-control"
                    type="text"
                    defaultValue={doctorName}
                    name="doctor_name"
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Surgery Address
                  </label>
                  <input
                    style={{ borderColor: "#38f9d7" }}
                    className="form-control"
                    type="text"
                    name="surgery_address"
                    defaultValue={surgeryAddress}
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold">
                    Surgery Contact
                  </label>
                  <input
                    style={{ borderColor: "#38f9d7" }}
                    className="form-control"
                    type="tel"
                    defaultValue={surgeryNumber}
                    name="surgery_number"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Known Allergies
                  </label>
                  <input
                    style={{ borderColor: "#38f9d7" }}
                    className="form-control"
                    type="text"
                    defaultValue={allergies}
                    name="allergies"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Medical Conditions
                  </label>
                  <input
                    style={{ borderColor: "#38f9d7" }}
                    className="form-control"
                    type="text"
                    defaultValue={condition}
                    name="medical_condition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button
              type="submit"
              className="btn text-white fw-semibold px-5 py-3 rounded-3 border-0"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                textShadow: "0 1px 1px rgba(0,0,0,0.2)",
                fontSize: "1.1rem",
                minWidth: "200px",
              }}
            >
              Update Child Information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
