import React, { useState, useEffect } from "react";
import { useGetDashboardAttendanceSummaryQuery } from "../../redux/features/attendances/attendancesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import TargetCard from "./TargetCard";
import AttendanceSummary from "./AttendanceSummary";
import RevenueAnalytics from "./RevenueAnalytics";
import StatsGrid from "./StatsGrid";
import StaffDetails from "./StaffDetails";
import StudentDetails from "./StudentDetails";

const CrmDashboard = ({
  teachersCount,
  studentsCount,
  staffPresence,
  studentPresence,
}) => {
  const [screenSize, setScreenSize] = useState("xl");
  const { data: dashboardAttendanceSummary, isLoading } =
    useGetDashboardAttendanceSummaryQuery();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1400) setScreenSize("xxl");
      else if (width >= 1200) setScreenSize("xl");
      else setScreenSize("lg");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Theme colors (shared with components that need them)
  const themeColors = {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#06b6d4",
    dark: "#1e293b",
    light: "#f8fafc",
    border: "#e2e8f0",
    border2: "#64748b",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
  };

  // Helper function for color classes
  const getBgColor = (colorName, opacity = 0.1) => {
    const color = themeColors[colorName] || colorName;
    return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;
  };

  // Responsive grid logic based on screen size
  const getGridStyles = () => {
    if (screenSize === "xxl") {
      return {
        mainContainer: {
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "16px",
        },
        leftColumn: {
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "16px",
        },
        topDealsSection: { gridColumn: "span 4" },
        statsSection: { gridColumn: "span 8" },
        statsGrid: {
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        },
        sidebar: { display: "flex", flexDirection: "column", gap: "16px" },
      };
    } else if (screenSize === "xl") {
      return {
        mainContainer: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        },
        leftColumn: { display: "flex", flexDirection: "column", gap: "16px" },
        topDealsSection: { width: "100%" },
        statsSection: { width: "100%" },
        statsGrid: {
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        },
        sidebar: { display: "flex", flexDirection: "column", gap: "16px" },
      };
    } else {
      return {
        mainContainer: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        },
        leftColumn: { display: "flex", flexDirection: "column", gap: "16px" },
        topDealsSection: { width: "100%" },
        statsSection: { width: "100%" },
        statsGrid: {
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px",
        },
        sidebar: { display: "flex", flexDirection: "column", gap: "16px" },
      };
    }
  };

  const gridStyles = getGridStyles();

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  if (!dashboardAttendanceSummary) return null;

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          flexDirection: screenSize === "lg" ? "column" : "row",
          justifyContent: "space-between",
          alignItems: screenSize === "lg" ? "flex-start" : "center",
          marginBottom: "24px",
          gap: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "18px",
              margin: 0,
              color: themeColors.textPrimary,
            }}
          >
            Welcome back, Mohammad Khalid!
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: themeColors.textMuted,
              margin: "4px 0 0 0",
            }}
          >
            Track your LMS activity, leads and records here.
          </p>
        </div>
      </div>

      {/* Main Grid Container */}
      <div style={gridStyles.mainContainer}>
        {/* LEFT: Main Content */}
        <div style={gridStyles.leftColumn}>
          {/* First Row */}
          <div style={gridStyles.topDealsSection}>
            <TargetCard themeColors={themeColors} />
            <AttendanceSummary
              data={dashboardAttendanceSummary}
              screenSize={screenSize}
              themeColors={themeColors}
              getBgColor={getBgColor}
            />
          </div>

          {/* Second Row */}
          <div style={gridStyles.statsSection}>
            <StatsGrid
              themeColors={themeColors}
              getBgColor={getBgColor}
              screenSize={screenSize}
              gridStyles={gridStyles.statsGrid}
            />
            <RevenueAnalytics themeColors={themeColors} />
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div style={gridStyles.sidebar}>
          <StaffDetails
            teachersCount={teachersCount}
            staffPresence={staffPresence}
            screenSize={screenSize}
            themeColors={themeColors}
          />
          <StudentDetails
            studentsCount={studentsCount}
            studentPresence={studentPresence}
            screenSize={screenSize}
            themeColors={themeColors}
          />
        </div>
      </div>
    </div>
  );
};

export default CrmDashboard;
