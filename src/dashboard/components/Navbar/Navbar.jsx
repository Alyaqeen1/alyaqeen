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
import {
  useGetRoleQuery,
  useGetUserQuery,
} from "../../../redux/features/role/roleApi";
import { useGetStudentsQuery } from "../../../redux/features/students/studentsApi";
import { useGetUnreadNotificationsQuery } from "../../../redux/features/notifications/notificationsApi";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import LoadingSpinnerDash from "../LoadingSpinnerDash";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const { data, isLoading } = useGetRoleQuery(user?.email, {
    skip: !user?.email, // avoid fetching if no ID
  });
  const { data: userDb, isLoading: isUserDbLoading } = useGetUserQuery(
    user?.email,
    {
      skip: !user?.email, // avoid fetching if no ID
    }
  );
  const axiosPublic = useAxiosPublic();
  const { data: unreadNotifications, refetch } =
    useGetUnreadNotificationsQuery();

  const handleSignOut = () => {
    signOutUser().then(() => {
      toast.success("Logout successful");
    });
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNotificationClick = async (id, link) => {
    setShowDropdown(false);
    const { data } = await axiosPublic.patch(`/notifications/${id}`);

    if (data.modifiedCount) {
      navigate(link);
      refetch();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // if (isLoading || isUserDbLoading) {
  //   return <LoadingSpinnerDash></LoadingSpinnerDash>;
  // }
  return (
    <nav className="navbar bg-white sticky-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand mb-0 h3">
          <img src={logo} style={{ width: "40px" }} alt="Logo" />
        </Link>

        <div className="d-flex align-items-center gap-3">
          {/* Search */}
          <motion.button
            type="button" // <-- prevents form submission
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
          {/* <motion.button
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }}
            style={btnStyle}
            className="d-none d-lg-block"
          >
            <IoCartOutline className="fs-4" />
          </motion.button> */}

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
              {unreadNotifications?.length > 0 && data?.role === "admin" && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.65rem" }}
                >
                  {unreadNotifications?.length}
                </motion.span>
              )}
            </motion.button>

            {showDropdown && (
              <div
                className="position-absolute end-0 mt-2 p-2 bg-white shadow rounded"
                style={{ minWidth: "200px", zIndex: 1000 }}
              >
                {unreadNotifications?.length > 0 && data?.role === "admin" ? (
                  unreadNotifications.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        handleNotificationClick(item?._id, item?.link)
                      }
                      style={{
                        cursor: "pointer",
                        padding: "5px 10px",
                        border: "3px solid #eee",
                      }}
                    >
                      {item.message}
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
              src={
                user?.photoURL ||
                "https://i.ibb.co/wrgq63jG/360-F-1316686759-Rn-Y5-CQrx-IPk-Neb-Z6xkkt-Wxm-Qw9p-BXR0b.jpg"
              }
              className="rounded-circle object-fit-cover"
              style={{ width: "40px", height: "40px" }}
              alt="Profile"
            />
            <div className="d-none d-lg-block">
              <h6 className="fw-bold" style={{ fontSize: "14px" }}>
                {userDb?.name || "Anonymous User"}
              </h6>
              <h6 className="text-lowercase" style={{ fontSize: "12px" }}>
                {userDb?.email}
              </h6>
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
