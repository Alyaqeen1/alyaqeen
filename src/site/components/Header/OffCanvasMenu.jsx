import { useState } from "react";
import { Link } from "react-router";
import logo from "../../assets/img/logo/logo.png";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

const OffCanvasMenu = ({ toggleMenu, handleToggleMenu }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [openNestedMenu, setOpenNestedMenu] = useState(null);
  const { user, signOutUser, loading } = useAuth();
  const handleSignOut = () => {
    signOutUser().then(() => {
      toast.success("Logout successful");
    });
  };

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
                      <li className="active menu-thumb">
                        <Link
                          to="/"
                          // className={`drop ${isSubMenuButton("home")}`}
                          onClick={() => handleToggleMenu(false)}
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <a
                          className={`drop ${isSubMenuButton("about")}`}
                          onClick={() => handleSubmenu("about")}
                        >
                          About Us
                        </a>
                        <ul className={`submenu ${isSubMenuOpen("about")}`}>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/about-founder"
                            >
                              About The Founder
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/about"
                            >
                              Who We Are
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/our-team"
                            >
                              Meet The Team
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/our-vision"
                            >
                              Mission, Vision & Values
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a
                          className={`drop ${isSubMenuButton("programs")}`}
                          onClick={() => handleSubmenu("programs")}
                        >
                          Courses
                        </a>
                        <ul className={`submenu ${isSubMenuOpen("programs")}`}>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/arabic-qaidah-quran-hifdh"
                            >
                              Qaidah, Quran & Hifdh
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/maths-english-science"
                            >
                              Maths, English & Science
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/arabic-language"
                            >
                              Arabic Language
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/modern-foreign-languages"
                            >
                              Modern Foreign Languages
                            </Link>
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
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/news"
                            >
                              News & Updates
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/our-syllabus"
                            >
                              Our Syllabus
                            </Link>
                          </li>

                          <li className="has-dropdown">
                            <a
                              className={`drop ${isNestedMenuButton("event")}`}
                              onClick={() => handleNestedmenu("event")}
                            >
                              Academic Calendar
                            </a>
                            <ul
                              className={`submenu ${isNestedMenuOpen("event")}`}
                            >
                              <li>
                                <Link
                                  onClick={() => handleToggleMenu(false)}
                                  to="/weekdays"
                                >
                                  Weekdays
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() => handleToggleMenu(false)}
                                  to="/weekends"
                                >
                                  Weekends
                                </Link>
                              </li>
                            </ul>
                          </li>

                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/prayer-timetable"
                            >
                              Prayer Timetable
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/vacancies"
                            >
                              Vacancies
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/faq"
                            >
                              FAQ&apos;S
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/shop"
                            >
                              Shop
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/photos-videos"
                            >
                              Photos & Videos
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a
                          className={`drop ${isSubMenuButton("blog")}`}
                          onClick={() => handleSubmenu("blog")}
                        >
                          Contact
                        </a>
                        <ul className={`submenu ${isSubMenuOpen("blog")}`}>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/contact"
                            >
                              Contact Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              target="_blank"
                              to="https://wa.me/447869636849"
                            >
                              Chat
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/academy-visit"
                            >
                              Academy Visit
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/volunteering"
                            >
                              Volunteering
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => handleToggleMenu(false)}
                              to="/feedback"
                            >
                              Feedback
                            </Link>
                          </li>
                        </ul>
                      </li>
                      {!user ? (
                        <>
                          <li>
                            <Link to="/login">Login</Link>
                          </li>
                          <li>
                            <Link to="/register">Register</Link>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link to="/dashboard">Dashboard</Link>
                          </li>
                          <li>
                            <button
                              className="theme-btn py-2 px-4"
                              onClick={handleSignOut}
                            >
                              Logout
                            </button>
                          </li>
                        </>
                      )}
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
                        116 Church Road, Yardley, Birmingham, B25 8UX
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-envelope"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link to="mailto:info@example.com">
                        <span className="mailto:contact@alyaqeen.co.uk">
                          contact@alyaqeen.co.uk
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
                      <Link to="tel:+07869636849">+07869636849</Link>
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
                  <Link to="https://www.facebook.com/AlyaqeenAcademy">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                  <Link to="https://x.com">
                    <i className="fab fa-twitter"></i>
                  </Link>
                  <Link to="https://www.youtube.com/@alyaqeenacademy5282">
                    <i className="fab fa-youtube"></i>
                  </Link>
                  <Link to="https://www.linkedin.com/">
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
