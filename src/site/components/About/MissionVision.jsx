import one from "../../assets/img/about/line-shape.png";
import two from "../../assets/img/about/frame.png";
import three from "../../assets/img/about/border-shape.png";
import four from "../../assets/img/about/mission-vision.png";
import five from "../../assets/img/about/icon-7.svg";
import six from "../../assets/img/about/icon-8.svg";
import seven from "../../assets/img/team/team01.jpeg";
import { Link } from "react-router";

const MissionVision = () => {
  return (
    <section className="about-section-2 fix section-padding" id="about">
      <div className="left-shape">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="frame-shape text-end">
        <img src={two} className="w-50" alt="shape-img" />
      </div>
      <div className="container">
        <div className="about-wrapper-2">
          <div className="row g-4">
            <div
              className="col-lg-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="about-image-items">
                <div className="border-shape ">
                  <img
                    src={three}
                    className=""
                    style={{ width: "365px" }}
                    alt="shape-img"
                  />
                </div>
                <div className="thumb">
                  <img src={four} alt="about-img" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    Mission & Vision
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Welcome to the best Platform for your child
                  </h2>
                </div>
                <p
                  className="mt-3 mt-md-0 "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  Our mission is to use modern, Shariah-compliant methods to
                  benefit the Ummah, fostering growth and moral development,
                  with a vision to leave a lasting legacy by pleasing Allah and
                  serving others.
                </p>
                <div className="row g-4 mt-4">
                  <div
                    className="col-xl-6 col-lg-8 col-md-6 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="icon-items">
                      <div className="icon">
                        <img src={five} alt="img" />
                      </div>
                      <div className="content">
                        <h5>Our Mission</h5>
                        <p>
                          Affordable education, <br /> moral development.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xl-6 col-lg-8 col-md-6 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <div className="icon-items">
                      <div className="icon">
                        <img src={six} alt="img" />
                      </div>
                      <div className="content">
                        <h5>Our Vision</h5>
                        <p>
                          Serving Ummah with <br /> Shariah-based methods.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about-author">
                  <div
                    className="author-image "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <img
                      src={seven}
                      className="rounded-circle object-fit-cover"
                      style={{ width: "60px", height: "60px" }}
                      alt="author-img"
                    />
                    <div className="content">
                      <h6>Mohammad Khalid</h6>
                      <p>Managing Director & Headteacher</p>
                    </div>
                  </div>
                  <div
                    className="author-icon "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <div className="icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="content">
                      <span>Call Us Now</span>
                      <h5>
                        <Link to="tel:+07869636849">+07869636849</Link>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
