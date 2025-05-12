import { useEffect, useState } from "react";
import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";

const ParentComp = () => {
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
                    For Parent!
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
                          Personal Info
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
                    {/* email*/}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Email Address*</span>
                        <input
                          type="text"
                          name="name"
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

                    {/* Occupation */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Occupation (optional)</span>
                        <input type="text" name="occupation" />
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
                        <span>Address (optional)</span>
                        <input
                          type="text"
                          name="address"
                          id="name"
                          placeholder=""
                        />
                      </div>
                    </div>

                    {/* relation with the student */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Relation With the Student*</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
                          name="relationWithStd"
                          className="form-control"
                          required
                        >
                          <option value="">
                            Select relation with the student
                          </option>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="guardian">Guardian</option>
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
                        <span>Photo (optional)</span>
                        <input
                          type="file"
                          name="std_photo"
                          className="form-control"
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

export default ParentComp;
