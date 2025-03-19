import { Link } from "react-router";
import shape from "../../assets/img/header-top-shape.png";

const TopHeader = () => {
  return (
    <div className="header-top-section">
      <div className="header-top-shape">
        <img src={shape} alt="shape-img" />
      </div>
      <div className="container-fluid">
        <div className="header-top-wrapper">
          <ul className="contact-list">
            <li>
              <i className="fal fa-map-marker-alt"></i>
              6391 Elgin St. Celina, USA
            </li>
            <li>
              <i className="far fa-envelope"></i>
              <Link to="mailto:info@example.com" className="link">
                info@example.com
              </Link>
            </li>
          </ul>
          <div className="social-icon d-flex align-items-center">
            <span>Follow Us On:</span>
            <Link to="/">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link to="/">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link to="/">
              <i className="fa-brands fa-linkedin-in"></i>
            </Link>
            <Link to="/">
              <i className="fa-brands fa-youtube"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
