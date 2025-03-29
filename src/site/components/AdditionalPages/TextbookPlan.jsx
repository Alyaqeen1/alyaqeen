import React from "react";

export default function TextbookPlan({
  textbook1Data,
  textbook2Data,
  textbook3Data,
  textbook4Data,
  textbook5Data,
  textbook6Data,
  handleShow,
}) {
  return (
    <div className="row">
      {/* first item */}
      <div
        className="col-xl-6 col-lg-6  "
        data-aos-duration="800"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <div className="pricing-items box-shadow">
          <div className="icon">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/icon.svg"
              alt="icon-img"
            />
          </div>
          <div className="element-shape text-end">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/element.png"
              className="w-75"
              alt="shape-img"
            />
          </div>
          <div className="pricing-header mt-3 pb-5">
            <h4 className="text-uppercase">Textbook 1</h4>
          </div>
          <ul className="pricing-list">
            {textbook1Data?.slice(0, 10)?.map((singleData) => (
              <li
                key={singleData.id}
                className="d-flex align-items-center w-100"
              >
                <i className="fa-solid fa-check"></i>
                <div className="d-flex justify-content-between w-100">
                  <p>{singleData?.name}</p>
                  <p>{singleData?.source}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleShow("textbook 1")}
            className="theme-btn"
          >
            View All <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
      {/* 2nd item */}
      <div
        className="col-xl-6 col-lg-6  "
        data-aos-duration="800"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div className="pricing-items active">
          <div className="icon">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/icon.svg"
              alt="icon-img"
            />
          </div>
          <div className="element-shape text-end">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/element-2.png"
              className="w-75"
              alt="shape-img"
            />
          </div>
          <div className="pricing-header mt-3 pb-5">
            <h4 className="text-uppercase">Textbook 2</h4>
          </div>
          <ul className="pricing-list">
            {textbook2Data?.slice(0, 10)?.map((singleData) => (
              <li
                key={singleData.id}
                className="d-flex align-items-center w-100"
              >
                <i className="fa-solid fa-check"></i>
                <div className="d-flex justify-content-between w-100">
                  <p>{singleData?.name}</p>
                  <p>{singleData?.source}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleShow("textbook 2")}
            className="theme-btn"
          >
            View All <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
      {/* 3rd item */}
      <div
        className="col-xl-6 col-lg-6  "
        data-aos-duration="800"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div className="pricing-items active">
          <div className="icon">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/icon.svg"
              alt="icon-img"
            />
          </div>
          <div className="element-shape text-end">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/element-2.png"
              className="w-75"
              alt="shape-img"
            />
          </div>
          <div className="pricing-header mt-3 pb-5">
            <h4 className="text-uppercase">Textbook 3</h4>
          </div>
          <ul className="pricing-list">
            {textbook3Data?.slice(0, 10)?.map((singleData) => (
              <li
                key={singleData.id}
                className="d-flex align-items-center w-100"
              >
                <i className="fa-solid fa-check"></i>
                <div className="d-flex justify-content-between w-100">
                  <p>{singleData?.name}</p>
                  <p>{singleData?.source}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleShow("textbook 3")}
            className="theme-btn"
          >
            View All <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
      {/* 4th item */}
      <div
        className="col-xl-6 col-lg-6  "
        data-aos-duration="800"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <div className="pricing-items box-shadow">
          <div className="icon">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/icon.svg"
              alt="icon-img"
            />
          </div>
          <div className="element-shape text-end">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/element.png"
              className="w-75"
              alt="shape-img"
            />
          </div>
          <div className="pricing-header mt-3 pb-5">
            <h4 className="text-uppercase">Textbook 4</h4>
          </div>
          <ul className="pricing-list">
            {textbook4Data?.slice(0, 10)?.map((singleData) => (
              <li
                key={singleData.id}
                className="d-flex align-items-center w-100"
              >
                <i className="fa-solid fa-check"></i>
                <div className="d-flex justify-content-between w-100">
                  <p>{singleData?.name}</p>
                  <p>{singleData?.source}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleShow("textbook 4")}
            className="theme-btn"
          >
            View All <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
      {/* 5th item */}
      <div
        className="col-xl-6 col-lg-6  "
        data-aos-duration="800"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <div className="pricing-items box-shadow">
          <div className="icon">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/icon.svg"
              alt="icon-img"
            />
          </div>
          <div className="element-shape text-end">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/element.png"
              className="w-75"
              alt="shape-img"
            />
          </div>
          <div className="pricing-header mt-3 pb-5">
            <h4 className="text-uppercase">Textbook 5</h4>
          </div>
          <ul className="pricing-list">
            {textbook5Data?.slice(0, 10)?.map((singleData) => (
              <li
                key={singleData.id}
                className="d-flex align-items-center w-100"
              >
                <i className="fa-solid fa-check"></i>
                <div className="d-flex justify-content-between w-100">
                  <p>{singleData?.name}</p>
                  <p>{singleData?.source}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleShow("textbook 5")}
            className="theme-btn"
          >
            View All <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
      {/* 6th item */}
      <div
        className="col-xl-6 col-lg-6  "
        data-aos-duration="800"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div className="pricing-items active">
          <div className="icon">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/icon.svg"
              alt="icon-img"
            />
          </div>
          <div className="element-shape text-end">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/pricing/element-2.png"
              className="w-75"
              alt="shape-img"
            />
          </div>
          <div className="pricing-header mt-3 pb-5">
            <h4 className="text-uppercase">Textbook 6</h4>
          </div>
          <ul className="pricing-list">
            {textbook6Data?.slice(0, 10)?.map((singleData) => (
              <li
                key={singleData.id}
                className="d-flex align-items-center w-100"
              >
                <i className="fa-solid fa-check"></i>
                <div className="d-flex justify-content-between w-100">
                  <p>{singleData?.name}</p>
                  <p>{singleData?.source}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleShow("textbook 6")}
            className="theme-btn"
          >
            View All <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
