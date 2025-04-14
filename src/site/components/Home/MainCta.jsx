import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const MainCta = () => {
  const { t } = useTranslation(["home", "common"]);
  const {
    name,
    title,
    description,
    exploreBtn,
    skills: { one, two, three, four, five, six, seven },
  } = t("teacherOfTheYear") || {};
  const { name: directorName, post } = t("director", { ns: "common" }) || {};

  return (
    <section className="main-cta-section rounded-5">
      <div className="plane-shape float-bob-y text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/plane.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="main-cta-wrapper section-padding">
          <div className="plane-shape float-bob-y">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/cta/plane.png"
              className="w-50"
              alt="img"
            />
          </div>
          <div className="cta-shape float-bob-x">
            <img
              src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/cta/shape.png"
              className="w-50"
              alt="img"
            />
          </div>
          <div className="cta-bg" style={{ borderRadius: "100px" }}></div>
          {/* changed newsletter section from here */}
          <div className="row g-5 px-lg-5 px-3 pt-0 rounded-5 mt-0 pt-0 pb-0 mb-0">
            <div className="col-lg-6 flex flex-column flex-lg-row pt-lg-0 justify-content-center align-items-center my-auto">
              <img
                className="rounded-5 w-100"
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="500"
                style={{ height: "500px" }}
                src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/team/team02.png"
                alt="img"
              />
            </div>
            <div className="col-lg-6 text-white">
              <div className="about-content">
                <div className="section-title">
                  <span
                    data-aos-duration="800"
                    data-aos="fade-up"
                    className="text-white"
                  >
                    {/*About Us*/} {/*Best Teacher*/}
                    {name}
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="text-white"
                  >
                    {title}
                    {/*Learn to play, converse*/} {/*<br />*/}
                    {/*with confidence.*/}
                  </h2>
                </div>
                <p
                  className="mt-3 mt-md-0 "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  {description}
                </p>
                <ul
                  className="list-items "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <li className="d-flex align-items-center">
                    <i className="fa-regular fa-circle-check me-2"></i>
                    {one}
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="fa-regular fa-circle-check me-2"></i>
                    {two}
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="fa-regular fa-circle-check me-2"></i>
                    {three}
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="fa-regular fa-circle-check me-2"></i>
                    {four}
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="fa-regular fa-circle-check me-2"></i>
                    {five}
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="fa-regular fa-circle-check me-2"></i>
                    {six}
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="fa-regular fa-circle-check me-2 "></i>
                    {seven}
                  </li>
                </ul>
                <div className="row mt-2 align-items-center">
                  <div
                    className="about-button col-lg-6"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <Link to="/about" className="theme-btn bg-white">
                      {exploreBtn}
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                  <div
                    className="author-image col-lg-6"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    {/* <Image src={eight} alt="author-img" /> */}
                    <div className="content">
                      <h6 className="text-white fw-bold">{directorName}</h6>
                      <p>{post}</p>
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

export default MainCta;
