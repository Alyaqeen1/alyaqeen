import { Link } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";

const ServicesGrid = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    axios("/services.json")
      .then((res) => setServices(res.data))
      .catch((error) => console.error("Error fetching staff data:", error));
  }, []);
  return (
    <section className="event-section fix section-padding mt-0">
      <div className="container">
        <div className="row g-4">
          {services?.map((service) => (
            <div
              className="col-xl-4 col-lg-6 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="event-box-items mt-0 box-shadow">
                <div className="event-image">
                  <img
                    src={service?.image_link}
                    style={{ height: "250px", objectFit: "cover" }}
                    alt="event-img"
                  />
                  <div className="event-shape">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/event/shape.png"
                      alt="shape-img"
                    />
                  </div>
                  <ul className="post-date">
                    <li>
                      <img
                        src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/event/calender.svg"
                        alt="img"
                        className="me-2"
                      />
                      Jan 16, 2024
                    </li>
                  </ul>
                </div>
                <div className="event-content">
                  <ul>
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12.7847 1.98206C11.5066 0.703906 9.80717 0 7.99961 0C6.19205 0 4.49261 0.703906 3.21448 1.98206C1.93633 3.26025 1.23242 4.95962 1.23242 6.76716C1.23242 10.4238 4.68986 13.4652 6.54733 15.0991C6.80545 15.3262 7.02836 15.5223 7.20595 15.6882C7.42845 15.896 7.71405 15.9999 7.99958 15.9999C8.28517 15.9999 8.5707 15.896 8.79324 15.6882C8.97083 15.5223 9.19374 15.3262 9.45186 15.0991C11.3093 13.4652 14.7668 10.4238 14.7668 6.76716C14.7667 4.95962 14.0629 3.26025 12.7847 1.98206ZM8.8328 14.3954C8.56902 14.6275 8.34124 14.8279 8.15342 15.0033C8.06714 15.0838 7.93202 15.0838 7.8457 15.0033C7.65792 14.8278 7.43011 14.6274 7.16633 14.3954C5.42008 12.8593 2.16961 9.99997 2.16961 6.76719C2.16961 3.55256 4.78489 0.937281 7.99955 0.937281C11.2142 0.937281 13.8295 3.55256 13.8295 6.76719C13.8295 9.99997 10.579 12.8593 8.8328 14.3954Z"
                          fill="#F39F5F"
                        />
                        <path
                          d="M7.9998 3.5293C6.35539 3.5293 5.01758 4.86708 5.01758 6.51148C5.01758 8.15589 6.35539 9.49367 7.9998 9.49367C9.6442 9.49367 10.982 8.15589 10.982 6.51148C10.982 4.86708 9.6442 3.5293 7.9998 3.5293ZM7.9998 8.55639C6.8722 8.55639 5.95483 7.63902 5.95483 6.51145C5.95483 5.38389 6.8722 4.46652 7.9998 4.46652C9.12739 4.46652 10.0447 5.38389 10.0447 6.51145C10.0447 7.63902 9.12739 8.55639 7.9998 8.55639Z"
                          fill="#F39F5F"
                        />
                      </svg>
                      <span>116 Church Road, Yardley, Birmingham, B25 8UX</span>
                    </li>
                  </ul>
                  <h3>
                    <Link to={service?.nav_link}>
                      {service?.name === "Nikah"
                        ? service?.title
                        : service?.name}
                    </Link>
                  </h3>
                  <div className="event-author">
                    <Link to={service?.nav_link} className="theme-btn">
                      View Details
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                    <div className="author-ratting">
                      <span>(10 Review)</span>
                      <div className="star">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star color-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
