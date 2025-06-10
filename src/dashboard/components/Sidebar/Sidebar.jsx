import React, { useState } from "react";
import { Outlet, Link, NavLink } from "react-router";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import {
  FaChevronDown,
  FaChevronRight,
  FaCogs,
  FaRegCircle,
} from "react-icons/fa";
import { TiHomeOutline } from "react-icons/ti";
import logo from "../../../site/assets/img/logo/logo.png";
import MenuItem from "../../shared/MenuItem";
import { FaUsers } from "react-icons/fa6";
import { useGetRoleQuery } from "../../../redux/features/role/roleApi";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../site/components/LoadingSpinner";
import LoadingSpinnerDash from "../LoadingSpinnerDash";

export default function Sidebar() {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const { user } = useAuth();
  const { data, isLoading } = useGetRoleQuery(user?.email, {
    skip: !user?.email, // avoid fetching if no ID
  });

  // console.log(role);

  const handleSubmenu = (submenuId) => {
    if (openSubMenu === submenuId) {
      setOpenSubMenu(null); // Close if already open
    } else {
      setOpenSubMenu(submenuId); // Open the clicked one
    }
  };

  const isSubMenuOpen = (submenuId) => openSubMenu === submenuId;

  const handleToggleMenu = (open) => {
    console.log("Toggle menu:", open);
  };
  if (isLoading) return <LoadingSpinnerDash></LoadingSpinnerDash>;

  return (
    <div
      className="col-md-3 col-xl-2 p-0 d-none d-md-block"
      style={{ minHeight: "100vh", backgroundColor: "var(--border2)" }}
      id="sidebar"
    >
      <div
        className="d-flex flex-column fixed-top"
        style={{ width: "inherit" }}
      >
        <Link to="/" className="py-2 text-white text-center">
          <img src={logo} style={{ width: "60px" }} alt="Logo" />
        </Link>
        <hr className="text-white" />

        <nav className="flex-grow-1 px-4 mean-nav mobile-menu">
          <p className="ms-2" style={{ fontSize: "12px", color: "#A2AED0" }}>
            MAIN
          </p>
          <ul className="list-unstyled">
            {/* First Dropdown */}
            {/* <li className="has-dropdown">
              <a
                className={`border-0 rounded-2 d-flex justify-content-between ${
                  isSubMenuOpen("dashboard1") ? "bg-white bg-opacity-10" : ""
                }`}
                onClick={() => handleSubmenu("dashboard1")}
              >
                <span className="d-flex align-items-center">
                  <TiHomeOutline className="mx-2 fs-5" />
                  Dashboard 1
                </span>
                <span className="me-2">
                  {isSubMenuOpen("dashboard1") ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
              </a>
              {isSubMenuOpen("dashboard1") && (
                <ul className="submenu sub-menu-active">
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
              )}
            </li> */}

            {/* Second Dropdown */}
            {/* <li className="has-dropdown">
              <a
                className={`border-0 rounded-2 d-flex justify-content-between ${
                  isSubMenuOpen("dashboard2") ? "bg-white bg-opacity-10" : ""
                }`}
                onClick={() => handleSubmenu("dashboard2")}
              >
                <span className="d-flex align-items-center">
                  <TiHomeOutline className="mx-2 fs-5" />
                  Dashboard 2
                </span>
                <span className="me-2">
                  {isSubMenuOpen("dashboard2") ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
              </a>
              {isSubMenuOpen("dashboard2") && (
                <ul className="submenu sub-menu-active">
                  <li>
                    <NavLink
                      className="border-0 p-0"
                      onClick={() => handleToggleMenu(false)}
                      to="/analytics"
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
                      Analytics
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="border-0 p-0"
                      onClick={() => handleToggleMenu(false)}
                      to="/sales"
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
                      Sales
                    </NavLink>
                  </li>
                </ul>
              )}
            </li> */}

            {/* Dashboard (no submenu) */}
            <MenuItem
              icon={<TiHomeOutline className="mx-2 fs-5" />}
              label="Dashboard"
              to="/dashboard"
            />
            {/* <MenuItem
              icon={<TiHomeOutline className="mx-2 fs-5" />}
              label="Admissions"
              to="admissions"
            /> */}

            {/* Users (with submenu) */}
            {data?.role === "admin" && (
              <MenuItem
                icon={<FaUsers className="mx-2 fs-5" />}
                label="Students"
                identifier="students"
                submenuItems={[
                  { label: "Add New", to: "add-student" },
                  { label: "Active Students", to: "active-students" },
                  { label: "Inactive Students", to: "inactive-students" },
                  { label: "Online Admission", to: "online-admissions" },
                ]}
                openSubMenu={openSubMenu}
                handleSubmenu={handleSubmenu}
                isSubMenuOpen={isSubMenuOpen}
                handleToggleMenu={handleToggleMenu}
              />
            )}

            {data?.role === "parent" && (
              <MenuItem
                icon={<RiMoneyEuroCircleLine className="mx-2 fs-5" />}
                label="Payment Summary"
                to="/dashboard/payment-summary"
                openSubMenu={openSubMenu}
                handleSubmenu={handleSubmenu}
                isSubMenuOpen={isSubMenuOpen}
                handleToggleMenu={handleToggleMenu}
              />
            )}

            {/* Settings (no submenu) */}
            <MenuItem
              icon={<FaCogs className="mx-2 fs-5" />}
              label="Settings"
              to="/settings"
              openSubMenu={openSubMenu}
              handleSubmenu={handleSubmenu}
              isSubMenuOpen={isSubMenuOpen}
              handleToggleMenu={handleToggleMenu}
            />
          </ul>
        </nav>
      </div>
    </div>
  );
}
