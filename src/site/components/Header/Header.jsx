import { useState, useEffect } from "react";
import OffCanvasMenu from "./OffCanvasMenu";
import logo from "../../assets/img/logo/logo.png";
import grid from "../../assets/img/grid.svg";
import one from "../../assets/img/header/home-1.jpg";
import two from "../../assets/img/header/home-2.jpg";
import three from "../../assets/img/header/home-3.jpg";
import four from "../../assets/img/header/home-4.jpg";
import { Link } from "react-router";
// import "../../styles/scss/main.module.scss";

const Header = () => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [logout, setLogout] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn"))
  );

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setLogout(false); // Update the state immediately to trigger a re-render
  };

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  useEffect(() => {
    const handleResizeHeader = () => {
      setToggleMenu(false);
      setOpenSubMenu(null);
    };

    window.addEventListener("resize", handleResizeHeader);

    return () => {
      window.removeEventListener("resize", handleResizeHeader);
    };
  }, []);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 200) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // search toggle
  const [searchToggle, setSearchToggle] = useState(false);

  const handleSearch = () => {
    setSearchToggle(!searchToggle);
  };

  const closeSearch = () => {
    setSearchToggle(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <header
        id="header-sticky"
        className={(scrolled ? " animated sticky" : " ") + " header-1"}
      >
        <div className="container-fluid px-5">
          <div className="mega-menu-wrapper">
            <div className="header-main style-2">
              <div className="header-left">
                <div className="logo ms-2">
                  <Link to="/" className="header-logo w-auto">
                    <img
                      className="h-auto"
                      style={{ width: "70px" }}
                      src={logo}
                      alt="logo-img"
                    />
                  </Link>
                </div>
                <div className="category-oneadjust flex">
                  <img src={grid} alt="img" className="me-2 inline" />
                  <select name="cate" className="category">
                    <option value="1">English</option>
                    <option value="1">Arabic</option>
                  </select>
                </div>
              </div>
              <div className="header-right gap-0 d-flex justify-content-end align-items-center">
                <div className="mean__menu-wrapper d-none d-xl-block">
                  <div className="main-menu">
                    <nav id="mobile-menu">
                      <ul className="text-base">
                        <li className="active menu-thumb">
                          <Link className="text-sm" to="/">
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link>
                            About Us
                            <i className="fas fa-angle-down"></i>
                          </Link>
                          <ul className="submenu">
                            <li>
                              <Link to="/about-founder">About The Founder</Link>
                            </li>
                            <li>
                              <Link to="/about">Who We Are</Link>
                            </li>
                            <li>
                              <Link to="/our-team">Meet The Team</Link>
                            </li>
                            <li>
                              <Link to="/our-vision">
                                Mission, Vision & Values
                              </Link>
                            </li>
                          </ul>
                        </li>

                        <li>
                          <Link>
                            Courses
                            <i className="fas fa-angle-down"></i>
                          </Link>
                          <ul className="submenu">
                            <li>
                              <Link to="/arabic-qaidah-quran-hifdh">
                                Qaidah, Quran & Hifdh
                              </Link>
                            </li>
                            <li>
                              <Link to="/maths-english-science">
                                Maths, English &amp; Science
                              </Link>
                            </li>
                            <li>
                              <Link to="/arabic-language">Arabic Language</Link>
                            </li>
                            <li>
                              <Link to="/modern-foreign-languages">
                                Modern Foreign Languages
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="has-dropdown">
                          <Link>
                            Pages
                            <i className="fas fa-angle-down"></i>
                          </Link>
                          <ul className="submenu">
                            <li>
                              <Link to="/news">News & Updates</Link>
                            </li>
                            <li>
                              <Link to="/our-syllabus">Our Syllabus</Link>
                            </li>
                            <li className="has-dropdown">
                              <Link>
                                Academic Calendar
                                <i className="fas fa-angle-down"></i>
                              </Link>
                              <ul className="submenu">
                                <li>
                                  <Link to="/weekdays">Weekdays</Link>
                                </li>
                                <li>
                                  <Link to="/weekends">Weekend</Link>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <Link to="/prayer-timetable">
                                Prayer Timetable
                              </Link>
                            </li>
                            <li>
                              <Link to="/vacancies">Vacancies</Link>
                            </li>
                            <li>
                              <Link to="/faq">FAQ&apos;S</Link>
                            </li>
                            <li>
                              <Link to="/shop">Shop</Link>
                            </li>
                            <li>
                              <Link to="/photos-videos">Photos & Videos</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link>
                            Contact
                            <i className="fas fa-angle-down"></i>
                          </Link>
                          <ul className="submenu">
                            <li>
                              <Link to="/contact">Contact Us</Link>
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
                              <Link to="/academy-visit">Academy Visit</Link>
                            </li>
                            <li>
                              <Link to="/volunteering">Volunteering</Link>
                            </li>
                            <li>
                              <Link to="/feedback">Feedback</Link>
                            </li>
                          </ul>
                        </li>
                        {!logout ? (
                          <li>
                            <Link to="/login">Login</Link>
                          </li>
                        ) : (
                          <li>
                            <button onClick={handleLogout}>Logout</button>
                          </li>
                        )}
                        {/* <li>
                          <Link to="/login">Login</Link>
                        </li> */}
                      </ul>
                    </nav>
                  </div>
                </div>
                <button
                  className="search-trigger search-icon ms-5 me-4"
                  onClick={handleSearch}
                >
                  <i className="fal fa-search"></i>
                </button>
                <div className="header-button">
                  <Link to="/contact" className="theme-btn">
                    <span>
                      get A Quote
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </span>
                  </Link>
                </div>
                <div className="header__hamburger d-xl-none my-auto">
                  <div className="sidebar__toggle" onClick={handleToggleMenu}>
                    <i className="fas fa-bars"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <OffCanvasMenu
        toggleMenu={toggleMenu}
        handleToggleMenu={handleToggleMenu}
      />
      <div
        className={(searchToggle ? " open" : " ") + " search-wrap"}
        onClick={closeSearch}
      >
        <div className="search-inner">
          <i
            className="fas fa-times search-close"
            id="search-close"
            onClick={closeSearch}
          ></i>
          <div className="search-cell">
            <form method="get">
              <div className="search-field-holder">
                <input
                  type="search"
                  className="main-search-input"
                  placeholder="Search..."
                  onClick={handleClick}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
