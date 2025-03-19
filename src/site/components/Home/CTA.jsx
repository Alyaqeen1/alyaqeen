import one from "../../assets/img/cta/plane.png";
import two from "../../assets/img/cta/pencil.png";
import three from "../../assets/img/cta/cta-1.png";
import four from "../../assets/img/cta/cta-shape.png";
import five from "../../assets/img/cta/cta-bg.jpg";
import { Link } from "react-router";

const CTA = () => {
  return (
    <section
      className="cta-section fix section-padding bg-cover"
      style={{
        backgroundImage: `url(${five})`,
      }}
    >
      <div className="plane-shape">
        <img src={one} alt="img" />
      </div>
      <div className="pencil-shape">
        <img src={two} alt="img" />
      </div>
      <div className="container">
        <div className="cta-wrapper">
          <div className="row justify-content-between">
            <div className="col-lg-6">
              <div className="section-title">
                <span
                  className="text-white "
                  data-aos-duration="800"
                  data-aos="fade-up"
                >
                  Get your quality
                </span>
                <h2
                  className="text-white "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  Come and be Part of <br /> Our Latest Session
                </h2>
              </div>
              <div
                className="cta-button mt-4 mt-md-0 "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <Link to="contact" className="theme-btn bg-white">
                  Apply Now <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
            <div
              className="col-lg-5 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="cta-image">
                <img src={three} alt="cta-img" />
                <div className="cta-shape">
                  <img src={four} alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
