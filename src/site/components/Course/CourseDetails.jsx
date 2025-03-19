import one from "../../assets/img/program/details-1.jpg";
import two from "../../assets/img/program/author.png";
import three from "../../assets/img/program/icon/08.svg";
import four from "../../assets/img/program/icon/09.svg";
import five from "../../assets/img/program/icon/10.svg";
import six from "../../assets/img/program/icon/11.svg";
import seven from "../../assets/img/program/icon/14.svg";
import eight from "../../assets/img/program/icon/13.svg";
import nine from "../../assets/img/program/p-author.jpg";
import { Link } from "react-router";

const CourseDetails = () => {
  return (
    <section className="program-details-section fix section-padding">
      <div className="container">
        <div className="program-details-wrapper">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="program-details-items">
                <div className="details-image">
                  <img src={one} alt="img" />
                </div>
                <div className="details-content">
                  <div className="post">
                    <span>Kindergarten</span>
                  </div>
                  <h2 className="mb-0">Drawing Classes</h2>
                  <div className="details-author-area">
                    <div className="author-items">
                      <img src={two} alt="img" />
                      <p>Savannah Nguyen</p>
                    </div>
                    <ul className="class-list">
                      <li>
                        <i className="fa-regular fa-circle-play me-2"></i>
                        30 Classes
                      </li>
                      <li>
                        <i className="fas fa-star me-2"></i>
                        3.4 (36 Review)
                      </li>
                    </ul>
                  </div>
                  <h2>Descriptions</h2>
                  <p className="mb-3">
                    Consectetur adipisicing elit, sed do eiusmod tempor is
                    incididunt ut labore et dolore of magna aliqua. Ut enim ad
                    minim veniam, made of owl the quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea dolor commodo
                    consequat. Duis aute irure and dolor in reprehenderit.
                  </p>
                  <p className="mb-4">
                    The is ipsum dolor sit amet consectetur adipiscing elit.
                    Fusce eleifend porta arcu In hac augu ehabitasse the is
                    platea augue thelorem turpoi dictumst. In lacus libero
                    faucibus at malesuada sagittis placerat eros sed istincidunt
                    augue ac ante rutrum sed the is sodales augue consequat.
                  </p>
                  <h2>Requirements for The Classes</h2>
                  <p>
                    Nulla facilisi. Vestibulum tristique sem in eros eleifend
                    imperdiet. Donec quis convallis neque. In id lacus pulvinar
                    lacus, eget vulputate lectus. Ut viverra bibendum lorem, at
                    tempus nibh mattis in. Sed a massa eget lacus consequat
                    auctor.
                  </p>
                  <ul className="list-items">
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Ut viverra bibendum lorem, at tempus nibh mattis
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      quis nostrud exercitation ullamco laboris nisi
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Duis aute irure and dolor in reprehenderit.
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      ante rutrum sed the is sodales augue consequat.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="details-list-area">
                <h3>Classes includes:</h3>
                <ul className="details-list">
                  <li>
                    <span>
                      <img src={three} alt="img" className="me-2 inline" />
                      Age
                    </span>
                    3-5 year
                  </li>
                  <li>
                    <span>
                      <img src={four} alt="img" className="me-2 inline" />
                      Duration:
                    </span>
                    9:00-11:00
                  </li>
                  <li>
                    <span>
                      <img src={five} alt="img" className="me-2 inline" />
                      Lessons:
                    </span>
                    15
                  </li>
                  <li>
                    <span>
                      <img src={six} alt="img" className="me-2 inline" />
                      Students:
                    </span>
                    50
                  </li>
                  <li>
                    <span>
                      <img src={seven} alt="img" className="me-2 inline" />
                      Certifications:
                    </span>
                    Yes
                  </li>
                  <li>
                    <span>
                      <img src={eight} alt="img" className="me-2 inline" />
                      Language
                    </span>
                    English
                  </li>
                </ul>
                <Link
                  to="program-details"
                  className="theme-btn w-100 border-style mb-3"
                >
                  This course Free $49.00
                </Link>
                <Link to="program-details" className="theme-btn w-100">
                  Enroll Your Kid{" "}
                  <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
                <div className="social-icon d-flex align-items-center">
                  <span>Share: </span>
                  <Link to="/">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                  <Link to="/">
                    <i className="fab fa-twitter"></i>
                  </Link>
                  <Link to="/">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </Link>
                  <Link to="/">
                    <i className="fa-brands fa-youtube"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="program-author-items">
                <div className="thumb">
                  <img src={nine} alt="img" />
                </div>
                <div className="content">
                  <h2>Savannah Nguyen</h2>
                  <span>Children Diet</span>
                  <p>
                    Adipiscing elit. Mauris viverra nisl quis mollis laoreet. Ut
                    eget lacus a felis accumsan pharetra in dignissim enim. In
                    amet odio mollis urna aliquet volutpat. Sed bibendum nisl
                    vehicula imperdiet imperdiet, augue massa fringilla.
                  </p>
                  <ul>
                    <li>Experience: 10 Years</li>
                    <li>
                      <i className="fas fa-user"></i>
                      188 Students
                    </li>
                    <li>
                      <i className="fa-solid fa-star color-star"></i>
                      454 (36 Review)
                    </li>
                  </ul>
                  <div className="social-icon d-flex align-items-center">
                    <Link to="/">
                      <i className="fab fa-facebook-f"></i>
                    </Link>
                    <Link to="/">
                      <i className="fab fa-twitter"></i>
                    </Link>
                    <Link to="/">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </Link>
                    <Link to="/">
                      <i className="fa-brands fa-youtube"></i>
                    </Link>
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

export default CourseDetails;
