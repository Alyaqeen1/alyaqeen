import one from "../../assets/img/section-top-shape.png";
import two from "../../assets/img/section-bottom-shape.png";
import three from "../../assets/img/program/mask.png";
import four from "../../assets/img/program/pencil.png";
import five from "../../assets/img/program/mask-2.png";
import six from "../../assets/img/program/compass.png";
import seven from "../../assets/img/program/01.png";
import eight from "../../assets/img/program/02.png";
import nine from "../../assets/img/program/03.png";
import { Link } from "react-router";

const ProgramSection = () => {
  return (
    <section
      className="program-section section-padding section-bg-2 fix"
      id="programs"
    >
      <div className="top-shape">
        <img src={one} alt="shape-img" priority />
      </div>
      <div className="bottom-shape">
        <img src={two} alt="shape-img" priority />
      </div>
      <div className="mask-shape float-bob-x">
        <img src={three} alt="shape-img" priority />
      </div>
      <div className="pencil-shape">
        <img src={four} alt="shape-img" priority />
      </div>
      <div className="mask-shape-2">
        <img src={five} alt="shape-img" priority />
      </div>
      <div className="compass-shape">
        <img src={six} alt="shape-img" priority />
      </div>
      <div className="container">
        <div className="section-title text-center mt-60">
          <span data-aos-duration="800" data-aos="fade-up">
            Our Programs
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            We meet kids at their level <br /> regardless of their age
          </h2>
        </div>
        <div className="row">
          <div
            className="col-xl-4 col-lg-6 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="program-box-items">
              <div className="program-bg"></div>
              <div className="program-image">
                <img src={seven} alt="img" priority />
              </div>
              <div className="program-content text-center">
                <h4>
                  <Link to="program-details">Kindergarten</Link>
                </h4>
                <span>(4-5 years)</span>
                <p>
                  Lorem ipsum dolor consectur the <br /> adipiscing elit
                  eiusmod.
                </p>
                <Link to="program-details" className="arrow-icon">
                  <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="col-xl-4 col-lg-6 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="program-box-items">
              <div className="program-bg bg-2"></div>
              <div className="program-image">
                <img src={eight} alt="img" priority />
              </div>
              <div className="program-content text-center">
                <h4>
                  <Link to="program-details">Chemistry Class</Link>
                </h4>
                <span>(1-2 years)</span>
                <p>
                  Lorem ipsum dolor consectur the <br /> adipiscing elit
                  eiusmod.
                </p>
                <Link to="program-details" className="arrow-icon color-2">
                  <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="col-xl-4 col-lg-6 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <div className="program-box-items">
              <div className="program-bg bg-3"></div>
              <div className="program-image">
                <img src={nine} alt="img" priority />
              </div>
              <div className="program-content text-center style-2">
                <h4>
                  <Link to="program-details">Drawing Class</Link>
                </h4>
                <span>(1-2 years)</span>
                <p>
                  Lorem ipsum dolor consectur the <br /> adipiscing elit
                  eiusmod.
                </p>
                <Link to="program-details" className="arrow-icon">
                  <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
