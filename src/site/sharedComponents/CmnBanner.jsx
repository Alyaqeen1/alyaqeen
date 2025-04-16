import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const CmnBanner = ({ title }) => {
  const { t } = useTranslation(["common"]);
  const {
    nav: { home },
  } = t("header");
  return (
    <div
      className="breadcrumb-wrapper bg-cover"
      style={{
        backgroundImage: `url(https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/breadcrumb.png)`,
      }}
    >
      <div className="line-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/breadcrumb-shape/line.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="plane-shape float-bob-y">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/breadcrumb-shape/plane.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="doll-shape float-bob-x">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/breadcrumb-shape/doll.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="parasuit-shape float-bob-y text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/breadcrumb-shape/parasuit.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="frame-shape text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/breadcrumb-shape/frame.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="bee-shape float-bob-x text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/breadcrumb-shape/bee.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="page-heading">
          <h1 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            {title}
          </h1>
          <ul
            className="breadcrumb-items "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <li>
              <Link to="/">{home}</Link>
            </li>
            <li>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li>{title}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CmnBanner;
