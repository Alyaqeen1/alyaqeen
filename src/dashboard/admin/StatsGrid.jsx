import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import { useGetDashboardStatsQuery } from "../../redux/features/attendances/attendancesApi";

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
}) => {
  const [chart, setChart] = useState(null);

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

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        border: `1px solid ${themeColors.border}`,
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
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
              <p
                style={{
                  fontSize: "13px",
                  color: themeColors.textMuted,
                  margin: 0,
                }}
              >
                {title}
              </p>
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
  const { data: dashboardStats, isLoading } = useGetDashboardStatsQuery();

  // Prepare stats data from API response
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
    },
    {
      title: "Weekly Attendance",
      value: dashboardStats?.stats?.attendanceRate?.value || "0%",
      color: themeColors.success,
      emoji: "📊",
      chartData: [70, 72, 75, 76, 78.5],
      change: dashboardStats?.stats?.attendanceRate?.change || 0,
      changeLabel: `Week ${dashboardStats?.metadata?.weekRange || ""}`,
      isLoading,
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
