import { Link } from "react-router";
const TopHeader = () => {
  return (
    <div className="header-top-section">
      <div className="header-top-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/header-top-shape.png"
          alt="shape-img"
        />
      </div>
      <div className="container-fluid">
        <div className="header-top-wrapper">
          <ul className="contact-list">
            <li>
              <i className="fal fa-map-marker-alt"></i>
              116 Church Road, Yardley, Birmingham, B25 8UX
            </li>
            <li>
              <i className="far fa-envelope"></i>
              <Link to="mailto:contact@alyaqeen.co.uk" className="link">
                contact@alyaqeen.co.uk
              </Link>
            </li>
          </ul>
          <div className="social-icon d-flex align-items-center">
            <span>Follow Us On:</span>
            <Link to="https://www.facebook.com/AlyaqeenAcademy">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link to="https://www.twitter.com">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link to="https://www.linkedin.com/">
              <i className="fa-brands fa-linkedin-in"></i>
            </Link>
            <Link to="https://www.youtube.com/@alyaqeenacademy5282">
              <i className="fa-brands fa-youtube"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
