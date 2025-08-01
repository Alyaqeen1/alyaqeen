import { useTranslation } from "react-i18next";
import Counter from "./Counter";
import one from "../../assets/img/counter/line-shape.png";
import two from "../../assets/img/counter/box-shape.png";
import three from "../../assets/img/counter/icon-1.svg";
import four from "../../assets/img/counter/icon-2.svg";
import five from "../../assets/img/counter/icon-3.svg";
import six from "../../assets/img/counter/icon-4.svg";

const CounterMain = () => {
  const { t } = useTranslation(["about"]);
  const { experience, completed, instructors, enroll } = t("counter") || {};
  return (
    <section className="counter-section fix">
      <div className="line-shape">
        <img src={one} className="w-50" alt="shape-img" />
      </div>
      <div className="box-shape float-bob-x text-end">
        <img src={two} className="w-50" alt="shape-img" />
      </div>
      <div className="counter-bg"></div>
      <div className="container">
        <div className="counter-wrapper">
          <div className="row g-4">
            <div
              className="col-xl-3 col-lg-4 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="counter-items flex flex-col items-center justify-center">
                <div className="icon">
                  <img src={three} alt="img" />
                </div>
                <div className="content">
                  <h2>
                    <span className="count">
                      <Counter value={20} />
                    </span>
                    +
                  </h2>
                  <p>{experience}</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="counter-items flex flex-col items-center justify-center">
                <div className="icon">
                  <img src={four} alt="img" />
                </div>
                <div className="content">
                  <h2>
                    <span className="count">
                      <Counter value={120} />
                    </span>
                    +
                  </h2>
                  <p>{completed}</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="counter-items flex flex-col items-center justify-center">
                <div className="icon">
                  <img src={five} alt="img" />
                </div>
                <div className="content">
                  <h2>
                    <span className="count">
                      <Counter value={10} />
                    </span>
                    +
                  </h2>
                  <p>{instructors}</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <div className="counter-items flex flex-col items-center justify-center border-none">
                <div className="icon">
                  <img src={six} alt="img" />
                </div>
                <div className="content">
                  <h2>
                    <span className="count">
                      <Counter value={1000} />
                    </span>
                    +
                  </h2>
                  <p>{enroll}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounterMain;
