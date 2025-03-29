import { Link } from "react-router";

const AllThree = () => {
  return (
    <section className="service-section fix section-padding">
      <div className="line-1">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/line-1.png"
          alt="shape-img"
        />
      </div>
      <div className="line-2">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/line-3.png"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="service-wrapper">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="service-left">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    Mission, Vision & Values
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Guided by Purpose, <br />
                    Driven by Values
                  </h2>
                </div>
                <p
                  className="mt-3 mt-md-0 "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  Striving to benefit the Ummah through Shariah-compliant
                  methods, seeking Allah’s pleasure, with sincerity, hard work,
                  quality education, and strong character.
                </p>
                <div
                  className="about-author "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="about-button">
                    <Link to="/contact" className="theme-btn">
                      Book A visit{" "}
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
            <div className="col-lg-6">
              <div className="service-right">
                <div
                  className="icon-items "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="icon">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/icon/05.svg"
                      alt="icon-img"
                    />
                  </div>
                  <div className="content">
                    <h5>Our Mission</h5>
                    <p>
                      The institute offers affordable education, <br />
                      moral growth, and community support.
                    </p>
                  </div>
                </div>
                <div
                  className="icon-items style-2 "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div className="icon color-2">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/icon/06.svg"
                      alt="icon-img"
                    />
                  </div>
                  <div className="content">
                    <h5>Our Vision</h5>
                    <p>
                      Striving to benefit the Ummah through Shariah- <br />
                      compliant methods, seeking Allah’s pleasure.
                    </p>
                  </div>
                </div>
                <div
                  className="icon-items "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <div className="icon color-3">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/icon/07.svg"
                      alt="icon-img"
                    />
                  </div>
                  <div className="content">
                    <h5>Our Values</h5>
                    <p>
                      Our values focus on sincerity, hard work, quality
                      <br />
                      education, love for Deen, and strong character.
                    </p>
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

export default AllThree;
