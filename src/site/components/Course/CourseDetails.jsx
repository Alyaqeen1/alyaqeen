import { Link } from "react-router";
import { useState } from "react";
import { FaRegHourglass } from "react-icons/fa";
import { IoTodayOutline } from "react-icons/io5";
import { MdOutlineTimelapse } from "react-icons/md";
import three from "../../assets/img/program/icon/08.svg";
import four from "../../assets/img/program/icon/09.svg";
import five from "../../assets/img/program/icon/10.svg";
import six from "../../assets/img/program/icon/11.svg";

const CourseDetails = ({
  classNum,
  classTeacher,
  image,
  title,
  subtitle1,
  descriptionPara1,
  descriptionPara2,
  descriptionPara3,
  descriptionPara4,
  descriptionPara5,
  descriptionPara6,
  subtitle2,
  structurePara1,
  structurePara2,
  structurePara3,
  structurePara4,
  structurePara5,
  structurePara6,
  detailsObj,
}) => {
  const [read_more_btn_description, setRead_more_btn_description] =
    useState(false);
  const [read_more_btn_structure, setRead_more_btn_structure] = useState(false);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };
  return (
    <section className="program-details-section fix section-padding">
      <div className="container">
        <div className="program-details-wrapper">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="program-details-items">
                <div className="details-image">
                  <img
                    src={image}
                    className="rounded-4 object-fit-cover"
                    style={{ height: 450 }}
                    alt="img"
                  />
                </div>
                <div className="details-content">
                  <div className="post">
                    <span>Kindergarten</span>
                  </div>
                  <h2 className="mb-0">{title}</h2>
                  <div className="details-author-area">
                    <div className="author-items">
                      <p>{classTeacher}</p>
                    </div>
                    <ul className="class-list">
                      <li>
                        <i className="fa-regular fa-circle-play me-2"></i>
                        {classNum} Classes
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2>{subtitle1}</h2>
                    <p className="mt-3 mt-md-0 mb-3">{descriptionPara1}</p>
                    <p className="mb-4">{descriptionPara2}</p>
                    {read_more_btn_description ? (
                      <>
                        <p className="mb-3 mt-3 mt-md-0">{descriptionPara3}</p>

                        {/*para 3 of about us page begins here*/}
                        <p className="mb-3 mt-3 mt-md-0">{descriptionPara4}</p>
                        {/*para 4 of about us page begins here*/}
                        <p className="mb-3 mt-3 mt-md-0">{descriptionPara5}</p>

                        <p className="mb-3 mt-3 mt-md-0">{descriptionPara6}</p>
                      </>
                    ) : (
                      <></>
                    )}

                    <div
                      className="mb-3"
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="20"
                    >
                      <button
                        // href="/about"
                        onClick={() => {
                          setRead_more_btn_description(
                            !read_more_btn_description,
                          );
                        }}
                        className="read-more-btn-feb-4"
                      >
                        Read {read_more_btn_description ? "Less" : "More"}{" "}
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h2>{subtitle2}</h2>
                    <p className="mt-3 mt-md-0 mb-3">{structurePara1}</p>
                    <p className="mb-3">{structurePara2}</p>
                    <p className="mb-3 mt-3 mt-md-0">{structurePara3}</p>
                    {read_more_btn_structure ? (
                      <>
                        {/*para 3 of about us page begins here*/}
                        <p className="mb-3 mt-3 mt-md-0">{structurePara4}</p>
                        {/*para 4 of about us page begins here*/}
                        <p className="mb-3 mt-3 mt-md-0">{structurePara5}</p>

                        <p className="mb-3 mt-3 mt-md-0">{structurePara6}</p>
                      </>
                    ) : (
                      <></>
                    )}
                    {structurePara4 ? (
                      <div
                        className="mb-3"
                        data-aos-duration="800"
                        data-aos="fade-up"
                        data-aos-delay="20"
                      >
                        <button
                          // href="/about"
                          onClick={() => {
                            setRead_more_btn_structure(
                              !read_more_btn_structure,
                            );
                          }}
                          className="read-more-btn-feb-4"
                        >
                          Read {read_more_btn_structure ? "Less" : "More"}{" "}
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="details-list-area pricing-wrapper">
                <h3>Classes includes:</h3>
                <ul className="nav gap-2 my-2" role="tablist">
                  <li
                    className="nav-item "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                    role="presentation"
                  >
                    <a
                      className={`nav-link text-uppercase box-shadow px-3 ${
                        activeTabIndex === 0 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(0)}
                    >
                      Weekdays
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
                      className={`nav-link text-uppercase box-shadow px-3 ${
                        activeTabIndex === 1 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(1)}
                    >
                      Weekends
                    </a>
                  </li>
                </ul>
                <div
                  id="weekdays"
                  className={`c-tab-single ${
                    activeTabIndex === 0 ? "active-tab" : ""
                  }`}
                >
                  <ul className="details-list">
                    <li>
                      <span>
                        <img src={three} alt="img" className="me-2 inline" />
                        Age:
                      </span>
                      {detailsObj?.age} year
                    </li>
                    <li>
                      <span>
                        <MdOutlineTimelapse
                          className="me-2 fs-4"
                          style={{ color: "var(--theme)" }}
                        />
                        1st Session:
                      </span>
                      {detailsObj?.session01}
                    </li>
                    <li>
                      <span>
                        <MdOutlineTimelapse
                          className="me-2 fs-4"
                          style={{ color: "var(--theme)" }}
                        />
                        2nd Session:
                      </span>
                      {detailsObj?.session02}
                    </li>
                    <li>
                      <span>
                        <img src={four} alt="img" className="me-2 inline" />
                        Duration Per Day:
                      </span>
                      {detailsObj?.weekdaysDuration} hours
                    </li>
                    <li>
                      <span>
                        <IoTodayOutline
                          className="me-2 fs-5"
                          style={{ color: "var(--theme)" }}
                        />
                        Days:
                      </span>
                      {detailsObj?.weeklyDays}
                    </li>
                    <li>
                      <span>
                        <FaRegHourglass
                          className="me-2 fs-5"
                          style={{ color: "var(--theme)" }}
                        />
                        Total Hours:
                      </span>
                      {detailsObj?.weeklyHours} hours
                    </li>
                  </ul>
                </div>

                <div
                  id="weekends"
                  className={`c-tab-single ${
                    activeTabIndex === 1 ? "active-tab" : ""
                  }`}
                >
                  <ul className="details-list">
                    <li>
                      <span>
                        <img src={three} alt="img" className="me-2 inline" />
                        Age:
                      </span>
                      {detailsObj?.age} year
                    </li>
                    <li>
                      <span>
                        <MdOutlineTimelapse
                          className="me-2 fs-4"
                          style={{ color: "var(--theme)" }}
                        />
                        Morning:
                      </span>
                      {detailsObj?.morning}
                    </li>
                    <li>
                      <span>
                        <MdOutlineTimelapse
                          className="me-2 fs-4"
                          style={{ color: "var(--theme)" }}
                        />
                        Afternoon:
                      </span>
                      {detailsObj?.afternoon}
                    </li>
                    <li>
                      <span>
                        <img src={four} alt="img" className="me-2 inline" />
                        Duration Per Day:
                      </span>
                      {detailsObj?.weekendsDuration} hours
                    </li>
                    <li>
                      <span>
                        <img src={five} alt="img" className="me-2 inline" />
                        Days:
                      </span>
                      {detailsObj?.weekendDays}
                    </li>
                    <li>
                      <span>
                        <img src={six} alt="img" className="me-2 inline" />
                        Total Hours:
                      </span>
                      {detailsObj?.weekendHours} hours
                    </li>
                  </ul>
                </div>

                <button className="theme-btn w-100 border-style mb-3">
                  This course Free £
                  {activeTabIndex === 0
                    ? detailsObj?.weekdaysFee
                    : detailsObj?.weekendFee}
                </button>
                <Link to="/register" className="theme-btn w-100">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;
