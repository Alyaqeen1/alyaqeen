import React, { useEffect, useState, useRef } from "react";
import OffCanvasMenu from "../Sidebar/OffCanvasMenu";
import { FaSearch, FaTimes } from "react-icons/fa";
import {
  IoLogOutOutline,
  IoMoonOutline,
  IoCartOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import img from "../../../site/assets/img/team/team01.jpeg";
import logo from "../../dashboard-assets/favicon.png";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  useGetRoleQuery,
  useGetUserQuery,
} from "../../../redux/features/role/roleApi";
import { useGetUnreadNotificationsQuery } from "../../../redux/features/notifications/notificationsApi";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import LoadingSpinnerDash from "../LoadingSpinnerDash";
import { useDashboardSearchQuery } from "../../../redux/features/searches/searchesApi";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const { data, isLoading } = useGetRoleQuery(user?.email, {
    skip: !user?.email,
  });

  // ===== SEARCH STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const userRole = data?.role || "admin";

  // Use dashboard search query
  const {
    data: results = [],
    isLoading: isSearchLoading,
    error: searchError,
  } = useDashboardSearchQuery(
    {
      searchTerm: searchQuery,
      role: userRole,
    },
    {
      skip: searchQuery.length < 2,
    },
  );

  // Handle input change
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // Handle result click
  const handleResultClick = (url) => {
    navigate(url);
    setSearchQuery("");
    setShowResults(false);
    setShowSearchOverlay(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  // Toggle search overlay (open/close)
  const toggleSearchOverlay = () => {
    const newState = !showSearchOverlay;
    setShowSearchOverlay(newState);

    // Focus input when opening
    if (newState) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      // Clear search when closing
      setSearchQuery("");
      setShowResults(false);
    }
  };

  // Close search overlay
  const closeSearchOverlay = () => {
    setShowSearchOverlay(false);
    setSearchQuery("");
    setShowResults(false);
  };

  // Handle click outside for results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close overlay on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showSearchOverlay) {
        closeSearchOverlay();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showSearchOverlay]);

  const { data: userDb, isLoading: isUserDbLoading } = useGetUserQuery(
    user?.email,
    {
      skip: !user?.email,
    },
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

  return (
    <nav className="navbar bg-white sticky-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand mb-0 h3">
          <img src={logo} style={{ width: "40px" }} alt="Logo" />
        </Link>

        <div className="d-flex align-items-center gap-3">
          {/* Search Button - Toggles Overlay */}
          <motion.button
            type="button"
            onClick={toggleSearchOverlay}
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }}
            style={{
              ...btnStyle,
              backgroundColor: showSearchOverlay ? "#F1F1F6" : "transparent",
            }}
          >
            <FaSearch className="fs-4" style={{ color: "#333333" }} />
          </motion.button>

          {/* Dark Mode */}
          <motion.button
            whileHover={{ backgroundColor: "#F1F1F6" }}
            transition={{ duration: 0 }}
            style={btnStyle}
          >
            <IoMoonOutline className="fs-4" style={{ color: "#333333" }} />
          </motion.button>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <motion.button
              whileHover={{ backgroundColor: "#F1F1F6" }}
              transition={{ duration: 0 }}
              style={btnStyle}
              title="Notifications"
              onClick={toggleDropdown}
            >
              <FaRegBell className="fs-4" style={{ color: "#333333" }} />
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
                        padding: "8px 12px",
                        borderBottom:
                          idx < unreadNotifications.length - 1
                            ? "1px solid #eee"
                            : "none",
                        color: "#333333",
                      }}
                    >
                      {item.message}
                    </div>
                  ))
                ) : (
                  <p
                    className="text-muted text-center mb-0"
                    style={{ color: "#666666", padding: "8px" }}
                  >
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
              <h6
                className="fw-bold"
                style={{ fontSize: "14px", color: "#333333", margin: 0 }}
              >
                {userDb?.name || "Anonymous User"}
              </h6>
              <h6
                className="text-lowercase"
                style={{ fontSize: "12px", color: "#666666", margin: 0 }}
              >
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
              padding: "7px 9px",
              borderRadius: "70px",
            }}
          >
            <IoLogOutOutline className="fs-4 text-danger" />
          </button>

          {/* OffCanvas Menu on Mobile */}
          {isMobile && <OffCanvasMenu />}
        </div>
      </div>

      {/* Minimal Search Overlay - Just the input field */}
      <AnimatePresence>
        {showSearchOverlay && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              padding: "12px 20px",
              backgroundColor: "transparent",
              zIndex: 999,
              pointerEvents: "none", // Allow clicking through the container
            }}
          >
            <div
              ref={searchRef}
              style={{
                position: "relative",
                maxWidth: "600px",
                margin: "0 auto",
                pointerEvents: "auto", // But catch clicks on the input
              }}
            >
              <div style={{ position: "relative" }}>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder={`Search ${userRole} dashboard...`}
                  style={{
                    width: "100%",
                    padding: "12px 45px 12px 20px",
                    borderRadius: "30px",
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#ffffff",
                    fontSize: "15px",
                    outline: "none",
                    color: "#333333",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  onFocus={() =>
                    searchQuery.length >= 2 && setShowResults(true)
                  }
                />
                {searchQuery ? (
                  <></>
                ) : (
                  <FaSearch
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#999999",
                      fontSize: "16px",
                    }}
                  />
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: "8px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    border: "1px solid #e5e7eb",
                    zIndex: 1000,
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isSearchLoading ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#666666",
                      }}
                    >
                      Searching...
                    </div>
                  ) : searchError ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#ef4444",
                      }}
                    >
                      Error loading results
                    </div>
                  ) : results.length === 0 && searchQuery.length >= 2 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#666666",
                      }}
                    >
                      No results found for "{searchQuery}"
                    </div>
                  ) : results.length > 0 ? (
                    <div>
                      {results.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleResultClick(item.url)}
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e5e7eb",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                            textAlign: "left",
                            backgroundColor: "#ffffff",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f3f4f6")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ffffff")
                          }
                        >
                          <div
                            style={{
                              fontWeight: "500",
                              color: "#111827",
                              marginBottom: "4px",
                              fontSize: "14px",
                            }}
                          >
                            {item.title}
                          </div>
                          {item.excerpt && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginBottom: "4px",
                              }}
                            >
                              {item.excerpt}
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#9ca3af",
                              textTransform: "capitalize",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{item.type}</span>
                            <span
                              style={{
                                backgroundColor: "#f3f4f6",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                color: "#4b5563",
                              }}
                            >
                              {item.visibility}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const btnStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "7px 9px",
  borderRadius: "70px",
  color: "#333333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
