import { Link } from "react-router";
const ErrorSection = () => {
  return (
    <section className="Error-section section-padding fix">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="error-items">
              <div className="error-image">
                <img
                  src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/oops-404-error-with-broken-robot-concept-illustration.png"
                  className="w-50"
                  alt="img"
                />
              </div>
              <h2>
                Whoops! This Page got Lost <br />
                in converstion
              </h2>
              <Link
                to="/"
                className="theme-btn"
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                Go Back Home
                <i className="fa-solid fa-arrow-right-long"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorSection;
