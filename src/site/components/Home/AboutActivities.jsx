import one from "../../assets/img/about/pencil.png";
import two from "../../assets/img/about/zebra.png";
import three from "../../assets/img/about/03.png";
import four from "../../assets/img/about/icon-1.svg";
import five from "../../assets/img/about/icon-3.svg";
import six from "../../assets/img/about/icon-2.svg";
import seven from "../../assets/img/about/icon-4.svg";

const AboutActivities = () => {
  return (
    <section className="about-activities-section section-padding pt-0">
      <div className="pencil-shape">
        <img src={one} alt="shape-img" />
      </div>
      <div className="zebra-shape float-bob-y">
        <img src={two} alt="shape-img" />
      </div>
      <div className="container">
        <div className="about-activities-wrapper">
          <div className="row g-4">
            <div
              className="col-lg-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="activities-image">
                <img src={three} alt="img" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="activities-content">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    Our Best Activities
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Let Us Know About Our <br /> Reading And Cultural
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
                <div className="row g-4 mt-4">
                  <div
                    className="col-xl-6 col-lg-8 col-md-6 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="icon-items">
                      <div className="icon box-color-1">
                        <img src={four} alt="img" />
                      </div>
                      <div className="content">
                        <h5>Early Learning</h5>
                        <p>
                          Elit Aenean scelerisque <br /> vitae consequat the.
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
                      <div className="icon box-color-3">
                        <img src={five} alt="img" />
                      </div>
                      <div className="content">
                        <h5>Early Learning</h5>
                        <p>
                          Elit Aenean scelerisque <br /> vitae consequat the.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xl-6 col-lg-8 col-md-6 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    <div className="icon-items">
                      <div className="icon box-color-2">
                        <img src={six} alt="img" />
                      </div>
                      <div className="content">
                        <h5>Early Learning</h5>
                        <p>
                          Elit Aenean scelerisque <br /> vitae consequat the.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xl-6 col-lg-8 col-md-6 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="800"
                  >
                    <div className="icon-items">
                      <div className="icon box-color-4">
                        <img src={seven} alt="img" />
                      </div>
                      <div className="content">
                        <h5>Early Learning</h5>
                        <p>
                          Elit Aenean scelerisque <br /> vitae consequat the.
                        </p>
                      </div>
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

export default AboutActivities;
