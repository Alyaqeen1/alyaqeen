import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import {
  useGetDashboardStatsQuery,
  useGetAttendanceStatsQuery,
} from "../../redux/features/attendances/attendancesApi";

const StatCard = ({
  title,
  value,
  color,
  emoji,
  chartData,
  change,
  changeLabel,
  themeColors,
  getBgColor,
  isLoading,
  showFilters,
  onFilterChange,
  dateRange,
  setDateRange,
}) => {
  const [chart, setChart] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      setChart({
        series: [{ data: chartData }],
        options: {
          chart: {
            type: "area",
            sparkline: { enabled: true },
            height: 50,
          },
          colors: [color],
          stroke: { curve: "smooth", width: 2 },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.1,
              stops: [0, 90, 100],
            },
          },
          tooltip: { enabled: false },
        },
      });
    }
  }, [chartData, color]);

  const renderFilterControls = () => {
    if (!showFilters) return null;

    return (
      <>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginLeft: "8px",
          }}
        >
          <button
            onClick={() => setShowFilterOptions(!showFilterOptions)}
            style={{
              backgroundColor: getBgColor("info", 0.1),
              border: `1px solid ${themeColors.info}`,
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "12px",
              color: themeColors.info,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <i className="bi bi-calendar-range"></i>
            Filter
          </button>

          {showFilterOptions && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "white",
                color: "black",
                border: `1px solid ${themeColors.border}`,
                borderRadius: "8px",
                padding: "12px",
                marginTop: "4px",
                width: "280px",
                zIndex: 1000,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: 500 }}>
                  Date Range:
                </label>
                <select
                  value={dateRange.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setDateRange({
                      ...dateRange,
                      type: newType,
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "6px",
                    marginTop: "4px",
                    borderRadius: "4px",
                    color: themeColors.textPrimary,
                    border: `1px solid ${themeColors.border}`,
                    fontSize: "12px",
                  }}
                >
                  <option value="current">Current Week</option>
                  <option value="month">Select Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              {dateRange.type === "month" && (
                <div style={{ marginBottom: "8px" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500 }}>
                      Select Year:
                    </label>
                    <select
                      value={dateRange.year}
                      onChange={(e) =>
                        setDateRange({
                          ...dateRange,
                          year: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "6px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        color: themeColors.textPrimary,
                        border: `1px solid ${themeColors.border}`,
                        fontSize: "12px",
                      }}
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <label style={{ fontSize: "12px", fontWeight: 500 }}>
                    Select Month:
                  </label>
                  <select
                    value={dateRange.month}
                    onChange={(e) =>
                      setDateRange({
                        ...dateRange,
                        month: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginTop: "4px",
                      borderRadius: "4px",
                      color: themeColors.textPrimary,
                      border: `1px solid ${themeColors.border}`,
                      fontSize: "12px",
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const monthNum = i + 1;
                      const monthName = new Date(2024, i).toLocaleDateString(
                        "en-US",
                        { month: "long" },
                      );
                      return (
                        <option
                          key={monthNum}
                          value={String(monthNum).padStart(2, "0")}
                        >
                          {monthName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {dateRange.type === "custom" && (
                <div style={{ marginBottom: "8px" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 500 }}>
                      Start Date:
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange({
                          ...dateRange,
                          startDate: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "6px",
                        marginTop: "4px",
                        color: themeColors.textPrimary,
                        borderRadius: "4px",
                        border: `1px solid ${themeColors.border}`,
                        fontSize: "12px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 500 }}>
                      End Date:
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, endDate: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "6px",
                        marginTop: "4px",
                        color: themeColors.textPrimary,
                        borderRadius: "4px",
                        border: `1px solid ${themeColors.border}`,
                        fontSize: "12px",
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "12px",
                }}
              >
                <button
                  onClick={() => {
                    // Reset to default
                    const today = new Date();
                    const currentYear = today.getFullYear();
                    const currentMonth = String(today.getMonth() + 1).padStart(
                      2,
                      "0",
                    );
                    const currentDate = today.toISOString().split("T")[0];

                    setDateRange({
                      type: "current",
                      year: currentYear.toString(),
                      month: currentMonth,
                      startDate: currentDate,
                      endDate: currentDate,
                    });
                    setShowFilterOptions(false);
                  }}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: getBgColor("warning", 0.1),
                    border: `1px solid ${themeColors.warning}`,
                    borderRadius: "4px",
                    color: themeColors.warning,
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setShowFilterOptions(false);
                    // Manually trigger refetch after applying filters
                    refetchAttendanceStats();
                  }}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: getBgColor("primary", 0.1),
                    border: `1px solid ${themeColors.primary}`,
                    borderRadius: "4px",
                    color: themeColors.primary,
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Close filter dropdown when clicking outside */}
        {showFilterOptions && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setShowFilterOptions(false)}
          />
        )}
      </>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        border: `1px solid ${themeColors.border}`,
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: getBgColor(color.replace("#", ""), 0.2),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              fontSize: "20px",
            }}
          >
            {emoji}
          </div>
        </div>
        <div style={{ flex: 1, marginLeft: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: themeColors.textMuted,
                    margin: 0,
                  }}
                >
                  {title}
                </p>
                {renderFilterControls()}
              </div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  margin: "4px 0",
                  color: themeColors.textPrimary,
                }}
              >
                {isLoading ? "..." : value}
              </h3>
            </div>
            <div style={{ width: "80px", height: "40px" }}>
              {chart && !isLoading ? (
                <ApexCharts
                  options={chart.options}
                  series={chart.series}
                  type="area"
                  height={40}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: themeColors.textMuted,
                    fontSize: "10px",
                  }}
                >
                  {isLoading ? "..." : "No trend"}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "12px", color: themeColors.textMuted }}>
              {changeLabel}
            </div>
            <div style={{ textAlign: "right" }}>
              {change !== undefined && (
                <>
                  <p
                    style={{
                      color:
                        change >= 0 ? themeColors.success : themeColors.danger,
                      fontSize: "13px",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {change >= 0 ? "+" : ""}
                    {typeof change === "number" ? change.toFixed(1) : change}%
                  </p>
                  <p
                    style={{
                      color: themeColors.textMuted,
                      fontSize: "11px",
                      margin: "2px 0 0 0",
                      opacity: 0.7,
                    }}
                  >
                    {change >= 0 ? "Increase" : "Decrease"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsGrid = ({ themeColors, getBgColor, screenSize, gridStyles }) => {
  const [attendanceDateRange, setAttendanceDateRange] = useState({
    type: "current", // 'current', 'month', 'custom'
    startDate: "",
    endDate: "",
    month: "",
    year: "",
  });

  // Format current date for default values
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    const currentDate = today.toISOString().split("T")[0];

    // Set default values for attendance filters
    setAttendanceDateRange({
      type: "current",
      year: currentYear.toString(),
      month: currentMonth,
      startDate: currentDate,
      endDate: currentDate,
    });
  }, []);

  // Determine which API to use based on date range type
  const getAttendanceQueryParams = () => {
    switch (attendanceDateRange.type) {
      case "month":
        return {
          year: attendanceDateRange.year,
          month: attendanceDateRange.month,
        };
      case "custom":
        return {
          startDate: attendanceDateRange.startDate,
          endDate: attendanceDateRange.endDate,
        };
      case "current":
      default:
        return {};
    }
  };

  // Use the flexible stats query ONLY for attendance
  const {
    data: attendanceStats,
    isLoading: statsLoading,
    refetch: refetchAttendanceStats,
  } = useGetAttendanceStatsQuery(getAttendanceQueryParams(), {
    skip: false, // Keep fetching
  });

  // Keep the original dashboard stats for other cards
  const { data: dashboardStats, isLoading: dashboardLoading } =
    useGetDashboardStatsQuery();

  const isLoading = statsLoading || dashboardLoading;

  // Format date range label
  const getAttendancePeriodLabel = () => {
    switch (attendanceDateRange.type) {
      case "month":
        const monthNum = parseInt(attendanceDateRange.month);
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const monthName = monthNames[monthNum - 1] || attendanceDateRange.month;
        return `${monthName} ${attendanceDateRange.year}`;

      case "custom":
        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        };
        return `${formatDate(attendanceDateRange.startDate)} to ${formatDate(attendanceDateRange.endDate)}`;

      case "current":
      default:
        // Get current week dates
        const getCurrentWeekDates = () => {
          const today = new Date();
          const dayOfWeek = today.getDay();
          const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          const monday = new Date(today);
          monday.setDate(today.getDate() - diffToMonday);

          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);

          return { monday, sunday };
        };

        const { monday, sunday } = getCurrentWeekDates();
        const formatWeekDate = (date) => {
          return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          });
        };
        const year = monday.getFullYear();
        return `${formatWeekDate(monday)} - ${formatWeekDate(sunday)} ${year}`;
    }
  };

  // Prepare stats data from API responses
  const statsData = [
    {
      title: "Active Students",
      value: dashboardStats?.stats?.totalActiveStudents?.value || "0",
      color: themeColors.primary,
      emoji: "👨‍🎓",
      chartData: [290, 300, 310, 315, 319],
      change: 10,
      changeLabel: "this month",
      isLoading,
      showFilters: false, // No filters for this card
    },
    {
      title: "Monthly Revenue",
      value: dashboardStats?.stats?.currentMonthRevenue?.value || "£0",
      color: themeColors.secondary,
      emoji: "💰",
      chartData: [500, 1000, 1500, 2000, 2500],
      change: 25,
      changeLabel: "this month",
      isLoading,
      showFilters: false, // No filters for this card
    },
    // Find the attendance rate stat in statsData array and add refetch:
    {
      title: "Attendance Rate",
      value:
        attendanceStats?.stats?.rate !== undefined
          ? `${attendanceStats.stats.rate}%`
          : "0%",
      color: themeColors.success,
      emoji: "📊",
      chartData: [70, 72, 75, 76, 78.5],
      change: attendanceStats?.comparison?.change || 0, // ✅ Use attendanceStats.comparison.change
      changeLabel: getAttendancePeriodLabel(),
      isLoading,
      showFilters: true,
      dateRange: attendanceDateRange,
      setDateRange: setAttendanceDateRange,
      refetchAttendanceStats: refetchAttendanceStats,
    },
    {
      title: "Outstanding Payments",
      value: dashboardStats?.stats?.outstandingPayments?.value || "£0",
      color: themeColors.warning,
      emoji: "⚠️",
      chartData: [2000, 1900, 1850, 1750, 1640],
      change: -18,
      changeLabel: `${dashboardStats?.stats?.outstandingPayments?.count || 0} pending`,
      isLoading,
      showFilters: false, // No filters for this card
    },
  ];

  // Show loading skeleton if still loading
  if (isLoading) {
    return (
      <div style={gridStyles}>
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              border: `1px solid ${themeColors.border}`,
              height: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ width: "60%" }}>
                <div
                  style={{
                    height: "16px",
                    backgroundColor: themeColors.border,
                    borderRadius: "4px",
                    marginBottom: "8px",
                    width: "60%",
                  }}
                ></div>
                <div
                  style={{
                    height: "28px",
                    backgroundColor: themeColors.border,
                    borderRadius: "4px",
                    marginBottom: "12px",
                    width: "80%",
                  }}
                ></div>
              </div>
              <div
                style={{
                  width: "80px",
                  height: "40px",
                  backgroundColor: themeColors.border,
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={gridStyles}>
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          themeColors={themeColors}
          getBgColor={getBgColor}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
