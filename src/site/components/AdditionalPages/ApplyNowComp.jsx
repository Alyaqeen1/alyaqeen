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

const ApplyNowComp = () => {
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { createUser, setUser, updateUser, setLoading } = useAuth();

  const sigRef = useRef();

  const clearSignature = () => sigRef.current.clear();

  const saveSignature = () => {
    const signatureData = sigRef.current.toDataURL();
    console.log(signatureData); // You can send this to Firebase or backend
  };
  useEffect(() => {
    setSession("");
    setSessionTime("");
  }, [department]);
  const getClassOptions = () => {
    if (!department || !session || !sessionTime) {
      return <option value="">Select Class</option>;
    }

    if (department === "math-english") {
      if (session === "weekend" && sessionTime === "wa") {
        return <option value="adult-english">Adult English</option>;
      }
      if (session === "weekend" && sessionTime === "wm") {
        return (
          <>
            <option value="tuitionG1">Tuition G1</option>
            <option value="tuitionG2">Tuition G2</option>
          </>
        );
      }
    }

    if (department === "arabic") {
      if (session === "weekdays" && sessionTime === "s2") {
        return <option value="arabic-beginner">Arabic Beginner Group</option>;
      }
      if (session === "weekend" && sessionTime === "wa") {
        return (
          <>
            <option value="arabic-gcse">Arabic GCSE</option>
            <option value="arabic-beginner">Arabic Beginner Group</option>
          </>
        );
      }
    }
    if (department === "quran") {
      if (session === "weekdays" && sessionTime === "s1") {
        return (
          <>
            <option value="b6/7">B6/7</option>
            <option value="b3/4">B3/4</option>
            <option value="b1/2">B1/2</option>
            <option value="g2">G2</option>
            <option value="g3/4">G3/4</option>
            <option value="g6/7">G6/7</option>
          </>
        );
      }
      if (session === "weekdays" && sessionTime === "s2") {
        return (
          <>
            <option value="b8">B8</option>
            <option value="b5/6">B5/6</option>
            <option value="bg1/2">BG1/2</option>
            <option value="g3/5">G3/5</option>
            <option value="g7/8">G7/8</option>
            <option value="b7">B7</option>
          </>
        );
      }
      if (session === "weekend" && sessionTime === "wa") {
        return (
          <>
            <option value="wab3/5">WA - B3/5</option>
            <option value="wag1/2">WA - G1/2</option>
            <option value="wab7">WA - B7</option>
            <option value="wag5/7">WA - G5/7</option>
            <option value="wab1/2">WA - B1/2</option>
          </>
        );
      }
      if (session === "weekend" && sessionTime === "wm") {
        return (
          <>
            <option value="wmb1/2">WM - B1/2</option>
            <option value="wmg7/7">WM - G7/7</option>
            <option value="wmb8">WM - B8</option>
            <option value="wmb4/6">WM - B4/6</option>
            <option value="wmg2/4">WM - G2/4</option>
          </>
        );
      }
    }
    if (department === "online") {
      if (session === "weekdays" && sessionTime === "s1") {
        return (
          <>
            <option value="class1">Qaida and Quran Class 1</option>
          </>
        );
      }
      if (session === "weekdays" && sessionTime === "s2") {
        return (
          <>
            <option value="class2">Qaida and Quran Class 2</option>
          </>
        );
      }
      if (session === "weekend" && sessionTime === "wa") {
        return (
          <>
            {" "}
            <option value="class4">Qaida and Quran Class 4</option>
          </>
        );
      }
      if (session === "weekend" && sessionTime === "wm") {
        return (
          <>
            <option value="class3">Qaida and Quran Class 3</option>
          </>
        );
      }
    }

    return <option value="">Not Available</option>;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const name = form.name.value;
    const student_email = form.student_email.value;

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      return setError("Password did not match");
    }

    if (!/[A-Z]/.test(password)) {
      return setError("Must have an Uppercase letter in the password ");
    }
    if (!/[a-z]/.test(password)) {
      return setError("Must have a Lowercase letter in the password");
    }
    if (password.length < 6) {
      return setError("Password length must be at least 6 character");
    }
    createUser(student_email, password)
      .then(async (result) => {
        setUser(result.user);
        navigate("/dashboard");
        toast.success("Registration successful");
        // updateUser({ displayName: name, photoURL: image }).then(() => {});

        // const { data } = await axiosPublic.post("/users", user);

        // if (data.insertedId) {
        //   navigate("/");
        // }
      })
      .catch((error) => toast.error(error.code))
      .finally(() => setLoading(false));
    form.reset();
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
                          name="name"
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
                        <input type="date" name="std_dob" />
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
                        >
                          <option value="">Select year</option>
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
                        <span>Mother Language (optional)</span>
                        <input
                          type="text"
                          name="language"
                          id="name"
                          placeholder=""
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
                        <span>Parent/Guardian Full Name*</span>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* contact */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Contact Number*</span>
                        <input
                          type="tel"
                          name="number"
                          id="number"
                          placeholder=""
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
                        <span>Preferred Number*</span>
                        <input
                          type="tel"
                          name="number"
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
                        <span>Student Email Address*(not same as parent)</span>
                        <input
                          type="email"
                          name="student_email"
                          id="name"
                          placeholder=""
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
                          name="mother-name"
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
                          name="occupation"
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
                          type="number"
                          name="number"
                          id="name"
                          placeholder=""
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
                          name="father-name"
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
                          name="occupation"
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
                          type="number"
                          name="number"
                          id="name"
                          placeholder=""
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
                        <span>One of the parents email*</span>
                        <input
                          type="email"
                          name="parent-email"
                          id="name"
                          placeholder=""
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
                    {/* full name */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Previous Institute*</span>
                        <input
                          type="text"
                          name="previousInstitute"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* department */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Departments*</span>
                        <select
                          onChange={(e) => setDepartment(e.target.value)}
                          name="std_department_id"
                          value={department}
                          className="form-control selectDepartment"
                          style={{ backgroundColor: "var(--theme2)" }}
                        >
                          <option value="">Select department</option>
                          <option value="quran">
                            Arabic, Quran &amp; Islamic Education
                          </option>
                          <option value="math-english">
                            Maths, English &amp; Science Tuition
                          </option>
                          <option value="arabic">Arabic Language</option>
                          <option value="urdu">Urdu/Banla Language</option>
                          <option value="online">Online Learning</option>
                        </select>
                      </div>
                    </div>
                    {/* session */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Session*</span>
                        <select
                          onChange={(e) => setSession(e.target.value)}
                          name="std_type"
                          value={session}
                          className="form-control font-light selectClassType"
                          style={{ backgroundColor: "var(--theme2)" }}
                        >
                          <option value="">Select Session</option>
                          <option value="weekdays">Weekdays</option>
                          <option value="weekend">Weekend</option>
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
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Session Time*</span>
                        <select
                          name="std_time"
                          className="form-control font-light selectClassTime"
                          value={sessionTime}
                          style={{ backgroundColor: "var(--theme2)" }}
                          onChange={(e) => setSessionTime(e.target.value)}
                        >
                          <option value="">Select Session Time</option>
                          {department && session === "weekdays" ? (
                            <>
                              <option value="4:30 PM – 6:00 PM">
                                4:30 PM – 6:00 PM
                              </option>
                              <option value="5:45 PM – 7:15 PM">
                                5:45 PM – 7:15 PM
                              </option>
                            </>
                          ) : department && session === "weekend" ? (
                            <>
                              <option value="10:00 AM – 12:30 PM">
                                10:00 AM – 12:30 PM
                              </option>
                              <option value="12:30 PM – 2:30 PM">
                                12:30 PM – 2:30 PM
                              </option>
                            </>
                          ) : null}
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

                    {/* parental details */}
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
                          name="doctor-name"
                          id="name"
                          placeholder=""
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
                          name="surgery-address"
                          id="name"
                          placeholder=""
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
                          type="number"
                          name="surgery-number"
                          id="name"
                          placeholder=""
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
                        <span>Medical Conditions</span>

                        <input
                          type="text"
                          name="medicalCondition"
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
                            Save
                          </button>
                        </div>
                      </div>
                      {/* <div className="form-clt">
                        <span>Parents Signature*</span>
                        <input
                          type="text"
                          name="parent-sign"
                          id="name"
                          placeholder=""
                        />
                      </div> */}
                    </div>
                    {/* Expected Starting Date */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Expected Starting Date*</span>
                        <input type="date" name="std_dob" />
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
                        2. Monthly Fees: All tuition fees must be paid within
                        the first week of each month to ensure uninterrupted
                        attendance.
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
                      <p className="mt-2 fw-bold">
                        We are honored to be part of your child’s educational
                        journey.
                      </p>
                      <p className="fw-bold">
                        At Alyaqeen, our mission is to nurture strong Islamic
                        values, academic excellence, and a love for learning in
                        a warm and welcoming environment.
                      </p>
                      <p className="fw-bold">
                        Classes are available for boys and Girls aged 5 to 16
                        years.
                      </p>
                      <p className="mt-2">
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
                        className="theme-btn bg-white text-center"
                      >
                        Apply
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
