import { useEffect, useState } from "react";
import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useAddTeacherMutation } from "../../../redux/features/teachers/teachersApi";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import uploadToCloudinary from "../../../utils/uploadToCloudinary";

const TeacherComp = () => {
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState(""); // Add this with other useState hooks
  const [cvUrl, setCvUrl] = useState("");
  const [dbsUrl, setDbsUrl] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const [addTeacher] = useAddTeacherMutation();
  const { createUser, setUser, updateUser, loading } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (example for PDFs)
    if (type === "cv" && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error("Please upload a PDF or Word file!");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "teachers");
      if (type === "photo") setPhotoUrl(url);
      else if (type === "cv") setCvUrl(url);
      else if (type === "dbs") setDbsUrl(url);
      else if (type === "certificate") setCertificateUrl(url);
      toast.success(`${type.toUpperCase()} uploaded!`);
    } catch (err) {
      toast.error("Upload failed!");
      console.error(err);
    } finally {
      setUploading(false);
      setLocalLoading(false); // Reset local loading state after upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.full_name.value;
    const email = form.email.value.toLowerCase().trim();
    const number = form.number.value;
    const dob = form.dob.value;
    const joining_date = form.joining_date.value;
    const qualification = form.qualification.value;
    const address = form.address.value;
    const post_code = form.post_code.value;
    const marital_status = form.marital_status.value;
    const gender = form.gender.value;
    const department = form.department.value;
    const experience = form.experience.value;
    const designation = form.designation.value;
    const emergency_number = form.emergency_number.value;
    const account_holder_name = form.account_holder_name.value;
    const bank_account_number = form.bank_account_number.value;
    const sord_code = form.sord_code.value;
    const password = form.password.value;
    const confirm_password = form.confirm_password.value;

    const teacherData = {
      name,
      email,
      number,
      dob,
      joining_date,
      qualification,
      address,
      post_code,
      marital_status,
      gender,
      department,
      experience,
      designation,
      status: "pending",
      activity: "active",
      teacher_photo: photoUrl,
      dbs_crb: dbsUrl,
      cv: cvUrl,
      highest_degree_certificate: certificateUrl,
      sord_code,
      emergency_number,
      account_holder_name,
      bank_account_number,
      dept_ids: [],
      class_ids: [],
      subject_ids: [],
      createdAt: new Date(),
    };

    if (localLoading) return; // Extra guard
    setLocalLoading(true); // ⬅️ Block double click

    // if (!photoUrl || !cvUrl || !dbsUrl || !certificateUrl) {
    //   setLocalLoading(false); // Reset loading state if files are missing
    //   return setError("Please wait until all files are uploaded.");
    // }

    // Password Validation
    if (password !== confirm_password) {
      setLocalLoading(false); // Reset loading state if passwords do not match
      return setError("Passwords do not match");
    }
    if (!/[A-Z]/.test(password)) {
      setLocalLoading(false); // Reset loading state if password does not meet criteria
      return setError("Must include an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      setLocalLoading(false); // Reset loading state if password does not meet criteria
      return setError("Must include a lowercase letter");
    }
    if (password.length < 6) {
      setLocalLoading(false); // Reset loading state if password does not meet criteria
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
      setLocalLoading(false);
      return toast.error(error?.message);
    } finally {
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
                        <input type="tel" name="number" required />
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
                        <input type="date" name="dob" required />
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
                        <span>Educational Qualification*</span>
                        <input type="text" name="qualification" required />
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
                        <span>Date of Joining*</span>
                        <input type="date" name="joining_date" required />
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
                        <input type="text" name="address" required />
                      </div>
                    </div>
                    {/* post code*/}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Post Code*</span>
                        <input type="text" name="post_code" required />
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
                        <span>Marital Status*</span>
                        <select
                          style={{ backgroundColor: "var(--theme2)" }}
                          name="marital_status"
                          required
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
                        <input type="text" name="designation" required />
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
                        <select
                          // onChange={(e) => setDepartment(e.target.value)}
                          name="department"
                          // value={department}
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
                        {/* <input type="text" name="department" required /> */}
                      </div>
                    </div>
                    {/* work experience */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Work Experience*</span>
                        <input type="text" name="experience" required />
                      </div>
                    </div>
                    {/* emergency contact number */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Emergency Contact Number*</span>
                        <input
                          type="tel"
                          name="emergency_number"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* photo */}
                    <div
                      className="col-lg-4"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Photo*</span>
                        <input
                          type="file"
                          name="teacher_photo"
                          accept="image/*"
                          disabled={uploading} // Disable during upload
                          onChange={(e) => handleFileChange(e, "photo")}
                          className="form-control"
                        />
                      </div>
                    </div>
                    {/* dbs crb */}
                    <div
                      className="col-lg-4"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>DBS(CRB)*</span>
                        <input
                          type="file"
                          name="dbs_crb"
                          // accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, "dbs")}
                          disabled={uploading} // Disable during upload
                          className="form-control"
                        />
                      </div>
                    </div>
                    {/* cv */}
                    <div
                      className="col-lg-4"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>CV*</span>
                        <input
                          type="file"
                          name="cv"
                          // accept=".pdf,.doc,.docx"
                          disabled={uploading} // Disable during upload
                          onChange={(e) => handleFileChange(e, "cv")}
                          className="form-control"
                        />
                      </div>
                    </div>
                    {/* highest degree certificate */}
                    <div
                      className="col-lg-4"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Highest Degree Certificate*</span>
                        <input
                          type="file"
                          name="highest_degree_certificate"
                          // accept=".pdf,.doc,.docx"
                          disabled={uploading} // Disable during upload
                          onChange={(e) => handleFileChange(e, "certificate")}
                          className="form-control"
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
                        <span>Account Holder Name*</span>
                        <input
                          type="text"
                          name="account_holder_name"
                          id="name"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* bank account number */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Bank Account Number*</span>
                        <input
                          type="text"
                          name="bank_account_number"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                    {/* sord code */}
                    <div
                      className="col-lg-4 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="700"
                    >
                      <div className="form-clt">
                        <span>Sord Code*</span>
                        <input
                          type="text"
                          name="sord_code"
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

export default TeacherComp;
