import React from "react";
export default function SubjectPlan({
  aqidahData,
  fiqhData,
  historyData,
  personalDevData,
  sirahData,
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
            <h4 className="text-uppercase">Aqidah</h4>
          </div>
          <ul className="pricing-list">
            {aqidahData?.slice(0, 10)?.map((singleData) => (
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

          <button onClick={() => handleShow("aqidah")} className="theme-btn">
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
            <h4 className="text-uppercase">Fiqh</h4>
          </div>
          <ul className="pricing-list">
            {fiqhData?.slice(0, 10)?.map((singleData) => (
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
          <button onClick={() => handleShow("fiqh")} className="theme-btn">
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
            <h4 className="text-uppercase">History</h4>
          </div>
          <ul className="pricing-list">
            {historyData?.slice(0, 10)?.map((singleData) => (
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
          <button onClick={() => handleShow("history")} className="theme-btn">
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
            <h4 className="text-uppercase">Personal Development</h4>
          </div>
          <ul className="pricing-list">
            {personalDevData?.slice(0, 10)?.map((singleData) => (
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
            onClick={() => handleShow("personal development")}
            className="theme-btn"
          >
            View All <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
      {/* 3rd item */}
      <div
        className="  "
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
            <h4 className="text-uppercase">Sirah</h4>
          </div>
          <ul className="pricing-list row gx-5">
            <div className="col-lg-6">
              {sirahData?.slice(0, 5)?.map((singleData) => (
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
            </div>
            <div className="col-lg-6">
              {sirahData?.slice(5, 10)?.map((singleData) => (
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
            </div>
          </ul>
          <button onClick={() => handleShow("sirah")} className="theme-btn">
            View All <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
