import { useTranslation } from "react-i18next";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosCalculator } from "react-icons/io";
import { IoBusOutline } from "react-icons/io5";
import { Link } from "react-router";
import one from "../../assets/img/process/line.png";
import three from "../../assets/img/process/line-2.png";
import seven from "../../assets/img/process/icon-bg.png";

const WorkProcess = () => {
  const { t } = useTranslation(["home"]);
  const { sessions, feeStructure, holidays } = t("workProcess") || {};

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
                    <img src={one} alt="shape-img" />
                  </div>
                  <div
                    className="icon bg-cover  flex justify-center items-center"
                    style={{
                      backgroundImage: `url(${seven})`,
                    }}
                  >
                    <FaCalendarAlt className="fs-3 text-white" />
                  </div>
                  <div className="content">
                    <h4>{sessions?.title} </h4>
                    <p>{sessions?.description}</p>
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
                    <img src={three} alt="shape-img" />
                  </div>
                  <div
                    className="icon bg-cover  flex justify-center items-center"
                    style={{
                      backgroundImage: `url(${seven})`,
                    }}
                  >
                    <IoIosCalculator className="fs-2 text-white" />
                  </div>
                  <div className="content">
                    <h4>{feeStructure?.title}</h4>
                    <p>{feeStructure?.description}</p>
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
                      backgroundImage: `url(${seven})`,
                    }}
                  >
                    <IoBusOutline className="fs-2 text-white" />
                  </div>
                  <div className="content">
                    <h4>{holidays?.title}</h4>
                    <p>{holidays?.description}</p>
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
