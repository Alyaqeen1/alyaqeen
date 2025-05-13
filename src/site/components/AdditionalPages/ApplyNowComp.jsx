import { useEffect, useRef, useState } from "react";
import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";
import SignatureCanvas from "react-signature-canvas";

const ApplyNowComp = () => {
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [sessionTime, setSessionTime] = useState("");
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
                    {/* parent/guardian name */}
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
                    {/* email */}
                    <div
                      className="col-lg-8 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>
                          Student Email Address*(Should not be the same as
                          parent)
                        </span>
                        <input
                          type="email"
                          name="email"
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
                              <option value="s1">S1</option>
                              <option value="s2">S2</option>
                            </>
                          ) : department && session === "weekend" ? (
                            <>
                              <option value="wm">WM</option>
                              <option value="wa">WA</option>
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
                    {/* Known Allergies */}
                    <div
                      className="col-lg-6 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Known Allergies (Optional)</span>

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
                        <span>Medical Conditions (Optional)</span>

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
                    {/* password */}
                    <div
                      className="col-lg-6"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Password*</span>
                        <input type="password" placeholder="" required />
                      </div>
                    </div>
                    {/* confirm password */}
                    <div
                      className="col-lg-6"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Confirm Password*</span>
                        <input type="password" placeholder="" required />
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
                            className: "border rounded w-100",
                          }}
                          ref={sigRef}
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={clearSignature}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={saveSignature}
                            className="px-2 py-1 bg-blue-500 text-white rounded"
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
                        Some important points for your consideration:
                      </h5>
                      <p>
                        1. A one off admission fee of £20 for each course is to
                        be paid before starting.
                      </p>
                      <p>2. Fees MUST be paid by the 1st week of each month.</p>
                      <p>
                        3. Alyaqeen Academy will not accept responsibility for
                        students 10 minutes after home time nor for students who
                        arrive 10 minutes before their scheduled time.
                      </p>
                      <p>
                        4. We do not recommend any DRESS CODE currently, but we
                        recommend that the students avoid brand clothes.
                      </p>
                      <p>
                        5. At the end of each term, the Academy will inform the
                        parents about the child’s progress in the form of a
                        report.
                      </p>
                      <p className="mt-2 fw-bold">Male and female teachers</p>
                      <p className="fw-bold">
                        Enjoyable and beneficial environment
                      </p>
                      <p className="fw-bold">
                        Classes are available for boys and Girls aged 5 to 16
                        years.
                      </p>
                      <p className="mt-2">
                        If you wish to enroll your child at the Academy, Please
                        fill the admission form, which can be collected from the
                        office or downloaded from the website.
                      </p>
                      <p>
                        For more information kindly visit our website or contact{" "}
                        <br />
                        116-118 Church Road Yew Tree Lane Yardley Birmingham B25
                        8UX
                      </p>
                      <div>
                        <p></p>
                      </div>
                    </div>

                    <div
                      className="col-lg-7 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="900"
                    >
                      <button type="submit" className="theme-btn bg-white">
                        Apply
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </button>
                    </div>
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
