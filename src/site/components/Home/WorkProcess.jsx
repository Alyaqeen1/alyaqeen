import { useTranslation } from "react-i18next";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosCalculator } from "react-icons/io";
import { IoBusOutline } from "react-icons/io5";
import { Link } from "react-router";

const WorkProcess = () => {
  const { t } = useTranslation(["home"]);
  const { title1, description1, title2, description2, title3, description3 } =
    t("workProcess");

  return (
    <section className="work-process-section fix section-padding fix">
      <div className="container">
        <div className="process-work-wrapper">
          <div className="row g-4 justify-content-center">
            <div
              className="col-xl-3 col-lg-3 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <Link to="session-timings">
                <div className="work-process-items text-center">
                  <div className="line-shape">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/process/line.png"
                      alt="shape-img"
                    />
                  </div>
                  <div
                    className="icon bg-cover  flex justify-center items-center"
                    style={{
                      backgroundImage: `url(https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/process/icon-bg.png)`,
                    }}
                  >
                    <FaCalendarAlt className="fs-3 text-white" />
                  </div>
                  <div className="content">
                    <h4>{title1} </h4>
                    <p>{description1}</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="col-xl-3 col-lg-3 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <Link to="fees">
                <div className="work-process-items text-center style-2">
                  <div className="line-shape-2">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/process/line-2.png"
                      alt="shape-img"
                    />
                  </div>
                  <div
                    className="icon bg-cover  flex justify-center items-center"
                    style={{
                      backgroundImage: `url(https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/process/icon-bg.png)`,
                    }}
                  >
                    <IoIosCalculator className="fs-2 text-white" />
                  </div>
                  <div className="content">
                    <h4>{title2}</h4>
                    <p>{description2}</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="col-xl-3 col-lg-3 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <Link to="holidays">
                <div className="work-process-items text-center">
                  <div
                    className="icon bg-cover flex justify-center items-center"
                    style={{
                      backgroundImage: `url(https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/process/icon-bg.png)`,
                    }}
                  >
                    <IoBusOutline className="fs-2 text-white" />
                  </div>
                  <div className="content">
                    <h4>{title3}</h4>
                    <p>{description3}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;
