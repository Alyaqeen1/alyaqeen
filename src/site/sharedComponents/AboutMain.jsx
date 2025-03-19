import one from "../assets/img/about/zebra.png";
import two from "../assets/img/section-top-shape-2.png";
import three from "../assets/img/client/shape-2.png";
import four from "../assets/img/about/04.png";
import five from "../assets/img/about/radius-shape.png";
import six from "../assets/img/about/circle.png";
import eight from "../assets/img/about/icon-5.svg";
import nine from "../assets/img/about/icon-6.svg";
import ten from "../assets/img/about/author.png";
import { Link } from "react-router";

const AboutMain = () => {
  return (
    <section className="about-activities-section-2 style-2 section-padding">
      <div className="zebra-shape float-bob-y">
        <img src={one} alt="shape-img" />
      </div>
      <div className="bottom-shape">
        <img src={two} alt="shape-img" />
      </div>
      <div className="sun-shape">
        <img src={three} alt="shape-img" />
      </div>
      <div className="container">
        <div className="about-activities-wrapper style-2">
          <div className="row g-4">
            <div
              className="col-lg-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="activities-image-items">
                <img src={four} alt="img" />
                <div className="radius-shape">
                  <img src={five} alt="shape-img" />
                </div>
                <div className="circle-shape">
                  <img src={six} alt="shape-img" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="activities-content">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    About Us
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Learn to play, converse <br />
                    with confidence.
                  </h2>
                </div>
                <p
                  className="mt-3 mt-md-0 "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  Luctus. Curabitur nibh justo imperdiet non ex non tempus
                  faucibus urna Aliquam at elit vitae dui sagittis maximus eget
                  vitae diam In fermentum
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
                        <img src={eight} alt="img" />
                      </div>
                      <div className="content">
                        <h5>Sport Program</h5>
                        <p>
                          Aliquam erat volutpat <br /> nullam imperdiet
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
                        <img src={nine} alt="img" />
                      </div>
                      <div className="content">
                        <h5>Easy To Learn</h5>
                        <p>
                          Ut vehiculadictumst <br /> maecenas ante.
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
                    <img src={ten} alt="author-img" />
                    <div className="content">
                      <h6>Ronald Richards</h6>
                      <p>Co, Founder</p>
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
                        <Link to="tel:+2085550112">+208-555-0112</Link>
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

export default AboutMain;
