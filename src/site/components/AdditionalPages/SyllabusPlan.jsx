import { useState } from "react";
import four from "../../assets/img/pricing/icon.svg";
import five from "../../assets/img/pricing/element.png";
import six from "../../assets/img/pricing/element-2.png";
import { Link } from "react-router";

const SyllabusPlan = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };
  return (
    <section className="pricing-section section-padding mt-0">
      <div className="container">
        <div className="pricing-wrapper">
          <div className="section-title text-center mb-0">
            <span data-aos-duration="800" data-aos="fade-up">
              Our pricing
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              Select a plan according to <br /> your requirements
            </h2>
          </div>
          <ul className="nav" role="tablist">
            <li
              className="nav-item "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
              role="presentation"
            >
              <a
                className={`nav-link box-shadow ${
                  activeTabIndex === 0 ? " active" : ""
                }`}
                onClick={() => handleTabClick(0)}
              >
                Monthly
              </a>
            </li>
            <li
              className="nav-item "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="500"
              role="presentation"
            >
              <a
                className={`nav-link box-shadow ${
                  activeTabIndex === 1 ? " active" : ""
                }`}
                onClick={() => handleTabClick(1)}
              >
                Yearly
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div
            id="monthly"
            className={`c-tab-single ${
              activeTabIndex === 0 ? "active-tab" : ""
            }`}
          >
            <div className="row">
              <div
                className="col-xl-4 col-lg-6 col-md-6 "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="pricing-items box-shadow">
                  <div className="icon">
                    <img src={four} alt="icon-img" />
                  </div>
                  <div className="element-shape">
                    <img src={five} alt="shape-img" />
                  </div>
                  <div className="pricing-header">
                    <h4>Basic Plan</h4>
                    <h2>
                      $39 <span>/monthly</span>
                    </h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum porttitor sem
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum lacinia quisque
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Fusce sagittis est fringilla auctor
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Ligula enim varius lacus et luctus
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Pellentesque non massa sed elit
                    </li>
                  </ul>
                  <Link to="contact" className="theme-btn">
                    Choose Plan <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
              <div
                className="col-xl-4 col-lg-6 col-md-6 "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="pricing-items active">
                  <div className="icon">
                    <img src={four} alt="icon-img" />
                  </div>
                  <div className="element-shape">
                    <img src={six} alt="shape-img" />
                  </div>
                  <div className="pricing-header">
                    <h4>Premium Plan</h4>
                    <h2>
                      $49 <span>/monthly</span>
                    </h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum porttitor sem
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum lacinia quisque
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Fusce sagittis est fringilla auctor
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Ligula enim varius lacus et luctus
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Pellentesque non massa sed elit
                    </li>
                  </ul>
                  <Link to="contact" className="theme-btn">
                    Choose Plan <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
              <div
                className="col-xl-4 col-lg-6 col-md-6 "
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="700"
              >
                <div className="pricing-items box-shadow">
                  <div className="icon">
                    <img src={four} alt="icon-img" />
                  </div>
                  <div className="element-shape">
                    <img src={five} alt="shape-img" />
                  </div>
                  <div className="pricing-header">
                    <h4>Advanced</h4>
                    <h2>
                      $99 <span>/monthly</span>
                    </h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum porttitor sem
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum lacinia quisque
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Fusce sagittis est fringilla auctor
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Ligula enim varius lacus et luctus
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Pellentesque non massa sed elit
                    </li>
                  </ul>
                  <Link to="contact" className="theme-btn">
                    Choose Plan <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            id="yearly"
            className={`c-tab-single ${
              activeTabIndex === 1 ? "active-tab" : ""
            }`}
          >
            <div className="row">
              <div className="col-xl-4 col-lg-6 col-md-6">
                <div className="pricing-items box-shadow">
                  <div className="icon">
                    <img src={four} alt="icon-img" />
                  </div>
                  <div className="element-shape">
                    <img src={five} alt="shape-img" />
                  </div>
                  <div className="pricing-header">
                    <h4>Basic Plan</h4>
                    <h2>
                      $39 <span>/monthly</span>
                    </h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum porttitor sem
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum lacinia quisque
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Fusce sagittis est fringilla auctor
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Ligula enim varius lacus et luctus
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Pellentesque non massa sed elit
                    </li>
                  </ul>
                  <Link to="contact" className="theme-btn">
                    Choose Plan <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6">
                <div className="pricing-items active">
                  <div className="icon">
                    <img src={four} alt="icon-img" />
                  </div>
                  <div className="element-shape">
                    <img src={six} alt="shape-img" />
                  </div>
                  <div className="pricing-header">
                    <h4>Premium Plan</h4>
                    <h2>
                      $49 <span>/monthly</span>
                    </h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum porttitor sem
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum lacinia quisque
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Fusce sagittis est fringilla auctor
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Ligula enim varius lacus et luctus
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Pellentesque non massa sed elit
                    </li>
                  </ul>
                  <Link to="contact" className="theme-btn">
                    Choose Plan <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6">
                <div className="pricing-items box-shadow">
                  <div className="icon">
                    <img src={four} alt="icon-img" />
                  </div>
                  <div className="element-shape">
                    <img src={five} alt="shape-img" />
                  </div>
                  <div className="pricing-header">
                    <h4>Advanced</h4>
                    <h2>
                      $99 <span>/monthly</span>
                    </h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum porttitor sem
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Condimentum lacinia quisque
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Fusce sagittis est fringilla auctor
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Ligula enim varius lacus et luctus
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i>
                      Pellentesque non massa sed elit
                    </li>
                  </ul>
                  <Link to="contact" className="theme-btn">
                    Choose Plan <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SyllabusPlan;
