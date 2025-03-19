import one from "../../assets/img/process/line.png";
import two from "../../assets/img/process/01.svg";
import three from "../../assets/img/process/line-2.png";
import four from "../../assets/img/process/02.svg";
import five from "../../assets/img/process/03.svg";
import six from "../../assets/img/process/04.svg";
import seven from "../../assets/img/process/icon-bg.png";

const WorkProcess = () => {
  return (
    <section className="work-process-section fix section-padding fix">
      <div className="container">
        <div className="process-work-wrapper">
          <div className="row g-4">
            <div
              className="col-xl-3 col-lg-4 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="work-process-items text-center">
                <div className="line-shape">
                  <img src={one} alt="shape-img" priority />
                </div>
                <div
                  className="icon bg-cover  flex justify-center items-center"
                  style={{
                    backgroundImage: `url(${seven})`,
                  }}
                >
                  <img src={two} alt="img" priority />
                </div>
                <div className="content">
                  <h4>Choose A Service</h4>
                  <p>
                    In a free hour, when our power of choice is untrammeled and
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="work-process-items text-center style-2">
                <div className="line-shape-2">
                  <img src={three} alt="shape-img" priority />
                </div>
                <div
                  className="icon bg-cover  flex justify-center items-center"
                  style={{
                    backgroundImage: `url(${seven})`,
                  }}
                >
                  <img src={four} alt="img" priority />
                </div>
                <div className="content">
                  <h4>Expert Teachers</h4>
                  <p>
                    In a free hour, when our power of choice is untrammeled and
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <div className="work-process-items text-center">
                <div className="line-shape">
                  <img src={one} alt="shape-img" priority />
                </div>
                <div
                  className="icon bg-cover flex justify-center items-center"
                  style={{
                    backgroundImage: `url(${seven})`,
                  }}
                >
                  <img src={five} alt="img" priority />
                </div>
                <div className="content">
                  <h4>E-Learning Media</h4>
                  <p>
                    In a free hour, when our power of choice is untrammeled and
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <div className="work-process-items text-center">
                <div className="content style-two">
                  <h4>Full Day Programs</h4>
                  <p>
                    In a free hour, when our power of choice is untrammeled and
                  </p>
                </div>
                <div
                  className="icon bg-cover flex justify-center items-center"
                  style={{
                    backgroundImage: `url(${seven})`,
                  }}
                >
                  <img src={six} alt="img" priority />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;
