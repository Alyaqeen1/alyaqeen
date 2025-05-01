import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";

const ApplyNowComp = () => {
  return (
    <section className="contact-section section-padding">
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
                    {/* subject info */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Subject Info
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
                          name="std_department_id"
                          className="form-control selectDepartment"
                          style={{ backgroundColor: "var(--theme2)" }}
                        >
                          <option value="">Select department</option>
                          <option value="15">
                            Maths, English &amp; Science Tuition
                          </option>
                          <option value="16">Arabic Language</option>
                          <option value="17">Urdu/Banla Language</option>
                          <option value="18">
                            Arabic, Quran &amp; Islamic Education
                          </option>
                          <option value="19">Online Learning</option>
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
                          name="std_type"
                          className="form-control font-light selectClassType"
                          style={{ backgroundColor: "var(--theme2)" }}
                        >
                          <option value="">Select Session</option>
                          <option value="Weekdays">Weekdays</option>
                          <option value="Weekend">Weekend</option>
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
                        >
                          <option value="">Select Session Time</option>
                        </select>
                      </div>
                    </div>
                    {/* class name */}
                    <div
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
                        >
                          <option value="">Select Class</option>
                        </select>
                        {/* <input
                          type="text"
                          name="email"
                          id="email"
                          placeholder="info@example.com"
                        /> */}
                      </div>
                    </div>
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
                        />
                      </div>
                    </div>
                    {/* gender */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Gender*</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
                          name="std_gender"
                          className="form-control"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                    {/* language */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Language*</span>
                        <input
                          type="text"
                          name="language"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* date of birth */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Date of birth*</span>
                        <input type="date" name="std_dob" />
                      </div>
                    </div>
                    {/* school year */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
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
                    {/* admission date */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Admission Date*</span>
                        <input type="date" name="std_dob" />
                      </div>
                    </div>
                    {/* address */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Address*</span>
                        <input
                          type="text"
                          name="address"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* postcode */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Postcode*</span>
                        <input
                          type="text"
                          name="postcode"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* where did you hear about us */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Where did you hear about us?*</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
                          name="admission_source"
                          className="form-control"
                        >
                          <option value="">Select hear about us?</option>
                          <option value="Google">Google</option>
                          <option value="Alyaqeen Website">
                            Alyaqeen Website
                          </option>
                          <option value="Friends &amp; Family">
                            Friends &amp; Family
                          </option>
                          <option value="Social Media">Social Media</option>
                          <option value="Leaflet Advertisement">
                            Leaflet Advertisement
                          </option>
                          <option value="Alyaqeen Academy Premises">
                            Alyaqeen Academy Premises
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    {/* photo */}
                    <div
                      className="col-lg-12 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Photo*</span>
                        <input
                          type="file"
                          name="std_photo"
                          className="form-control"
                        />
                      </div>
                    </div>
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
                          PARENTAL DETAILS
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
                    {/* emergency contact name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Emergency Contact Name*</span>
                        <input
                          type="text"
                          name="mother-name"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* relation with student */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Relation with student*</span>
                        <input
                          type="text"
                          name="mother-name"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* emergency contact number */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Emergency Contact Number:*</span>
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
                    {/* MEDICAL INFO & SIGNATURES */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          MEDICAL INFO & SIGNATURES
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
                    {/* Any known medical issue */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Any known medical issue*</span>
                        <input
                          type="text"
                          name="medical-issue"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* Any Disability */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Any Disability*</span>
                        <input
                          type="text"
                          name="any-disability"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* Any food allergy */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Any food allergy*</span>
                        <input
                          type="text"
                          name="food-allergy"
                          id="name"
                          placeholder=""
                        />
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
                        <input
                          type="text"
                          name="parent-sign"
                          id="name"
                          placeholder=""
                        />
                      </div>
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
