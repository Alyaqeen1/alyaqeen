import React, { useEffect, useState } from "react";
import OffCanvasMenu from "../Sidebar/OffCanvasMenu";
import { FaSearch } from "react-icons/fa";
import { IoMoonOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router";
import { motion } from "framer-motion";
import img from "../../../site/assets/img/team/team01.jpeg";
import logo from "../../dashboard-assets/favicon.png";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update the isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <nav class="navbar bg-white sticky-top">
      <div class="container-fluid">
        <Link to="/" class="navbar-brand mb-0 h3">
          <img src={logo} style={{ width: "40px" }} alt="" />
        </Link>
        <div className="d-flex align-items-center gap-3">
          <motion.button
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }} // Ensure instant change
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "7px 9px",
              borderRadius: "70px",
            }}
          >
            <FaSearch className="fs-4" />
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }} // Ensure instant change
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "7px 9px",
              borderRadius: "70px",
            }}
          >
            <IoMoonOutline className="fs-4" />
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }} // Ensure instant change
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "7px 9px",
              borderRadius: "70px",
            }}
            className="d-none d-lg-block"
          >
            <IoCartOutline className="fs-4" />
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }} // Ensure instant change
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "7px 9px",
              borderRadius: "70px",
            }}
            className="d-none d-lg-block"
          >
            <FaRegBell className="fs-4" />
          </motion.button>
          <div className="d-flex gap-2 align-items-center">
            <img
              src={img}
              className="rounded-circle object-fit-cover"
              style={{ width: "40px", height: "40px" }}
              alt=""
            />
            <div className="d-none d-lg-block">
              <h6 style={{ fontSize: "14px" }} className="fw-bold">
                Json Taylor
              </h6>
              <h6 style={{ fontSize: "12px" }}>Wed Designer</h6>
            </div>
          </div>

          <motion.button
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <IoSettingsOutline className="fs-4" />
          </motion.button>
          {isMobile && <OffCanvasMenu></OffCanvasMenu>}
        </div>
      </div>
    </nav>
  );
}
