import one from "../../assets/img/process/line.png";
import two from "../../assets/img/process/01.svg";
import three from "../../assets/img/process/line-2.png";
import four from "../../assets/img/process/02.svg";
import five from "../../assets/img/process/03.svg";
import six from "../../assets/img/process/04.svg";
import seven from "../../assets/img/process/icon-bg.png";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosCalculator } from "react-icons/io";
import { IoBusOutline } from "react-icons/io5";
import { Link } from "react-router";

const WorkProcess = () => {
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
                    <h4>Sessions & Timings</h4>
                    <p>
                      Our onsite classes are held Monday to Thursday on weekdays
                      and on Saturday and Sunday during the weekends.{" "}
                    </p>
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
                    <h4>Fee Structure</h4>
                    <p>
                      Fee Structure depends on Course and Session types. We have
                      two session: weekdays and weekends.
                    </p>
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
                  {/* <div className="line-shape">
                  <img src={one} alt="shape-img" />
                </div> */}
                  <div
                    className="icon bg-cover flex justify-center items-center"
                    style={{
                      backgroundImage: `url(${seven})`,
                    }}
                  >
                    <IoBusOutline className="fs-2 text-white" />
                  </div>
                  <div className="content">
                    <h4>Holidays & Academic Calendar</h4>
                    <p>
                      Holidays & Academic Calendar will depend on Session types.
                      We have two session: weekdays and weekends.
                    </p>
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
