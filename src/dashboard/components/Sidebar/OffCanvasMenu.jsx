import React, { useState } from "react";
import { Outlet, Link, NavLink } from "react-router";
import { FaChevronDown, FaChevronRight, FaRegCircle } from "react-icons/fa";
import { TiHomeOutline } from "react-icons/ti";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegWindowClose } from "react-icons/fa";
import logo from "../../../site/assets/img/logo/logo.png";

export default function OffCanvasMenu() {
  const [openSubMenu, setOpenSubMenu] = useState("pages");
  const [openNestedMenu, setOpenNestedMenu] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false); // New state to manage sidebar visibility

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar); // Toggle the sidebar visibility
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
    <div>
      <div className="text-end">
        <button
          className="btn"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
          onClick={handleSidebarToggle} // Toggle the sidebar on button click
        >
          {!showSidebar ? (
            <GiHamburgerMenu className="fs-2" />
          ) : (
            <FaRegWindowClose className="fs-2" />
            // <span className="fs-1">x</span>
          )}
        </button>
      </div>

      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabIndex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div
          className="d-flex flex-column h-100 "
          style={{ minHeight: "100vh", backgroundColor: "var(--border2)" }}
        >
          {/* Sidebar Header */}
          <div>
            {/* <div className="text-end">
              <button
                type="button"
                className="btn-close bg-white "
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div> */}
            <div className="text-center py-2">
              <Link to="/" className="py-2 text-white text-center">
                <img
                  src={logo}
                  className="mx-auto"
                  style={{ width: "60px" }}
                  alt=""
                />
              </Link>
            </div>
          </div>
          <hr className="text-white" />
          {/* Sidebar Links */}
          <nav className="flex-grow-1 px-4 mean-nav mobile-menu">
            <p className=" ms-2" style={{ fontSize: "12px", color: "#A2AED0" }}>
              MAIN
            </p>
            <ul className="list-unstyled">
              <li className="has-dropdown">
                <a
                  className={` border-0 rounded-2  ${
                    openSubMenu && "bg-white bg-opacity-10"
                  } d-flex justify-content-between `}
                  // style={{ padding: "10px 10px !important" }}
                  onClick={() => handleSubmenu("pages")}
                >
                  <span className="d-flex align-items-center">
                    <TiHomeOutline className="mx-2 fs-5" />
                    Dashboard
                  </span>
                  <span>
                    {!openSubMenu ? (
                      <FaChevronRight className="me-2" />
                    ) : (
                      <FaChevronDown className="me-2" />
                    )}
                  </span>
                </a>
                <ul className={`submenu ${isSubMenuOpen("pages")}`}>
                  <li>
                    <NavLink
                      className="border-0 p-0"
                      onClick={() => handleToggleMenu(false)}
                      to="/dashboard"
                      style={({ isActive }) => ({
                        color: isActive ? "white" : "#A2AED0",
                        textDecoration: "none",
                        transition: "color 0.2s ease-in-out",
                      })}
                      onMouseEnter={(e) => (e.target.style.color = "white")}
                      onMouseLeave={(e) =>
                        (e.target.style.color = e.target.classList.contains(
                          "active"
                        )
                          ? "white"
                          : "#A2AED0")
                      }
                    >
                      <FaRegCircle
                        style={{ fontSize: "5px", marginRight: "8px" }}
                      />
                      CRM
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="border-0 p-0"
                      onClick={() => handleToggleMenu(false)}
                      to="/news"
                      style={({ isActive }) => ({
                        color: isActive ? "white" : "#A2AED0",
                        textDecoration: "none",
                        transition: "color 0.2s ease-in-out",
                      })}
                      onMouseEnter={(e) => (e.target.style.color = "white")}
                      onMouseLeave={(e) =>
                        (e.target.style.color = e.target.classList.contains(
                          "active"
                        )
                          ? "white"
                          : "#A2AED0")
                      }
                    >
                      <FaRegCircle
                        style={{ fontSize: "5px", marginRight: "8px" }}
                      />
                      Ecommerce
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
