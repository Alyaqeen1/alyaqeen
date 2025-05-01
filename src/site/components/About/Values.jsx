import { Link } from "react-router";
import one from "../../assets/img/about/left-shape.png";
import two from "../../assets/img/plane.png";
import three from "../../assets/img/line-1.png";
import four from "../../assets/img/about/radius-shape.png";
import five from "../../assets/img/about/circle.png";
import six from "../../assets/img/about/parent.png";
import seven from "../../assets/img/about/kid-smile.png";
import eight from "../../assets/img/team/team01.jpeg";

const Values = () => {
  return (
    <section className="about-section section-padding pt-0" id="about">
      <div className="left-shape">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="plane-shape float-bob-y">
        <img src={two} className="w-50" alt="shape-img" />
      </div>
      <div className="line-1 text-end">
        <img src={three} className="w-50" alt="shape-img" />
      </div>
      <div className="container">
        <div className="about-wrapper-3">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="about-image-area">
                <div className="radius-shape">
                  <img src={four} className="w-50" alt="shape-img" />
                </div>
                <div className="circle-shape text-end">
                  <img src={five} className="w-50" alt="shape-img" />
                </div>
                <div className="about-image">
                  <img
                    src={six}
                    alt="about-img"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  />
                  <div
                    className="about-image-2 text-start"
                    data-aos-duration="800"
                    data-aos="fade-left"
                    data-aos-delay="500"
                  >
                    <img
                      src={seven}
                      className=""
                      style={{ width: "60%" }}
                      alt="about-img"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mt-5">
              <div className="about-content">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    Our Values
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Embodying Values with <br />
                    Integrity and Excellence
                  </h2>
                </div>
                <p
                  className="mt-3 mt-md-0 "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  Our values include Sincerity (ikhlas) to work for the sake of
                  Allah, hard work, top quality education, creating a friendly
                  atmosphere, building love of the Deen and producing
                  personalities with high morals and character.
                </p>
                <ul
                  className="list-items "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <li>
                    <i className="fa-regular fa-circle-check"></i>
                    Sincerity (Ikhlas) in working for the sake of Allah.
                  </li>
                  <li>
                    <i className="fa-regular fa-circle-check"></i>
                    Dedication to hard work and providing top-quality education.
                  </li>
                  <li>
                    <i className="fa-regular fa-circle-check"></i>
                    Creating a friendly atmosphere and fostering love for the
                    Deen.
                  </li>
                  <li>
                    <i className="fa-regular fa-circle-check"></i>
                    Developing individuals with strong morals and high
                    character.
                  </li>
                </ul>
                <div className="about-author">
                  <div
                    className="about-button "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <Link to="/about" className="theme-btn">
                      Explore More{" "}
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                  <div
                    className="author-image "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <img
                      src={eight}
                      className="rounded-circle object-fit-cover"
                      style={{ width: "60px", height: "60px" }}
                      alt="author-img"
                    />
                    <div className="content">
                      <h6>Mohammad Khalid</h6>
                      <p>Managing Director & Headteacher</p>
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

export default Values;
