import { Link } from "react-router";

const CTA = () => {
  return (
    <section
      className="cta-section fix section-padding bg-cover"
      style={{
        backgroundImage: `url(https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/cta/cta-bg.jpg)`,
      }}
    >
      <div className="plane-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/cta/plane.png"
          className="w-50"
          alt="img"
        />
      </div>
      <div className="pencil-shape text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/cta/pencil.png"
          className="w-50"
          alt="img"
        />
      </div>
      <div className="container">
        <div className="cta-wrapper">
          <div className="row justify-content-between align-items-center">
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
                  Come and be Part of <br /> Our Latest Session. <br />{" "}
                  Admissions are open.
                </h2>
              </div>
              <div
                className="cta-button mt-4 mt-md-0 "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <Link to="/apply-now" className="theme-btn bg-white">
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
                <img
                  className="w-50"
                  src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/graduation-mortarboard-svgrepo-com.svg"
                  alt="cta-img"
                />
                <div className="cta-shape text-start">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/cta/cta-shape.png"
                    style={{ width: "53%" }}
                    alt="img"
                  />
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
