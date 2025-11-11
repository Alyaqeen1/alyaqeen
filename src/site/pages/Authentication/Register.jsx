import React, { useState } from "react";
import ApplyNowComp from "../../components/AdditionalPages/ApplyNowComp";
import CmnBanner from "../../sharedComponents/CmnBanner";
import TeacherComp from "../../components/AdditionalPages/TeacherComp";
import ParentComp from "../../components/AdditionalPages/ParentComp";

export default function Register() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };
  return (
    <div className="pricing-wrapper">
      <CmnBanner title="Apply Now"></CmnBanner>
      <ul
        className="nav gap-2 my-md-5 my-0 flex justify-content-center align-items-center"
        role="tablist"
      >
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
            Student
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
            Teacher
          </a>
        </li>
      </ul>
      <div
        id="student"
        className={`c-tab-single ${activeTabIndex === 0 ? "active-tab" : ""}`}
      >
        <ApplyNowComp></ApplyNowComp>
      </div>
      <div
        id="teacher"
        className={`c-tab-single ${activeTabIndex === 1 ? "active-tab" : ""}`}
      >
        <TeacherComp></TeacherComp>
      </div>
      {/* <div
        id="parent"
        className={`c-tab-single ${activeTabIndex === 2 ? "active-tab" : ""}`}
      >
        <ParentComp></ParentComp>
      </div> */}
    </div>
  );
}
