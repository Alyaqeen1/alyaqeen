import { Link } from "react-router";

const Values = () => {
  return (
    <section className="about-section section-padding pt-0" id="about">
      <div className="left-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/left-shape.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="plane-shape float-bob-y">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/plane.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="line-1 text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/line-1.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="about-wrapper-3">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="about-image-area">
                <div className="radius-shape">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/radius-shape.png"
                    className="w-50"
                    alt="shape-img"
                  />
                </div>
                <div className="circle-shape text-end">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/circle.png"
                    className="w-50"
                    alt="shape-img"
                  />
                </div>
                <div className="about-image">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/parent.png"
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
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/kid-smile.png"
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
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/team/team01.jpeg"
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
