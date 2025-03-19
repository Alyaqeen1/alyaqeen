import { useState } from "react";
import logo from "../../assets/img/logo/logo.svg";
import one from "../../assets/img/header/home-1.jpg";
import two from "../../assets/img/header/home-2.jpg";
import three from "../../assets/img/header/home-3.jpg";
import four from "../../assets/img/header/home-4.jpg";
import { Link } from "react-router";

const OffCanvasMenu = ({ toggleMenu, handleToggleMenu }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [openNestedMenu, setOpenNestedMenu] = useState(null);

  const handleSubmenu = (submenu) => {
    if (submenu === openSubMenu) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(submenu);
    }
  };

  const handleNestedmenu = (nestmenu) => {
    if (nestmenu === openNestedMenu) {
      setOpenNestedMenu(null);
    } else {
      setOpenNestedMenu(nestmenu);
    }
  };

  const isNestedMenuOpen = (nestmenu) => {
    return nestmenu === openNestedMenu ? " sub-menu-active" : " ";
  };

  const isNestedMenuButton = (nestmenu) => {
    return nestmenu === openNestedMenu ? " drop-active" : " ";
  };

  const isSubMenuOpen = (submenu) => {
    return submenu === openSubMenu ? "sub-menu-active" : " ";
  };

  const isSubMenuButton = (submenu) => {
    return submenu === openSubMenu ? " drop-active" : " ";
  };

  return (
    <>
      <div className="fix-area d-block d-xl-none">
        <div className={(toggleMenu ? " info-open" : " ") + " offcanvas__info"}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link to="/">
                    <img src={logo} alt="logo-img" />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button onClick={() => handleToggleMenu(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <p className="text d-none d-xl-block">
                Nullam dignissim, ante scelerisque the is euismod fermentum odio
                sem semper the is erat, a feugiat leo urna eget eros. Duis
                Aenean a imperdiet risus.
              </p>
              <div className="mobile-menu fix mb-3 mean-container">
                <div className="mean-bar">
                  <nav className="mean-nav mobile-menu">
                    <ul>
                      <li className="has-dropdown active menu-thumb">
                        <a
                          className={`drop ${isSubMenuButton("home")}`}
                          onClick={() => handleSubmenu("home")}
                        >
                          Home
                        </a>
                        <ul
                          className={`submenu has-homemenu ${isSubMenuOpen(
                            "home"
                          )}`}
                        >
                          <li>
                            <div className="homemenu-items">
                              <div className="homemenu">
                                <div className="homemenu-thumb">
                                  <img src={one} alt="img" />
                                  <div className="demo-button">
                                    <Link to="/" className="theme-btn">
                                      <span>Multi Page</span>
                                    </Link>
                                    <Link
                                      to="index-one-page"
                                      className="theme-btn"
                                    >
                                      <span>One Page</span>
                                    </Link>
                                  </div>
                                </div>
                                <div className="homemenu-content text-center">
                                  <h4 className="homemenu-title">Home 01</h4>
                                </div>
                              </div>
                              <div className="homemenu">
                                <div className="homemenu-thumb mb-15">
                                  <img src={two} alt="img" />
                                  <div className="demo-button">
                                    <Link to="index-2" className="theme-btn">
                                      <span>Multi Page</span>
                                    </Link>
                                    <Link
                                      to="index-two-page"
                                      className="theme-btn"
                                    >
                                      <span>One Page</span>
                                    </Link>
                                  </div>
                                </div>
                                <div className="homemenu-content text-center">
                                  <h4 className="homemenu-title">Home 02</h4>
                                </div>
                              </div>
                              <div className="homemenu">
                                <div className="homemenu-thumb mb-15">
                                  <img src={three} alt="img" />
                                  <div className="demo-button">
                                    <Link to="index-3" className="theme-btn">
                                      <span>Multi Page</span>
                                    </Link>
                                    <Link
                                      to="index-three-page"
                                      className="theme-btn"
                                    >
                                      <span>One Page</span>
                                    </Link>
                                  </div>
                                </div>
                                <div className="homemenu-content text-center">
                                  <h4 className="homemenu-title">Home 03</h4>
                                </div>
                              </div>
                              <div className="homemenu">
                                <div className="homemenu-thumb mb-15">
                                  <img src={four} alt="img" />
                                  <div className="demo-button">
                                    <Link to="index-4" className="theme-btn">
                                      <span>Multi Page</span>
                                    </Link>
                                    <Link
                                      to="index-four-page"
                                      className="theme-btn"
                                    >
                                      <span>One Page</span>
                                    </Link>
                                  </div>
                                </div>
                                <div className="homemenu-content text-center">
                                  <h4 className="homemenu-title">Home 04</h4>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link to="about">About Us</Link>
                      </li>
                      <li>
                        <a
                          className={`drop ${isSubMenuButton("programs")}`}
                          onClick={() => handleSubmenu("programs")}
                        >
                          Programs
                        </a>
                        <ul className={`submenu ${isSubMenuOpen("programs")}`}>
                          <li>
                            <Link to="program">Programs Grid</Link>
                          </li>
                          <li>
                            <Link to="program-carousel">Programs Carousel</Link>
                          </li>
                          <li>
                            <Link to="program-details">Programs Details</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="has-dropdown">
                        <a
                          className={`drop ${isSubMenuButton("pages")}`}
                          onClick={() => handleSubmenu("pages")}
                        >
                          Pages
                        </a>
                        <ul className={`submenu ${isSubMenuOpen("pages")}`}>
                          <li className="has-dropdown">
                            <a
                              className={`drop ${isNestedMenuButton("event")}`}
                              onClick={() => handleNestedmenu("event")}
                            >
                              Event
                            </a>
                            <ul
                              className={`submenu ${isNestedMenuOpen("event")}`}
                            >
                              <li>
                                <Link to="event">Event Grid</Link>
                              </li>
                              <li>
                                <Link to="event-carousel">Event Carousel</Link>
                              </li>
                              <li>
                                <Link to="event-details">Event Details</Link>
                              </li>
                            </ul>
                          </li>
                          <li className="has-dropdown">
                            <a
                              className={`drop ${isNestedMenuButton(
                                "teacher"
                              )}`}
                              onClick={() => handleNestedmenu("teacher")}
                            >
                              Teacher
                            </a>
                            <ul
                              className={`submenu ${isNestedMenuOpen(
                                "teacher"
                              )}`}
                            >
                              <li>
                                <Link to="team">Our Teacher</Link>
                              </li>
                              <li>
                                <Link to="team-carousel">Teacher Carousel</Link>
                              </li>
                              <li>
                                <Link to="team-details">Teacher Details</Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link to="pricing">Pricing</Link>
                          </li>
                          <li>
                            <Link to="faq">FAQ&apos;S</Link>
                          </li>
                          <li>
                            <Link to="404">404 Page</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a
                          className={`drop ${isSubMenuButton("blog")}`}
                          onClick={() => handleSubmenu("blog")}
                        >
                          Blog
                        </a>
                        <ul className={`submenu ${isSubMenuOpen("blog")}`}>
                          <li>
                            <Link to="news-grid">Blog Grid</Link>
                          </li>
                          <li>
                            <Link to="news">Blog List</Link>
                          </li>
                          <li>
                            <Link to="news-carousel">Blog Carousel</Link>
                          </li>
                          <li>
                            <Link to="news-details">Blog Details</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link to="contact">Contact Us</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="offcanvas__contact">
                <h4>Contact Info</h4>
                <ul>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon">
                      <i className="fal fa-map-marker-alt"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link target="_blank" to="/">
                        Main Street, Melbourne, Australia
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-envelope"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link to="mailto:info@example.com">
                        <span className="mailto:info@example.com">
                          info@example.com
                        </span>
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-clock"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link target="_blank" to="/">
                        Mod-friday, 09am -05pm
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="far fa-phone"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link to="tel:+11002345909">+11002345909</Link>
                    </div>
                  </li>
                </ul>
                <div className="header-button mt-4">
                  <Link to="contact" className="theme-btn text-center">
                    <span>
                      Get A Quote
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </span>
                  </Link>
                </div>
                <div className="social-icon d-flex align-items-center">
                  <Link to="/">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                  <Link to="/">
                    <i className="fab fa-twitter"></i>
                  </Link>
                  <Link to="/">
                    <i className="fab fa-youtube"></i>
                  </Link>
                  <Link to="/">
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          (toggleMenu ? " overlay-open" : " ") +
          " offcanvas__overlay d-block d-xl-none"
        }
        onClick={() => handleToggleMenu(false)}
      ></div>
    </>
  );
};

export default OffCanvasMenu;
