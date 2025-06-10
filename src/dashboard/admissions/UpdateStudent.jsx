import React, { useState } from "react";
import { useGetStudentQuery } from "../../redux/features/students/studentsApi";
import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";

export default function UpdateStudent() {
  const { id } = useParams();
  const {
    data: student,
    isLoading,
    refetch,
  } = useGetStudentQuery(id, {
    skip: !id, // avoid fetching if no ID)
  });
  const axiosPublic = useAxiosPublic();
  const { user, updateUser, loading } = useAuth();
  const {
    name,
    email,
    dob,
    gender,
    school_year,
    language,
    status,
    emergency_number,

    student_age,
    family_name,
    activity,
    mother,
    father,
    academic,
    medical,
    startingDate,
    parent_email,
  } = student || {};
  const { doctorName, surgeryAddress, surgeryNumber, allergies, condition } =
    medical || {};
  const {
    name: fatherName,
    occupation: fatherOcc,
    number: fatherNumber,
  } = father || {};

  const { name: motherName, occupation, number: motherNumber } = mother || {};

  const { session, department, time, class: studentClass } = academic || {};

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    // basic info
    const student_name = form.student_name.value;
    const student_dob = form.std_dob.value;
    const student_age = form.student_age.value;
    const family_name = form.family_name.value.trim();
    const student_gender = form.std_gender.value;
    const school_year = form.school_year.value;
    const language = form.language.value;
    const emergency_number = form.emergency_number.value;
    // parent details
    const mother_name = form.mother_name.value;
    const mother_occupation = form.mother_occupation.value;
    const mother_number = form.mother_number.value;
    const father_name = form.father_name.value;
    const father_occupation = form.father_occupation.value;
    const father_number = form.father_number.value;
    const parent_email = form.parent_email.value;
    // academic details
    const std_department = form.std_department.value;
    const std_time = form.std_time.value;
    const std_session = form.std_session.value;
    // health details
    const doctor_name = form.doctor_name.value;
    const surgery_address = form.surgery_address.value;
    const surgery_number = form.surgery_number.value;
    const allergies = form.allergies.value;
    const medical_condition = form.medical_condition.value;
    const student_class = form.student_class.value;

    const studentData = {
      name: student_name,
      dob: student_dob,
      student_age,
      gender: student_gender,
      school_year: school_year,
      status: "under review",
      activity: "active",
      language,
      parent_email: parent_email,
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
        allergies: allergies,
        condition: medical_condition,
      },
    };

    const { data } = await axiosPublic.put(`/students/${id}`, studentData);
    console.log(data);
    if (data.modifiedCount) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Student updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    }
  };
  if (isLoading || loading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }
  return (
    <div>
      <h3 className={`fs-1 fw-bold text-center`}>Update Student</h3>
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
            defaultValue={dob}
            type="date"
            name="std_dob"
            required
          />
        </div>
        {/* age */}
        {student_age && (
          <div className="col-md-4">
            <label className="form-label">Age</label>
            <select
              style={{ borderColor: "var(--border2)" }}
              name="student_age"
              defaultValue={student_age}
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
        )}

        {/* gender */}
        {gender && (
          <div className="col-md-4">
            <label className="form-label">Gender</label>
            <select
              style={{ borderColor: "var(--border2)" }}
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
        )}

        {/* school year */}
        {school_year && (
          <div className="col-md-4">
            <label className="form-label">School Year</label>
            <select
              style={{ borderColor: "var(--border2)" }}
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
            required
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
            defaultValue={emergency_number}
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
            defaultValue={email}
            style={{ borderColor: "var(--border2)", cursor: "not-allowed" }}
            disabled
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
            defaultValue={fatherName}
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
            defaultValue={fatherOcc}
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
            defaultValue={fatherNumber}
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
            defaultValue={parent_email}
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
        {department && (
          <div className="col-md-6">
            <label className="form-label">Departments</label>
            <select
              name="std_department"
              style={{ borderColor: "var(--border2)" }}
              className="form-control bg-light"
              defaultValue={department}
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
        )}

        {/* session */}
        {session && (
          <div className="col-md-6">
            <label className="form-label">Session</label>
            <select
              name="std_session"
              style={{ borderColor: "var(--border2)" }}
              className="form-control bg-light"
              required
              defaultValue={session}
            >
              <option value="">Select Session</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekend">Weekend</option>
            </select>
          </div>
        )}

        {/* time */}
        {time && (
          <div className="col-md-6">
            <label className="form-label">Session Time</label>
            <select
              name="std_time"
              style={{ borderColor: "var(--border2)" }}
              className="form-control bg-light"
              required
              defaultValue={time}
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
        )}

        {/* class */}
        <div className="col-md-6">
          <label className="form-label">Class</label>
          <input
            style={{ borderColor: "var(--border2)" }}
            className="form-control bg-light"
            type="text"
            defaultValue={studentClass === null ? "Not Provided" : studentClass}
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
            defaultValue={doctorName}
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
            defaultValue={surgeryAddress}
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
            defaultValue={surgeryNumber}
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
            defaultValue={allergies}
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
            defaultValue={condition}
            name="medical_condition"
            id="name"
            placeholder=""
            required
          />
        </div>

        {/* Submit Button */}
        <div className="col-12 text-center py-3">
          <button
            type="submit"
            style={{ backgroundColor: "var(--border2)" }}
            className="btn text-white"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
