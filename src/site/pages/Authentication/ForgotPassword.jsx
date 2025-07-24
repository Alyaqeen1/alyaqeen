import Lottie from "lottie-react";
import loginAnimation from "../../assets/animation/login.json";
import { Link } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";
import four from "../../assets/img/circle-2.png";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      await resetPassword(email);
      toast.success("Password reset email sent. Check your inbox.");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reset email.");
    }
  };

  return (
    <section className="contact-section py-5">
      <div className="line-1">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="line-2 text-end">
        <img src={two} className="w-50" alt="shape-img" />
      </div>
      <div className="container">
        <div className="contact-wrapper py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="contact-content">
                <div className="section-title">
                  <span
                    className="text-white"
                    data-aos-duration="800"
                    data-aos="fade-up"
                  >
                    Reset Password
                  </span>
                  <h2
                    className="text-white"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Forgot Your Password?
                  </h2>
                </div>
                <form
                  onSubmit={handleReset}
                  id="contact-form"
                  method="POST"
                  className="contact-form-items"
                >
                  <div className="row g-4">
                    {/* Email Field */}
                    <div
                      className="col-lg-12"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Your Email*</span>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div
                      className="col-lg-7"
                      data-aos-duration="800"
                      data-aos="fade-up"
                    >
                      <button type="submit" className="theme-btn bg-white">
                        Send Reset Link
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </button>
                    </div>

                    {/* Optional Link */}
                    <p className="text-white">
                      Remembered your password?{" "}
                      <Link
                        style={{ color: "var(--theme)" }}
                        className="font-bolder"
                        to="/login"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right side animation */}
            <div className="col-lg-6">
              <div
                className="contact-image d-flex justify-content-center align-items-center"
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <Lottie animationData={loginAnimation} loop={true} />
                <div className="cricle-shape">
                  <img src={four} alt="shape-img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
