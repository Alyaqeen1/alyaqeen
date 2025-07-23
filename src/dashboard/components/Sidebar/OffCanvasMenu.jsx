import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { TbFileReport } from "react-icons/tb";
import { TiHomeOutline } from "react-icons/ti";
import { GiHamburgerMenu, GiTeacher } from "react-icons/gi";
import { IoTimer } from "react-icons/io5";
import {
  FaCalendar,
  FaCalendarCheck,
  FaEye,
  FaPersonCircleCheck,
  FaTrophy,
  FaUsers,
} from "react-icons/fa6";
import { useGetRoleQuery } from "../../../redux/features/role/roleApi";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinnerDash from "../LoadingSpinnerDash";
import logo from "../../../site/assets/img/logo/logo.png";
import MenuItem from "../../shared/MenuItem";
import {
  FaChevronDown,
  FaChevronRight,
  FaRegCircle,
  FaRegWindowClose,
} from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";

export default function OffCanvasMenu() {
  const [openSubMenu, setOpenSubMenu] = useState("pages");
  const [openNestedMenu, setOpenNestedMenu] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false); // New state to manage sidebar visibility
  const { user } = useAuth();
  const { data, isLoading } = useGetRoleQuery(user?.email, {
    skip: !user?.email, // avoid fetching if no ID
  });
  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar); // Toggle the sidebar visibility
  };
  const handleSubmenu = (submenuId) => {
    if (openSubMenu === submenuId) {
      setOpenSubMenu(null); // Close if already open
    } else {
      setOpenSubMenu(submenuId); // Open the clicked one
    }
  };

  const isSubMenuButton = (submenu) => {
    return submenu === openSubMenu ? " drop-active" : " ";
  };
  const isSubMenuOpen = (submenuId) => openSubMenu === submenuId;

  const handleToggleMenu = (open) => {};

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
        // style={{
        //   maxHeight: "100vh",
        //   overflowY: "auto",
        //   backgroundColor: "var(--border2)",
        // }} // ✅ Add this
      >
        <div
          className="d-flex flex-column"
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            backgroundColor: "var(--border2)",
          }} // ✅ Add this
        >
          {/* Sidebar Header */}
          <div className="position-relative py-2">
            {/* ✅ Close Button on the Right */}
            <button
              type="button"
              className="btn btn-sm btn-light position-absolute end-0 top-0 m-2"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              onClick={() => setShowSidebar(false)}
            >
              <FaRegWindowClose className="fs-5 text-dark" />
            </button>

            {/* ✅ Centered Logo */}
            <div className="text-center">
              <Link to="/" className="text-white">
                <img
                  src={logo}
                  className="mx-auto"
                  style={{ width: "60px" }}
                  alt="Logo"
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
              {isLoading ? (
                <div className="text-center my-3">
                  <LoadingSpinnerDash />
                </div>
              ) : (
                <>
                  {/* Dashboard (no submenu) */}
                  <MenuItem
                    icon={<TiHomeOutline className="mx-2 fs-5" />}
                    label="Dashboard"
                    to="/dashboard"
                  />

                  {/* Users (with submenu) */}
                  {data?.role === "admin" && (
                    <>
                      <MenuItem
                        icon={<FaUsers className="mx-2 fs-5" />}
                        label="Academics"
                        identifier="academics"
                        submenuItems={[
                          { label: "Departments", to: "departments" },
                          { label: "Classes", to: "classes" },
                          { label: "Subjects", to: "subjects" },
                        ]}
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                      <MenuItem
                        icon={<FaUsers className="mx-2 fs-5" />}
                        label="Students"
                        identifier="students"
                        submenuItems={[
                          { label: "Add New", to: "add-student" },
                          // { label: "Active Students", to: "active-students" },
                          // { label: "Inactive Students", to: "inactive-students" },
                          {
                            label: "Online Admission",
                            to: "online-admissions",
                          },
                        ]}
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                      <MenuItem
                        icon={<GiTeacher className="mx-2 fs-5" />}
                        label="Teachers"
                        identifier="teachers"
                        submenuItems={[
                          { label: "Add New", to: "add-teacher" },
                          { label: "Pending Teachers", to: "pending-teachers" },
                          { label: "Active Teachers", to: "active-teachers" },
                          {
                            label: "Inactive Teachers",
                            to: "inactive-teachers",
                          },
                        ]}
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                      <MenuItem
                        icon={<FaPersonCircleCheck className="mx-2 fs-5" />}
                        label="Attendance"
                        identifier="attendance"
                        submenuItems={[
                          {
                            label: "Student Attendance",
                            to: "student-attendance-admin",
                          },
                          { label: "Staff Attendance", to: "staff-attendance" },
                        ]}
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                      <MenuItem
                        icon={<FaUsers className="mx-2 fs-5" />}
                        label="Fee Management"
                        identifier="fees"
                        submenuItems={[
                          { label: "Fee Settings", to: "fee-settings" },
                          // { label: "Unpaid List", to: "unpaid-list" },
                          { label: "Pending Payments", to: "pending-payments" },
                        ]}
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                      <MenuItem
                        icon={<IoTimer className="mx-2 fs-5" />}
                        label="Time Update"
                        identifier="time-update"
                        submenuItems={[
                          {
                            label: "Prayer Time Update",
                            to: "prayer/time-update",
                          },
                          {
                            label: "Holiday Update",
                            to: "holiday/time-update",
                          },
                        ]}
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                      <MenuItem
                        icon={<PiStudentBold className="mx-2 fs-5" />}
                        label="Merit Students"
                        to="merit-students"
                      />

                      <MenuItem
                        icon={<TbFileReport className="mx-2 fs-5" />}
                        label="Reports Summary"
                        to="reports-summary"
                      />
                    </>
                  )}

                  {data?.role === "teacher" && (
                    <>
                      <MenuItem
                        icon={<FaEye className="mx-2" />}
                        label="View Profile"
                        to="/dashboard/view-profile"
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                      <MenuItem
                        icon={<FaCalendar className="mx-2" />}
                        label="Time Table"
                        to="/dashboard/time-table"
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                      <MenuItem
                        icon={<FaCalendarCheck className="mx-2" />}
                        label="Student Attendance"
                        to="/dashboard/student-attendance"
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                      <MenuItem
                        icon={<FaTrophy className="mx-2" />}
                        label="Merits"
                        to="/dashboard/teacher/merits"
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />

                      <MenuItem
                        icon={<TbFileReport className="mx-2 fs-5" />}
                        label="Reports"
                        identifier="report"
                        submenuItems={[
                          {
                            label: "Lessons Covered",
                            to: "teacher/lessons-covered",
                          },
                          {
                            label: "Reports Summary",
                            to: "teacher/reports-summary",
                          },
                        ]}
                        openSubMenu={openSubMenu}
                        handleSubmenu={handleSubmenu}
                        isSubMenuOpen={isSubMenuOpen}
                        handleToggleMenu={handleToggleMenu}
                      />
                    </>
                  )}

                  {data?.role === "parent" && (
                    <>
                      <MenuItem
                        icon={<TbFileReport className="mx-2 fs-5" />}
                        label="Reports Summary"
                        to="parent/reports-summary"
                      />
                    </>
                  )}
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
