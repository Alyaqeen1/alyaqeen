import { useEffect, useState } from "react";
import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";

const TeacherComp = () => {
  return (
    <section className="contact-section">
      <div className="line-1">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="line-2 text-end">
        <img src={two} className="w-50" alt="shape-img" />
      </div>

      <div className="container">
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
                    For Teacher!
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
                    {/* email */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Email Address*</span>
                        <input
                          type="email"
                          name="email"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* phone */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Phone Number*</span>
                        <input
                          type="number"
                          name="number"
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
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Date of birth (optional)</span>
                        <input type="date" name="std_dob" />
                      </div>
                    </div>
                    {/* qualification */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Educational Qualification</span>
                        <input
                          type="text"
                          name="qualification"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* joining date */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Date of Joining (optional)</span>
                        <input type="date" name="joiningDate" />
                      </div>
                    </div>
                    {/* present address */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Present Address*</span>
                        <input
                          type="text"
                          name="present"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* permanent address*/}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Permanent Address (optional)</span>
                        <input
                          type="text"
                          name="permanent"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* marital status */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Marital Status (optional)</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
                          name="maritalStatus"
                          className="form-control"
                        >
                          <option value="">Select marital status</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                        </select>
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
                          name="gender"
                          className="form-control"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                    {/* designation */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Designation*</span>
                        <input
                          type="text"
                          name="designation"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* department */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Department*</span>
                        <input
                          type="text"
                          name="department"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* work experience */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Work Experience (optional)</span>
                        <input
                          type="text"
                          name="experience"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* photo */}
                    <div
                      className="col-lg-8"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Photo (optional)</span>
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
                        <span>Mother Name (optional)</span>
                        <input
                          type="text"
                          name="mother-name"
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
                        <span>Father Name (optional)</span>
                        <input
                          type="text"
                          name="father-name"
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
                        <span>Emergency Contact Number (optional)</span>
                        <input
                          type="number"
                          name="emergencyNumber"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>

                    {/* Bank Account Details */}
                    <div className="col-md-12 mb-2">
                      <div
                        className="rounded"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--theme) 0, var(--theme2)  100%)",
                        }}
                      >
                        <h6 className="text-white font-weight-bold rounded mb-0 text-uppercase p-2">
                          Bank Account Details
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
                        <span>Account Title (optional)</span>
                        <input
                          type="text"
                          name="accountTitle"
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
                        <span>Bank Name (optional)</span>
                        <input
                          type="text"
                          name="bankName"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* branch name */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Bank Branch Name (optional)</span>
                        <input
                          type="number"
                          name="bankBranchName"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>
                    {/* Any known medical issue */}
                    <div
                      className="col-lg-8"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Bank Account Number (optional)</span>
                        <input
                          type="number"
                          name="accountNumber"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>

                    <div
                      className="col-lg-9"
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

export default TeacherComp;
