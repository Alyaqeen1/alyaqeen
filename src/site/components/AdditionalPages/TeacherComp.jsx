import { useEffect, useState } from "react";
import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useAddTeacherMutation } from "../../../redux/features/teachers/teachersApi";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const TeacherComp = () => {
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [addTeacher] = useAddTeacherMutation();
  const { createUser, setUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.full_name.value;
    const email = form.email.value;
    const number = form.number.value;
    const dob = form.dob.value;
    const qualification = form.qualification.value;
    const present_address = form.present_address.value;
    const permanent_address = form.permanent_address.value;
    const marital_status = form.marital_status.value;
    const gender = form.gender.value;
    const department = form.department.value;
    const experience = form.experience.value;
    const designation = form.designation.value;
    const teacher_photo = form.teacher_photo.files[0];
    const mother_name = form.mother_name.value;
    const father_name = form.father_name.value;
    const emergency_number = form.emergency_number.value;
    const account_title = form.account_title.value;
    const bank_name = form.bank_name.value;
    const bank_branch_name = form.bank_branch_name.value;
    const account_number = form.account_number.value;
    const password = form.password.value;
    const confirm_password = form.confirm_password.value;

    const teacherData = {
      name,
      email,
      number,
      dob,
      qualification,
      present_address,
      permanent_address,
      marital_status,
      gender,
      department,
      experience,
      designation,
      // teacher_photo,
      mother_name,
      father_name,
      emergency_number,
      account_title,
      bank_name,
      bank_branch_name,
      account_number,
    };
    // Password Validation
    if (password !== confirm_password) {
      return setError("Passwords do not match");
    }
    if (!/[A-Z]/.test(password)) {
      return setError("Must include an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      return setError("Must include a lowercase letter");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      // Create user with email and password
      const res = await createUser(email, password);
      setUser(res?.user);
      await updateUser({ displayName: name });
      const userData = {
        uid: res?.user?.uid,
        name,
        email,
        role: "teacher",
        createdAt: new Date(),
      };
      if (res?.user) {
        const data = await addTeacher(teacherData).unwrap();
        await axiosPublic.post("/users", userData);
        if (data.insertedId) {
          toast.success("Teacher registration successful!");
          form.reset();
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
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
                  onSubmit={handleSubmit}
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
                          name="full_name"
                          id="name"
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
                          type="tel"
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
                        <input type="date" name="dob" />
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
                        <input type="date" name="joining_date" />
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
                          name="present_address"
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
                          name="permanent_address"
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
                          name="marital_status"
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
                          name="teacher_photo"
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
                          name="mother_name"
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
                          name="father_name"
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
                          type="tel"
                          name="emergency_number"
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
                          name="account_title"
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
                          name="bank_name"
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
                          name="bank_branch_name"
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
                          name="account_number"
                          id="name"
                          placeholder=""
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
                            name="confirm_password"
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
