import React, { useEffect, useState } from "react";
import OffCanvasMenu from "../Sidebar/OffCanvasMenu";
import { FaSearch } from "react-icons/fa";
import {
  IoLogOutOutline,
  IoMoonOutline,
  IoCartOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import img from "../../../site/assets/img/team/team01.jpeg";
import logo from "../../dashboard-assets/favicon.png";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { useGetRoleQuery } from "../../../redux/features/role/roleApi";
import { useGetStudentsQuery } from "../../../redux/features/students/studentsApi";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const [prevStudents, setPrevStudents] = useState([]);
  const navigate = useNavigate();
  const { data } = useGetRoleQuery();

  const { data: students = [] } = useGetStudentsQuery(undefined, {
    pollingInterval: 30000,
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (
      data?.role === "admin" &&
      prevStudents.length &&
      students.length > prevStudents.length
    ) {
      const newStudents = students.filter(
        (s) => !prevStudents.some((prev) => prev._id === s._id)
      );

      const newNotifications = newStudents.map((student) => ({
        name: student.name,
      }));

      setNotifications((prev) => [...newNotifications, ...prev]);
    }

    setPrevStudents(students);
  }, [students, data]);

  const { user, signOutUser } = useAuth();

  const handleSignOut = () => {
    signOutUser().then(() => {
      toast.success("Logout successful");
    });
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNotificationClick = () => {
    setShowDropdown(false);
    navigate("/dashboard/online-admissions");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar bg-white sticky-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand mb-0 h3">
          <img src={logo} style={{ width: "40px" }} alt="Logo" />
        </Link>

        <div className="d-flex align-items-center gap-3">
          {/* Search */}
          <motion.button
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }}
            style={btnStyle}
          >
            <FaSearch className="fs-4" />
          </motion.button>

          {/* Dark Mode */}
          <motion.button
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }}
            style={btnStyle}
          >
            <IoMoonOutline className="fs-4" />
          </motion.button>

          {/* Cart */}
          <motion.button
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }}
            style={btnStyle}
            className="d-none d-lg-block"
          >
            <IoCartOutline className="fs-4" />
          </motion.button>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <motion.button
              whileHover={{ backgroundColor: "#F1F1F6" }}
              transition={{ duration: 0 }}
              style={btnStyle}
              className="d-none d-lg-block"
              title="Notifications"
              onClick={toggleDropdown}
            >
              <FaRegBell className="fs-4" />
              {students.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.65rem" }}
                >
                  {students.length}
                </motion.span>
              )}
            </motion.button>

            {showDropdown && (
              <div
                className="position-absolute end-0 mt-2 p-2 bg-white shadow rounded"
                style={{ minWidth: "200px", zIndex: 1000 }}
              >
                {students.length > 0 ? (
                  students.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={handleNotificationClick}
                      style={{
                        cursor: "pointer",
                        padding: "5px 10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      👤 {item.name} has joined
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center mb-0">
                    No notifications
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="d-flex gap-2 align-items-center">
            <img
              src={img}
              className="rounded-circle object-fit-cover"
              style={{ width: "40px", height: "40px" }}
              alt="Profile"
            />
            <div className="d-none d-lg-block">
              <h6 className="fw-bold" style={{ fontSize: "14px" }}>
                Json Taylor
              </h6>
              <h6 style={{ fontSize: "12px" }}>Web Designer</h6>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleSignOut}
            title="Logout"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <IoLogOutOutline className="fs-4 text-danger" />
          </button>

          {/* OffCanvas Menu on Mobile */}
          {isMobile && <OffCanvasMenu />}
        </div>
      </div>
    </nav>
  );
}

const btnStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "7px 9px",
  borderRadius: "70px",
};
