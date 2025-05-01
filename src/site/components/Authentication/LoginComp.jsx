import Lottie from "lottie-react";
import loginAnimation from "../../assets/animation/login.json";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import one from "../../assets/img/line-1.png";
import two from "../../assets/img/line-2.png";
import three from "../../assets/img/contact.png";
import four from "../../assets/img/circle-2.png";

const LoginComp = () => {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    // Store login status in localStorage
    localStorage.setItem("isLoggedIn", "true");

    // Redirect to dashboard
    navigate("/dashboard");
  };

  useEffect(() => {
    // Redirect if already logged in
    if (JSON.parse(localStorage.getItem("isLoggedIn")) === true) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);
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
                    className="text-white "
                    data-aos-duration="800"
                    data-aos="fade-up"
                  >
                    Login Now
                  </span>
                  <h2
                    className="text-white "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Login Here!
                  </h2>
                </div>
                <form
                  action="#"
                  id="contact-form"
                  method="POST"
                  className="contact-form-items"
                >
                  <div className="row g-4">
                    <div
                      className="col-lg-12"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="form-clt">
                        <span>Your Email*</span>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div
                      className="col-lg-12"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="form-clt">
                        <span>Password*</span>
                        <input
                          type="password"
                          name="password"
                          id="email"
                          placeholder=""
                        />
                      </div>
                    </div>

                    <div
                      className="col-lg-7 "
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      <button
                        onClick={handleLogin}
                        type="submit"
                        className="theme-btn bg-white"
                      >
                        Login
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="contact-image d-flex justify-content-center align-items-center"
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <Lottie
                  animationData={loginAnimation}
                  className=""
                  loop={true}
                />
                {/* <img src={three} alt="contact-img" /> */}
                <div className="cricle-shape ">
                  <img src={four} className="" alt="shape-img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginComp;
