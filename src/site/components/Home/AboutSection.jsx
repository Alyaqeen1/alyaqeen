import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import AwesomeStarsRating from "react-awesome-stars-rating";
import { useState } from "react";
import toast from "react-hot-toast";

const AboutSection = () => {
  const { t } = useTranslation(["home"]);
  const { mainHeading, sectionTitle, submitBtn, call } = t("activities");
  const [rating, setRating] = useState(0);
  const handleChange = (value) => {
    setRating(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const title = form.title.value;
    const description = form.description.value;
    const madrasha_id = 2;

    if (!rating) {
      return toast.error("please provide a rating");
    }
    const reviewData = {
      name,
      email,
      phone,
      title,
      description,
      madrasha_id,
      rating,
    };
    console.log(reviewData);
    form.reset();
    setRating(0);
  };
  return (
    <section className="about-section section-padding" id="about">
      <div className="bus-shape float-bob-x">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/bus.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="girl-shape float-bob-y text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/quran-quran-svgrepo-com.svg"
          style={{ width: "120px" }}
          alt="shape-img"
        />
      </div>
      <div className="dot-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/dot.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="about-wrapper mb-40">
          <div className="row g-4">
            <div className="col-lg-6 px-0">
              <div
                className="about-image "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <img
                  src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/review01.png"
                  alt="about-img"
                />
                <div className="about-image-2 text-end">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/review02.png"
                    className=""
                    style={{ width: "57%" }}
                    alt="about-img"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 px-0">
              <div className="about-content">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    {sectionTitle}
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    {mainHeading}
                  </h2>
                </div>
                <p
                  className="mt-3 mt-md-0 "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  Share your thoughts and experiences with our courses. Your
                  feedback helps us improve and guide others in choosing the
                  right path of learning.
                </p>
                <section className="contact-section fix">
                  <div className="">
                    <div className="contact-wrapper-2">
                      {/* <div className="row g-4 align-items-center"> */}
                      <div className="contact-content m-0 w-100">
                        <form
                          onSubmit={handleSubmit}
                          action="contact.php"
                          id="contact-form"
                          method="POST"
                          className="contact-form-items w-100"
                        >
                          <div className="row g-4">
                            <div
                              className="col-lg-6 "
                              data-aos-duration="800"
                              data-aos="fade-up"
                              data-aos-delay="300"
                            >
                              <div className="form-clt">
                                <span>Your name*</span>
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  required
                                  placeholder="Your Name"
                                />
                              </div>
                            </div>
                            <div
                              className="col-lg-6"
                              data-aos-duration="800"
                              data-aos="fade-up"
                              data-aos-delay="500"
                            >
                              <div className="form-clt">
                                <span>Your Email*</span>
                                <input
                                  type="text"
                                  name="email"
                                  id="email"
                                  required
                                  placeholder="Your Email"
                                />
                              </div>
                            </div>
                            <div
                              className="col-lg-6"
                              data-aos-duration="800"
                              data-aos="fade-up"
                              data-aos-delay="500"
                            >
                              <div className="form-clt">
                                <span>Your Phone Number*</span>
                                <input
                                  type="number"
                                  name="phone"
                                  id="phone"
                                  required
                                  placeholder="Your Phone Number"
                                />
                              </div>
                            </div>
                            <div
                              className="col-lg-6"
                              data-aos-duration="800"
                              data-aos="fade-up"
                              data-aos-delay="500"
                            >
                              <div className="form-clt">
                                <span>Review Title*</span>
                                <input
                                  type="text"
                                  name="title"
                                  id="title"
                                  required
                                  placeholder="Summarize your experience"
                                />
                              </div>
                            </div>
                            <div
                              className="col-lg-12 "
                              data-aos-duration="800"
                              data-aos="fade-up"
                              data-aos-delay="700"
                            >
                              <div className="form-clt">
                                <span>Share Your Experience*</span>
                                <textarea
                                  name="description"
                                  id="description"
                                  placeholder="Write your honest review here..."
                                  required
                                ></textarea>
                              </div>
                            </div>
                            <div
                              className="col-lg-12 "
                              data-aos-duration="800"
                              data-aos="fade-up"
                              data-aos-delay="700"
                            >
                              <div className="form-clt">
                                <span>Your Rating*</span>
                                <br />
                                <AwesomeStarsRating
                                  value={rating}
                                  onChange={handleChange}
                                  isEdit={true}
                                  half={true} // Optional: for half-star ratings
                                  size={24} // Optional: size of the stars
                                  className="my-custom-rating" // Optional: for extra styling
                                />
                              </div>
                            </div>
                            <div
                              className="col-lg-12 mt-0"
                              data-aos-duration="800"
                              data-aos="fade-up"
                              data-aos-delay="700"
                            >
                              <div className="about-author">
                                <div
                                  className="about-button "
                                  data-aos-duration="800"
                                  data-aos="fade-up"
                                  data-aos-delay="300"
                                >
                                  <button className="theme-btn">
                                    {submitBtn}
                                    <i className="fa-solid fa-arrow-right-long"></i>
                                  </button>
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
                                    <span>{call}</span>
                                    <h5>
                                      <Link to="tel:+07869636849">
                                        +07869636849
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              {/* <button type="submit" className="theme-btn">
                                Submit Review
                                <i className="fa-solid fa-arrow-right-long"></i>
                              </button> */}
                            </div>
                          </div>
                        </form>
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
