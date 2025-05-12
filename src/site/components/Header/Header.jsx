import { useState, useEffect } from "react";
import OffCanvasMenu from "./OffCanvasMenu";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import logo from "../../assets/img/logo/logo.png";
import grid from "../../assets/img/grid.svg";

const languages = [
  { code: "en", lang: "English" },
  { code: "ar", lang: "Arabic" },
];

const Header = () => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [logout, setLogout] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn"))
  );
  const { i18n } = useTranslation();

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
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  useEffect(() => {
    document.body.style.textAlign = i18n.dir() === "rtl" ? "right" : "left";
  }, [i18n, i18n.language]);
  const { t } = useTranslation(["common"]);
  const { nav, discountBtn, options } = t("header") || {};
  const { english, arabic } = options || {};
  const {
    home,
    aboutUs,
    aboutTheFounder,
    whoWeAre,
    meetTheTeam,
    missionVision,
    courses,
    qaidahQuran,
    mathEnglish,
    arabicLanguage,
    modernForeign,
    pages,
    news,
    ourSyllabus,
    academicCalendar,
    weekdays,
    weekend,
    prayerTimetable,
    vacancies,
    faq,
    shop,
    photosVideos,
    contact,
    contactUs,
    chat,
    academyVisit,
    volunteering,
    feedback,
    login,
    logOut,
  } = nav || {};

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
                  <select
                    name="cate"
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="category"
                  >
                    <option value="en">{english}</option>

                    <option value="ar">{arabic}</option>
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
                            {home}
                          </Link>
                        </li>
                        <li>
                          <Link>
                            {aboutUs}
                            <i className="fas fa-angle-down"></i>
                          </Link>
                          <ul className="submenu">
                            <li>
                              <Link to="/about-founder">{aboutTheFounder}</Link>
                            </li>
                            <li>
                              <Link to="/about">{whoWeAre}</Link>
                            </li>
                            <li>
                              <Link to="/our-team">{meetTheTeam}</Link>
                            </li>
                            <li>
                              <Link to="/our-vision">{missionVision}</Link>
                            </li>
                          </ul>
                        </li>

                        <li>
                          <Link>
                            {courses}
                            <i className="fas fa-angle-down"></i>
                          </Link>
                          <ul className="submenu">
                            <li>
                              <Link to="/arabic-qaidah-quran-hifdh">
                                {qaidahQuran}
                              </Link>
                            </li>
                            <li>
                              <Link to="/maths-english-science">
                                {mathEnglish}
                              </Link>
                            </li>
                            <li>
                              <Link to="/arabic-language">
                                {arabicLanguage}
                              </Link>
                            </li>
                            <li>
                              <Link to="/modern-foreign-languages">
                                {modernForeign}
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="has-dropdown">
                          <Link>
                            {pages}
                            <i className="fas fa-angle-down"></i>
                          </Link>
                          <ul className="submenu">
                            <li>
                              <Link to="/news">{news}</Link>
                            </li>
                            <li>
                              <Link to="/our-syllabus">{ourSyllabus}</Link>
                            </li>
                            <li className="has-dropdown">
                              <Link>
                                {academicCalendar}
                                <i className="fas fa-angle-down"></i>
                              </Link>
                              <ul className="submenu">
                                <li>
                                  <Link to="/weekdays">{weekdays}</Link>
                                </li>
                                <li>
                                  <Link to="/weekends">{weekend}</Link>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <Link to="/prayer-timetable">
                                {prayerTimetable}
                              </Link>
                            </li>
                            <li>
                              <Link to="/vacancies">{vacancies}</Link>
                            </li>
                            <li>
                              <Link to="/faq">{faq}</Link>
                            </li>
                            <li>
                              <Link to="/shop">{shop}</Link>
                            </li>
                            <li>
                              <Link to="/photos-videos">{photosVideos}</Link>
                            </li>
                            <li>
                              <Link to="/complaint">Complaint</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link>
                            {contact}
                            <i className="fas fa-angle-down"></i>
                          </Link>
                          <ul className="submenu">
                            <li>
                              <Link to="/contact">{contactUs}</Link>
                            </li>
                            <li>
                              <Link
                                target="_blank"
                                to="https://wa.me/447869636849"
                              >
                                {chat}
                              </Link>
                            </li>
                            <li>
                              <Link to="/academy-visit">{academyVisit}</Link>
                            </li>
                            <li>
                              <Link to="/volunteering">{volunteering}</Link>
                            </li>
                            <li>
                              <Link to="/feedback">{feedback}</Link>
                            </li>
                          </ul>
                        </li>
                        {!logout ? (
                          <>
                            <li>
                              <Link to="/login">{login}</Link>
                            </li>
                            <li>
                              <Link to="/register">Register</Link>
                            </li>
                          </>
                        ) : (
                          <li>
                            <button onClick={handleLogout}>{logOut}</button>
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
                  <Link to="/fees" className="theme-btn">
                    <span>
                      {discountBtn}
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
