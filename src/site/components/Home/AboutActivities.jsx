import { useTranslation } from "react-i18next";

const AboutActivities = () => {
  const { t } = useTranslation(["home"]);
  const {
    heading1,
    heading2,
    feature1,
    feature2,
    feature3,
    feature4,
    feature5,
    feature6,
  } = t("whyChooseUs");

  return (
    <section className="about-activities-section section-padding pt-0">
      <div className="pencil-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/pencil.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="zebra-shape float-bob-y w-25 text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/about/kaaba-svgrepo-com.svg"
          style={{ width: "35%" }}
          alt="shape-img"
        />
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
                <img
                  src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/new-mask.png"
                  alt="img"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="activities-content">
                <div className="section-title">
                  <span data-aos-duration="800" data-aos="fade-up">
                    {heading2}
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    {heading1}
                  </h2>
                </div>
                <div className="row g-4 mt-4">
                  <div
                    className="col-xl-6 col-lg-8 col-md-6 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="icon-items">
                      <div className="icon box-color-1">
                        <img
                          className="w-50"
                          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/icon/board-svgrepo-com.svg"
                          alt="img"
                        />
                      </div>
                      <div className="content">
                        <h5>{feature1}</h5>
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
                        <img
                          className="w-50"
                          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/icon/group_focus_2.svg"
                          alt="img"
                        />
                      </div>
                      <div className="content">
                        <h5>{feature2}</h5>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlSpace="preserve"
                          viewBox="0 0 508 508"
                          fill="none"
                        >
                          <path
                            d="M388 410.7H120c-1.7 0-3-1.4-3-3V100.4c0-1.7 1.4-3 3-3h268c1.7 0 3 1.4 3 3v307.3c0 1.6-1.3 3-3 3z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M117 109.4v289.2c0 6.7 5.4 12 12 12h214v-36c0-6.6 5.4-12 12-12h36V109.4c0-6.7-5.4-12-12-12H129c-6.7-.1-12 5.3-12 12z"
                            style={{
                              fill: "#fff",
                            }}
                          />
                          <path
                            d="m343 410.7 48-48h-36c-6.6 0-12 5.4-12 12v36z"
                            style={{
                              fill: "#e6e9ee",
                            }}
                          />
                          <path
                            d="M129.3 110.8h16.1v7.5h-16.1z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M132.3 82.3h10.1v32.3h-10.1z"
                            style={{
                              fill: "#324a5e",
                            }}
                          />
                          <path
                            d="M162.6 110.8h16.1v7.5h-16.1z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M165.6 82.3h10.1v32.3h-10.1z"
                            style={{
                              fill: "#324a5e",
                            }}
                          />
                          <path
                            d="M196 110.8h16.1v7.5H196z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M198.9 82.3H209v32.3h-10.1z"
                            style={{
                              fill: "#324a5e",
                            }}
                          />
                          <path
                            d="M229.3 110.8h16.1v7.5h-16.1z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M232.3 82.3h10.1v32.3h-10.1z"
                            style={{
                              fill: "#324a5e",
                            }}
                          />
                          <path
                            d="M262.6 110.8h16.1v7.5h-16.1z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M265.6 82.3h10.1v32.3h-10.1z"
                            style={{
                              fill: "#324a5e",
                            }}
                          />
                          <path
                            d="M296 110.8h16.1v7.5H296z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M298.9 82.3H309v32.3h-10.1z"
                            style={{
                              fill: "#324a5e",
                            }}
                          />
                          <path
                            d="M329.3 110.8h16.1v7.5h-16.1z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M332.3 82.3h10.1v32.3h-10.1z"
                            style={{
                              fill: "#324a5e",
                            }}
                          />
                          <path
                            d="M362.6 110.8h16.1v7.5h-16.1z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M365.6 82.3h10.1v32.3h-10.1z"
                            style={{
                              fill: "#324a5e",
                            }}
                          />
                          <path
                            d="M177 214.4h-31.1c-4.1 0-7.5-3.4-7.5-7.5v-31.1c0-4.1 3.4-7.5 7.5-7.5H177c4.1 0 7.5 3.4 7.5 7.5V207c-.1 4.1-3.4 7.4-7.5 7.4zm-30.6-7.9h30.2v-30.2h-30.2v30.2zM177 288.7h-31.1c-4.1 0-7.5-3.4-7.5-7.5v-31.1c0-4.1 3.4-7.5 7.5-7.5H177c4.1 0 7.5 3.4 7.5 7.5v31.1c-.1 4.1-3.4 7.5-7.5 7.5zm-30.6-8h30.2v-30.2h-30.2v30.2zM177 362.9h-31.1c-4.1 0-7.5-3.4-7.5-7.5v-31.1c0-4.1 3.4-7.5 7.5-7.5H177c4.1 0 7.5 3.4 7.5 7.5v31.1c-.1 4.1-3.4 7.5-7.5 7.5zm-30.6-7.9h30.2v-30.2h-30.2V355z"
                            style={{
                              fill: "#e6e9ee",
                            }}
                          />
                          <path
                            d="M159.5 198.3c.7.9 1.7 1.5 2.9 1.6h.3c1.1 0 2.1-.4 2.8-1.2l41.1-41.1c1.6-1.6 1.6-4.1 0-5.6-1.6-1.6-4.1-1.6-5.6 0l-37.9 37.9-5.6-7.7c-1.3-1.8-3.8-2.2-5.5-.9-1.8 1.3-2.1 3.8-.9 5.5l8.4 11.5zM201 226.2l-37.9 37.9-5.6-7.7c-1.3-1.8-3.8-2.2-5.5-.9-1.8 1.3-2.1 3.8-.9 5.5l8.4 11.4c.7.9 1.7 1.5 2.9 1.6h.3c1.1 0 2.1-.4 2.8-1.2l41.1-41.1c1.6-1.6 1.6-4.1 0-5.6-1.5-1.4-4-1.4-5.6.1zM201 300.5l-37.9 37.9-5.6-7.7c-1.3-1.8-3.8-2.2-5.5-.9-1.8 1.3-2.1 3.8-.9 5.5l8.4 11.4c.7.9 1.7 1.5 2.9 1.6h.3c1.1 0 2.1-.4 2.8-1.2l41.1-41.1c1.6-1.6 1.6-4.1 0-5.6-1.5-1.5-4-1.5-5.6.1z"
                            style={{
                              fill: "#ff7058",
                            }}
                          />
                          <path
                            d="M216.6 175.4h116.9v9.1H216.6zM216.6 198.4h70.6v9.1h-70.6zM216.6 249.6h116.9v9.1H216.6zM216.6 272.6h70.6v9.1h-70.6zM216.6 323.8h116.9v9.1H216.6zM216.6 346.8h70.6v9.1h-70.6z"
                            style={{
                              fill: "#84dbff",
                            }}
                          />
                        </svg>
                      </div>
                      <div className="content">
                        <h5>{feature3}</h5>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlSpace="preserve"
                          viewBox="0 0 482.2 482.2"
                        >
                          <path
                            d="M180.9 103.1v56h-56v243.1h253.3V103.1z"
                            style={{
                              fill: "#acb3ba",
                            }}
                          />
                          <path
                            d="M160 379.1v-56h-56V80h253.3v299.1z"
                            style={{
                              fill: "#fff",
                            }}
                          />
                          <path
                            d="m160 379.1-56-56h56zM141.2 198.2H320v10.7H141.2zM141.2 226.5H320v10.7H141.2zM141.2 254.9H320v10.7H141.2zM141.2 283.3h106.6V294H141.2z"
                            style={{
                              fill: "#ced5e0",
                            }}
                          />
                          <path
                            d="M164.9 131.2c0 5-2 8.2-5.9 9.7l7.9 11.1h-8.5l-6.9-9.9h-4.8v9.9h-6.9v-31.1h11.8c4.8 0 8.3.8 10.3 2.4 1.9 1.6 3 4.3 3 7.9zm-8.4 3.7c.9-.8 1.3-2 1.3-3.7s-.4-2.8-1.3-3.4c-.9-.6-2.4-.9-4.7-.9h-5.2v9.2h5.1c2.3-.1 4-.5 4.8-1.2zM194.4 120.9v6.2h-15.5v6.4h13.9v5.9h-13.9v6.4h16v6.1H172v-31.1h22.4v.1zM222.5 123.6c2.2 1.9 3.3 4.7 3.3 8.5s-1.1 6.6-3.4 8.4c-2.2 1.8-5.7 2.7-10.3 2.7H208v8.7h-6.9v-31.1h11c4.7.1 8.2 1 10.4 2.8zm-5.1 12.3c.8-.9 1.2-2.3 1.2-4.1s-.5-3.1-1.6-3.8c-1.1-.8-2.8-1.1-5-1.1h-4v10.5h4.7c2.3-.1 3.9-.6 4.7-1.5zM257.3 147.7c-3.1 3.1-7 4.6-11.6 4.6s-8.5-1.5-11.6-4.6-4.7-6.9-4.7-11.5 1.6-8.4 4.7-11.5c3.1-3.1 7-4.6 11.6-4.6s8.5 1.5 11.6 4.6 4.7 6.9 4.7 11.5-1.5 8.4-4.7 11.5zm-2.3-11.5c0-2.8-.9-5.1-2.7-7.1-1.8-2-4-2.9-6.6-2.9s-4.8 1-6.6 2.9c-1.8 2-2.7 4.3-2.7 7.1s.9 5.1 2.7 7.1c1.8 1.9 4 2.9 6.6 2.9s4.8-1 6.6-2.9c1.8-1.9 2.7-4.3 2.7-7.1zM293.1 131.2c0 5-2 8.2-5.9 9.7l7.9 11.1h-8.5l-6.9-9.9h-4.8v9.9H268v-31.1h11.8c4.8 0 8.3.8 10.3 2.4 2 1.6 3 4.3 3 7.9zm-8.3 3.7c.9-.8 1.3-2 1.3-3.7s-.4-2.8-1.3-3.4c-.9-.6-2.4-.9-4.7-.9h-5.2v9.2h5.1c2.3-.1 3.9-.5 4.8-1.2zM312.8 126.9V152h-6.9v-25.1h-8.8v-6h24.5v6h-8.8z"
                            style={{
                              fill: "#54c0eb",
                            }}
                          />
                        </svg>
                      </div>
                      <div className="content">
                        <h5>{feature4}</h5>
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
                      <div className="icon box-color-1">
                        <img
                          className="w-50"
                          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/icon/quran_2.svg"
                          alt="img"
                        />
                      </div>
                      <div className="content">
                        <h5>{feature5}</h5>
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
                      <div className="icon box-color-2">
                        <img
                          className="w-50"
                          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/icon/earth-globe-geography-svgrepo-com.svg"
                          alt="img"
                        />
                      </div>
                      <div className="content">
                        <h5>{feature6}</h5>
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
