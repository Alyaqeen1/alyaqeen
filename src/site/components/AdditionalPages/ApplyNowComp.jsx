import { useEffect, useRef, useState } from "react";
import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";
import SignatureCanvas from "react-signature-canvas";
import { FaEarthAfrica, FaEye, FaEyeSlash } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const image_hosting_key = import.meta.env.VITE_Image_Hosting_Key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const ApplyNowComp = () => {
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  const axiosPublic = useAxiosPublic();

  const { createUser, setUser, updateUser, signInUser, setLoading } = useAuth();

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

  useEffect(() => {
    setSession("");
    setSessionTime("");
  }, [department]);
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (localLoading) return; // Extra guard

    setLocalLoading(true); // ⬅️ Block double click
    const form = e.target;

    // Extract form values
    const student_name = form.student_name.value;
    const student_email = form.student_email.value;
    const student_dob = form.std_dob.value;
    const student_age = form.student_age.value;
    const family_name = form.family_name.value.trim();
    const student_gender = form.std_gender.value;
    const school_year = form.school_year.value;
    const language = form.language.value;
    const emergency_number = form.emergency_number.value;

    const mother_name = form.mother_name.value;
    const mother_occupation = form.mother_occupation.value;
    const mother_number = form.mother_number.value;
    const father_name = form.father_name.value;
    const father_occupation = form.father_occupation.value;
    const father_number = form.father_number.value;
    const parent_email = form.parent_email.value;

    const std_department = form.std_department.value;
    const std_time = form.std_time.value;
    const std_session = form.std_session.value;

    const doctor_name = form.doctor_name.value;
    const surgery_address = form.surgery_address.value;
    const surgery_number = form.surgery_number.value;
    const allergies = form.allergies.value;
    const medical_condition = form.medical_condition.value;
    const starting_date = form.starting_date.value;

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const student_class = null;

    const today = new Date().setHours(0, 0, 0, 0); // current date at midnight
    const selectedDate = new Date(starting_date).setHours(0, 0, 0, 0); // user date at midnight

    if (selectedDate < today) {
      setLocalLoading(false); // ✅ Unblock double click
      setLoading(false);
      return setError("Starting date cannot be in the past");
    }
    // Password Validation
    if (password !== confirmPassword) {
      setLocalLoading(false); // ✅ Unblock double click
      setLoading(false);
      return setError("Passwords do not match");
    }
    if (!/[A-Z]/.test(password)) {
      setLocalLoading(false); // ✅ Unblock double click
      setLoading(false);
      return setError("Must include an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      setLocalLoading(false); // ✅ Unblock double click
      setLoading(false);
      return setError("Must include a lowercase letter");
    }
    if (password.length < 6) {
      setLocalLoading(false); // ✅ Unblock double click
      setLoading(false);
      return setError("Password must be at least 6 characters");
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
      const studentUid = crypto.randomUUID(); // ✅ Generate student UID early
      let parentUid;

      if (existingParent) {
        try {
          // ✅ Attempt to sign in using Firebase client SDK
          await signInUser(student_email, password); // from useAuth
          parentUid = existingParent.uid;
        } catch (err) {
          // ❌ Invalid password
          setLoading(false);
          setLocalLoading(false);
          return toast.error(
            "Incorrect email/password for existing family account"
          );
        }
      } else {
        // 🔧 Create new Firebase user for parent
        const parentRes = await createUser(student_email, password);
        const currentUser = parentRes.user;

        await updateUser({ displayName: family_name }); // optional but good for clarity
        setUser(currentUser);

        parentUid = currentUser.uid;

        const newFamily = {
          uid: parentUid,
          name: family_name,
          familyId: `${family_name}-${student_email}`,
          email: student_email,
          feeChoice: null,
          phone: father_number,
          fatherName: father_name,
          children: [studentUid],
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
        signature,
        createdAt: new Date(),
      };

      const notification = {
        type: "admission",
        message: `${student_name} has joined.`,
        isRead: false,
        createdAt: new Date(),
        link: "/dashboard/online-admissions",
      };

      // ✅ 3. Save student and notify
      await axiosPublic.post("/students", studentData);
      await axiosPublic.post("/notifications", notification);

      // ✅ 4. If parent existed, patch to add student UID
      if (existingParent) {
        await axiosPublic.patch(`/families/${student_email}/add-child`, {
          studentUid,
        });
      }

      toast.success("Registration successful");
      navigate("/dashboard");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="line-1">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="line-2 text-end">
        <img src={two} className="w-50" alt="shape-img" />
      </div>

      <div className="container">
        <div className="text-right mb-3">
          <a
            href="/file/Arabic Quran Application Form.docx"
            className="theme-btn"
            style={{
              marginRight: "10px",
            }}
          >
            Download Form In Word File
          </a>
          <a
            href="/file/Tuition Admission Form Updated.pdf"
            download
            className="theme-btn"
          >
            Download Form In PDF File
          </a>
        </div>
        <div className="contact-wrapper">
          <div className="row">
            <div className="col-lg-12">
              <div className="contact-content">
                <div className="section-title">
                  <p
                    className="text-white text-center fs-4 mb-1"
                    data-aos-duration="800"
                    data-aos="fade-up"
                  >
                    Alyaqeen Academy
                  </p>
                  <p className="text-white text-center">
                    116 - 118 Church Road, Yardley Birmingham, B25 8UX :
                    +07869636849
                  </p>
                  <p className="text-white text-center">Registration Form</p>
                  <h2
                    className="text-white "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Apply Now!
                  </h2>
                </div>

                <form
                  onSubmit={handleRegister}
                  action="#"
                  id="contact-form"
                  method="POST"
                  className="contact-form-items"
                >
                  <div className="row g-4">
                    {/* basic info */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Basic Info
                        </h6>
                      </div>
                    </div>
                    {/* full name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Full Name*</span>
                        <input
                          type="text"
                          name="student_name"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* date of birth */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Date of birth*</span>
                        <input type="date" name="std_dob" required />
                      </div>
                    </div>
                    {/* school year */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Age*</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
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
                    </div>
                    {/* gender */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Gender*</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
                          name="std_gender"
                          className="form-control"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                    {/* school year */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>School Year*</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
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
                          <option value="A level 1st Year">
                            A level 1st Year
                          </option>
                          <option value="A level 2nd Year">
                            A level 2nd Year
                          </option>
                          <option value="University">University</option>
                        </select>
                      </div>
                    </div>
                    {/* language */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Mother Language*</span>
                        <input
                          type="text"
                          name="language"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* parent/guardian name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Family Name (used to group your family)*</span>
                        <input
                          type="text"
                          name="family_name"
                          placeholder="e.g. Rahman / Khan"
                          id="name"
                          required
                        />
                      </div>
                    </div>

                    {/* contact */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Preferred Contact Number*</span>
                        <input
                          type="tel"
                          name="emergency_number"
                          id="number"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* email */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>
                          Preferred Email*(Where You Will get Updates)
                        </span>
                        <input
                          type="email"
                          name="student_email"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    {/* parent or guardian details */}

                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Parent/Guardian Details
                        </h6>
                      </div>
                    </div>
                    {/* mothers name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Mother Name*</span>
                        <input
                          type="text"
                          name="mother_name"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* Occupation */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Occupation:*</span>
                        <input
                          type="text"
                          name="mother_occupation"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* contact number */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Contact Number:*</span>
                        <input
                          type="tel"
                          name="mother_number"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* fathers name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Father Name*</span>
                        <input
                          type="text"
                          name="father_name"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* Occupation */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Occupation:*</span>
                        <input
                          type="text"
                          name="father_occupation"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* contact number */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Contact Number:*</span>
                        <input
                          type="tel"
                          name="father_number"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    {/* parent email */}
                    <div
                      className="col-lg-12 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>One of the other parents email*</span>
                        <input
                          // style={{ backgroundColor: "var(--theme2)" }}
                          type="email"
                          name="parent_email"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    {/* Academic Details */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Academic Details
                        </h6>
                      </div>
                    </div>

                    {/* department */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Departments*</span>
                        <select
                          onChange={(e) => setDepartment(e.target.value)}
                          name="std_department"
                          value={department}
                          className="form-control selectDepartment"
                          style={{ backgroundColor: "var(--theme2)" }}
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
                          <option value="Hifz Memorisation">
                            Hifz Memorisation
                          </option>
                          <option value="Arabic Language">
                            Arabic Language
                          </option>
                        </select>
                      </div>
                    </div>
                    {/* session */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Session*</span>
                        <select
                          onChange={(e) => setSession(e.target.value)}
                          name="std_session"
                          value={session}
                          className="form-control font-light selectClassType"
                          style={{ backgroundColor: "var(--theme2)" }}
                          required
                        >
                          <option value="">Select Session</option>
                          <option value="weekdays">Weekdays</option>
                          <option value="weekends">Weekends</option>
                        </select>
                        {/* <input
                          type="text"
                          name="email"
                          id="email"
                          placeholder="info@example.com"
                        /> */}
                      </div>
                    </div>
                    {/* session timing */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Session Time*</span>
                        <select
                          name="std_time"
                          className="form-control font-light selectClassTime"
                          value={sessionTime}
                          style={{ backgroundColor: "var(--theme2)" }}
                          onChange={(e) => setSessionTime(e.target.value)}
                          required
                        >
                          <option value="">Select Session Time</option>
                          {department && session === "weekdays" ? (
                            <>
                              <option value="Early - 4:30 PM – 6:00 PM (1½ hrs)">
                                Early - 4:30 PM – 6:00 PM (1½ hrs)
                              </option>
                              <option value="Late - 5:45 PM – 7:15 PM (1½ hrs)">
                                Late - 5:45 PM – 7:15 PM (1½ hrs)
                              </option>
                            </>
                          ) : department && session === "weekends" ? (
                            <>
                              <option value="Morning - 10:00 AM – 12:30 PM (1½ hrs)">
                                Morning - 10:00 AM – 12:30 PM (1½ hrs)
                              </option>
                              <option value="Afternoon - 12:30 PM – 2:30 PM (1½ hrs)">
                                Afternoon - 12:30 PM – 2:30 PM (1½ hrs)
                              </option>
                            </>
                          ) : null}
                        </select>
                      </div>
                    </div>
                    {/* class */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Class*</span>
                        <select
                          disabled
                          style={{
                            backgroundColor: "var(--theme2)",
                            cursor: "not-allowed",
                          }}
                          name="student_class"
                          className="form-control"
                        >
                          <option value="">
                            Class will be selected by Admin
                          </option>
                        </select>
                      </div>
                    </div>
                    {/* class name */}
                    {/* <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Class Name*</span>
                        <select
                          name="std_class_id"
                          className="form-control selectClass"
                          style={{ backgroundColor: "var(--theme2)" }}
                        >
                          <option value="">Select Class</option>
                          {getClassOptions()}
                        </select>
                     
                      </div>
                    </div> */}

                    {/* health details */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Health Information
                        </h6>
                      </div>
                    </div>
                    {/* doctor name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Surgery/Doctor name*</span>
                        <input
                          type="text"
                          name="doctor_name"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* Surgery address */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Surgery address*</span>
                        <input
                          type="text"
                          name="surgery_address"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* Surgery contact */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Surgery contact*</span>
                        <input
                          type="tel"
                          name="surgery_number"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>

                    {/* Known Allergies */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Known Allergies</span>

                        <input
                          type="text"
                          name="allergies"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* Medical Conditions */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Any Other Medical Conditions</span>

                        <input
                          type="text"
                          name="medical_condition"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* credentials */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Credentials
                        </h6>
                      </div>
                    </div>

                    {/* password */}
                    <div
                      className="col-lg-6"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="">
                        <p
                          className="text-white"
                          style={{ marginBottom: "20px" }}
                        >
                          Password*
                        </p>
                        <div
                          className="input-group border"
                          style={{ padding: "14px 10px" }}
                        >
                          <input
                            name="password"
                            type={show ? "text" : "password"}
                            className="form-control border-0 text-white"
                            style={{
                              backgroundColor: "var(--theme2)",
                            }}
                            required
                          />
                          <button
                            onClick={() => setShow(!show)}
                            type="button"
                            className="text-white"
                          >
                            {show ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* confirm password */}
                    <div
                      className="col-lg-6"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="">
                        <p
                          className="text-white"
                          style={{ marginBottom: "20px" }}
                        >
                          Confirm Password*
                        </p>
                        <div
                          className="input-group border"
                          style={{ padding: "14px 10px" }}
                        >
                          <input
                            type={confirmShow ? "text" : "password"}
                            className="form-control border-0 text-white"
                            name="confirmPassword"
                            style={{
                              backgroundColor: "var(--theme2)",
                            }}
                            required
                          />
                          <button
                            onClick={() => setConfirmShow(!confirmShow)}
                            type="button"
                            className="text-white"
                          >
                            {confirmShow ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 mb-2">
                      <div className="d-flex align-items-center">
                        <hr className="w-100 my-0 text-white" />
                        <span
                          className="mx-2 px-2 py-1 rounded text-white"
                          // style="background: linear-gradient(5deg, #B79879 100%, #FFFDDF  100%);"

                          style={{
                            background:
                              "linear-gradient(180deg, var(--theme) 60%, var(--theme2)  100%)",
                          }}
                        >
                          SIGNATURES
                        </span>
                        <hr className="w-100 my-0 text-white" />
                      </div>
                    </div>
                    {/* Parents Signature */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Parents Signature*</span>
                        <SignatureCanvas
                          penColor="black"
                          canvasProps={{
                            // width: 550,
                            height: 150,
                            className: "border w-100",
                          }}
                          ref={sigRef}
                        />
                        <div className="mt-2 d-flex gap-2">
                          <button
                            type="button"
                            onClick={clearSignature}
                            className="theme-btn px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={saveSignature}
                            className="theme-btn px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Save & Submit
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Expected Starting Date */}
                    <div
                      className="col-lg-6 mt-5"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Expected Starting Date*</span>
                        <input type="date" name="starting_date" required />
                      </div>
                    </div>

                    <div className="text-white">
                      <h5 className="text-white">
                        Important Guidelines for Parents & Guardians::
                      </h5>
                      <p>
                        1. Admission Fee: A one-time, non-refundable fee of £20
                        per course is required before the start of classes.
                      </p>
                      <p>
                        2. Monthly Fees Policy: Parents have two options for
                        paying tuition fees based on the admission date:
                        <p className="ms-4">
                          a.{" "}
                          <strong>
                            Admission After the 10th of the Month:
                          </strong>{" "}
                          Pay a pro-rated fee (such as 1/3 or 2/3 of the monthly
                          fee) for the remaining days of the current month, and
                          Begin regular full-month payments starting from the
                          first week of the next month.
                          <br />
                          b. <strong>Full-Month Enrollment:</strong>{" "}
                          Alternatively, if parents prefer the student to be
                          considered enrolled for the entire current month, the
                          full monthly fee must be paid within 7 days of
                          admission (e.g., admitted on the 10th → pay by the
                          17th).
                        </p>
                      </p>
                      <p>
                        3. Student Supervision: The Academy is only responsible
                        for supervising students up to 10 minutes before and
                        after their class time. Please ensure timely drop-off
                        and pick-up.
                      </p>
                      <p>
                        4. Dress Code: While there is no strict uniform, we
                        kindly encourage modest and simple attire. Branded or
                        fashion-label clothing is discouraged to help maintain a
                        focused Islamic learning environment.
                      </p>
                      <p>
                        5. Progress Reports: Parents will receive a performance
                        report at the end of each term, highlighting their
                        child’s academic progress and personal development.
                      </p>
                      <p className="mt-3 fw-bold fs-5">
                        We are honored to be part of your child’s educational
                        journey.
                      </p>
                      <p className="fw-bold fs-5">
                        At Alyaqeen, our mission is to nurture strong Islamic
                        values, academic excellence, and a love for learning in
                        a warm and welcoming environment.
                      </p>
                      <p className="fw-bold fs-5">
                        Classes are available for boys and Girls aged 5 to 16
                        years.
                      </p>
                      <p className="mt-3">
                        To register your child, please fill out the admission
                        form, available at our office or downloadable via our
                        website.
                      </p>
                      <p className="my-2">
                        Jazakum Allahu Khayran – May Allah bless your efforts
                        and grant your child success.
                      </p>
                      <p>
                        For more information kindly visit our website or
                        contact.
                        <br />
                        116-118 Church Road Yew Tree Lane Yardley Birmingham B25
                        8UX
                      </p>
                      <div className="d-flex gap-4 align-items-center flex-wrap text-white mt-3">
                        <Link
                          className="text-white d-flex gap-2 align-items-center"
                          to={"https://alyaqeen.vercel.app/"}
                        >
                          <FaEarthAfrica />
                          www.alyaqeen.co.uk
                        </Link>
                        <span>|</span>
                        <Link
                          className="text-white d-flex gap-2 align-items-center"
                          to="mailto:kidsa@gmail.com"
                        >
                          <FaEnvelope />
                          contact@alyaqeen.co.uk
                        </Link>
                        <span>|</span>
                        <Link
                          className="text-white d-flex gap-2 align-items-center"
                          to="tel:+07869636849"
                        >
                          <FaPhoneAlt />
                          07869636849
                        </Link>
                      </div>
                    </div>
                    {error && (
                      <p className="text-danger text-center col-span-2">
                        {error}
                      </p>
                    )}

                    <div
                      className="col-lg-12 d-flex justify-content-center"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      // data-aos-delay="900"
                    >
                      <button
                        type="submit"
                        disabled={localLoading}
                        className="theme-btn bg-white text-center"
                      >
                        {localLoading ? "Submitting..." : "Submit"}
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </button>
                    </div>
                    <p className="text-center text-white">
                      Already have an account? Please{" "}
                      <Link
                        style={{ color: "var(--theme)" }}
                        className=" font-bolder"
                        to="/login"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplyNowComp;
