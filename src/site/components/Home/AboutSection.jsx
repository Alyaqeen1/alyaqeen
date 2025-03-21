import one from "../../assets/img/about/bus.png";
import two from "../../assets/img/home/quran-quran-svgrepo-com.svg";
import three from "../../assets/img/about/dot.png";
import four from "../../assets/img/home/review01.png";
import five from "../../assets/img/home/review02.png";
import { Link } from "react-router";

const AboutSection = () => {
  return (
    <section className="about-section section-padding" id="about">
      <div className="bus-shape float-bob-x">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="girl-shape float-bob-y text-end">
        <img src={two} style={{ width: "120px" }} alt="shape-img" />
      </div>
      <div className="dot-shape">
        <img src={three} className="w-50" alt="shape-img" />
      </div>
      <div className="container">
        <div className="about-wrapper mb-40">
          <div className="row g-4">
            <div className="col-lg-6">
              <div
                className="about-image "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <img src={four} alt="about-img" />
                <div className="about-image-2 text-end">
                  <img
                    src={five}
                    className=""
                    style={{ width: "57%" }}
                    alt="about-img"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    Our Best Activities
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Let Us Know About Our Reading And Cultural{" "}
                  </h2>
                </div>
                <p
                  className="mt-3 mt-md-0 "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos. Suspendisse gravida vitae nisi
                  in tincidunt.
                </p>
                <div className="about-list">
                  <ul
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <li>
                      <i className="fa-regular fa-circle-check"></i>
                      Sports Training
                    </li>
                    <li>
                      <i className="fa-regular fa-circle-check"></i>
                      Sports Training
                    </li>
                    <li>
                      <i className="fa-regular fa-circle-check"></i>
                      Sports Training
                    </li>
                  </ul>
                  <ul
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <li>
                      <i className="fa-regular fa-circle-check"></i>
                      Sports Training
                    </li>
                    <li>
                      <i className="fa-regular fa-circle-check"></i>
                      Sports Training
                    </li>
                    <li>
                      <i className="fa-regular fa-circle-check"></i>
                      Sports Training
                    </li>
                  </ul>
                </div>
                <div className="about-author">
                  <div
                    className="about-button "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <Link to="about" className="theme-btn">
                      Explore More{" "}
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
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

export default AboutSection;
