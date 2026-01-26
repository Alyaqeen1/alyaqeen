import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const StatCard = ({
  title,
  value,
  color,
  icon,
  chartData,
  change,
  changeLabel,
  themeColors,
  getBgColor,
}) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
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
  }, [chartData, color]);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        border: `1px solid ${themeColors.border}`,
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
            }}
          >
            <i className={icon} style={{ color, fontSize: "20px" }}></i>
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
                {value}
              </h3>
            </div>
            <div style={{ width: "80px", height: "40px" }}>
              {chart && (
                <ApexCharts
                  options={chart.options}
                  series={chart.series}
                  type="area"
                  height={40}
                />
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
            <a
              href="#!"
              style={{
                color: color,
                fontSize: "13px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View All
              <i className="bi bi-arrow-right" style={{ fontSize: "12px" }}></i>
            </a>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  color: change >= 0 ? themeColors.success : themeColors.danger,
                  fontSize: "13px",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </p>
              <p
                style={{
                  color: themeColors.textMuted,
                  fontSize: "11px",
                  margin: "2px 0 0 0",
                  opacity: 0.7,
                }}
              >
                {changeLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsGrid = ({ themeColors, getBgColor, screenSize, gridStyles }) => {
  const statsData = [
    {
      title: "Total Customers",
      value: "1,02,890",
      color: themeColors.primary,
      icon: "bi bi-people-fill",
      chartData: [30, 40, 35, 50, 49, 60, 70],
      change: 40,
      changeLabel: "this month",
    },
    {
      title: "Total Revenue",
      value: "$56,562",
      color: themeColors.secondary,
      icon: "bi bi-wallet-fill",
      chartData: [30, 25, 35, 40, 45, 50, 55],
      change: 25,
      changeLabel: "this month",
    },
    {
      title: "Conversion Ratio",
      value: "12.08%",
      color: themeColors.success,
      icon: "bi bi-graph-up-arrow",
      chartData: [30, 40, 35, 30, 25, 20, 15],
      change: -12,
      changeLabel: "this month",
    },
    {
      title: "Total Deals",
      value: "2,543",
      color: themeColors.warning,
      icon: "bi bi-briefcase-fill",
      chartData: [30, 40, 35, 50, 49, 60, 70],
      change: 19,
      changeLabel: "this month",
    },
  ];

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
